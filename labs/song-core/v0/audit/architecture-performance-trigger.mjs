#!/usr/bin/env node
// Manual offline-only Sóng architecture + performance audit. No external HTTP or production calls.
import {spawnSync} from 'node:child_process';
import {generateKeyPairSync,sign} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {dirname,resolve,relative,isAbsolute,sep} from 'node:path';
import {mkdirSync,writeFileSync} from 'node:fs';
import {CLAIM_V2,createAuthorityRegistry,claimPayload,VerifiedEvidenceLedger} from '../src/verified-evidence.mjs';
import {ScopedEphemeralMemory} from '../src/scoped-memory.mjs';
import {exportEvidenceLedger,restoreEvidenceLedger} from '../src/signed-backup.mjs';
import {createEvidenceGatedTurn} from '../src/secure-turn.mjs';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
function opt(name,fallback=null){const i=process.argv.indexOf('--'+name);return i<0?fallback:process.argv[i+1]&&!process.argv[i+1].startsWith('--')?process.argv[i+1]:true;}
const local=opt('local-fixture')===true;
const expected=opt('expected-sha');
const out=resolve(String(opt('out','/tmp/song-core-architecture-trigger')));
const within=relative(root,out);
if(!within.startsWith('..'+sep)&&within!=='..'&&!isAbsolute(within))throw Error('OUTPUT_MUST_BE_OUTSIDE_REPO');
const exec=(cmd,args)=>spawnSync(cmd,args,{cwd:root,encoding:'utf8',timeout:25000,maxBuffer:2000000});
const g=exec('git',['rev-parse','HEAD']);
const head=g.status===0?g.stdout.trim():null;
const clean=g.status===0&&exec('git',['status','--porcelain']).stdout.trim()==='';
const findings=[];
function record(id,severity,status,reason,action){findings.push({id,severity,status,reason,action});}
record('A00','P0',local?'UNVERIFIED':expected&&/^[a-f0-9]{40}$/.test(expected)&&head===expected&&clean?'PASS':'BLOCKED',
 `Source SHA=${head||'unknown'}, expected=${expected||'none'}, clean=${clean}, local fixture=${local}`,
 'Run from exact full commit SHA and clean checkout on authorized VPS. Never use Windows as workspace.');
