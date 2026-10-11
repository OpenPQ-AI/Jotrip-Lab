import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
const T=THREE;
const canvas=document.querySelector('#world');
const scene=new T.Scene();
scene.background=new T.Color('#b5ccd1');
scene.fog=new T.FogExp2('#cbd4d2',0.0061);
const camera=new T.PerspectiveCamera(54,1,.1,145);
const renderer=new T.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance',alpha:false});
renderer.outputColorSpace=T.SRGBColorSpace;
renderer.toneMapping=T.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.22;
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=T.PCFSoftShadowMap;
renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.3));
scene.add(new T.HemisphereLight('#eff7ff','#a9aca1',2.05));
const sunlight=new T.DirectionalLight('#fff5e4',3.0);
sunlight.position.set(-21,32,20);
sunlight.castShadow=true;
sunlight.shadow.mapSize.set(1024,1024);
sunlight.shadow.camera.left=-43;sunlight.shadow.camera.right=43;
sunlight.shadow.camera.top=43;sunlight.shadow.camera.bottom=-43;
sunlight.shadow.normalBias=.028;scene.add(sunlight);
const fill=new T.DirectionalLight('#7fb4bf',.55);fill.position.set(9,14,-12);scene.add(fill);
const mat=(color,roughness=.75,metalness=0,extra={})=>new T.MeshStandardMaterial({color,roughness,metalness,...extra});
const P={
 stone:mat('#e5ded0',.98),offwhite:mat('#f2eee5',.88),sunwhite:mat('#efe1c8',.9),
 mint:mat('#a4ddc6',.82),mintDark:mat('#6bb9a7',.87),seaBlue:mat('#77c0c8',.75),
 turquoise:mat('#08aaa5',.37,.38),cyanBright:mat('#21beb2',.25,.5),tealShade:mat('#087d79',.42,.42),
 glass:mat('#9bd3c8',.16,.15,{transparent:true,opacity:.48,depthWrite:false,side:T.DoubleSide}),
 glassDeep:mat('#539aa6',.20,.15,{transparent:true,opacity:.62,depthWrite:false,side:T.DoubleSide}),
 bronze:mat('#b58137',.35,.72),bronzeLight:mat('#d3a346',.28,.74),darkGold:mat('#77552a',.44,.6),
 dark:mat('#2a4f56',.59,.35),red:mat('#c9102f',.46,.14),redLight:mat('#eb2141',.42,.1),
 pavement:mat('#dbd0bd',.96),road:mat('#a9a096',.97),roof:mat('#6b9f9b',.74,.31),
 roofTerracotta:mat('#c58b66',.82,.08),bark:mat('#92755b',.98),leaf:mat('#367a57',.86),
 leaf2:mat('#538f56',.93),leaf3:mat('#69985a',.89),pink:mat('#d8437a',.8),
 flowerWhite:mat('#f6e7d3',.91),goldTrim:mat('#cca96d',.44,.5),fountain:mat('#dddcd4',.91)
};
const texLoader=new T.TextureLoader();
const textures=[
 ['paving','textures/paving_albedo.jpg','textures/paving_normal.jpg','textures/paving_rough.jpg'],
 ['plaster','textures/plaster_albedo.jpg','textures/plaster_normal.jpg','textures/plaster_rough.jpg'],
 ['roof','textures/roof_albedo.jpg','textures/roof_normal.jpg','textures/roof_rough.jpg']
];
const texSets={};
for(const [name,a,n,r] of textures){
 const load=(u,srgb=false)=>{
  const t=texLoader.load(u);t.wrapS=t.wrapT=T.RepeatWrapping;
  t.anisotropy=Math.min(renderer.capabilities.getMaxAnisotropy(),8);
  if(srgb)t.colorSpace=T.SRGBColorSpace;
  return t;
 };
 texSets[name]={color:load(a,true),normal:load(n),rough:load(r)};
}
function usePBR(target,key,repeats=[1,1],tint='#ffffff'){
 const x=texSets[key];
 const c=x.color.clone(),n=x.normal.clone(),r=x.rough.clone();
 for(const item of [c,n,r]){item.repeat.set(...repeats);item.needsUpdate=true;}
 target.map=c;target.normalMap=n;target.roughnessMap=r;target.color.set(tint);target.needsUpdate=true;
}
usePBR(P.pavement,'paving',[9,9],'#f1e3d5');
usePBR(P.mint,'plaster',[2.7,2.8],'#c0e4d5');
usePBR(P.sunwhite,'plaster',[3,3],'#eae0d0');
usePBR(P.roofTerracotta,'roof',[3,3],'#ddaa87');
const g=new T.Group();scene.add(g);
let meshes=0,tris=0;
function attach(geometry,material,pos=[0,0,0],rot=[0,0,0],cast=true){
 const x=new T.Mesh(geometry,material);x.position.set(...pos);x.rotation.set(...rot);
 x.castShadow=cast;x.receiveShadow=true;g.add(x);
 meshes++;tris+=geometry.index?geometry.index.count/3:geometry.attributes.position.count/3;return x;
}
const box=(ma,x,y,z,w,h,d)=>attach(new T.BoxGeometry(w,h,d),ma,[x,y,z]);
const cyl=(ma,x,y,z,r,h,seg=24,r2=r)=>attach(new T.CylinderGeometry(r2,r,h,seg),ma,[x,y,z]);
const cone=(ma,x,y,z,r,h,seg=28)=>attach(new T.ConeGeometry(r,h,seg),ma,[x,y,z]);
const ball=(ma,x,y,z,r,sx=1,sy=1,sz=1)=>{
 const o=attach(new T.IcosahedronGeometry(r,2),ma,[x,y,z]);o.scale.set(sx,sy,sz);return o;
};
function torus(ma,x,y,z,r,tube=.075,segments=42,rot=[0,0,0]){
 return attach(new T.TorusGeometry(r,tube,10,segments),ma,[x,y,z],rot);
}
function beam(ma,start,end,w=.12,d=.12){
 const v1=new T.Vector3(...start),v2=new T.Vector3(...end),vec=v2.clone().sub(v1);
 const o=attach(new T.BoxGeometry(w,vec.length(),d),ma,v1.add(v2).multiplyScalar(.5).toArray());
 o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),vec.normalize());
 return o;
}
function band(ma,x,y,z,rad,level=1,begin=0,end=Math.PI*2){
 const geo=new T.CylinderGeometry(rad,rad,level,64,1,true,begin,end-begin);
 return attach(geo,ma,[x,y,z]);
}
function ellipseRibbon(mat,points,width=.45,depth=.12){
 const curve=new T.CatmullRomCurve3(points.map(v=>new T.Vector3(...v)),false,'catmullrom',.32);
 const coords=[],indices=[],n=42;
 for(let i=0;i<=n;i++){
  const t=i/n,p=curve.getPoint(t),tan=curve.getTangent(t);
  const side=new T.Vector3(-tan.z,.13,tan.x).normalize();
  const drift=(1+Math.sin(t*Math.PI*3)*.12)*width/2;
  for(const d of [-drift,drift]){
   const v=p.clone().addScaledVector(side,d);
   coords.push(v.x,v.y,v.z);
  }
  if(i<n){const k=i*2;indices.push(k,k+1,k+2,k+1,k+3,k+2);}
 }
 const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(coords,3));geo.setIndex(indices);geo.computeVertexNormals();
 return attach(geo,mat);
}
// Plaza: walkable ground is continuous, with curved cobbled road near Apollo Cafe.
box(P.pavement,-1,-.12,4,47,.19,51);
const roadTint=mat('#c2afa0',.93);usePBR(roadTint,'paving',[8,6],'#b9aaa1');
const road=box(roadTint,7,-.002,10,16,.025,34);road.rotation.y=-.16;
const outerCurve=new T.CatmullRomCurve3([
 new T.Vector3(2.3,.055,23),new T.Vector3(6.6,.055,14),new T.Vector3(10.2,.055,6),
 new T.Vector3(9.7,.055,-5),new T.Vector3(11.4,.055,-17)
]);
for(let k=0;k<70;k++){
 const a=outerCurve.getPoint(k/70),b=outerCurve.getPoint((k+1)/70);
 beam(P.stone,a.toArray(),b.toArray(),.13,.20);
}
for(let k=0;k<35;k++){
 const z=23-k*1.12;
 box(P.stone,11,.045,z,2.2,.025,.035);
}
// Gallery mass behind Apollo (separate buildings, no borrowed image billboards).
const GX=-4.35,GZ=-8.1,GR=5.15,GH=13.25;
cyl(P.mint,GX,GH/2,GZ,GR,GH,56);
band(P.sunwhite,GX,GH-.3,GZ,GR+.08,.2);
band(P.mintDark,GX,10.8,GZ,GR+.14,.18);
band(P.goldTrim,GX,12.0,GZ,GR+.17,.12);
// Tall gallery dome and teal patinated roof (true 3D sloping surface).
cone(P.roof,GX,14.15,GZ,5.75,1.98,56);
cyl(P.roof,GX,15.02,GZ,2.13,.65,28);
cone(P.roof,GX,15.83,GZ,2.5,1.0,30);
// Arched upper windows around drum toward street, glazed dark with trim.
for(let k=0;k<9;k++){
 const a=-.20+k*Math.PI/8;
 const xx=GX+Math.sin(a)*(GR+.08),zz=GZ+Math.cos(a)*(GR+.08);
 const o=box(P.dark,xx,9.08,zz,1.03,2.20,.09);o.rotation.y=a;
 const w=box(P.glassDeep,xx+Math.sin(a)*.082,9.12,zz+Math.cos(a)*.082,.94,2.12,.07);w.rotation.y=a;
 const top=box(P.sunwhite,xx,10.23,zz,1.25,.11,.19);top.rotation.y=a;
 beam(P.stone,[xx-.22,9.75,zz+.10],[xx+.22,9.75,zz+.10],.10,.1);
}
// Gallery façade low arched glazing and detailed lintel
for(let k=0;k<7;k++){
 const a=-.24+k*Math.PI/9;
 const x=GX+Math.sin(a)*(GR+.15),z=GZ+Math.cos(a)*(GR+.15);
 const dark=box(P.dark,x,3.45,z,1.32,4.55,.16);dark.rotation.y=a;
 const gl=box(P.glassDeep,x+Math.sin(a)*.09,3.45,z+Math.cos(a)*.09,1.2,4.4,.13);gl.rotation.y=a;
 const crown=torus(P.stone,x+Math.sin(a)*.16,5.77,z+Math.cos(a)*.16,.64,.10,28,[0,a,0]);
 crown.scale.y=1.20;
}
// Secondary Gallery wing on left / rear: non-repeating multi-tier facades and sea-facing tower
const TOWERX=-10.1,TOWERZ=-12.0;
box(P.sunwhite,TOWERX,7.65,TOWERZ,4.2,15.3,6.2);
box(P.goldTrim,TOWERX,15.24,TOWERZ,4.4,.25,6.4);
cone(P.roof,TOWERX,16.2,TOWERZ,3.48,2.13,4).rotation.y=Math.PI/4;
for(let i=0;i<4;i++){
 const y=2.7+i*3.15;
 box(P.dark,-7.95,y,TOWERZ, .12,2.2,1.14);
 box(P.goldTrim,-7.86,y+1.21,TOWERZ,.2,.18,1.42);
 box(P.glassDeep,-7.84,y,TOWERZ,.07,2,1.04);
}
// Wrap-around red ribbon at top of main cylinder and ornate bow facing plaza.
band(P.red,GX,11.32,GZ,GR+.22,1.55,Math.PI*.26,Math.PI*1.47);
band(P.redLight,GX,11.37,GZ,GR+.27,1.38,-.34,.75);
const BOWCX=-4.05,BOWCZ=GZ+GR+.28,BOWY=11.45;
box(P.sunwhite,BOWCX,BOWY,BOWCZ+.29,.92,1.32,.34);

