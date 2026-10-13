// Knowledge-only export: NEVER put raw customer questions, secrets or sessions in Git.
import {createHash} from 'node:crypto';
import {IslandBrain,SCHEMA,validateClaim} from './brain.mjs';
const sha256=s=>createHash('sha256').update(s,'utf8').digest('hex');
export function exportBrain(brain) {
  const lines=brain.exportVerifiedClaims().map(c=>JSON.stringify(c)).join('\n');
  return {manifest:{format:'song.brain-export.v1',claimSchema:SCHEMA,count:lines?lines.split('\n').length:0,sha256:sha256(lines)},jsonl:lines};
}
export function restoreBrain({manifest,jsonl}={}) {
  if(manifest?.format!=='song.brain-export.v1'||manifest.claimSchema!==SCHEMA||typeof jsonl!=='string'||sha256(jsonl)!==manifest.sha256)throw Error('BACKUP_INVALID_OR_TAMPERED');
  const claims=jsonl?jsonl.split('\n').map(s=>JSON.parse(s)):[];
  if(claims.length!==manifest.count)throw Error('BACKUP_COUNT_MISMATCH');
  claims.forEach(validateClaim);
  return new IslandBrain(claims);
}
