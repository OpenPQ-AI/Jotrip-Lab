// Providers are replaceable. Never persist provider keys or model outputs to analytics.
const unpack = raw => {
  let value = raw;
  if (typeof raw === 'string') {
    try {value=JSON.parse(raw);} catch {throw Error('MODEL_OUTPUT_NOT_STRUCTURED');}
  }
  if (!value || typeof value.answer !== 'string' || !Array.isArray(value.evidenceIds) || value.evidenceIds.some(x=>typeof x!=='string')) throw Error('MODEL_OUTPUT_INVALID');
  return {answer:value.answer.trim().slice(0,2000),evidenceIds:[...new Set(value.evidenceIds)].slice(0,12)};
};
export function createWorkersAiProvider({ai,model='@cf/google/gemma-4-26b-a4b-it'}={}) {
  if (!ai || typeof ai.run!=='function') throw Error('AI_BINDING_REQUIRED');
  return {id:'workers-ai',async generate(messages) {
    const v=await ai.run(model,{messages,max_completion_tokens:420,temperature:0.2,stream:false});
    const raw=v?.choices?.[0]?.message?.content ?? v?.response;
    return unpack(raw);
  }};
}
export function createOpenAICompatibleProvider({endpoint,apiKey,model,fetcher=fetch}={}) {
  if (typeof endpoint!=='string' || !(/^(https:\/\/|http:\/\/127\.0\.0\.1[:/]|http:\/\/localhost[:/])/.test(endpoint)) || !model || typeof apiKey!=='string') throw Error('INVALID_PROVIDER_CONFIGURATION');
  return {id:'openai-compatible',async generate(messages) {
    const r=await fetcher(endpoint,{method:'POST',headers:{'content-type':'application/json',authorization:'Bearer '+apiKey},body:JSON.stringify({model,messages,temperature:0.2,max_tokens:420})});
    if (!r.ok) throw Error('PROVIDER_HTTP_'+r.status);
    const j=await r.json();
    return unpack(j?.choices?.[0]?.message?.content);
  }};
}