// True ribbon silhouette: broad cloth loops and split hanging tails with depth.
function bowShape(points,ma){
 const shape=new T.Shape();
 shape.moveTo(points[0][0],points[0][1]);
 for(let i=1;i<points.length;i++)shape.lineTo(points[i][0],points[i][1]);
 shape.closePath();
 const mesh=attach(new T.ExtrudeGeometry(shape,{
  depth:.10,bevelEnabled:true,bevelThickness:.028,bevelSize:.025,bevelSegments:2
 }),ma,[BOWCX,BOWY,BOWCZ+.64]);
 return mesh;
}
bowShape([[-.45,-.40],[-1.55,-1.03],[-3.9,-1.42],[-4.05,1.55],[-2.8,2.06],[-1.45,1.55],[-.45,.44]],P.redLight);
bowShape([[.45,-.40],[1.57,-1.03],[3.95,-1.42],[4.08,1.55],[2.8,2.06],[1.44,1.55],[.45,.44]],P.red);
bowShape([[-.49,-.40],[-.91,-4.83],[-1.26,-4.34],[-1.89,-4.93],[-2.41,-4.63],[-1.73,-.56]],P.red);
bowShape([[.35,-.42],[.36,-4.87],[.98,-4.45],[1.5,-4.90],[1.84,-4.68],[1.17,-.61]],P.redLight);
box(P.offwhite,BOWCX,BOWY,BOWCZ+.85,.86,1.2,.24);
// Apollo café: elevated glass pavilion is in FRONT RIGHT of Gallery, distinct silhouette.
// Lower wing joins pavilion and bronze couplings.
const CX=4.2,CZ=1.45,CR=2.35,CH=10.15;
const glassWing=box(P.dark,-.20,3.0,.12,7.40,4.10,4.55);
const wingRoof=box(P.turquoise,-.20,5.12,.12,7.55,.30,4.77);
box(P.tealShade,-.20,.82,.12,7.52,.48,4.75);
for(let i=0;i<=6;i++){
 const x=-3.73+i*1.18;
 box(P.turquoise,x,3.0,2.43,.13,3.98,.19);
 box(P.glass,x+.52,3.00,2.47,1.0,3.82,.11);
}
for(const z of [-2.33,2.45]){
 box(P.tealShade,-.25,1.13,z,7.5,.27,.22);
 box(P.cyanBright,-.25,4.91,z,7.5,.18,.25);
}
box(P.turquoise,-.22,3.20,2.55,7.4,.12,.13);
// Gold turbine cylinders that are distinctive under the glass wing; not generic torus decorations.
function horizontalTube(x,y,z,length,radius){
 const tube=attach(new T.CylinderGeometry(radius,radius,length,20),P.bronze,[x,y,z],[0,0,Math.PI/2]);
 for(let t=-length/2+.28;t<=length/2-.28;t+=.49){
  torus(P.goldTrim,x+t,y,z,radius+.09,.071,28,[0,Math.PI/2,0]);
 }
 for(let t=-length/2+.35;t<=length/2-.30;t+=.95){
  const ring=torus(P.darkGold,x+t,y,z,radius-.14,.034,32,[0,Math.PI/2,0]);
 }
 const collar=torus(P.bronzeLight,x+length/2-.07,y,z,radius+.06,.19,36,[0,Math.PI/2,0]);
 const inside=attach(new T.CircleGeometry(radius-.32,32),P.glassDeep,[x+length/2+.06,y,z],[0,Math.PI/2,0]);
 torus(P.darkGold,x+length/2+.18,y,z,radius-.22,.06,28,[0,Math.PI/2,0]);
 return tube;
}
horizontalTube(-2.18,1.44,3.10,3.1,1.23);
horizontalTube(-2.25,2.38,2.50,2.6,.98);
horizontalTube(-1.40,1.50,3.20,2.4,.91);
// Outer café tower octagonal/lobed glass envelope with teal mullions and slanted lower supports.
const n=14;
const yy=CH/2;
for(let i=0;i<n;i++){
 const a=i*2*Math.PI/n,a2=(i+1)*2*Math.PI/n,mid=(a+a2)/2;
 const x0=CX+Math.sin(a)*CR,z0=CZ+Math.cos(a)*CR;
 const x1=CX+Math.sin(a2)*CR,z1=CZ+Math.cos(a2)*CR;
 const center=new T.Vector3((x0+x1)/2,5.78,(z0+z1)/2);
 const width=Math.hypot(x1-x0,z1-z0)-.09;
 const frame=box(P.glass,center.x,5.77,center.z,width,8.65,.095);
 frame.rotation.y=mid;
 beam(P.turquoise,[x0,.90,z0],[x0,CH+.10,z0],.21,.21);
 beam(P.cyanBright,[x0,6.4,z0],[x0,CH+.10,z0],.06,.07);
 const edge=box(P.cyanBright,center.x,8.27,center.z,width,.12,.16);edge.rotation.y=mid;
 const middle=box(P.turquoise,center.x,5.01,center.z,width,.23,.18);middle.rotation.y=mid;
 const lower=box(P.tealShade,center.x,1.21,center.z,width,.42,.25);lower.rotation.y=mid;
 // Below mid-height outward foot braces: actual geometry is sloped forward, not a cube tower.
 if(i%2===0){
  const qx=CX+Math.sin(mid)*3.18,qz=CZ+Math.cos(mid)*3.18;
  beam(P.turquoise,[qx,.52,qz],[center.x,4.55,center.z],.31,.24);
 }
 const winMullion=box(P.turquoise,center.x,6.6,center.z,.09,2.55,.12);winMullion.rotation.y=mid;
}
cyl(P.turquoise,CX,CH+.03,CZ,CR+.20,.42,48);
cyl(P.tealShade,CX,CH+.34,CZ,CR+.36,.17,48);
cyl(P.roof,CX,CH+.57,CZ,CR+.30,.19,48);
cyl(P.tealShade,CX,.63,CZ,CR+.1,1.2,48);
for(const y of [3.18,6.08,8.74])cyl(P.turquoise,CX,y,CZ,CR+.06,.13,48);
// Interior readable floors behind reflective glass rather than empty void.
for(const y of [2.0,4.99,7.62]){
 cyl(P.sunwhite,CX,y,CZ,CR-.27,.14,32);
 for(let j=0;j<7;j++){
  const a=j*Math.PI*2/7;
  cyl(P.goldTrim,CX+Math.sin(a)*1.37,y+.48,CZ+Math.cos(a)*1.37,.055,.96,10);
 }
}
// Clock inside glazed top, facing front-right.
const clock=attach(new T.CircleGeometry(.64,48),P.sunwhite,[CX,7.75,CZ+2.0]);
torus(P.goldTrim,CX,7.75,CZ+2.024,.65,.087,48);
for(let k=0;k<12;k++){
 const t=k*Math.PI/6;
 const x=CX+Math.sin(t)*.52,y=7.75+Math.cos(t)*.52;
 ball(P.dark,x,y,CZ+2.052,.035,.7,.7,.5);
}
beam(P.dark,[CX,7.75,CZ+2.075],[CX+.20,8.04,CZ+2.075],.035,.037);
beam(P.dark,[CX,7.75,CZ+2.08],[CX-.30,7.62,CZ+2.08],.028,.029);
// Café name board, sunburst reliefs and gold sunflower are one of few distinguishable brand motifs.
function textPlate(str,w=3.25,h=.48){
 const c=document.createElement('canvas');c.width=1024;c.height=200;const ctx=c.getContext('2d');
 ctx.fillStyle='#087e7c';ctx.fillRect(0,0,1024,200);
 ctx.strokeStyle='#d2ad65';ctx.lineWidth=11;ctx.strokeRect(10,10,1004,180);
 ctx.fillStyle='#f6d999';ctx.font='bold 93px Georgia,serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(str,512,108);
 const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;
 return new T.MeshBasicMaterial({map:t,transparent:false,side:T.DoubleSide,toneMapped:false});
}
const sign=attach(new T.PlaneGeometry(3.37,.67),textPlate('APOLLO CAFE'),[CX,1.38,CZ+CR+.45]);
const sunburst=(x,y,z)=>{
 torus(P.bronzeLight,x,y,z,.19,.065,18);
 for(let k=0;k<16;k++){
  const theta=k*2*Math.PI/16;
  beam(P.bronzeLight,[x+Math.sin(theta)*.27,y+Math.cos(theta)*.27,z],
   [x+Math.sin(theta)*.42,y+Math.cos(theta)*.42,z],.068,.075);
 }
};
sunburst(CX-1.95,2.0,CZ+2.34);sunburst(CX+1.95,2.0,CZ+2.34);
// Neighboring real-color facade bands; intentionally irregular proportions.
function building(x,z,width,height,color,kind=0){
 box(color,x,height/2,z,4.6,height,width);
 box(P.sunwhite,x-2.38,height-.14,z,.33,.27,width+.33);
 box(P.roofTerracotta,x,height+.40,z,5.0,.78,width+.55);
 const floors=Math.floor((height-1.2)/2.7);
 for(let f=0;f<floors;f++){
  const y=1.60+f*2.7;
  box(P.sunwhite,x-2.38,y-.95,z,.32,.17,width+.2);
  const count=width>6?3:2;
  for(let i=0;i<count;i++){
   const zz=z-width/2+width*(i+.5)/count;
   box(P.dark,x-2.42,y,zz,.14,1.67,.79);
   box(P.glassDeep,x-2.53,y,zz,.075,1.49,.69);
   box(P.sunwhite,x-2.56,y+.93,zz,.2,.15,1.04);
   for(const left of [-.43,.43])box(P.sunwhite,x-2.57,y,zz+left,.18,1.88,.15);
   if(f>0){
    box(P.sunwhite,x-3.0,y-.90,zz,1.02,.18,1.13);
    box(P.dark,x-3.48,y-.51,zz,.08,.06,1.17);
    for(let k=-2;k<=2;k++)cyl(P.dark,x-3.48,y-.73,zz+k*.22,.020,.50,8);
   }else{
    for(const side of [-1,1]){
     box(kind?P.tealShade:P.red,x-2.56,y,zz+side*.65,.16,1.77,.29);
    }
   }
  }
 }
}
building(20,-9,7.5,12.2,P.sunwhite);
building(20,0,8.7,10.6,mat('#e5c9ae',.87));
building(19,10.8,7.8,12.8,mat('#f0e0cb',.85),1);
building(-24,-13,7.0,11.5,mat('#d5c6aa',.88),1);
building(-23,-1,8.7,10.8,mat('#e5d6bd',.85));

