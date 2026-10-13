/** Non-semantic, fail-closed planner. Never let a user-supplied plan bypass evidence gates. */
const fold=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').toLowerCase();
export function planQuestion(question) {
  if(typeof question!=='string'||!question.trim()||question.length>900)throw Error('INVALID_QUESTION');
  const q=fold(question);
  const status=/\b(co|con|duoc|dang|da|se)\s+(chay|hoat dong|di|xuat ben|mo cua)\b|dung chay|ngung chay|cam (bien|cano)|xuat ben|lich chay|co khai thac|ngung hoat dong/.test(q);
  const cano=/cano|ca no|xuong may/.test(q);
  const ferry=/tau cao toc|pha bien|tau khach|ferry/.test(q);
  if((cano||ferry)&&status) {
    if(/ngay mai|mai (nay|sang|chieu|toi)|tuan sau|thang sau|hom sau/.test(q))
      return {intent:'FUTURE_OPERATIONAL_STATUS',needsCurrentSource:false,query:null,reason:'FUTURE_OPERATION_NOT_VERIFIED'};
    // Bare An Thoi is an area, NOT proof of the status of all canoes departing there.
    // Only a precisely named route may match a current signed operator receipt.
    const route= /\ban thoi\b/.test(q)&&/\bhon thom\b/.test(q)?'an-thoi-hon-thom':null;
    return {intent:'OPERATIONAL_STATUS',needsCurrentSource:true,query:route?{domain:cano?'cano':'ferry',predicate:'operational_status',scope:{type:'route',id:route}}:null,reason:route?'EXACT_ROUTE_ONLY':'ROUTE_REQUIRED'};
  }
  if(/thoi tiet|mua|nhiet do|gio bien|song bien/.test(q))return {intent:'WEATHER_CONDITIONS',needsCurrentSource:true,query:null,reason:'PRECISE_OBSERVATION_SCOPE_REQUIRED'};
  return {intent:'UNCLASSIFIED',needsCurrentSource:false,query:null,reason:'SEMANTIC_RETRIEVAL_NOT_IMPLEMENTED'};
}
