// Ephemeral TEST/PROTOTYPE ONLY - NOT a durable production database.
export class EphemeralSessionStore {
  #rows = new Map();
  constructor({ttlMs=15*60_000,clock=()=>Date.now()}={}) {this.ttlMs=ttlMs;this.clock=clock;}
  async get(sessionId) {
    const r=this.#rows.get(sessionId);
    if (!r) return [];
    if (r.expires <= this.clock()) {this.#rows.delete(sessionId);return [];}
    return structuredClone(r.messages);
  }
  async put(sessionId,messages) {
    this.#rows.set(sessionId,{expires:this.clock()+this.ttlMs,messages:structuredClone(messages.slice(-6))});
  }
  async erase(sessionId) {this.#rows.delete(sessionId);}
}
