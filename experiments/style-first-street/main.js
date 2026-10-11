import * as T from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';

// LivingPQ: real 3D art-directed micro-street. Fictionalized Sunset Town inspired environment.
// Not a survey, photogrammetry, OSM parcel model, or source-image projection.
const el=id=>document.getElementById(id);
const scene=new T.Scene();
scene.background=new T.Color('#97bfd0');
scene.fog=new T.FogExp2('#bed2cb',.0065);
const renderer=new T.WebGLRenderer({canvas:el('world'),antialias:false,powerPreference:'high-performance',alpha:false});
renderer.outputColorSpace=T.SRGBColorSpace;
renderer.toneMapping=T.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.42;
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=T.PCFSoftShadowMap;
renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.45));
const camera=new T.PerspectiveCamera(72,1,.1,135);
camera.rotation.order='YXZ';
scene.add(new T.HemisphereLight('#f2f7ff','#bd987b',2.05));
const sun=new T.DirectionalLight('#fff1d3',3.1);sun.position.set(-19,27,-22);
sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);
sun.shadow.camera.left=-36;sun.shadow.camera.right=36;sun.shadow.camera.top=37;sun.shadow.camera.bottom=-37;
sun.shadow.normalBias=.025;scene.add(sun);
const fill=new T.DirectionalLight('#aad3d8',.45);fill.position.set(20,14,7);scene.add(fill);

