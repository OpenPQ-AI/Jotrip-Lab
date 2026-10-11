'use strict';
const http=require('http'),fs=require('fs'),path=require('path');
const mime={'.html':'text/html;charset=utf-8','.js':'text/javascript;charset=utf-8','.jpg':'image/jpeg','.png':'image/png','.json':'application/json'};
function createServer(){
 return http.createServer((req,res)=>{
  let name=new URL(req.url,'http://127.0.0.1').pathname;
  if(name==='/favicon.ico'){res.writeHead(204).end();return}
  if(name==='/')name='/index.html';
  const p=path.resolve(__dirname,'.'+name);
  if(!p.startsWith(__dirname+path.sep)||!fs.existsSync(p)||!fs.statSync(p).isFile()){res.writeHead(404).end('NOT_FOUND');return}
  res.writeHead(200,{'Content-Type':mime[path.extname(p)]||'application/octet-stream','Content-Length':fs.statSync(p).size,'cache-control':'no-store'});
  fs.createReadStream(p).pipe(res);
 });
}
module.exports={createServer};
if(require.main===module)createServer().listen(4207,'127.0.0.1',()=>console.log('ISOLATED_APOLLO_LOCAL_ONLY'));