/** Gateway-scoped ephemeral memory. The authentication resolver is a trusted SERVER adapter. */
const ident=s=>typeof s==='string'&&/^[a-z0-9][a-z0-9_-]{3,90}$/i.test(s);
export class ScopedEphemeralMemory {
  #rows=new Map();#resolvePrincipal;
  constructor({resolvePrincipal,clock=()=>Date.now(),ttlMs=15*60_000,maxRows=1000}={}) {
    if(typeof resolvePrincipal!=='function')throw Error('AUTHENTICATED_IDENTITY_RESOLVER_REQUIRED');
    this.#resolvePrincipal=resolvePrincipal;this.clock=clock;this.ttlMs=ttlMs;this.maxRows=maxRows;
  }
  async #key({requestContext,productId,sessionId}={}) {
    // Never trust principalId, trustedGateway or consent from browser-supplied JSON.
    if(!ident(productId)||!ident(sessionId))throw Error('INVALID_SESSION_SCOPE');
    const principal=await this.#resolvePrincipal(requestContext);
    if(!principal||principal.verified!==true||!ident(principal.subject))throw Error('TRUSTED_PRINCIPAL_REQUIRED');
    return JSON.stringify([productId,principal.subject,sessionId]);
  }
  async read(context,{consent}={}) {
    const k=await this.#key(context);if(consent?.sessionMemory!==true)return [];
    const row=this.#rows.get(k);if(!row)return [];
    if(row.expiry<=this.clock()){this.#rows.delete(k);return [];}return structuredClone(row.messages);
  }
  async write(context,messages,{consent}={}) {
    const k=await this.#key(context);
    if(consent?.sessionMemory!==true){this.#rows.delete(k);return false;}
    if(!Array.isArray(messages)||messages.length>30||messages.some(m=>!['user','assistant'].includes(m?.role)||typeof m.content!=='string'||m.content.length>1000))throw Error('INVALID_MEMORY');
    if(!this.#rows.has(k)&&this.#rows.size>=this.maxRows)throw Error('SESSION_CAPACITY_EXCEEDED');
    this.#rows.set(k,{messages:structuredClone(messages.slice(-6)),expiry:this.clock()+this.ttlMs});return true;
  }
  async erase(context){this.#rows.delete(await this.#key(context));}
}