const suite=exec('node',['--test','test/core.test.mjs','test/architecture-gates.test.mjs']);
const matches=[...String(suite.stdout).matchAll(/^# (tests|pass|fail) (\d+)$/gm)];
const sums=Object.fromEntries(matches.map(m=>[m[1],Number(m[2])]));
record('A01','P0',suite.status===0&&sums.tests>=36&&sums.fail===0?'PASS':'FAIL',
 `Regression suite ${sums.pass??'unknown'}/${sums.tests??'unknown'}; failures=${sums.fail??'unknown'}`,
 'Regression tests alone do not prove real model reasoning or user capacity.');
const key=generateKeyPairSync('ed25519');
const now=new Date('2026-10-13T05:00:00Z');
const mkPolicy=extra=>({publisherId:'test-ops',datasetId:'cano',publicKey:key.publicKey,
 domains:['cano'],predicates:['operational_status'],scopeTypes:['route'],
 maxAgeMs:900000,maxValidityMs:1800000,sourcePrefix:'https://fixtures.invalid/cano',...extra});
const claim=(id,entityId='operator-one',scopeId='an-thoi-hon-thom')=>{
 const c={schema:CLAIM_V2,id,entityId,domain:'cano',predicate:'operational_status',
  value:'OPEN',scope:{type:'route',id:scopeId},observedAt:'2026-10-13T04:55:00Z',
  validUntil:'2026-10-13T05:10:00Z',status:'VERIFIED',
  source:{publisherId:'test-ops',datasetId:'cano',uri:'https://fixtures.invalid/cano/one'}};
 c.signature=sign(null,Buffer.from(claimPayload(c)),key.privateKey).toString('base64');return c;
};
const registry=policies=>createAuthorityRegistry(policies??[mkPolicy()]);
function failsAdmission(row,r){try{new VerifiedEvidenceLedger([row],r);return false;}catch{return true;}}
record('A02','P0',failsAdmission(claim('outside','another','other-route'),registry([mkPolicy({authorizedScopeIds:['an-thoi-hon-thom']})]))?'PASS':'FAIL',
 'Registry intended to authorize one route still admits different routes',
 'Validate exact source route/entity capability and its changes, not just scope type.');
record('A03','P0',failsAdmission(claim('revoked'),registry([mkPolicy({status:'REVOKED'})]))?'PASS':'FAIL',
 'Revoked publisher signing key can still submit records',
 'Enforce key epoch/status/rotation and block revoked key at ingestion.');
record('A04','P0',failsAdmission({...claim('tampered'),value:'CLOSED'},registry())?'PASS':'FAIL',
 'Tampered signed claim is rejected','Preserve signatures and formalize canonical serialization.');
const memory=new ScopedEphemeralMemory({resolvePrincipal:ctx=>ctx?.verifiedUser?{verified:true,subject:'user_1234'}:null});
const context={requestContext:{verifiedUser:true},productId:'song_app',sessionId:'session_test'};
try{
 const accepted=await memory.write(context,[{role:'user',content:'SYNTHETIC ONLY'}],{consent:{sessionMemory:true}});
 record('A05','P0',accepted?'FAIL':'PASS','Memory accepted caller-supplied consent Boolean='+accepted,
  'Require trusted server-side consent registry with revocation and purpose binding.');
}catch(e){record('A05','P0','UNVERIFIED',String(e.message),'Check server-side consent path.');}
const baseRegistry=registry();
const baseLedger=new VerifiedEvidenceLedger([claim('base')],baseRegistry);
const backup=exportEvidenceLedger(baseLedger);
let restored=false;
try{restored=restoreEvidenceLedger(backup,baseRegistry).exportClaims().length===1;}catch{}
record('A06','P1',restored&&Boolean(backup.manifest?.authorityRegistry||backup.authorityRegistry)?'PASS':'FAIL',
 'Local ledger roundtrip works, but authority registry is not included in backup',
 'Back up signed trust registry/key history encrypted offsite; prove clean-VPS restore.');
const operation=await createEvidenceGatedTurn({ledger:baseLedger,clock:()=>now}).turn({question:'Cano tuyến An Thới Hòn Thơm có chạy không?'});
record('A07','P0',operation.status==='SOURCE_BACKED_OPERATION_SCOPE'&&operation.modelCalled===false?'PASS':'FAIL',
 `Scoped deterministic output status=${operation.status}`,
 'Retain evidence scope and never infer safe sea passage.');
function pct(a,p){const s=a.toSorted((x,y)=>x-y);return Number(s[Math.min(s.length-1,Math.ceil(p*s.length)-1)].toFixed(3));}
function bench(n){
 const rows=Array.from({length:n},(_,i)=>claim('row-'+i,'entity-'+i));
 const l=new VerifiedEvidenceLedger(rows,baseRegistry);
 const q={domain:'cano',predicate:'operational_status',scope:{type:'route',id:'an-thoi-hon-thom'}};
 for(let i=0;i<3;i++)l.select(q,{now});
 const timings=[];
 for(let i=0;i<16;i++){const start=performance.now();l.select(q,{now});timings.push(performance.now()-start);}
 return {rows:n,p50Ms:pct(timings,.5),p95Ms:pct(timings,.95)};
}
const small=bench(128),large=bench(512),ratio=Number((large.p50Ms/Math.max(.001,small.p50Ms)).toFixed(2));
record('A08','P1','FAIL',
 `Unindexed multi-entity scope lookup: 128 rows p50 ${small.p50Ms}ms, 512 rows p50 ${large.p50Ms}ms (${ratio}x). Synthetic CPU microbench only.`,
 'Create indexed materialized evidence projection with versions; benchmark speed AND equivalent safety semantics.');
const fixedTurn=createEvidenceGatedTurn({ledger:baseLedger,clock:()=>now});
const start=performance.now();
const burst=await Promise.all(Array.from({length:64},()=>fixedTurn.turn({question:'Cano tuyến An Thới Hòn Thơm có chạy không?'})));
const burstMs=Number((performance.now()-start).toFixed(3));
record('A09','P1',burst.every(x=>x.status==='SOURCE_BACKED_OPERATION_SCOPE')?'PASS':'FAIL',
 `64 concurrent deterministic turn calls: ${burstMs}ms (NO real AI, storage, ASR/TTS, queue, or network)`,
 'Benchmark real VPS gateway and provider independently; never claim this is concurrent user capacity.');
for(const [id,severity,reason,action] of [
 ['A10','P0','No durable inbox/lease/ack/idempotency/retry/dead-letter queue exists','Implement at-least-once durable jobs and idempotent consumers with backpressure and DLQ.'],
 ['A11','P0','No authenticated durable consent registry and encrypted session store','Implement purpose binding, retention and deletion before real guest capture.'],
 ['A12','P0','No validated Vietnamese semantic planner and model answer entailment','Test against expert-confirmed and unseen Phú Quốc cases.'],
 ['A13','P1','No proven provider timeout/circuit breaker/fallback/queue saturation handling','Timebox inference and background work, shed load honestly, isolate failures.'],
 ['A14','P1','No data publication watermark, index-lag or dead-letter observability','Track source version, applied version, lag, expiry, errors, and stalled jobs.'],
 ['A15','P1','No independent VPS load and cross-host recovery measurements','Use bounded synthetic VPS load and clean-host restore, no production stress.']
])record(id,severity,'UNVERIFIED',reason,action);
const critical=findings.filter(x=>x.severity==='P0'&&x.status!=='PASS');
const verdict=critical.length?'HOLD_P0':'ARCHITECTURE_REVIEW_PASS';
const report={schema:'song.architecture-performance-trigger.v1',generatedAt:new Date().toISOString(),scope:'OFFLINE_SYNTHETIC_ONLY',
 source:{head,expected:expected||null,clean,localFixture:local},baseline:sums,
 performance:{microbench:{small,large,ratio},syntheticBurst:{count:64,totalMs:burstMs,notRealLoad:true}},verdict,production:'HOLD',findings};
mkdirSync(out,{recursive:true});
writeFileSync(resolve(out,'REPORT.json'),JSON.stringify(report,null,2)+'\n',{mode:0o600});
const md=['# Sóng Architecture + Performance Trigger V1','',`**Verdict: ${verdict}. Production: HOLD.**`,'',
 'Synthetic local measurements only, NOT actual capacity.','',
 '| ID | Severity | Result | Evidence |','|---|---|---|---|',
 ...findings.map(f=>`| ${f.id} | ${f.severity} | ${f.status} | ${f.reason.replaceAll('|','/')} |`),'',
 '## Actionable remediation',...findings.filter(f=>f.status!=='PASS').map(f=>`- **${f.id}:** ${f.action}`),'',
 'No real customer data, paid API calls, live Cloudflare, production or Core V1.2 changes.'];
writeFileSync(resolve(out,'REPORT.md'),md.join('\n')+'\n',{mode:0o600});
console.log(JSON.stringify({verdict,baseline:sums,performance:report.performance,out},null,2));
process.exitCode=critical.length?2:0;