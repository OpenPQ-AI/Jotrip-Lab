// No raw questions, transcripts, identity, exact coordinates or private session memory.
const INTENTS=new Set(['weather','mobility','place','culture','activity','operations','other']);
const OUTCOMES=new Set(['ANSWERED','UNKNOWN','PROVIDER_UNAVAILABLE','USER_CONFIRMED_USEFUL','USER_REPORTED_WRONG']);
const LANGUAGES=new Set(['vi','en','ko','ru','zh','fr','other']);
export function makeAggregateSignal(input,{at=new Date()}={}) {
  if (input?.consent?.analytics !== true) return null;
  const intent=INTENTS.has(input.intent)?input.intent:'other';
  const outcome=OUTCOMES.has(input.outcome)?input.outcome:'UNKNOWN';
  const language=LANGUAGES.has(input.language)?input.language:'other';
  return Object.freeze({schema:'song.question-signal.v1',month:new Date(at).toISOString().slice(0,7),intent,language,outcome});
}
