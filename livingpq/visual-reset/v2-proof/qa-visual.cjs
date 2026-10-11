'use strict';
const fs=require('fs'),path=require('path');
const {chromium}=require('C:/Users/Public/OpenPQ/living-kyoto-reference-proof-20261010/kyoto-higashiyama/node_modules/playwright');
const {createServer}=require('./server.cjs');
(async()=>{
 const server=createServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));
 let browser;const snaps=[],errs=[];
 try{
  browser=await chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',args:['--no-sandbox','--enable-unsafe-swiftshader','--disable-extensions']});
  const context=await browser.newContext({viewport:{width:1200,height:800},deviceScaleFactor:1});
  const page=await context.newPage();
  page.on('pageerror',e=>errs.push('JS:'+e.message));
  page.on('console',x=>{if(x.type()==='error')errs.push('CONSOLE:'+x.text().slice(0,180))});
  page.on('response',r=>{if(r.status()>=400)errs.push('HTTP:'+r.status()+' '+r.url())});
  const res=await page.goto('http://127.0.0.1:'+server.address().port+'/',{waitUntil:'domcontentloaded',timeout:30000});
  await page.waitForFunction(()=>window.SignatureArt?.state().palmReady&&window.SignatureArt?.state().frames>10,{timeout:65000});
  for(const name of ['hillside','promenade','bridge']){
   await page.evaluate(name=>SignatureArt.setView(name),name);
   await page.waitForTimeout(900);
   const state=await page.evaluate(()=>SignatureArt.state());
   const filename='ACTUAL_3D_'+name.toUpperCase()+'.png';
   await page.screenshot({path:path.join(__dirname,filename),timeout:30000});
   snaps.push({view:name,fpsEdgeSoftware:state.fps,palms:state.palmInstances,bridgeGapMeters:state.bridgeGapMeters,palmError:state.palmError,sourceTruth:state.sourceTruth});
   console.log('RENDER',name,JSON.stringify(snaps.at(-1)));
  }
  await page.setViewportSize({width:390,height:844});
  await page.evaluate(()=>SignatureArt.setView('hillside'));
  await page.waitForTimeout(850);
  await page.screenshot({path:path.join(__dirname,'ACTUAL_3D_PORTRAIT.png')});
  const verdict=(res.status()===200&&snaps.length===3&&snaps.every(x=>x.palms>=12&&!x.palmError&&x.bridgeGapMeters>2)&&errs.length===0)?'REAL_WEBGL_RENDER_PASS_VISUAL_REVIEW_REQUIRED':'TECHNICAL_HOLD';
  const result={verdict,source:'Local Three.js 3D meshes + authorized CC0 palm model and PBR; no gameplay; not measured site geometry',snaps,errs,productionTouched:false,beautyGate:'NOT_APPROVED',siteGate:'NOT_CALIBRATED'};
  fs.writeFileSync(path.join(__dirname,'SIGNATURE_3D_QA.json'),JSON.stringify(result,null,2));
  console.log('VERDICT',verdict,JSON.stringify(errs));
  if(verdict==='TECHNICAL_HOLD')process.exitCode=2;
  await context.close();
 }catch(e){console.error('RENDER_FATAL',e.stack);process.exitCode=2}
 finally{if(browser)await browser.close();await new Promise(r=>server.close(r))}
})().catch(e=>{console.error(e);process.exitCode=2});