// Deliberately small physically walkable 44m stretch. Matched landmarks only in design language.
const mats=new Map(),batch=new Map();
function material(key,color,roughness=.88,metalness=0,extra={}){
 if(mats.has(key))return mats.get(key);
 const m=new T.MeshStandardMaterial({color,roughness,metalness,...extra});
 mats.set(key,m);return m;
}
const m={
 asphalt:material('asphalt','#655f59'),curb:material('curb','#e8c4a0'),paver:material('paver','#dcc0a2'),
 stripe:material('stripe','#e5d2b6'),cream:material('cream','#f4dfbb'),
 sand:material('sand','#ecd2ab'),blue:material('blue','#95c6c5'),
 teal:material('teal','#569f9b'),peach:material('peach','#e7b6a2'),
 rose:material('rose','#d99593'),yellow:material('yellow','#f0d6a0'),
 mint:material('mint','#c4d9b2'),lavender:material('lavender','#c9b5bb'),
 white:material('white','#f1e8d8'),trim:material('trim','#f7e0b6'),
 sandstone:material('sandstone','#c9a788'),dark:material('dark','#293e49'),
 glass:material('glass','#3e6878',.22,.32),glow:material('glow','#ffdfab',.29,.18,{emissive:'#72583d',emissiveIntensity:.4}),
 gold:material('gold','#b58d53',.38,.52),roof:material('roof','#b7664d',.92),
 cobble:material('cobble','#b69e86'),leaves:material('leaves','#527b5e'),
 lightleaf:material('lightleaf','#87a570'),bark:material('bark','#8b6550'),
 water:material('water','#407e94',.2,.3),red:material('red','#c95e58'),
 shutter:material('shutter','#518a84'),iron:material('iron','#3d514e',.42,.65)
};
const batchGeo=(geo,ma,pos=[0,0,0],rot=[0,0,0],scale=[1,1,1])=>{
 const cloned=geo.index?geo.toNonIndexed():geo.clone();
 const e=new T.Euler(...rot),q=new T.Quaternion().setFromEuler(e),matrix=new T.Matrix4().compose(new T.Vector3(...pos),q,new T.Vector3(...scale));
 cloned.applyMatrix4(matrix);
 if(!batch.has(ma))batch.set(ma,[]);
 batch.get(ma).push(cloned);
 geo.dispose();
};
function box(ma,x,y,z,w,h,d,rot=0){batchGeo(new T.BoxGeometry(w,h,d),ma,[x,y,z],[0,rot,0])}
function cyl(ma,x,y,z,r,h,segments=12){batchGeo(new T.CylinderGeometry(r,r,h,segments),ma,[x,y,z])}
function cone(ma,x,y,z,r,h,segments=12){batchGeo(new T.ConeGeometry(r,h,segments),ma,[x,y,z])}
function ball(ma,x,y,z,r,sx=1,sy=1,sz=1){batchGeo(new T.IcosahedronGeometry(r,1),ma,[x,y,z],[0,0,0],[sx,sy,sz])}
function torus(ma,x,y,z,r=.5,t=.055,arc=Math.PI,ry=Math.PI/2){batchGeo(new T.TorusGeometry(r,t,6,18,arc),ma,[x,y,z],[0,ry,0])}
function line(ma,ax,ay,az,bx,by,bz,r=.04){
 const a=new T.Vector3(ax,ay,az),b=new T.Vector3(bx,by,bz),diff=b.clone().sub(a),len=diff.length();
 const geo=new T.CylinderGeometry(r,r,len,6);
 const q=new T.Quaternion().setFromUnitVectors(new T.Vector3(0,1,0),diff.normalize());
 const mesh=new T.Mesh(geo,ma);mesh.position.copy(a.add(b).multiplyScalar(.5));mesh.quaternion.copy(q);
 mesh.updateMatrix();batchGeo(geo,ma,mesh.position.toArray(),mesh.rotation.toArray().slice(0,3)); // simple trims only, orientation approximation
}
// Road and flat sidewalk visible from eye level, with multiple material zones and real geometry.
box(m.asphalt,0,-.16,0,12,.28,64);
box(m.paver,-7.98,-.065,0,4.15,.29,64);box(m.paver,7.98,-.065,0,4.15,.29,64);
box(m.curb,-5.97,.035,0,.28,.21,64);box(m.curb,5.97,.035,0,.28,.21,64);
for(let z=-29;z<30;z+=1.4){
 box(m.stripe,0,.006,z,.08,.016,.56);
 for(const s of [-1,1]){
  const xx=s*8.2;
  box(m.cobble,xx,.089,z,2.15,.008,.025);
 }
}
// Street details: drains, pavers, reflections approximated with geometry.
for(let z=-26;z<=27;z+=4.8)for(const s of [-1,1]){
 box(m.iron,s*6.39,-.008,z,.32,.015,.22);
 for(let t=-.10;t<=.11;t+=.11)box(m.dark,s*6.4,.006,z+t,.29,.01,.018);
}
function windowUnit(side,x,y,z,wide=1.5,tall=2.05,bay=false,arch=false){
 const inward=-side,front=x+inward*.14,opening=wide*.94;
 box(m.dark,front,y,z,.12,tall+.16,wide+.12);
 box(m.glass,front+inward*.10,y,z,.10,tall-.16,opening-.12);
 box(m.trim,front+inward*.17,y,z-wide/2,.22,tall+.32,.16);
 box(m.trim,front+inward*.17,y,z+wide/2,.22,tall+.32,.16);
 box(m.trim,front+inward*.17,y+tall/2,z,.20,.18,wide+.38);
 box(m.sandstone,front+inward*.21,y-tall/2,z,.3,.19,wide+.45);
 box(m.iron,front+inward*.25,y,z,.075,tall-.25,.065);
 box(m.iron,front+inward*.26,y+.05,z,.07,.06,wide-.1);
 if(arch)torus(m.trim,front+inward*.14,y+tall*.49,z,wide*.50,.073,Math.PI,Math.PI/2);
 if(bay){
  const k=front+inward*.68;
  box(m.white,k,y-tall*.64,z,.93,.19,wide+.65);
  for(let dz=-wide*.55;dz<=wide*.56;dz+=.33){
   cyl(m.iron,k,y-tall*.36,z+dz,.028,.49,6);
  }
  box(m.iron,k,y-tall*.13,z,.055,.055,wide+.55);
  box(m.rose,k,y-tall*.57,z,.38,.16,wide*.85);
  for(let j=0;j<4;j++)ball(j%2?m.lightleaf:m.leaves,k,y-tall*.51,z-wide*.31+j*wide*.21,.19,1.1,.7,.75);
 }
}
function portico(side,x,y,z,wide=2.3){
 const inward=-side, front=x+inward*.17;
 box(m.dark,front,y,z,.16,3.25,wide);
 box(m.glow,front+inward*.08,y,z,.06,2.65,wide*.88);
 for(const dz of [-wide*.48,wide*.48]){
  box(m.trim,front+inward*.23,y,z+dz,.26,3.48,.21);
  cyl(m.sandstone,front+inward*.39,y-.5,z+dz,.23,2.35,12);
  cyl(m.trim,front+inward*.39,y+.76,z+dz,.30,.17,12);
 }
 torus(m.trim,front+inward*.15,y+1.61,z,wide*.49,.095,Math.PI,Math.PI/2);
 box(m.gold,front+inward*.29,y-1.62,z,.22,.12,wide+.37);
}
function house(side,z0,width,floors,col,style,cap=0){
 const x=side*10.3+side*(.25*cap),h=floors*3.15+1.15,mid=z0;
 box(col,x,h/2,mid,5.65,h,width-.15);
 box(m.white,x-side*2.86,.16,z0,.42,.32,width+.2);
 box(m.trim,x-side*2.93,h-.33,z0,.42,.4,width+.55);
 box(m.sandstone,x-side*2.90,.5,z0,.26,.88,width+.18);
 for(let f=1;f<floors;f++){
  box(m.trim,x-side*2.92,f*3.15,z0,.40,.17,width+.35);
 }
 // Roof layers and terracotta ridges, not plain cubes.
 box(m.roof,x,h+.35,mid,6.22,.48,width+.5);
 box(m.sandstone,x-side*3.0,h+.08,mid,.32,.35,width+.6);
 for(let z=mid-width/2+.43;z<mid+width/2;z+=.43)box(m.roof,x,h+.63,z,5.9,.12,.18);
 const face=x-side*2.83;
 const count=width>=9?3:2,spacing=(width-1.35)/count;
 for(let f=0;f<floors;f++)for(let k=0;k<count;k++){
  const z=mid-width/2+.68+spacing*(k+.5),y=f*3.15+1.78;
  if(f===0&&k===1){portico(side,face,1.68,z,2.1);continue}
  windowUnit(side,face,y,z,1.28,f===0?2.33:1.96,style==='gallery'&&f>0,style!=='minimal'&&f===0);
  if(f>0 && style==='shutter'){
   box(m.shutter,face-side*.29,y,z-.82,.13,1.83,.36);
   box(m.shutter,face-side*.29,y,z+.82,.13,1.83,.36);
  }
 }
 if(style==='gallery'){
  for(let i=0;i<6;i++){
   const z=mid-width/2+.5+i*(width-1)/5;
   box(m.white,x-side*2.95,h-.73,z,.38,.9,.31);
   ball(i%2?m.lightleaf:m.leaves,x-side*2.99,h-.22,z,.27);
  }
 }
 // Venetian side quoin corners, narrow vertical stone bands
 for(const z of [mid-width/2+.16,mid+width/2-.16]){
  for(let f=0;f<floors*4;f++)box(m.white,x-side*2.98,.32+f*.75,z,.22,.41,.43);
 }
 return {x,front:face,h};
}

