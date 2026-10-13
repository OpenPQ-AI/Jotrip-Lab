/** VPS-first, Node-only G1 prototype. Evidence claims are not customer conversations. */
import {createHash, verify as verifySignature} from 'node:crypto';

export const CLAIM_V2 = 'song.evidence.v2';
const DOMAINS = new Set(['cano','weather','ferry','airport','transit','place','culture']);
const STATUSES = new Set(['VERIFIED','REVOKED','DISPUTED']);
const PREDICATES = new Set(['operational_status','temperature_c','departure_station','location_description','background_fact']);
const SCOPE_TYPES = new Set(['site','route','area','island','station']);
const stamp = s => typeof s === 'string' && /(?:Z|[+-]\d\d:\d\d)$/.test(s) && Number.isFinite(Date.parse(s));
const ident = s => typeof s === 'string' && /^[a-z0-9][a-z0-9:_-]{1,95}$/.test(s);
const canonical = v => {
  if (Array.isArray(v)) return '[' + v.map(canonical).join(',') + ']';
  if (v && typeof v === 'object') return '{' + Object.keys(v).sort().map(k => JSON.stringify(k)+':'+canonical(v[k])).join(',') + '}';
  return JSON.stringify(v);
};
export const unsignedClaim = claim => Object.fromEntries(Object.entries(claim).filter(([k])=>k!=='signature'));
export const claimPayload = claim => canonical(unsignedClaim(claim));
export const claimFingerprint = claim => createHash('sha256').update(claimPayload(claim)).digest('hex');
const trustedUri = uri => typeof uri === 'string' && uri.length < 500 && /^https:\/\/[^\s?#]+(?:\/[^\s?#]*)?$/.test(uri);
const scopeKey = c => `${c.domain}|${c.predicate}|${c.entityId}|${c.scope.type}|${c.scope.id}`;

export function createAuthorityRegistry(policies) {
  if (!Array.isArray(policies) || policies.length === 0) throw Error('AUTHORITY_POLICY_REQUIRED');
  const entries = new Map();
  for (const p of policies) {
    if (!ident(p.publisherId) || !ident(p.datasetId) || !p.publicKey || !Array.isArray(p.domains) || !Array.isArray(p.predicates) || !Array.isArray(p.scopeTypes)
      || !Number.isSafeInteger(p.maxAgeMs) || p.maxAgeMs<=0 || !Number.isSafeInteger(p.maxValidityMs) || p.maxValidityMs<=0
      || !trustedUri(p.sourcePrefix) || entries.has(`${p.publisherId}/${p.datasetId}`)) throw Error('INVALID_AUTHORITY_POLICY');
    if (p.domains.some(d=>!DOMAINS.has(d)) || p.predicates.some(d=>!PREDICATES.has(d)) || p.scopeTypes.some(d=>!SCOPE_TYPES.has(d))) throw Error('INVALID_AUTHORITY_CAPABILITY');
    entries.set(`${p.publisherId}/${p.datasetId}`, Object.freeze({...p,domains:[...p.domains],predicates:[...p.predicates],scopeTypes:[...p.scopeTypes]}));
  }
  return Object.freeze({get(publisherId,datasetId){return entries.get(`${publisherId}/${datasetId}`)||null;}});
}

export function verifyEvidenceClaim(c,registry) {
  if (!c || c.schema!==CLAIM_V2 || !ident(c.id) || !ident(c.entityId) || !DOMAINS.has(c.domain) || !PREDICATES.has(c.predicate)
    || !STATUSES.has(c.status) || !c.scope || !SCOPE_TYPES.has(c.scope.type) || !ident(c.scope.id)
    || !stamp(c.observedAt) || !stamp(c.validUntil) || Date.parse(c.validUntil)<=Date.parse(c.observedAt)
    || !c.source || !ident(c.source.publisherId) || !ident(c.source.datasetId) || !trustedUri(c.source.uri)
    || typeof c.value!=='string' || !c.value.trim() || c.value.length>200 || typeof c.signature!=='string'
    || !/^[A-Za-z0-9+/_-]+={0,2}$/.test(c.signature)) throw Error('INVALID_EVIDENCE_SHAPE');
  const policy=registry?.get(c.source.publisherId,c.source.datasetId);
  if (!policy || !policy.domains.includes(c.domain) || !policy.predicates.includes(c.predicate) || !policy.scopeTypes.includes(c.scope.type)
    || !c.source.uri.startsWith(policy.sourcePrefix) || (c.source.uri.length>policy.sourcePrefix.length && !c.source.uri.slice(policy.sourcePrefix.length).startsWith('/'))
    || Date.parse(c.validUntil)-Date.parse(c.observedAt)>policy.maxValidityMs) throw Error('SOURCE_NOT_AUTHORIZED');
  if (c.predicate==='operational_status' && (!['OPEN','CLOSED','UNKNOWN'].includes(c.value) || !['cano','ferry'].includes(c.domain) || c.scope.type!=='route')) throw Error('INVALID_OPERATION_VALUE_OR_SCOPE');
  if (c.predicate==='temperature_c' && (!Number.isFinite(Number(c.value)) || Number(c.value)<-30 || Number(c.value)>65)) throw Error('INVALID_TEMPERATURE');
  if (!verifySignature(null,Buffer.from(claimPayload(c)),policy.publicKey,Buffer.from(c.signature,'base64'))) throw Error('BAD_EVIDENCE_SIGNATURE');
  return policy;
}

/** Only receives authority-verified claims. This is not a semantic/vector search. */
export class VerifiedEvidenceLedger {
  #rows;
  #registry;
  constructor(claims,registry) {
    this.#registry=registry;
    if(!Array.isArray(claims)||claims.length>10000)throw Error('EVIDENCE_BATCH_LIMIT');
    const seen=new Set();this.#rows=[];
    for (const source of claims) {
      verifyEvidenceClaim(source,registry);
      if (seen.has(source.id)) throw Error('DUPLICATE_CLAIM_ID');
      seen.add(source.id);this.#rows.push(structuredClone(source));
    }
  }
  select(query,{now=new Date()}={}) {
    if (!query || !DOMAINS.has(query.domain) || !PREDICATES.has(query.predicate) || !query.scope
      || !SCOPE_TYPES.has(query.scope.type) || !ident(query.scope.id)) throw Error('INVALID_EVIDENCE_QUERY');
    const time=new Date(now).getTime();if(!Number.isFinite(time))throw Error('INVALID_CLOCK');
    const candidates=this.#rows.filter(c=>c.domain===query.domain&&c.predicate===query.predicate&&c.scope.type===query.scope.type&&c.scope.id===query.scope.id
      &&(!query.entityId||c.entityId===query.entityId));
    // Latest signed event wins for a subject; old OPEN cannot resurrect after later CLOSED/REVOKED.
    // Events at the same observedAt with disagreeing values/status remain CONFLICT.
    const bySubject=new Map();
    for(const c of candidates){
      if(Date.parse(c.observedAt)>time)continue;
      const key=scopeKey(c);
      bySubject.set(key,[...(bySubject.get(key)||[]),c]);
    }
    const rejected=[];const evidence=[];
    for(const group of bySubject.values()) {
      const latestTime=Math.max(...group.map(c=>Date.parse(c.observedAt)));
      const latest=group.filter(c=>Date.parse(c.observedAt)===latestTime);
      const active=candidates.filter(c=>scopeKey(c)===scopeKey(latest[0])&&Date.parse(c.observedAt)<=time&&Date.parse(c.validUntil)>time
        &&time-Date.parse(c.observedAt)<=this.#registry.get(c.source.publisherId,c.source.datasetId).maxAgeMs);
      const independentConflict=active.some(c=>c.source.publisherId!==latest[0].source.publisherId && (c.value!==latest[0].value||c.status!==latest[0].status));
      if(independentConflict || (latest.length>1 && new Set(latest.map(c=>c.status+'|'+c.value)).size>1)) {
        active.forEach(c=>rejected.push({id:c.id,reason:'CONFLICT'}));continue;
      }
      const c=latest[0],policy=this.#registry.get(c.source.publisherId,c.source.datasetId);
      if(c.status!=='VERIFIED') {rejected.push({id:c.id,reason:c.status});continue;}
      if(Date.parse(c.validUntil)<=time||time-Date.parse(c.observedAt)>policy.maxAgeMs) {
        rejected.push({id:c.id,reason:'STALE'});continue;
      }
      // Same current event with duplicate signed receipts must not become two answers.
      evidence.push(Object.freeze({id:c.id,entityId:c.entityId,domain:c.domain,predicate:c.predicate,value:c.value,scope:structuredClone(c.scope),observedAt:c.observedAt,validUntil:c.validUntil,source:structuredClone(c.source),fingerprint:claimFingerprint(c)}));
    }
    return {status:evidence.length?'EVIDENCE_AVAILABLE':rejected.some(r=>['REVOKED','DISPUTED'].includes(r.reason))?'SOURCE_DISPUTED_OR_REVOKED':rejected.some(r=>r.reason==='CONFLICT')?'CONFLICT':rejected.length?'NO_TRUSTED_EVIDENCE':'NO_MATCH',evidence,rejected};
  }
  exportClaims(){return structuredClone(this.#rows);}
}
