// Sóng Core V0: verified knowledge only; questions from guests are NEVER claims.
export const SCHEMA = 'song.claim.v1';
const norm = s => String(s ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').toLowerCase();
const words = s => new Set((norm(s).match(/[a-z0-9]{3,}/g) || []).filter(w => !new Set(['toi','ban','cho','cua','nay','kia','nhung','voi','tren','duoc','khong','biet','phu','quoc']).has(w)));
const timestamp = s => typeof s === 'string' && /(?:Z|[+-]\d\d:\d\d)$/.test(s) && Number.isFinite(Date.parse(s));
const allowed = new Set(['VERIFIED','REVOKED','DISPUTED']);
export function validateClaim(c) {
  if (!c || c.schema !== SCHEMA || !/^[a-z0-9][a-z0-9:_-]{2,80}$/i.test(c.id || '')) throw Error('INVALID_CLAIM_ID');
  for (const k of ['entityId','predicate','value','area']) if (typeof c[k] !== 'string' || !c[k].trim() || c[k].length > 500) throw Error('INVALID_' + k.toUpperCase());
  if (!allowed.has(c.status)) throw Error('INVALID_VERIFICATION_STATUS');
  if (!timestamp(c.observedAt) || !timestamp(c.validUntil) || Date.parse(c.validUntil) <= Date.parse(c.observedAt)) throw Error('INVALID_VALIDITY');
  if (!c.source || typeof c.source.uri !== 'string' || !/^https:\/\//.test(c.source.uri) || !['operator','observed','editorial'].includes(c.source.kind)) throw Error('INVALID_PROVENANCE');
  if (c.status === 'VERIFIED' && (!c.verification || !timestamp(c.verification.at) || !['owner','source-crosscheck','ground-truth'].includes(c.verification.method))) throw Error('UNVERIFIED_CLAIM');
  if (c.aliases !== undefined && (!Array.isArray(c.aliases) || c.aliases.some(x => typeof x !== 'string' || x.length > 100))) throw Error('INVALID_ALIASES');
  return true;
}
export class IslandBrain {
  #claims;
  constructor(claims = []) {
    const ids = new Set();
    this.#claims = claims.map(c => {
      validateClaim(c);
      if (ids.has(c.id)) throw Error('DUPLICATE_CLAIM_ID');
      ids.add(c.id);
      return structuredClone(c);
    });
  }
  retrieve(question, {now = new Date(), area = null, limit = 6} = {}) {
    const nowMs = new Date(now).getTime();
    if (!Number.isFinite(nowMs)) throw Error('INVALID_CLOCK');
    const tokens = words(question);
    if (!tokens.size) return {status:'NO_MATCH', evidence:[], rejected:[]};
    const rejected=[];
    const hits=[];
    for (const c of this.#claims) {
      const scoreTokens=words([c.entityId,c.predicate,c.value,c.area,...(c.aliases || [])].join(' '));
      const matched=[...tokens].filter(t=>scoreTokens.has(t)).length;
      if (matched === 0) continue;
      if (area && norm(c.area) !== norm(area) && norm(c.area) !== 'toan dao') continue;
      if (c.status !== 'VERIFIED' || Date.parse(c.validUntil) <= nowMs || Date.parse(c.observedAt)>nowMs) {
        rejected.push({id:c.id,reason:c.status !== 'VERIFIED'?'NOT_VERIFIED':'STALE'});
        continue;
      }
      hits.push({c,score:matched});
    }
    const byKey = new Map();
    for (const h of hits) {
      const key=[h.c.entityId,h.c.predicate,h.c.area].join('|');
      byKey.set(key,[...(byKey.get(key)||[]),h]);
    }
    const conflicted=new Set();
    for (const group of byKey.values()) if (new Set(group.map(x=>norm(x.c.value))).size>1) group.forEach(x=>conflicted.add(x.c.id));
    for(const id of conflicted) rejected.push({id,reason:'CONFLICT'});
    const evidence=hits.filter(x=>!conflicted.has(x.c.id)).sort((a,b)=>b.score-a.score||a.c.id.localeCompare(b.c.id)).slice(0,Math.min(12,Math.max(1,limit))).map(({c})=>({
      id:c.id,entityId:c.entityId,predicate:c.predicate,value:c.value,area:c.area,
      observedAt:c.observedAt,validUntil:c.validUntil,source:structuredClone(c.source)
    }));
    return {status:evidence.length?'EVIDENCE_AVAILABLE':rejected.length?'NO_TRUSTED_EVIDENCE':'NO_MATCH',evidence,rejected};
  }
  exportVerifiedClaims() { return structuredClone(this.#claims); }
}
