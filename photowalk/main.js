'use strict';
/* Apollo PhotoWalk: four actual photographs, controlled transitions. This deliberately
   does NOT purport to be continuous calibrated 3D travel or surveyed physical geography. */
const views=[
 {src:'/view_07.jpg',tag:'01 / 04 · Phía con phố',title:'Apollo, thật gần.',desc:'Tháp kính xanh và con phố bên cạnh. Ảnh thực tế chụp từ mặt đất.',credit:'Vivu Vietnam · Wikimedia Commons CC BY-SA 4.0'},
 {src:'/view_06.jpg',tag:'02 / 04 · Mặt tiền',title:'Sắc xanh Apollo.',desc:'Điểm nhấn đồng, kính và khối nhà phía sau. Đây là góc ảnh khác, không phải camera 3D liên tục.',credit:'Vivu Vietnam · Wikimedia Commons CC BY-SA 4.0'},
 {src:'/view_04.jpg',tag:'03 / 04 · Quảng trường',title:'Thị trấn lên đèn.',desc:'Một góc quảng trường Sunset Town ở thời điểm khác trong ngày.',credit:'Vivu Vietnam · Wikimedia Commons CC BY-SA 4.0'},
 {src:'/view_08.jpg',tag:'04 / 04 · Góc nhìn trên cao',title:'Một góc toàn cảnh.',desc:'Ảnh drone thật. Chuyển điểm nhìn để quan sát kiến trúc và khu vực xung quanh, không phải bay trong không gian 3D.',credit:'Vivu Vietnam · Wikimedia Commons CC BY-SA 4.0'}
];
const $=id=>document.getElementById(id);
const A=$('photoA'),B=$('photoB'),view=$('viewport');
const loaded=views.map(x=>new Image());
loaded.forEach((im,i)=>{im.src=views[i].src;});
[A,B].forEach(im=>{im.draggable=false;im.addEventListener('dragstart',e=>e.preventDefault());});
let progress=0,pressForward=false,pressBack=false,auto=false;
let last=performance.now(),startAuto=0,pointer=null,panX=0,panY=0,lookCount=0,walkFrames=0,stoppedFrames=0,currentIndex=-1,showA=-1,showB=-1,frames=0;
const frameMax=views.length-1;
const clamp=(v,lo,hi)=>Math.min(hi,Math.max(lo,v));
const ease=t=>t*t*(3-2*t);
function viewLabel(idx){
 if(idx!==currentIndex){
  currentIndex=idx;
  $('eyebrow').textContent=views[idx].tag;
  $('headline').textContent=views[idx].title;
  $('subtitle').textContent=views[idx].desc;
 }
}
function render(){
 const i=Math.min(frameMax,Math.floor(progress)),next=Math.min(i+1,frameMax);
 const delta=progress-i;
 const blend=i===next?0:ease(clamp((delta-.57)/.43,0,1));
 if(showA!==i){A.src=views[i].src;showA=i;}
 if(showB!==next){B.src=views[next].src;showB=next;}
 A.style.opacity=String(1-blend);B.style.opacity=String(blend);
 const scrollX=(progress/frameMax-.5)*-18;
 const sx=panX*.9+scrollX,sy=panY*.74;
 const scale=(1.07+.035*(1-delta));
 A.style.transform='translate3d('+sx+'px,'+sy+'px,0) scale('+scale+')';
 B.style.transform='translate3d('+(sx*.7)+'px,'+(sy*.75)+'px,0) scale('+(scale+.012)+')';
 $('progressFill').style.width=(progress/frameMax*100).toFixed(1)+'%';
 viewLabel(clamp(Math.round(progress),0,frameMax));
 $('start').textContent=auto?'Ⅱ Dừng tham quan':'▶ Tham quan 25s';
 $('prev').disabled=progress<=.001;
 $('next').disabled=progress>=frameMax-.001;
}
function setProgress(next){progress=clamp(next,0,frameMax);render();}
function gotoNode(direction){
 auto=false;
 setProgress(clamp(Math.round(progress+direction),0,frameMax));
}
function startTour(){
 if(auto){auto=false;render();return;}
 if(progress>=frameMax-.04)setProgress(0);
 auto=true;startAuto=performance.now()-progress/frameMax*25000;
 render();
}
$('prev').addEventListener('click',()=>gotoNode(-1));
$('next').addEventListener('click',()=>gotoNode(1));
$('start').addEventListener('click',startTour);
window.addEventListener('keydown',e=>{
 const k=e.key.toLowerCase();
 if(['w','s','arrowup','arrowdown','arrowleft','arrowright','a','d'].includes(k))e.preventDefault();
 if(k==='w'||k==='arrowup'){pressForward=true;auto=false;}
 if(k==='s'||k==='arrowdown'){pressBack=true;auto=false;}
 if(k==='arrowright'||k==='d'){if(!e.repeat)gotoNode(1);}
 if(k==='arrowleft'||k==='a'){if(!e.repeat)gotoNode(-1);}
});
window.addEventListener('keyup',e=>{const k=e.key.toLowerCase();if(k==='w'||k==='arrowup')pressForward=false;if(k==='s'||k==='arrowdown')pressBack=false;});
window.addEventListener('blur',()=>{pressForward=false;pressBack=false;pointer=null;});
view.addEventListener('pointerdown',e=>{
 if(e.pointerType==='mouse'&&e.button!==0)return;
 pointer={id:e.pointerId,x:e.clientX,y:e.clientY};
 if(e.pointerType!=='mouse')view.setPointerCapture(e.pointerId);e.preventDefault();
});
window.addEventListener('pointermove',e=>{
 if(!pointer||e.pointerId!==pointer.id)return;
 panX=clamp(panX+(e.clientX-pointer.x)*.35,-95,95);
 panY=clamp(panY+(e.clientY-pointer.y)*.35,-55,55);
 pointer.x=e.clientX;pointer.y=e.clientY;lookCount++;render();
});
view.addEventListener('pointerup',e=>{if(e.pointerId===pointer?.id)pointer=null;});
view.addEventListener('pointercancel',e=>{if(e.pointerId===pointer?.id)pointer=null;});
view.addEventListener('wheel',e=>{
 if(e.ctrlKey)return;
 e.preventDefault();auto=false;setProgress(progress-Math.sign(e.deltaY)*.22);
},{passive:false});
function tick(t){
 const dt=clamp((t-last)/1000,0,.06);last=t;frames++;
 if(auto){
  const d=clamp((t-startAuto)/25000,0,1);
  setProgress(d*frameMax);
  if(d>=1){auto=false;render();}
 }else if(pressForward||pressBack){
  setProgress(progress+(Number(pressForward)-Number(pressBack))*dt*.24);
  walkFrames++;
 }else stoppedFrames++;
 requestAnimationFrame(tick);
}
window.PhotoWalk={
 state:()=>({ready:loaded.every(im=>im.complete&&im.naturalWidth>0),mode:'PHOTO_TRANSITIONS_NOT_FULL_3D',
 progress,activeView:currentIndex,sourceCount:views.length,lookCount,walkFrames,stoppedFrames,auto,frames,
 network:'LOCAL_IMAGES_ONLY',notTrueWalk:true,notCalibrated:true,notSurveyed:true,allLicensed:'CC_BY_SA_4_0_CHECK_SOURCE_METADATA',
 licenseCredit:'Vivu Vietnam / Wikimedia Commons',master:'NO_DEPLOY_NO_MERGE'}),
 reset:()=>{auto=false;panX=0;panY=0;setProgress(0);},
 show:(i)=>{auto=false;setProgress(clamp(i,0,frameMax));},
 play:startTour
};
render();requestAnimationFrame(tick);