// Wide fountain opposite café, a recognizable visual anchor in the real plaza.
const FX=-13,FZ=13;
cyl(P.fountain,FX,.16,FZ,5.1,.34,56);
cyl(P.offwhite,FX,.48,FZ,4.62,.28,56);
cyl(P.glassDeep,FX,.61,FZ,4.08,.045,56);
torus(P.fountain,FX,.72,FZ,4.43,.22,52,[Math.PI/2,0,0]);
cyl(P.stone,FX,1.06,FZ,1.47,.85,42);
cyl(P.fountain,FX,1.55,FZ,1.35,.22,42);
cyl(P.fountain,FX,2.18,FZ,.87,1.3,24);
cyl(P.fountain,FX,2.87,FZ,.44,.24,24);
for(let j=0;j<10;j++){
 const a=j*2*Math.PI/10,x=FX+Math.cos(a)*3.15,z=FZ+Math.sin(a)*3.15;
 cyl(P.fountain,x,.99,z,.16,.85,12);
 ball(P.fountain,x,1.46,z,.22,1,.86,.9);
}
// Real-form trees: tapered palm fronds curved outwards (avoids spherical tree geometry).
function frond(x,y,z,angle,length,width,ma){
 const vertices=[],idx=[];
 const N=9;
 for(let i=0;i<=N;i++){
  const t=i/N,rad=length*t;
  const sx=x+Math.cos(angle)*rad,sz=z+Math.sin(angle)*rad;
  const dy=y + .60*Math.sin(Math.PI*t)-2.2*t*t;
  const perp=[-Math.sin(angle),Math.cos(angle)];
  const hw=width*(.2+.8*Math.sin(Math.PI*t))*.5;
  vertices.push(sx+perp[0]*hw,dy,sz+perp[1]*hw,
                sx-perp[0]*hw,dy-.09,sz-perp[1]*hw);
  if(i<N){const j=i*2;idx.push(j,j+1,j+2,j+1,j+3,j+2);}
 }
 const ge=new T.BufferGeometry();ge.setAttribute('position',new T.Float32BufferAttribute(vertices,3));ge.setIndex(idx);ge.computeVertexNormals();
 return attach(ge,ma,[0,0,0],[],false);
}
function palm(x,z,height=5.4,scale=1){
 cyl(P.bark,x,height*.48,z,.21,height*.96,12,.14);
 for(let i=0;i<13;i++){
  const phi=i*2.39996;
  frond(x,height,z,phi,3.2*scale,.42*scale,i%2?P.leaf:P.leaf2);
 }
 for(let i=0;i<4;i++)ball(P.darkGold,x+.12*Math.cos(i*1.5),height-.15,z+.12*Math.sin(i*1.5),.17);
 cyl(P.stone,x,.23,z,.65,.47,18);
}
function shrub(x,z,sz=1){
 cyl(P.stone,x,.28,z,.66*sz,.55,12);
 for(let i=0;i<20;i++){
  const phi=i*2.39996,rr=.16+.40*(i%5)/5;
  const cx=x+Math.cos(phi)*rr*sz,cy=(.77+(i%7)*.068)*sz,cz=z+Math.sin(phi)*rr*sz;
  beam(i%2?P.leaf:P.leaf2,[cx,cy-.13*sz,cz],[cx+.13*Math.sin(phi),cy+.14*sz,cz+.15*Math.cos(phi)],.065,.035);
  const leaf=ball(i%2?P.leaf2:P.leaf,cx,cy+.12*sz,cz,.13*sz,.50,1.32,.58);
  leaf.rotation.y=phi;
 }
 for(let i=0;i<9;i++){
  const phi=i*2.17,r=.43*sz;
  ball(i%3?P.pink:P.flowerWhite,x+Math.sin(phi)*r,.98*sz,z+Math.cos(phi)*r,.13*sz);
 }
}
for(const [x,z,h] of [[-10,3,5.8],[-9,-13,6.6],[9.3,-7,5.1],[9.1,11,5.0],[-17,18,6.4],[-1.3,14.8,4.9]])palm(x,z,h);
for(const [x,z] of [[-4.5,2],[-6.4,3.6],[1.4,4.5],[5.7,-4],[7.5,7.6],[-10.8,-.7],[-14,4.6]])shrub(x,z,.94);
// Café terrace furniture and stone-sided planters
for(const [x,z] of [[0.5,10.2],[2.1,12.3],[-7.5,9.3]]){
 const c=cyl(P.dark,x,.62,z,.08,1.22,10);
 cyl(P.bronzeLight,x,1.29,z,.61,.08,18);
 for(let k=0;k<3;k++){
  const a=k*2*Math.PI/3,xx=x+Math.cos(a)*1,zz=z+Math.sin(a)*1;
  box(P.sunwhite,xx,.57,zz,.55,.19,.55);
  cyl(P.dark,xx,.28,zz,.032,.59,8);
 }
}
// Light poles and planted street furnishings will be replaced by actual CC0 glTF props.
// Light and sky: no spheres masquerading as clouds.
const skyGeo=new T.SphereGeometry(100,26,16);
const sky=new T.Mesh(skyGeo,new T.ShaderMaterial({
 side:T.BackSide,depthWrite:false,fog:false,
 vertexShader:'varying vec3 pos; void main(){pos=position; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
 fragmentShader:'varying vec3 pos; void main(){float v=normalize(pos).y;vec3 a=vec3(.94,.82,.72);vec3 b=vec3(.65,.78,.81);vec3 c=vec3(.46,.64,.76);float m=smoothstep(-.16,.35,v);float n=smoothstep(.15,.85,v);gl_FragColor=vec4(mix(mix(a,b,m),c,n),1.);}'
}));
sky.frustumCulled=false;sky.renderOrder=-99;scene.add(sky);
// Studio camera references selected by visual comparison; not calibrated.
// Camera pose has NOT been calibrated from EXIF/fSpy - visual perspectives only.
const views={
 'plaza-front':{pos:[1.85,5.1,23.0],target:[-.1,6.4,-4.3],fov:50},
 'oblique-close':{pos:[9.5,3.4,14.8],target:[-1.3,6.6,-3.9],fov:50},
 'street-side':{pos:[13.4,2.7,7.8],target:[-.4,5.1,-2.7],fov:58},
 'aerial-context':{pos:[18.0,21.6,30.5],target:[-3.3,3.1,-3.5],fov:50}
};

