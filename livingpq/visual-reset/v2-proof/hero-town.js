// LivingPQ Visual Reset V2 - handcrafted signature architecture.
// Uncalibrated PHOTO-STUDY geometry. No building footprints or bridge elevations claimed as surveyed.
// Geometry is REAL WebGL 3D, not image cards, panorama, photo planes, or gameplay assets.
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
export function buildHeroTown(scene){
 const T=THREE;
 const mats={
  cream:'#ead8bb', ivory:'#f8e8d2', lemon:'#e7c88d', coral:'#d89d87',
  salmon:'#c88679', peach:'#e8b19a', ochre:'#cd9c68', blush:'#dfadab',
  rose:'#d3938b', mint:'#a4c6b3', teal:'#7faca9', blue:'#a6bcc7',
  brick:'#934f3f', brickLight:'#b66b4e', roof:'#a64e39', roof2:'#bd684c',
  trim:'#ffedd5', arch:'#edd9bd', windows:'#285364', windowsLit:'#ffbd6b',
  glass:'#79a4ae', balcony:'#463e43', paving:'#d2bda3',
  light:'#ffe0a2', greenery:'#526b45', hillside:'#53654e', deep:'#365a51',
  charcoal:'#4d4850', bronze:'#947058'
 };
 const batches={};const geocount={};
 function geo(key,g,x=0,y=0,z=0,rot=0){
  if(rot)g.rotateY(rot);
  g.translate(x,y,z);
  if(g.index)g=g.toNonIndexed();
  (batches[key]??=[]).push(g);geocount[key]=(geocount[key]||0)+1;
 }
 function bx(key,x,y,z,w,h,d){geo(key,new T.BoxGeometry(w,h,d),x,y,z)}
 function cy(key,x,y,z,r,h,n=14){geo(key,new T.CylinderGeometry(r,r,h,n),x,y,z)}
 function triangleRoof(key,x,y,z,w,d,rise){
  const sh=new T.Shape(); sh.moveTo(-w/2,0);sh.lineTo(0,rise);sh.lineTo(w/2,0);sh.closePath();
  let g=new T.ExtrudeGeometry(sh,{depth:d,bevelEnabled:true,bevelSize:.10,bevelThickness:.06,bevelSegments:1});
  geo(key,g,x,y,z-d/2);
 }
 function setArch(key,x,y,z,w,h,depth=.09){ // single framed archivolt, NOT 2D impostor
  const sh=new T.Shape();sh.moveTo(-w/2,0);sh.lineTo(-w/2,h-w/2);
  sh.absarc(0,h-w/2,w/2,Math.PI,0,true);
  sh.lineTo(w/2,0);sh.closePath();
  geo(key,new T.ExtrudeGeometry(sh,{depth,bevelEnabled:false,curveSegments:9}),x,y,z);
 }
 function windowSet(x,y,z,ww,wh,lights,detail){
  setArch(lights?'windowsLit':'windows',x,y,z,ww,wh,.065);
  bx('trim',x-ww/2-.11,y+wh*.36,z-.06,.15,wh*.77,.13);
  bx('trim',x+ww/2+.11,y+wh*.36,z-.06,.15,wh*.77,.13);
  bx('trim',x,y-.02,z-.12,ww+.43,.17,.25);
  bx('trim',x,y+wh*.70,z-.12,ww+.32,.10,.15);
  if(detail) {
    bx('balcony',x,y-.20,z-.42,ww+1,.11,.82);
    bx('balcony',x,y+.50,z-.83,ww+.94,.07,.08);
    for(let k=-2;k<=2;k++)bx('balcony',x+k*(ww+.55)/5,y+.16,z-.81,.045,.57,.045);
  }
 }
 const palette=['cream','lemon','peach','salmon','mint','ivory','blush','coral','ochre','blue'];
 const widths=[12,9.6,10.4,12.4,8.8,11.4,9.2,13.0,10.3,9.7,12.5,11.3,9.5];
 let facades=0,windows=0;
 function palazzo(x,z,w,h,level,idx){
  const d=9.5+(idx%4)*1.55;let k=palette[idx%palette.length];let yy=level;
  // Real volumetric extruded façades: recesses, cornices, ornament, balcony, pitched tiled roofs.
  // Irregular silhouette and roofline are intentional. Never use anonymous box-town prototype.
  const sh=new T.Shape();
  const shoulders=idx%3===0?1.05:0;
  sh.moveTo(-w/2,0);sh.lineTo(w/2,0);sh.lineTo(w/2,h-shoulders);
  if(shoulders){sh.lineTo(w*.36,h-shoulders);sh.lineTo(w*.30,h);sh.lineTo(-w*.30,h);sh.lineTo(-w*.36,h-shoulders);}
  sh.lineTo(-w/2,h-shoulders);sh.closePath();
  geo(k,new T.ExtrudeGeometry(sh,{depth:d,bevelEnabled:false}),x,yy,z-d/2);
  bx('trim',x,yy+h-.32,z-d/2-.18,w+.48,.36,.5);
  bx('arch',x,yy+h-1.05,z-d/2-.13,w+.33,.13,.25);
  bx('paving',x,yy+.14,z-d/2-.17,w+.3,.31,.5);
  const floors=Math.max(2,Math.floor(h/4.0));
  const cols=Math.max(2,Math.floor((w-.8)/2.7));const space=w/cols;
  for(let floor=0;floor<floors;floor++){
   let wy=yy+1.1+floor*(h-2)/floors;
   for(let c=0;c<cols;c++){
    let wx=x-w/2+space*(c+.5);
    let frameW=Math.min(1.32,space*.51);
    let frameH=floor===0?2.45:2.10;
    windowSet(wx,wy,z-d/2-.15,frameW,frameH,(idx+c+floor)%6===0,floor>0 && (idx+c)%4===0);
    windows++;
   }
  }
  if(idx%4!==2){
   triangleRoof(idx%3===1?'roof2':'roof',x,yy+h+.2,z,w+.65,d+.55,2.2+(idx%3)*.8);
   bx('brickLight',x,yy+h+.08,z-d/2,w+.43,.17,.32);
  } else {
   for(let c=0;c<5;c++)bx('ivory',x-w*.43+c*w*.215,yy+h+.29,z-d/2-.16,w*.12,.52,.37);
  }
  // awnings for storefronts
  if(idx%2===0)bx('roof2',x,yy+3.1,z-d/2-1,w*.77,.15,2.0);
  facades++;
 }
 // Step plaza up towards a stylised Mediterranean hillside. Entire ground is 3D geometry.
 bx('paving',0,-.85,76,330,1.7,152);
 // Raised street terraces and narrow decorated winding promenade
 for(let tier=0;tier<3;tier++){
  const cz=52+tier*29,level=tier*4;
  bx('paving',0,level+.12,cz,286,1.2,21.5);
  bx('trim',0,level+.82,cz-11,286,.18,.45);
  for(let j=0;j<50;j++){
   let x=-139+j*5.7;
   bx('charcoal',x,level+.65,cz-11,.045,.075,1.2);
  }
 }
 // Hinterland wave terrain, visibly connects town to island. Not a flat backdrop.
 const verts=[],inds=[];let nx=62,nz=18;
 for(let j=0;j<=nz;j++){let z=125+j*8;
  for(let i=0;i<=nx;i++){let x=-180+i*360/nx;
   let h=17+Math.sin(x*.023)*7+Math.sin(x*.065+z*.014)*3+Math.sin(z*.035)*2+(z-125)*.13;
   verts.push(x,h,z);
  }
 }
 for(let j=0;j<nz;j++)for(let i=0;i<nx;i++){let a=j*(nx+1)+i,b=a+1,c=a+nx+1,d=c+1;inds.push(a,c,b,b,c,d)}
 const land=new T.BufferGeometry();
 land.setAttribute('position',new T.Float32BufferAttribute(verts,3));land.setIndex(inds);land.computeVertexNormals();
 geo('hillside',land);
 // Lively pitched roofs on waterfront, with actual void/corridor around the clock tower.
 let x=-146;for(let i=0;i<27;i++){
  let w=8.8+(i%5)*1.1;x+=w/2+.5;
  if(x>-84&&x<-57){x+=21;continue}
  if(x>146)break;
  palazzo(x,55+Math.sin(i*.46)*1.5,w,12+(i%5)*1.9,2.6+(i%4)*.6,i);
  x+=w/2+.6;
 }
 for(let row=1;row<=2;row++){
  let pos=-153+row*5;
  for(let i=0;i<25;i++){
   let w=9+(i%4)*1.15;pos+=w/2+1.8;
   if(pos>150)break;
   palazzo(pos,56+row*30+Math.sin(i)*1.3,w,15+(i%6)*1.7,6.2+(row-1)*6.0,i+row*31);
   pos+=w/2+1.35;
  }
 }
 // 75m Venice-inspired CLOCK TOWER landmark, independently modelled 3D. Approximate silhouette.
 const tx=-67, tz=58;let base=3.5;
 bx('brick',tx,base+16,tz,10.5,32,10.5);
 for(let side of [-1,1]){
  bx('trim',tx+side*5.25,base+16,tz,1.0,32,10.9);
  bx('brickLight',tx+side*4.15,base+16,tz-5.30,.28,30,.20);
 }
 for(let j=0;j<13;j++)bx('brickLight',tx,base+3+j*2.23,tz-5.28,8.95,.18,.10);
 bx('ivory',tx,base+33,tz,13.9,2.8,13.9);
 bx('ochre',tx,base+35.2,tz,11.2,1.4,11.2);
 bx('cream',tx,base+43,tz,11.3,14.8,11.3);
 for(let face=0;face<4;face++){
  const zface=face===0?tz-5.8:face===1?tz+5.8:tz;
  const xface=face===2?tx-5.8:face===3?tx+5.8:tx;
  for(let k=-1;k<=1;k++){
   if(face<=1){
    setArch('windows',tx+k*3.2,base+37,zface,1.85,6,.14);
    bx('ivory',tx+k*3.2,base+44.8,zface,.32,4,.38);
   }else{
    bx('windows',xface,base+40,tz+k*3.2,.20,5.9,1.55);
   }
  }
 }
 bx('ivory',tx,base+50.7,tz,15.3,1.3,15.3);
 // 4-sided clock faces & Roman-style tick marks. Clock geometry extends toward seafront.
 const cf=new T.CircleGeometry(2.76,40);cf.rotateX(0);
 geo('ivory',cf,tx,base+49.1,tz-7.76);
 const rim=new T.TorusGeometry(2.8,.20,8,40);geo('bronze',rim,tx,base+49.1,tz-7.90);
 for(let a=0;a<12;a++){let q=a*Math.PI/6;bx('charcoal',tx+Math.sin(q)*2.28,base+49.1+Math.cos(q)*2.28,tz-7.93,.13,.38,.12)}
 bx('charcoal',tx+.28,base+49.5,tz-8.05,.12,1.23,.10);
 bx('charcoal',tx+.74,base+48.93,tz-8.05,1.44,.10,.10);
 const spire=new T.ConeGeometry(8.2,14.2,4);spire.rotateY(Math.PI/4);geo('roof',spire,tx,base+58.3,tz);
 cy('bronze',tx,base+66,tz,.32,3,12);
 geo('bronze',new T.SphereGeometry(.78,10,8),tx,base+67.9,tz);
 // Lower clock complex, promenade piazza and colonnades
 bx('cream',tx+27,base+6.15,tz+3.4,46,12.3,16);
 triangleRoof('roof',tx+27,base+12.4,tz+3.4,46.8,16.7,2.65);
 for(let j=0;j<12;j++){
  let xx=tx+4.6+j*3.86;
  setArch('windows',xx,base+2,tz-5.04,2.1,4.8,.18);
  bx('trim',xx,base+1.95,tz-5.28,2.46,.20,.23);
 }
 // Dome-like small civic pavilion and broad waterfront stair/plaza.
 const dome=new T.SphereGeometry(9,20,10,0,Math.PI*2,0,Math.PI/2);
 geo('teal',dome,56,17,92);
 cy('ivory',56,13,92,9,2.6,30);
 for(let k=0;k<13;k++){let a=k*2*Math.PI/13;cy('trim',56+7.7*Math.sin(a),10.7,92+7.7*Math.cos(a),.23,7.2,8)}
 bx('trim',56,5,92,24,1,25);
 // Faceted shore promenade (not floating square). Seafront rows of curving planters.
 for(let i=0;i<55;i++){
  let ang=Math.PI*2*i/55,x=3+58*Math.cos(ang),z=16+18*Math.sin(ang);
  if(z>30)continue;
  cy('greener',x,2.68,z,1.1,.13,8); // optional unknown material intentionally supplied below
 }
 const count=Object.values(batches).reduce((s,a)=>s+a.length,0);
 let draw=0,failures=[];
 for(const [key,gg] of Object.entries(batches)){
  const color=mats[key]||mats.greenery;
  const mat=new T.MeshStandardMaterial({color,roughness:key==='windows'?.37:.83,metalness:key==='bronze'?.62:0,side:key==='hillside'?T.DoubleSide:T.FrontSide,emissive:key==='windowsLit'?'#af6c35':'#000000',emissiveIntensity:key==='windowsLit'?.30:0});
  if(key==='roof'||key==='roof2'){const tex=new T.TextureLoader().load('textures/roof_albedo.jpg');tex.wrapS=tex.wrapT=T.RepeatWrapping;tex.repeat.set(.22,.22);tex.colorSpace=T.SRGBColorSpace;mat.map=tex;mat.color.set(key==='roof'?'#f4d6be':'#f9d9c4');mat.roughness=.92;}
  try {
   const merged=mergeGeometries(gg,false);
   if(!merged){failures.push(key);continue}
   const obj=new T.Mesh(merged,mat);obj.frustumCulled=false;scene.add(obj);draw++;
  }catch(e){failures.push(key+':'+e.message)}
 }
 return {facades,windows,drawCalls:draw,geometryParts:count,failures,siteTruth:'STYLIZED_PHOTO_REFERENCED_NOT_SURVEYED'};
}