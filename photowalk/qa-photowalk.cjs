'use strict';
const path=require('path'),fs=require('fs');
const {chromium}=require('C:/Users/Public/OpenPQ/living-kyoto-reference-proof-20261010/kyoto-higashiyama/node_modules/playwright');
const {createServer}=require('./server.cjs');
(async()=>{
 const server=createServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const url='http://127.0.0.1:'+server.address().port+'/';
 let browser,context,page,video=null;const errors=[],stages=[];
 try{
  browser=await chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
   args:['--no-sandbox','--disable-extensions','--enable-unsafe-swiftshader']});
  context=await browser.newContext({viewport:{width:844,height:390},deviceScaleFactor:1,recordVideo:{dir:__dirname,size:{width:844,height:390}}});
  page=await context.newPage();
  page.on('pageerror',e=>errors.push('JS '+e.message));
  page.on('console',c=>{if(c.type()==='error')errors.push('CONSOLE '+c.text())});
  page.on('request',r=>{if(!r.url().startsWith(url)&&!r.url().startsWith('blob:'))errors.push('EXTERNAL '+r.url())});
  page.on('response',r=>{if(r.status()>=400)errors.push('HTTP '+r.status()+' '+r.url())});
  await page.goto(url,{waitUntil:'networkidle',timeout:30000});
  await page.waitForFunction(()=>window.PhotoWalk?.state().ready,{timeout:30000});
  async function shot(n){
   const state=await page.evaluate(()=>PhotoWalk.state());
   const file='PHOTOWALK_'+n+'.png',buf=await page.screenshot({path:path.join(__dirname,file),timeout:25000});
   stages.push({name:n,png:file,bytes:buf.length,state});
   console.log('CAPTURE',n,'view',state.activeView,'progress',state.progress.toFixed(2),'size',buf.length);
  }
  await shot('01_STREET');
  await page.evaluate(()=>PhotoWalk.show(1));await page.waitForTimeout(800);await shot('02_FRONT');
  await page.evaluate(()=>PhotoWalk.show(2));await page.waitForTimeout(800);await shot('03_PLAZA');
  await page.evaluate(()=>PhotoWalk.show(3));await page.waitForTimeout(800);await shot('04_AERIAL');
  await page.evaluate(()=>PhotoWalk.reset());
  await page.keyboard.down('w');await page.waitForTimeout(7200);await page.keyboard.up('w');await page.waitForTimeout(400);await shot('05_REAL_WALK');
  await page.mouse.move(590,235);await page.mouse.down();
  for(let i=0;i<13;i++){await page.mouse.move(590-i*21,230);await page.waitForTimeout(35)}
  await page.mouse.up();await page.waitForTimeout(300);
  await shot('06_POINTER_LOOK');
  await page.evaluate(()=>PhotoWalk.reset());await page.click('#start');await page.waitForTimeout(2700);
  const running=await page.evaluate(()=>PhotoWalk.state());await page.click('#start');
  const stopped=await page.evaluate(()=>PhotoWalk.state());
  const checks={
   imageAssetReady:stages.every(s=>s.state.ready),
   fourActualPhotographs:stages.slice(0,4).every((s,i)=>s.state.activeView===i),
   actualKeyboardInput:stages[4].state.walkFrames>0&&stages[4].state.progress>.4,
   actualPointerInput:stages[5].state.lookCount>=10,
   startStopAuto:running.auto&&!stopped.auto,
   noJSNetworkErrors:errors.length===0,
   notPretending3D:stages[0].state.notTrueWalk&&stages[0].state.notSurveyed
  };
  video=page.video();await page.close();await context.close();
  const vidpath=path.join(__dirname,'PHOTOWALK_REAL_INTERACTION_WEBM.webm');await video.saveAs(vidpath);
  const result={status:Object.values(checks).every(Boolean)?'PHOTO_WALK_INTERACTION_PASS_VISUAL_REVIEW_PENDING':'TECHNICAL_HOLD',
    checks,stages,errors,videoBytes:fs.statSync(vidpath).size,
    truth:'Actual photos with transition between different viewpoints, no continuous 3D camera travel. No physical iPhone test or geographical coordinates.'};
  fs.writeFileSync(path.join(__dirname,'PHOTOWALK_QA.json'),JSON.stringify(result,null,2));
  console.log('RESULT',result.status,'CHECKS',JSON.stringify(checks),'VIDEO',result.videoBytes);
  if(!Object.values(checks).every(Boolean))process.exitCode=2;
 }catch(e){console.error('PHOTOWALK_QA_ERROR',e.stack);process.exitCode=2;}
 finally{try{if(context)await context.close()}catch{};try{if(browser)await browser.close()}catch{};await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=2});