const palettes=[m.cream,m.peach,m.mint,m.yellow,m.rose,m.blue,m.lavender];
const lots=[[-23.2,10.2,4,'gallery'],[-12.2,10.1,3,'shutter'],[-1.4,9.8,4,'shutter'],[9.6,9.7,3,'gallery'],[20.4,9.6,3,'shutter']];
for(let i=0;i<lots.length;i++){
 const [z,w,n,st]=lots[i];
 house(-1,z,w,n,palettes[i%7],st,i%2);
 if(i!==1 && i!==0)house(1,z,w,n,palettes[(i+3)%7],i%2?'shutter':'gallery',i%3);
}
// The signature is an *artist's impression* of the Apollo glass café.
// Its unique cylinder and red gallery sculpture are modeled as 3D, not projected imagery.
const ax=8.0,az=-12.2,ah=13.1,ar=2.5;
cyl(m.gold,ax,.22,az,2.77,.33,28);
cyl(m.glass,ax,ah/2,az,ar,ah,32);
cyl(m.teal,ax,ah+.22,az,2.72,.36,32);
cyl(m.trim,ax,ah+.49,az,2.54,.22,32);
for(let t=0;t<32;t++){
 const a=t*Math.PI*2/32;
 const x=ax+Math.cos(a)*(ar+.035),z=az+Math.sin(a)*(ar+.035);
 cyl(m.teal,x,ah/2,z,.085,ah+.18,7);
 if(t%2===0)cyl(m.gold,x,ah*.57,z,.023,ah*.60,6);
}
for(let level=1;level<=4;level++){
 const y=level*2.5+.25;
 cyl(m.teal,ax,y,az,ar+.09,.12,32);
 cyl(m.glow,ax,y-.25,az,ar-.14,.11,32);
}
cyl(m.glass,ax,ah+1.35,az,2.18,1.3,24);
cone(m.roof,ax,ah+2.3,az,2.5,.82,24);
// Glass entrance overhang, toward center of the street.
box(m.teal,ax-2.7,2.78,az,2.2,.16,3.7);
for(const dz of [-1.68,1.68])cyl(m.gold,ax-3.5,1.45,az+dz,.10,2.9);
// Elaborated red bow on the adjacent gallery, stylized sculptural landmark.
const bx=7.15,by=11.8,bz=-23.5;
function ribbon(start,end,w=.38){
 const A=new T.Vector3(...start),B=new T.Vector3(...end),mid=A.clone().add(B).multiplyScalar(.5);
 const dir=B.clone().sub(A),g=new T.BoxGeometry(w,dir.length(),.32);
 const obj=new T.Mesh(g,m.red);obj.position.copy(mid);
 obj.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),dir.normalize());
 obj.updateMatrix();
 const baked=g.clone().applyMatrix4(obj.matrix);
 const arr=baked.index?baked.toNonIndexed():baked;
 if(!batch.has(m.red))batch.set(m.red,[]);batch.get(m.red).push(arr);g.dispose();baked.dispose();
}
for(let i=0;i<5;i++){
 const theta=i*Math.PI*2/5,sz=Math.sin(theta)*1.35,sy=Math.cos(theta)*2.0;
 ribbon([bx,by,bz],[bx-.25,by+sy,bz+sz],.56);
}
ball(m.gold,bx,by,bz,.42,1,1,.5);
// Golden APOLLO CAFÉ lettering on a real 3D facade-facing sign.
function labelTexture(text,color='#eadbb9',bg='#193f41',w=512,h=136){
 const c=document.createElement('canvas');c.width=w;c.height=h;const ct=c.getContext('2d');
 ct.fillStyle=bg;ct.fillRect(0,0,w,h);
 ct.strokeStyle='#d0ad6f';ct.lineWidth=8;ct.strokeRect(5,5,w-10,h-10);
 ct.textAlign='center';ct.textBaseline='middle';ct.fillStyle=color;
 ct.font='700 49px Georgia,serif';ct.fillText(text,w/2,h/2+2);
 const texture=new T.CanvasTexture(c);texture.colorSpace=T.SRGBColorSpace;return texture;
}
const nameplate=new T.Mesh(new T.PlaneGeometry(3.75,.96),new T.MeshStandardMaterial({map:labelTexture('APOLLO CAFÉ'),roughness:.62,metalness:.12,side:T.DoubleSide}));
nameplate.position.set(5.31,3.45,az);
nameplate.rotation.y=-Math.PI/2;scene.add(nameplate);
function arbor(s,z){
 const x=s*5.91;
 box(m.sandstone,x,.32,z,.85,.72,.85);
 cyl(m.bark,x,1.1,z,.15,1.8);
 for(let j=0;j<7;j++){
  const a=j*2.399963,rad=.70+(j%3)*.32;
  ball(j%2?m.leaves:m.lightleaf,x+Math.cos(a)*rad,2.35+j*.065,z+Math.sin(a)*rad,.62,.65,.85,.7);
 }
}
for(const z of [-19,-6,8,21]){arbor(-1,z);arbor(1,z+2.5)}
function lamp(s,z){
 const x=s*6.05;
 cyl(m.iron,x,2.14,z,.062,4.22,9);
 cyl(m.gold,x,4.27,z,.17,.14,10);
 ball(m.glow,x,4.48,z,.20,1,1.2,1);
 // Non-dynamic lights, visually warm glow without mobile shadow overhead.
}
for(let z=-23;z<=24;z+=9.6){lamp(-1,z);lamp(1,z+3.7)}
function cafeTable(x,z){
 cyl(m.iron,x,.82,z,.055,1.64,8);
 cyl(m.trim,x,1.05,z,.54,.065,14);
 for(let i=0;i<3;i++){
  const a=i*Math.PI*2/3,xx=x+Math.cos(a)*.9,zz=z+Math.sin(a)*.9;
  box(m.sandstone,xx,.46,zz,.55,.14,.48,a);
  for(const dx of [-.18,.18])cyl(m.iron,xx+dx,.22,zz,.028,.45,6);
 }
}
for(const z of [-18,7]){cafeTable(-6.7,z);cafeTable(6.9,z+2)}
function parasol(x,z,color){
 cyl(m.iron,x,1.4,z,.045,2.8,8);
 cone(color,x,2.68,z,1.45,.83,12);
}
parasol(-6.8,-18,m.rose);parasol(6.8,8.8,m.cream);
// Sea appears at the end of the real traversable street, beyond rail and terraces.
box(m.water,0,-.25,-47,160,.1,58);
for(let i=0;i<15;i++)box(i%3?m.white:m.gold,(i-7)*1.8,-.14,-32-.3*(i%5),1.1,.006,.037);
for(let s=-5;s<=5;s++){
 cyl(m.white,s*1.12,.55,-29.4,.09,1.1);
}
box(m.white,0,1.07,-29.4,12.3,.15,.20);
box(m.gold,0,.47,-29.4,12.3,.09,.17);
// Colorful fabric flags near the roof line and a few plants.

