'use strict';
const http=require('http'),fs=require('fs'),path=require('path');
const allow={'/':'index.html','/index.html':'index.html','/main.js':'main.js','/view_04.jpg':'view_04.jpg','/view_06.jpg':'view_06.jpg','/view_07.jpg':'view_07.jpg','/view_08.jpg':'view_08.jpg','/view_09.jpg':'view_09.jpg'};
function createServer(){
 return http.createServer((req,res)=>{
  const u=new URL(req.url,'http://127.0.0.1');
  if(u.pathname==='/favicon.ico'){res.writeHead(204).end();return;}
  if(req.method!=='GET'||!Object.prototype.hasOwnProperty.call(allow,u.pathname)){res.writeHead(404).end('NOT_FOUND');return;}
  const f=allow[u.pathname],file=path.join(__dirname,f);
  if(!fs.existsSync(file)){res.writeHead(404).end('MISSING');return;}
  res.writeHead(200,{'Content-Type':f.endsWith('.html')?'text/html; charset=utf-8':f.endsWith('.js')?'text/javascript; charset=utf-8':'image/jpeg','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Content-Length':fs.statSync(file).size});
  fs.createReadStream(file).pipe(res);
 });
}
module.exports={createServer};
if(require.main===module)createServer().listen(Number(process.argv[2]||4196),'127.0.0.1',()=>console.log('PHOTOWALK_LOOPBACK_ONLY'));