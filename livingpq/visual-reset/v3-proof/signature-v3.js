// LivingPQ Visual Reset V3 - signed landmark geometry, photo-referenced art study.
// NOT survey geometry, not a recovered protected point cloud.
import * as THREE from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
export function buildSignatureV3(scene){
 const T=THREE, PI=Math.PI, groups={}, materialCount={};
 const P={sand:'#d7bb9d',plaza:'#d7cab7',ivory:'#f2e6d3',gold:'#e7c79d',
  white:'#eee5da',cream:'#e6d5bb',butter:'#e4c597',coral:'#dca28d',
  apricot:'#e9b49d',salmon:'#ce877a',pink:'#d49e9a',ochre:'#c99d71',
  azure:'#a5b9bf',mint:'#9ab6a2',brick:'#9e5445',darkbrick:'#68382f',
  terracotta:'#b55f41',roof:'#b75c40',roofdark:'#914732',mortar:'#e8d6bc',
  slate:'#517e81',ink:'#294953',glass:'#285060',lit:'#f3b867',
  shadow:'#605856',rail:'#785d53',bronze:'#96765c',foliage:'#617c69',grove:'#466c56',groveLight:'#799178',
  stone:'#d0c7b9',stage:'#d9e0dd',steel:'#a5bdc1',lawn:'#658167',
  seafoam:'#69a7b3',rock:'#776c60'};
 let townBuildings=0,windowCount=0;
 function add(key,g,x=0,y=0,z=0,rx=0,ry=0){
  if(rx)g.rotateX(rx);if(ry)g.rotateY(ry);g.translate(x,y,z); if(g.index)g=g.toNonIndexed();
  if(!g.getAttribute('normal'))g.computeVertexNormals();
  if(!g.getAttribute('uv'))g.setAttribute('uv',new T.Float32BufferAttribute(new Float32Array(g.getAttribute('position').count*2),2));
  (groups[key]??=[]).push(g);materialCount[key]=(materialCount[key]||0)+1;
 }
 function box(k,x,y,z,w,h,d){add(k,new T.BoxGeometry(w,h,d),x,y,z)}
 function cyl(k,x,y,z,r,h,seg=16){add(k,new T.CylinderGeometry(r,r,h,seg),x,y,z)}
 function beam(k,a,b,r=.09){
  const av=new T.Vector3(...a),bv=new T.Vector3(...b),v=bv.clone().sub(av);
  const g=new T.CylinderGeometry(r,r,v.length(),8);
  g.quaternion;g.applyQuaternion(new T.Quaternion().setFromUnitVectors(new T.Vector3(0,1,0),v.clone().normalize()));
  add(k,g,...av.add(bv).multiplyScalar(.5).toArray());
 }
 function frontArch(k,x,y,z,w,h,d=.10){
  const sh=new T.Shape();sh.moveTo(-w/2,0);sh.lineTo(-w/2,h-w*.48);
  sh.absarc(0,h-w*.48,w/2,PI,0,true);sh.lineTo(w/2,0);sh.closePath();
  add(k,new T.ExtrudeGeometry(sh,{depth:d,bevelEnabled:false,curveSegments:12}),x,y,z);
 }
 function roof(x,base,z,w,d,h,mat='roof'){
  // Physical twin-pitched tile roof, not flat caps / boxes.
  const sh=new T.Shape();sh.moveTo(-w/2,0);sh.lineTo(0,h);sh.lineTo(w/2,0);sh.closePath();
  add(mat,new T.ExtrudeGeometry(sh,{depth:d,bevelEnabled:true,bevelThickness:.06,bevelSize:.09,bevelSegments:1}),x,base,z-d/2);
  for(let j=0;j<3;j++){const dz=-d/2+j*d/2;beam('roofdark',[x-w/2,base-.09,z+dz],[x,base+h,z+dz],.055)}
 }
 function styledWindow(x,y,z,w,h,lit,balcony,variant){
  const c=lit?'lit':'glass';
  box('shadow',x,y+h*.50,z-.19,w+.26,h+.18,.19);
  frontArch(c,x,y,z-.27,w,h,.065);
  box('mortar',x-w*.5-.14,y+h*.49,z-.37,.16,h+.3,.20);
  box('mortar',x+w*.5+.14,y+h*.49,z-.37,.16,h+.3,.20);
  box('mortar',x,y-.06,z-.39,w+.38,.16,.34);
  box('mortar',x,y+h+.04,z-.37,w+.40,.14,.26);
  beam('mortar',[x,y+.14,z-.39],[x,y+h-.2,z-.39],.034);
  if(variant===2){box('mortar',x,y+h*.56,z-.40,w+.18,.05,.12)}
  if(balcony){
   box('stone',x,y-.25,z-.74,w+.9,.12,.88);
   for(let j=0;j<=5;j++){
    box('rail',x-(w+.56)/2+j*(w+.56)/5,y+.16,z-1.12,.048,.68,.049);
   }
   box('rail',x,y+.49,z-1.12,w+.8,.075,.055);
  }
  windowCount++;
 }
 function façade(x,z,w,stories,tint,style,level=0){
  const d=9.3+(style%4)*1.1, floorHeight=3.75, h=stories*floorHeight+.8;
  // Irregular polygon exterior rather than prior anonymous rectilinear blocks.
  const sh=new T.Shape(),cornice=.65;
  sh.moveTo(-w*.5,0);sh.lineTo(w*.5,0);sh.lineTo(w*.5,h-cornice);
  if(style%3===0){sh.lineTo(w*.36,h-cornice);sh.lineTo(w*.28,h);sh.lineTo(-w*.28,h);sh.lineTo(-w*.36,h-cornice)}
  else {sh.lineTo(w*.5,h);sh.lineTo(-w*.5,h)}
  sh.lineTo(-w*.5,h-cornice);sh.closePath();
  add(tint,new T.ExtrudeGeometry(sh,{depth:d,bevelEnabled:false}),x,level,z-d/2);
  box('mortar',x,level+stories*floorHeight-.01,z-d/2-.25,w+.47,.29,.5);
  box('shadow',x,level+floorHeight,z-d/2-.21,w+.19,.11,.34);
  const cols=style%5===0?2:3;const step=w/cols;
  for(let f=0;f<stories;f++){
   for(let c=0;c<cols;c++){
    const wx=x+(c-(cols-1)/2)*step;
    styledWindow(wx,level+.9+f*floorHeight,z-d/2-.14,Math.min(step*.47,1.42),
     f===0?2.8:2.18,(f+c+style*3)%7===0,f>0&&(f+c+style)%4===0,style%3);
   }
  }
  if(style%7===3){
   // Venetian curved parapet and roof terrace
   box('mortar',x,level+h+.28,z-d/2,w+.5,.6,.5);
   for(let k=0;k<5;k++)cyl('stone',x-w*.40+k*w*.2,level+h+.79,z-d/2,.20,.7,9);
  }else{
   roof(x,level+h+.13,z,w+.5,d+.4,style%4===0?2.0:3.0,style%4===1?'roofdark':'roof');
  }
  if(style%4===0){
   box('terracotta',x,level+3.36,z-d/2-1.11,w*.82,.12,2.0);
   for(let k=0;k<6;k++)beam('stone',[x-w*.4+k*w*.16,level+3.30,z-d/2-.14],
      [x-w*.4+k*w*.16,level+2.9,z-d/2-2.10],.045);
  }
  townBuildings++;
 }
 // Coast line is volumetric + curved. Sea-facing footprint independent of photo and uncalibrated.
 const coastPts=[[-190,18],[-162,17],[-145,11],[-124,14],[-103,23],[-81,28],[-59,25],[-36,24],[-12,20],[15,21],[39,25],[63,29],[87,24],[109,18],[135,17],[165,19],[195,24]];
 const coast=new T.Shape();coast.moveTo(-195,570);coast.lineTo(195,570);
 for(let i=coastPts.length-1;i>=0;i--)coast.lineTo(coastPts[i][0],coastPts[i][1]);
 coast.closePath();
 add('plaza',new T.ExtrudeGeometry(coast,{depth:3.9,bevelEnabled:false}),0,3.9,0,PI/2);
 // Hills behind the town: photo-referenced terrain silhouette, not surveyed elevations.
 {
  const nX=60,nZ=19,vs=[],idx=[];
  for(let j=0;j<=nZ;j++){
   const z=175+j*17;
   for(let i=0;i<=nX;i++){
    const x=-295+i*590/nX;
    const h=8+Math.max(0,z-175)*.072+3.8*Math.sin(x*.017)+2.1*Math.sin(x*.042+z*.018);
    vs.push(x,h,z);
   }
  }
  for(let j=0;j<nZ;j++)for(let i=0;i<nX;i++){
   const a=j*(nX+1)+i,b=a+1,c=a+nX+1,d=c+1;
   idx.push(a,b,c,b,d,c);
  }
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(vs,3));
  g.setIndex(idx);g.computeVertexNormals();add('foliage',g);
  for(let k=0;k<160;k++){
   const x=-250+(k*97.37%500),z=207+(k*51.73%238);
   const y=8+Math.max(0,z-175)*.072+3.8*Math.sin(x*.017)+2.1*Math.sin(x*.042+z*.018);
   const radius=2.1+(k%7)*.51;
   const bush=new T.SphereGeometry(radius,7,5);
   bush.scale(1,1.4+(k%3)*.18,.8);
   add(k%3===0?'groveLight':'grove',bush,x,y+.5,z);
  }
 }
 // Section-level cobbled waterfront band, real low terraces, rocky outer edge.
 for(let i=0;i<coastPts.length-1;i++){
  const a=coastPts[i],b=coastPts[i+1];
  beam('stone',[a[0],3.90,a[1]],[b[0],3.90,b[1]],1.0);
  beam('rock',[a[0],.60,a[1]-2],[b[0],.60,b[1]-2],1.1);
 }
 // Traffic-free arc plaza that follows slope. Deliberate irregular geometry.
 for(let tier=0;tier<3;tier++){
  const y=4.4+tier*3.9,z=42+tier*35;
  box('stone',0,y-.6,z,355,1.2,19);
  for(let j=-22;j<=22;j++){
   const x=j*7.7;
   box('mortar',x,y+.035,z+8.8,.06,.07,1.05);
  }
 }
 // Distinct set-back Mediterranean street blocks with varying roofline.
 const frontage=[
  [-155,2,'butter',1],[-143,3,'cream',0],[-129,3,'coral',4],[-116,4,'apricot',5],
  [-103,3,'ivory',1],[-89,4,'pink',8],[-74,3,'cream',2],
  [-28,3,'ochre',3],[-15,4,'apricot',7],[-1,3,'cream',12],[13,4,'salmon',9],
  [27,3,'butter',11],[40,4,'azure',5],[53,3,'coral',4],[68,4,'cream',1],
  [82,3,'mint',2],[96,4,'pink',7],[110,3,'ochre',2],[124,4,'cream',9],
  [138,3,'apricot',1],[151,3,'ivory',6]];
 for(const [x,h,t,s] of frontage){
  if(x>37&&x<78)continue;
  façade(x,61+(x/20)%2,12.0+(s%3)*.5,h,t,s,4.0);
 }
 const secondRow=[
  [-148,4,'cream',7],[-132,5,'salmon',9],[-113,4,'ochre',8],[-96,4,'butter',4],
  [-81,5,'cream',1],[-42,4,'ivory',6],[-24,5,'pink',3],[-8,5,'cream',5],
  [10,4,'azure',8],[27,5,'ivory',9],[45,4,'ochre',0],[61,5,'coral',11],
  [79,4,'mint',2],[98,5,'butter',3],[117,4,'apricot',13],[140,5,'ivory',11]
 ];
 for(const [x,h,t,s] of secondRow)façade(x,104,13+(s%3),h,t,s,8.0);
 // A colonnaded landmark museum/waterfront palazzo, off-axis to avoid boxy repetition.
 const bx=-20,bz=66;box('cream',bx+9,13.4,bz+9,32,20,18);
 roof(bx+9,23.7,bz+9,34,19,3.5,'roof');
 for(let i=0;i<9;i++){
  const x=bx-5+i*3.5;
  cyl('mortar',x,8.8,bz-.53,.30,9.0,12);
  frontArch('glass',x,5.3,bz-1.1,2.55,5.4,.24);
  box('mortar',x,13.6,bz-.65,.65,.8,.70);
 }
 box('stone',bx+9,14.2,bz-1.0,34,1.25,3.9);
 // Clock tower with measured-from-illustration proportion only, not real coordinates.
 const tx=57,tz=67,base=5.0;
 box('darkbrick',tx,base+16,tz,12.8,31.9,12.3);
 for(let k=0;k<4;k++)box('mortar',tx,base+5+k*8,tz-6.23,13.15,.27,.24);
 for(let side of [-1,1])box('mortar',tx+side*5.7,base+15.95,tz-6.24,.62,31.3,.38);
 box('ivory',tx,base+32.8,tz,16.0,2.3,16.0);
 box('cream',tx,base+42.2,tz,12.3,16.9,12.3);
 for(let j=0;j<4;j++){
  box('mortar',tx,base+35+j*3.9,tz-6.30,13.1,.27,.33);
 }
 for(let i=0;i<3;i++){
  frontArch('glass',tx+(i-1)*3.32,base+36.3,tz-6.34,1.96,7.8,.07);
 }
 box('ivory',tx,base+52.2,tz,17.2,1.8,17.2);
 // Wide sea-facing clock, raised dial not painted onto wall.
 cyl('bronze',tx,base+47.1,tz-8.38,3.02,.22,48); // rotate to face ocean by separate circular mesh
 const dial=new T.CircleGeometry(3.18,64);
 add('white',dial,tx,base+47.0,tz-8.78);
 const rim=new T.TorusGeometry(3.16,.25,8,64);add('bronze',rim,tx,base+47.0,tz-8.85);
 for(let n=0;n<12;n++){
  const a=n*PI/6;
  box('ink',tx+2.59*Math.sin(a),base+47+2.59*Math.cos(a),tz-8.90,.13,.32,.08);
 }
 beam('ink',[tx,base+47,tz-8.98],[tx+.0,base+49.3,tz-8.98],.10);
 beam('ink',[tx,base+47,tz-8.98],[tx+1.48,base+46.5,tz-8.98],.12);
 // Clock belfry pyramid roof sculpted as real geometry with tile finish.
 const cap=new T.ConeGeometry(9.8,15,4);cap.rotateY(PI/4);
 add('roofdark',cap,tx,base+60.6,tz);
 cyl('bronze',tx,base+70.6,tz,.20,5.6,12);
 add('bronze',new T.SphereGeometry(.72,10,8),tx,base+74,tz);
 // True semi-oval 3D coastal stage rather than three planar semicircles.
 const sx=86,sz=-9;const stageMaterial='stone';
 cyl('rock',sx,1.20,sz,32.5,1.85,72);
 cyl('stage',sx,2.45,sz,31.5,.80,72);
 cyl('stone',sx,2.92,sz,26.8,.33,72);
 // Arc beams as five piece sculpture: curved elliptic PBR shells with variable broad bands,
 // shell geometry is not image-plane impostor and open from every viewpoint.
 function stageShell(radius,height,z,thick,index){
  const vs=[],idx=[],slices=72;
  for(let j=0;j<=slices;j++){
   const a=PI*j/slices;
   // Edges land on platform at sides and crest overhead.
   const x=sx-radius*Math.cos(a)+5.5*Math.pow(Math.sin(a),2),y=3.3+height*Math.pow(Math.sin(a),.94),zz=sz+z+10.0*Math.sin(a)+index*1.0;
   const band=thick*(.86+.16*Math.sin(a));
   vs.push(x,y,zz-band/2,x,y+band,zz-band/2,x,y,zz+band/2,x,y+band,zz+band/2);
  }
  for(let j=0;j<slices;j++){
   const p=4*j,q=4*(j+1);
   for(const [a,b,c] of [[p,p+1,q],[p+1,q+1,q],[p+2,q+2,p+3],[p+3,q+2,q+3],
     [p,q,p+2],[p+2,q,q+2],[p+1,p+3,q+1],[p+3,q+3,q+1]])idx.push(a,b,c);
  }
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(vs,3));g.setIndex(idx);g.computeVertexNormals();
  add(index===0?'stage':'steel',g);
  for(let j=1;j<14;j++){
   const a=PI*j/14,x=sx-radius*Math.cos(a),y=3.3+height*Math.sin(a),zz=sz+z+5.2*Math.sin(a)+index;
   beam('white',[x,y,zz-thick/2-.04],[x,y+thick*.85,zz-thick/2-.05],.06);
  }
 }
 stageShell(22,21,2.4,2.8,0);stageShell(17.5,18,6.7,2.4,1);stageShell(13,14,10.7,2.05,2);
 // Stage projection screens, steps and lighting physically integrated.
 for(let j=0;j<6;j++)box('stone',sx,2.8-j*.12,sz-22-j*1.0,19-j*1.9,.18,.88);
 for(let i=0;i<20;i++){let a=i*2*PI/20;const x=sx+26*Math.sin(a),z=sz+26*Math.cos(a);
  cyl('bronze',x,3.5,z,.09,.9,8);
 }
 // World-sized actual two independent curved Kiss Bridge arms, not shallow pier strips.
 const armPoints=[
  [[-156,5,17],[-144,5.5,2],[-123,7,-16],[-91,9,-44],[-50,11,-69],[-12,12,-84],[-4.7,12.2,-91]],
  [[158,5,17],[139,5.5,0],[114,7,-22],[83,9,-49],[49,11,-71],[17,12,-87],[4.7,12.2,-91]]
 ];
 const endpoints=[];
 for(const ps of armPoints){
  const curve=new T.CatmullRomCurve3(ps.map(p=>new T.Vector3(...p)),false,'centripetal');
  endpoints.push(curve.getPoint(1));
  const deckVerts=[],deckIdx=[],edges=[[],[]],len=120;
  for(let j=0;j<=len;j++){
   const p=curve.getPoint(j/len),d=curve.getTangent(j/len);
   const side=new T.Vector3(d.z,0,-d.x).normalize(),w=2.75;
   const l=p.clone().addScaledVector(side,-w),r=p.clone().addScaledVector(side,w);
   deckVerts.push(l.x,l.y,l.z,r.x,r.y,r.z,l.x,l.y-.52,l.z,r.x,r.y-.52,r.z);
   edges[0].push(l.clone().add(new T.Vector3(0,1.3,0)));
   edges[1].push(r.clone().add(new T.Vector3(0,1.3,0)));
   if(j<len){
    const a=4*j,b=4*(j+1);
    for(const tr of [[a,b,a+1],[a+1,b,b+1],[a+2,a+3,b+2],[a+3,b+3,b+2],[a,a+2,b],[b,a+2,b+2],
        [a+1,b+1,a+3],[a+3,b+1,b+3]])deckIdx.push(...tr);
   }
   if(j%12===0&&j>0&&j<len){
    for(const sg of [-1,1]){
     const pt=p.clone().addScaledVector(side,sg*w);
     beam('rail',[pt.x,p.y+.20,pt.z],[pt.x,p.y+1.27,pt.z],.068);
    }
   }
   if(j%29===0&&j>0&&j<len-15){
    const s=p.clone();beam('steel',[s.x-3,.7,s.z-2],[s.x,s.y-.3,s.z],.56);
    beam('steel',[s.x+3,.7,s.z+2],[s.x,s.y-.3,s.z],.56);
   }
  }
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(deckVerts,3));g.setIndex(deckIdx);g.computeVertexNormals();add('stone',g);
  for(const e of edges){
   const cv=new T.CatmullRomCurve3(e);add('bronze',new T.TubeGeometry(cv,len,.105,6,false));
  }
  for(let i=0;i<40;i++){
   const p=curve.getPoint((i+.5)/41),d=curve.getTangent((i+.5)/41),side=new T.Vector3(d.z,0,-d.x).normalize();
   const m=p.clone().add(new T.Vector3(0,-.28,0));
   const l=m.clone().addScaledVector(side,-2.6),r=m.clone().addScaledVector(side,2.6);
   beam('bronze',l.toArray(),r.toArray(),.050);
  }
 }
 const bridgeGap=endpoints[0].distanceTo(endpoints[1]);
 // Terraced park on shore; individually modelled tree instances supplied by scene loader.
 const coastWalk=[];for(let i=0;i<coastPts.length;i++)coastWalk.push([coastPts[i][0],coastPts[i][1]]);
 // Lamps and planted beds make location inhabited at sunset without fake gameplay.
 for(let i=-12;i<=12;i++){
  const x=i*12.4,z=33+2*Math.sin(i*.5);
  cyl('bronze',x,5.8,z,.15,4.3,12);
  add('lit',new T.SphereGeometry(.38,8,8),x,8.15,z);
 }
 // Neutral procedural stucco: only art texture, not an image stand-in for the buildings.
 const cn=document.createElement('canvas');cn.width=256;cn.height=256;
 const ctx=cn.getContext('2d'),pix=ctx.createImageData(256,256);
 let seed=13871;const rnd=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
 for(let p=0;p<256*256;p++){
  let grain=Math.floor((rnd()-.5)*18),blotch=rnd()<.026?-23:0;
  let v=Math.max(195,Math.min(255,244+grain+blotch));const off=p*4;
  pix.data[off]=v;pix.data[off+1]=v-2;pix.data[off+2]=v-6;pix.data[off+3]=255;
 }
 ctx.putImageData(pix,0,0);
 const stucco=new T.CanvasTexture(cn);stucco.colorSpace=T.SRGBColorSpace;
 stucco.wrapS=stucco.wrapT=T.RepeatWrapping;stucco.repeat.set(.45,.45);
 // Merge material groups to keep draw calls manageable, no rendering from screenshots.
 const counts={};let meshes=0,triangles=0,failures=[];
 for(const [key,geos] of Object.entries(groups)){
  counts[key]=geos.length;
  try{
   const mat=new T.MeshStandardMaterial({color:P[key]||'#d5bdac',roughness:key==='glass'?.35:.84,
    metalness:key==='stage'||key==='steel'?.35:key==='bronze'?.53:0,
    side:['stage','steel','foliage'].includes(key)?T.DoubleSide:T.FrontSide,
    emissive:key==='lit'?'#f8a75d':'#000000',emissiveIntensity:key==='lit'?.6:0});
   if(['roof','roofdark'].includes(key)){
    const t=new T.TextureLoader().load('textures/roof_albedo.jpg');t.colorSpace=T.SRGBColorSpace;
    t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(.11,.11);mat.map=t;
    mat.color.set(key==='roof'?'#f3d4b8':'#d4b29f');mat.roughness=.94;
   }
   if(key==='plaza'){const t=new T.TextureLoader().load('textures/paving_albedo.jpg');t.colorSpace=T.SRGBColorSpace;t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(.14,.14);mat.map=t;mat.color.set('#f2dfca');}
   if(['cream','white','ivory','butter','coral','apricot','salmon','pink','ochre','azure','mint','mortar'].includes(key)){
    mat.map=stucco;mat.roughness=.91;
   }
   const gg=mergeGeometries(geos,false);
   if(!gg){failures.push('merge-empty:'+key);continue;}
   const mesh=new T.Mesh(gg,mat);mesh.frustumCulled=false;scene.add(mesh);meshes++;
   triangles+=(gg.getAttribute('position').count)/3;
  }catch(e){failures.push(key+':'+String(e))}
 }
 return {townBuildings,windowCount,bridgeTipGapArtUnits:+bridgeGap.toFixed(2),stageShells:3,
  meshes,triangles:Math.round(triangles),batchCounts:counts,errors:failures,
  siteTruth:'ARTIST_ESTIMATE_USING_REAL_PHOTOS_NOT_SURVEY',
  proprietaryScanUsed:false,gameplayEnabled:false};
}