// Handmade triangular bunting: no floating rectangular placeholder billboards.
for(const z of [3.5,-13.5]) {
 box(m.iron,0,6.45,z,13,.022,.018);
 for(let j=0;j<17;j++){
  const x=-6.02+j*.74;
  const sh=new T.Shape();sh.moveTo(-.34,0);sh.lineTo(.34,0);sh.lineTo(0,-.72);sh.closePath();
  const geo=new T.ShapeGeometry(sh);
  batchGeo(geo,[m.rose,m.yellow,m.mint,m.blue][j%4],[x,6.43,z]);
 }
}
// Street vendors, scooters and colored shutters create lived-in urban rhythm.
function scooter(x,z){
 for(const zz of [z-.63,z+.63]){
  batchGeo(new T.TorusGeometry(.26,.065,8,14),m.iron,[x+.31,.3,zz],[0,Math.PI/2,0]);
  batchGeo(new T.TorusGeometry(.26,.065,8,14),m.iron,[x-.31,.3,zz],[0,Math.PI/2,0]);
 }
 box(m.red,x,.61,z,.72,.43,1.38);
 box(m.dark,x,1.00,z-.29,.64,.19,.53);
 box(m.dark,x,1.32,z+.38,.39,.12,.09);
 box(m.gold,x,.72,z+.74,.55,.12,.09);
}
scooter(-5.45,13);scooter(5.38,-5);
for(const z of [16.4,-4.7,-20.2]){
 box(m.rose,-6.48,1.44,z,.22,1.58,2.55);
 box(m.trim,-6.4,2.38,z,1.55,.12,2.90);
 for(let i=0;i<5;i++){
  const zz=z-1+i*.5;
  ball(i%2?m.lightleaf:m.leaves,-6.06,2.40,zz,.22,.6,.7,.9);
 }
}
// Real geometry street arches instead of generic cube skyline.
function gateTower(x,z,y){
 cyl(m.cream,x,y/2,z,.86,y,16);
 cyl(m.roof,x,y+.35,z,1.08,.55,16);
 cone(m.roof,x,y+.98,z,1.1,1.12,12);
 for(let dy=2.2;dy<y-1;dy+=2.4){
  box(m.dark,x-.76,dy,z,.12,1.25,.56);
  box(m.trim,x-.84,dy+.71,z,.17,.13,.67);
 }
}
gateTower(-11.5,-23,18.2);
const skySphere=new T.Mesh(new T.SphereGeometry(118,32,16),new T.ShaderMaterial({
 side:T.BackSide,depthWrite:false,fog:false,
 vertexShader:'varying vec3 vP; void main(){vP=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
 fragmentShader:'varying vec3 vP; void main(){float h=normalize(vP).y;vec3 low=vec3(.96,.77,.57);vec3 mid=vec3(.58,.75,.78);vec3 high=vec3(.32,.58,.73);float a=smoothstep(-.12,.19,h);float b=smoothstep(.06,.82,h);vec3 c=mix(low,mid,a);c=mix(c,high,b);gl_FragColor=vec4(c,1.0);}'
}));
skySphere.renderOrder=-100;skySphere.frustumCulled=false;scene.add(skySphere);
// Painterly cloud masses are 3D soft silhouettes, not moving photo billboard.
for(let i=0;i<12;i++){
 const xx=-50+i*11,yy=27+(i%4)*2.8,zz=-60-(i%3)*11;
 ball(m.white,xx,yy,zz,4.2,2.0,.28,.9);
 ball(m.white,xx+3.3,yy+1,zz,3.4,1.1,.34,.8);
}

