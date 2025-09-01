// src/frontend/src/services/api.js
const base=import.meta.env.VITE_API_BASE_URL
let token=''
export const setToken=t=>token=t||''
const hdr=()=>token?{'Authorization':'Bearer '+token}:{}
const j=async(r)=>{if(!r.ok) throw new Error('http'); return r.json()}
export const api={
  get: (p)=>fetch(base+p,{headers:{...hdr()}}).then(j),
  post:(p,b)=>fetch(base+p,{method:'POST',headers:{'Content-Type':'application/json',...hdr()},body:JSON.stringify(b)}).then(j)
}
export const aiMermaid=(b)=>api.post('/ai/mermaid',b)
export default {api,setToken,aiMermaid}