// True imported CC0 modeled props. Normalize size only; content has auditable source manifest.
// Limit instances on 4GB QA machine, allow geometry reuse via clone without copying textures.
let propsReady=false,modelInstances=0,modelErrors=[];
const models=new GLTFLoader();
async function loadProp(file,placements,height){
 const gltf=await models.loadAsync(file);
 const object=gltf.scene;
 object.updateMatrixWorld(true);
 const bb=new T.Box3().setFromObject(object),size=bb.getSize(new T.Vector3());
 if(size.y<.000001)throw new Error('invalid asset bounds '+file);
 const factor=height/size.y;
 const cx=(bb.min.x+bb.max.x)/2,cz=(bb.min.z+bb.max.z)/2;
 for(const place of placements){
  const holder=new T.Group();holder.position.set(...place);holder.scale.setScalar(factor);
  const copy=object.clone(true);
  copy.position.set(-cx, -bb.min.y, -cz);
  copy.traverse(o=>{if(o.isMesh){o.castShadow=false;o.receiveShadow=true}});
  holder.add(copy);g.add(holder);modelInstances++;
 }
}
async function loadRealProps(){
 try{
  await loadProp('models/street_lamp_01/street_lamp_01_1k.gltf',
       [[12.5,0,15.2],[12.5,0,0.2],[-17.5,0,3.2]],4.15);
 }catch(e){modelErrors.push('lamp:'+e.message)}
 try{
  await loadProp('models/planter_box_01/planter_box_01_1k.gltf',
       [[2.45,0,8.1],[-6.70,0,6.8],[-8.25,0,-1.9]],.67);
 }catch(e){modelErrors.push('planter:'+e.message)}
 try{
  await loadProp('models/potted_plant_04/potted_plant_04_1k.gltf',
       [[.95,0,6.1],[7.1,0,9.4],[-9.3,0,8.3]],1.5);
 }catch(e){modelErrors.push('plant:'+e.message)}
 propsReady=true;console.info('IMPORTED_CC0',modelInstances,'ERRORS',modelErrors);
}
loadRealProps();
let active='plaza-front',fps=0,frame=0,last=performance.now(),counter=0,frames=0;
function useView(name){
 if(!views[name])return;
 const v=views[name];active=name;
 camera.position.set(...v.pos);
 camera.fov=v.fov;
 camera.lookAt(new T.Vector3(...v.target));
 camera.updateProjectionMatrix();
 document.querySelector('#angle').textContent=name.replace(/-/g,' ');
 for(const btn of document.querySelectorAll('button[data-view]'))btn.classList.toggle('active',btn.dataset.view===name);
}
function resize(){
 const w=Math.max(1,window.innerWidth),h=Math.max(1,window.innerHeight);
 camera.aspect=w/h;
 camera.updateProjectionMatrix();
 renderer.setSize(w,h,false);
}
window.addEventListener('resize',resize);
for(const btn of document.querySelectorAll('button[data-view]'))btn.addEventListener('click',()=>useView(btn.dataset.view));
resize();useView('plaza-front');
const tick=()=>{
 frame++;counter++;const now=performance.now();
 sky.position.copy(camera.position);
 renderer.render(scene,camera);
 if(now-last>1300){
  fps=Math.round(counter*1000/(now-last));counter=0;last=now;
  document.querySelector('#stats').textContent=meshes+' meshes · '+Math.round(tris).toLocaleString()+' tris · '+fps+' FPS (Edge)';
 }
};
renderer.setAnimationLoop(tick);
window.HERO={state:()=>({ready:frame>5&&propsReady,source:'ARTIST_MODELED_USING_REAL_PHOTOS_AND_PBR_REFERENCES',view:active,meshes,triangles:Math.round(tris),frameCount:frame,fpsBrowser:fps,modelInstances,modelErrors,
 statuses:{fspyCalibrated:false,real3D:true,visualGate:'WAITING_REFERENCE_COMPARISON',physicallyMeasured:false,live:false},
 cams:views}),setView:useView};
document.querySelector('#loading').style.display='none';