// 3D environment structure ends here. Merge opaque geometry to reduce draw calls on mobile.
let buildMeshes=0,triangles=0,geoBytes=0;
for(const [ma,geometries] of batch){
 const combined=mergeGeometries(geometries,false);
 if(!combined){console.warn('MERGE_FAIL',ma.color.getHexString(),geometries.length);continue}
 const mesh=new T.Mesh(combined,ma);mesh.receiveShadow=true;mesh.castShadow=true;
 scene.add(mesh);buildMeshes++;
 triangles+=combined.getAttribute('position').count/3;
 geoBytes+=combined.getAttribute('position').array.byteLength;
 for(const g of geometries)g.dispose();
}
batch.clear();

function noiseTexture(ma,strength=.11,size=128){
 const c=document.createElement('canvas');c.width=c.height=size;
 const ct=c.getContext('2d'),img=ct.createImageData(size,size);let seed=319;
 const next=()=>((seed=Math.imul(seed,1664525)+1013904223>>>0)/4294967295);
 for(let i=0;i<img.data.length;i+=4){
  const tone=Math.max(185,Math.min(255,Math.floor(240+(next()-.5)*strength*240)));
  img.data[i]=img.data[i+1]=img.data[i+2]=tone;img.data[i+3]=255;
 }
 ct.putImageData(img,0,0);
 const tex=new T.CanvasTexture(c);tex.wrapS=tex.wrapT=T.RepeatWrapping;tex.colorSpace=T.SRGBColorSpace;
 ma.map=tex;ma.needsUpdate=true;
}
function paving(ma,background,mortar,cols=8,rows=9,repeatX=3,repeatY=20){
 const canvas=document.createElement('canvas');canvas.width=512;canvas.height=512;
 const ctx=canvas.getContext('2d');ctx.fillStyle=mortar;ctx.fillRect(0,0,512,512);
 let seed=4123;const rand=()=>((seed=Math.imul(seed,1664525)+1013904223>>>0)/4294967295);
 const w=512/cols,h=512/rows;
 for(let j=0;j<rows;j++)for(let i=-1;i<=cols;i++){
  const offset=j%2?w*.5:0;
  const v=Math.floor((rand()-.5)*32);
  ctx.fillStyle='rgb('+[0,1,2].map(_=>Math.max(0,Math.min(255,background+v))).join(',')+')';
  ctx.fillRect(i*w+offset+2.5,j*h+2.0,w-5,h-4);
  ctx.fillStyle='rgba(250,236,209,.10)';ctx.fillRect(i*w+offset+4,j*h+4,w-8,3);
 }
 const tex=new T.CanvasTexture(canvas);tex.colorSpace=T.SRGBColorSpace;tex.wrapS=tex.wrapT=T.RepeatWrapping;
 tex.repeat.set(repeatX,repeatY);tex.anisotropy=renderer.capabilities.getMaxAnisotropy();
 ma.map=tex;ma.color.set('#ffffff');ma.needsUpdate=true;
}
for(const ma of [m.cream,m.peach,m.blue,m.yellow,m.mint,m.rose,m.sand,m.lavender])noiseTexture(ma,.17);
paving(m.asphalt,151,'#6a6461',8,7,2.8,22);
paving(m.paver,213,'#ae9786',8,8,3.1,26);
paving(m.roof,194,'#965c46',8,7,4,16);

