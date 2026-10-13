import {createHash} from 'node:crypto';
import {VerifiedEvidenceLedger,CLAIM_V2,verifyEvidenceClaim} from './verified-evidence.mjs';
const hash=s=>createHash('sha256').update(s).digest('hex');
/** A digest checks integrity only; not authenticity or offsite disaster recovery. */
export function exportEvidenceLedger(ledger) {
  const claims=ledger.exportClaims().sort((a,b)=>a.id.localeCompare(b.id));
  const jsonl=claims.map(c=>JSON.stringify(c)).join('\n');
  return {manifest:{format:'song.evidence-export.v2',schema:CLAIM_V2,count:claims.length,sha256:hash(jsonl),containsCustomerData:false},jsonl};
}
export function restoreEvidenceLedger(snapshot,registry) {
  if(snapshot?.manifest?.format!=='song.evidence-export.v2'||snapshot?.manifest?.schema!==CLAIM_V2
    ||snapshot?.manifest?.containsCustomerData!==false||typeof snapshot.jsonl!=='string'
    ||snapshot.manifest.sha256!==hash(snapshot.jsonl))throw Error('BACKUP_INTEGRITY_FAILURE');
  if(Buffer.byteLength(snapshot.jsonl,'utf8')>10_000_000)throw Error('BACKUP_TOO_LARGE');
  const rows=snapshot.jsonl?snapshot.jsonl.split('\n').map(line=>JSON.parse(line)):[];
  if(rows.length!==snapshot.manifest.count)throw Error('BACKUP_COUNT_MISMATCH');
  rows.forEach(c=>verifyEvidenceClaim(c,registry));
  return new VerifiedEvidenceLedger(rows,registry);
}
