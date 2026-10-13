import {planQuestion} from './query-contract.mjs';

const safe={vi:'Sóng chưa có xác nhận vận hành phù hợp về thời điểm và khu vực này. Mình chưa thể khẳng định được.',en:'I cannot confirm current operations without verified evidence for this place and time.'};
const timeVi=iso=>new Date(iso).toLocaleString('vi-VN',{timeZone:'Asia/Ho_Chi_Minh',day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'});
/** Only verified, typed facts can become customer-facing assertions. Model drafts are never authoritative. */
export function createEvidenceGatedTurn({ledger,clock=()=>new Date(),model=null}={}){
  if(!ledger||typeof ledger.select!=='function')throw Error('VERIFIED_LEDGER_REQUIRED');
  return Object.freeze({async turn({question,language='vi'}={}) {
    if(!['vi','en'].includes(language))throw Error('UNSUPPORTED_LANGUAGE');
    const plan=planQuestion(question);
    if(!plan.query)return {answer:safe[language],status:plan.reason,usedEvidenceIds:[],aiVerified:false,modelCalled:false};
    const selected=ledger.select(plan.query,{now:clock()});
    if(selected.evidence.length!==1) return {answer:safe[language],status:selected.status,usedEvidenceIds:[],aiVerified:false,modelCalled:false};
    const claim=selected.evidence[0];
    if(claim.predicate!=='operational_status')return {answer:safe[language],status:'NO_APPROVED_RENDERER',usedEvidenceIds:[],aiVerified:false,modelCalled:false};
    let wording;
    if(claim.value==='OPEN')wording='được xác nhận đang hoạt động';
    else if(claim.value==='CLOSED')wording='được xác nhận tạm ngừng hoạt động';
    else return {answer:safe[language],status:'OPERATOR_STATUS_UNKNOWN',usedEvidenceIds:[claim.id],aiVerified:false,modelCalled:false};
    if(language!=='vi')return {answer:safe.en,status:'LOCALE_RENDERER_NOT_APPROVED',usedEvidenceIds:[claim.id],aiVerified:false,modelCalled:false};
    return {answer:`Theo nguồn vận hành được xác thực cho tuyến ${claim.scope.id}, ${claim.domain==='cano'?'cano':'tàu cao tốc'} ${wording} (ghi nhận lúc ${timeVi(claim.observedAt)}). Đây không phải bảo đảm an toàn hay xác nhận cho chuyến cụ thể; tình trạng có thể thay đổi.`,status:'SOURCE_BACKED_OPERATION_SCOPE',usedEvidenceIds:[claim.id],evidenceFingerprint:claim.fingerprint,provenance:{publisherId:claim.source.publisherId,datasetId:claim.source.datasetId,validUntil:claim.validUntil},aiVerified:false,modelCalled:false};
  }});
}