// Small ambient distant layered hill silhouettes near water.
function hill(x,z,scale){
 const shape=new T.Shape();
 shape.moveTo(-scale,0);shape.quadraticCurveTo(-scale*.25,scale*.45,0,scale*.24);
 shape.quadraticCurveTo(scale*.55,scale*.63,scale,0);shape.lineTo(-scale,0);
 const geo=new T.ShapeGeometry(shape);
 const mesh=new T.Mesh(geo,new T.MeshBasicMaterial({color:'#7d9a90',side:T.DoubleSide,fog:true}));
 mesh.position.set(x,.04,z);scene.add(mesh);
}
hill(-17,-49,22);hill(28,-58,25);
// Physical sky disc beyond geometry, cinematic warm but restrained.
const sunBall=new T.Mesh(new T.SphereGeometry(4,24,12),new T.MeshBasicMaterial({color:'#ffe3ab',fog:false}));
sunBall.position.set(-37,29,-82);scene.add(sunBall);

// Walk interaction, bounded 3D play space. Portrait-first by default.
const player={x:0,y:1.7,z:15,yaw:-.28,pitch:.07,steps:0,walked:0,looking:0,framesMoving:0,framesStopped:0,samples:0};
const pressed=new Set(),joy={x:0,y:0,pointer:null};
let dragging=null,lastTick=performance.now(),frameCounter=0,fpsStart=performance.now(),fps=0,renderFrames=0;
const canvas=renderer.domElement;
const joyEl=el('joystick'),joyKnob=el('knob');
const moveKeys=new Set(['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright']);
window.addEventListener('keydown',e=>{
 const key=e.key.toLowerCase();if(moveKeys.has(key)){pressed.add(key);e.preventDefault();}
});
window.addEventListener('keyup',e=>pressed.delete(e.key.toLowerCase()));
window.addEventListener('blur',()=>{pressed.clear();joy.x=joy.y=0;dragging=null;});
function setJoy(e){
 const r=joyEl.getBoundingClientRect();
 let x=(e.clientX-(r.left+r.width/2))/(r.width*.38),
 y=(e.clientY-(r.top+r.height/2))/(r.height*.38);
 const len=Math.max(1,Math.hypot(x,y));x/=len;y/=len;
 joy.x=x;joy.y=-y;
 joyKnob.style.transform='translate('+Math.round(x*32)+'px,'+Math.round(y*32)+'px)';
}
joyEl.addEventListener('pointerdown',e=>{joy.pointer=e.pointerId;joyEl.setPointerCapture(e.pointerId);setJoy(e);e.preventDefault()});
joyEl.addEventListener('pointermove',e=>{if(e.pointerId===joy.pointer){setJoy(e);e.preventDefault()}});
function stopJoy(e){if(e.pointerId!==joy.pointer)return;joy.pointer=null;joy.x=joy.y=0;joyKnob.style.transform='';}
joyEl.addEventListener('pointerup',stopJoy);joyEl.addEventListener('pointercancel',stopJoy);
const lookPad=el('lookPad');
lookPad.addEventListener('pointerdown',e=>{dragging={id:e.pointerId,x:e.clientX,y:e.clientY};lookPad.setPointerCapture(e.pointerId);e.preventDefault()});
lookPad.addEventListener('pointermove',e=>{
 if(!dragging||dragging.id!==e.pointerId)return;
 const dx=e.clientX-dragging.x,dy=e.clientY-dragging.y;
 dragging.x=e.clientX;dragging.y=e.clientY;
 player.yaw-=dx*.0037;player.pitch=T.MathUtils.clamp(player.pitch-dy*.003, -.48,.57);
 player.looking++;e.preventDefault();
});
lookPad.addEventListener('pointerup',e=>{if(e.pointerId===dragging?.id)dragging=null});
lookPad.addEventListener('pointercancel',e=>{if(e.pointerId===dragging?.id)dragging=null});
const bounds={minX:-5.35,maxX:5.35,minZ:-25,maxZ:25};
function controls(dt){
 let f=Number(pressed.has('w')||pressed.has('arrowup'))-Number(pressed.has('s')||pressed.has('arrowdown'))+joy.y;
 let r=Number(pressed.has('d')||pressed.has('arrowright'))-Number(pressed.has('a')||pressed.has('arrowleft'))+joy.x;
 const mag=Math.hypot(f,r);
 if(mag>.13){
  const k=dt*2.08/Math.max(1,mag);
  const dx=(-Math.sin(player.yaw)*f+Math.cos(player.yaw)*r)*k;
  const dz=(-Math.cos(player.yaw)*f-Math.sin(player.yaw)*r)*k;
  const xx=T.MathUtils.clamp(player.x+dx,bounds.minX,bounds.maxX);
  const zz=T.MathUtils.clamp(player.z+dz,bounds.minZ,bounds.maxZ);
  player.walked+=Math.hypot(xx-player.x,zz-player.z);
  player.x=xx;player.z=zz;player.framesMoving++;player.steps++;
 }else player.framesStopped++;
 const bob=mag>.13?.037*Math.sin(player.steps*.21):0;
 player.y=T.MathUtils.lerp(player.y,1.70+bob,Math.min(1,dt*12));
 camera.position.set(player.x,player.y,player.z);
 camera.rotation.set(player.pitch,player.yaw,0,'YXZ');
}
function resize(){
 const width=Math.max(1,window.innerWidth),height=Math.max(1,window.innerHeight);
 camera.aspect=width/height;camera.updateProjectionMatrix();
 renderer.setSize(width,height,false);
}
window.addEventListener('resize',resize);resize();
el('reset').addEventListener('click',()=>{player.x=0;player.z=15;player.yaw=-.28;player.pitch=.07;player.walked=0;player.steps=0;pressed.clear();joy.x=joy.y=0});
el('stats').addEventListener('click',()=>{el('debug').classList.toggle('hide')});
const routeProgress=()=>T.MathUtils.clamp((15-player.z)/40,0,1);
const state=()=>({
 ready:true,webgl:!!renderer.getContext(),release:'LIVINGPQ_STYLE_FIRST_OFFLINE',
 label:'ART_DIRECTED_PHU_QUOC_INSPIRED_NOT_GEO_REGISTERED',
 camera:{x:player.x,y:player.y,z:player.z,yaw:player.yaw,pitch:player.pitch},
 walkedMeters:player.walked,movingFrames:player.framesMoving,stoppedFrames:player.framesStopped,lookEvents:player.looking,
 frameCount:renderFrames,fpsBrowser:fps,triangles:Math.floor(triangles),meshes:buildMeshes+3,batchedGeoBytes:geoBytes,
 routeProgress:routeProgress(),trueContinuous3D:true,notVerifiedSunsetGeography:true,physicalIPhoneTest:'NOT_RUN',
 visualGate:'PENDING_HUMAN_REVIEW',production:'NO_DEPLOY'
});
window.LivingMicro={state,reset:()=>el('reset').click()};
const clock=()=>{
 const now=performance.now(),dt=Math.max(0,Math.min(.05,(now-lastTick)/1000));lastTick=now;
 controls(dt);skySphere.position.copy(camera.position);renderer.render(scene,camera);
 renderFrames++;frameCounter++;
 if(now-fpsStart>1250){
  fps=Math.round(frameCounter*1000/(now-fpsStart));frameCounter=0;fpsStart=now;
  el('meter').textContent=(player.walked).toFixed(1)+' m đi bộ · '+fps+' FPS';
  el('debug').textContent=Math.round(triangles).toLocaleString()+' tris · '+(buildMeshes+3)+' draws · '+player.x.toFixed(1)+', '+player.z.toFixed(1)+' · '+Math.round(routeProgress()*100)+'% đoạn phố';
  el('progressBar').style.width=(routeProgress()*100).toFixed(1)+'%';
 }
};
renderer.setAnimationLoop(clock);
el('loading').classList.add('hide');