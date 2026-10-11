import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {buildHeroTown} from './hero-town.js';
// Visual Reset: photograph-informed landmark geometry only. No old scene, gameplay or billboards.
const T=THREE,canvas=document.getElementById('world'),scene=new T.Scene();
const camera=new T.PerspectiveCamera(56,1,.1,380);
const renderer=new T.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.2));
renderer.outputColorSpace=T.SRGBColorSpace;
renderer.toneMapping=T.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.08;
renderer.shadowMap.enabled=false;
scene.background=new T.Color('#cfbaa6');scene.fog=new T.FogExp2('#bcae9b',.00115);
scene.add(new T.HemisphereLight('#eaf1ff','#718c8a',2.2));
const sunlight=new T.DirectionalLight('#ffe2b2',3.1);sunlight.position.set(42,43,-90);scene.add(sunlight);
const backlight=new T.DirectionalLight('#97c2cb',.82);backlight.position.set(-60,25,20);scene.add(backlight);
const mat=(c,r=.75,m=0,x={})=>new T.MeshStandardMaterial({color:c,roughness:r,metalness:m,...x});
const M={
 concrete:mat('#d6c9ba',.84),marble:mat('#ece1d7',.77),bronze:mat('#aa7d57',.38,.62),
 stage:mat('#e0e5dc',.58,.18),rail:mat('#574944',.57,.4),shore:mat('#dcc7b1',.91),
 grass:mat('#64745a',.96),wood:mat('#756451',.86),white:mat('#fff2df',.74),
 light:mat('#ffdab1',.44,.12,{emissive:'#e5ad71',emissiveIntensity:1.35}),
 tile:mat('#d7caba',.96)
};
const group=new T.Group();scene.add(group);
let nMeshes=0,nTriangles=0;
function mesh(g,m,p=[0,0,0],r=[0,0,0]){
 const o=new T.Mesh(g,m);o.position.set(...p);o.rotation.set(...r);o.receiveShadow=true;group.add(o);
 nMeshes++;nTriangles+=(g.index?g.index.count:g.getAttribute('position').count)/3;return o;
}
function box(m,x,y,z,w,h,d){return mesh(new T.BoxGeometry(w,h,d),m,[x,y,z])}
function cyl(m,x,y,z,r,h,seg=16){return mesh(new T.CylinderGeometry(r,r,h,seg),m,[x,y,z])}
function beam(m,a,b,r=.09){
 const x=new T.Vector3(...a),y=new T.Vector3(...b),v=y.clone().sub(x);
 const o=mesh(new T.CylinderGeometry(r,r,v.length(),10),m,x.add(y).multiplyScalar(.5).toArray());
 o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),v.normalize());return o;
}
const loader=new T.TextureLoader();
for(const [key,files,u,v] of [
 ['tile',['paving_albedo.jpg','paving_normal.jpg','paving_rough.jpg'],5,6],
 ['stage',['plaster_albedo.jpg','plaster_normal.jpg','plaster_rough.jpg'],2,2]
]){
 const ma=M[key];
 for(let i=0;i<3;i++){
  const tex=loader.load('textures/'+files[i]);
  tex.wrapS=tex.wrapT=T.RepeatWrapping;tex.repeat.set(u,v);
  if(i===0)tex.colorSpace=T.SRGBColorSpace;
  ma[['map','normalMap','roughnessMap'][i]]=tex;
 }
 ma.needsUpdate=true;
}
const sky=new T.Mesh(new T.SphereGeometry(300,64,36),new T.ShaderMaterial({
 side:T.BackSide,depthWrite:false,fog:false,
 vertexShader:'varying vec3 vDir;void main(){vDir=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
 fragmentShader:'varying vec3 vDir;void main(){vec3 d=normalize(vDir);float y=d.y;vec3 c=mix(vec3(.99,.70,.57),vec3(.34,.53,.67),smoothstep(-.13,.70,y));float q=max(dot(d,normalize(vec3(.48,.14,-.87))),0.);c+=vec3(1.,.72,.50)*pow(q,42.)*.18;gl_FragColor=vec4(c,1.);}'
}));
sky.renderOrder=-100;scene.add(sky);
const water=new T.ShaderMaterial({
 uniforms:{time:{value:0}},side:T.DoubleSide,
 vertexShader:'varying vec3 w;void main(){w=(modelMatrix*vec4(position,1.)).xyz;gl_Position=projectionMatrix*viewMatrix*vec4(w,1.);}',
 fragmentShader:'uniform float time;varying vec3 w;void main(){float r=sin(w.x*.26+time*.31)*sin(w.z*.19-time*.24);float gl=pow(max(0.,1.-abs(w.x-58.)/100.),2.)*pow(max(0.,1.-abs(w.z+115.)/170.),2.);float flicker=sin(w.z*.81+time*.77+sin(w.x*.37))*.5+.5;vec3 c=mix(vec3(.07,.32,.44),vec3(.17,.53,.58),.35+r*.21);c+=vec3(1.,.73,.47)*gl*(.11+.26*flicker);gl_FragColor=vec4(c,1.);}'
});
mesh(new T.PlaneGeometry(520,520),water,[0,-.1,-200],[-Math.PI/2,0,0]);
// Real 3D shoreline: park in front, sea and bridge behind. No photographic panorama.
const coast=new T.Shape();
coast.moveTo(-60,7);coast.lineTo(49,7);
for(let i=0;i<=48;i++){
 const t=i*Math.PI/48,xx=49-102*i/48,zz=38+13*Math.sin(t);
 coast.lineTo(xx,zz);
}
coast.closePath();
mesh(new T.ExtrudeGeometry(coast,{depth:1.0,bevelEnabled:true,bevelThickness:.12,bevelSize:.15,bevelSegments:1}),M.shore,[0,1,0],[-Math.PI/2,0,0]);
const garden=new T.Shape();for(let i=0;i<=48;i++){const a=i*Math.PI*2/48,x=-15+17*Math.cos(a),z=24+12*Math.sin(a);if(i===0)garden.moveTo(x,z);else garden.lineTo(x,z);}
mesh(new T.ShapeGeometry(garden),M.grass,[0,2.2,0],[-Math.PI/2,0,0]);

// Coastal show-stage: layered broad stone arches, NOT the bridge.
function stageArch(cx,cz,outerWidth,outerHeight,band,depth){
 const shape=new T.Shape();
 for(let i=0;i<=50;i++){
  const q=i*Math.PI/50;
  const x=-outerWidth*Math.cos(q),y=outerHeight*Math.sin(q);
  if(i===0)shape.moveTo(x,y);else shape.lineTo(x,y);
 }
 for(let i=50;i>=0;i--){
  const q=i*Math.PI/50;
  const x=-(outerWidth-band)*Math.cos(q),y=(outerHeight-band)*Math.sin(q);
  shape.lineTo(x,y);
 }
 shape.closePath();
 const g=new T.ExtrudeGeometry(shape,{depth,bevelEnabled:true,bevelThickness:.20,bevelSize:.15,bevelSegments:2,curveSegments:50});
 mesh(g,M.stage,[cx,1.42,cz]);
 // Pale panel outlines following upper surface; grounded in ref photo's cladding rhythm.
 for(let i=2;i<49;i+=3){
  const q=i*Math.PI/50,x=cx-(outerWidth-.16)*Math.cos(q),y=1.42+(outerHeight-.16)*Math.sin(q),z=cz+depth+.18;
  const deco=box(M.white,x,y,z,.05,.08,.07);
  deco.rotation.z=q-Math.PI/2;
 }
}
cyl(M.concrete,27,1.34,-42,17,.70,68);
cyl(M.tile,27,1.75,-42,16.30,.16,68);
stageArch(27,-43,12.60,14.15,2.15,1.9);
stageArch(28,-40.9,9.70,11.90,1.75,1.45);
stageArch(29,-38.9,6.70,9.55,1.35,1.35);
// Stage hollow middle must remain genuinely open from ALL camera angles.
for(let x=15;x<39;x+=3.2){
 cyl(M.bronze,x,1.91,-43,.085,.21,8);
}
for(const dx of [-14,14]){
 box(M.concrete,27+dx,1.28,-42,1.9,1.2,3.6);
}
// Real bridge is a different object: two separate curved arms extending offshore.
// Control points approximate composition of licensed aerial source, not survey.
const spans=[
 [[-68,1.9,-28],[-58,2.9,-46],[-43,3.4,-61],[-28,4.15,-70],[-15.2,4.6,-76.8]],
 [[10,1.9,-32],[6,2.8,-45],[-.2,3.75,-61],[-6.0,4.33,-70],[-10.8,4.66,-76.8]]
];
const endpoints=[];
for(const curveData of spans){
 const cv=new T.CatmullRomCurve3(curveData.map(p=>new T.Vector3(...p)),false,'centripetal');
 endpoints.push(cv.getPoint(1).toArray());
 for(let i=0;i<90;i++){
  const a=cv.getPoint(i/90),b=cv.getPoint((i+1)/90),middle=a.clone().add(b).multiplyScalar(.5);
  const dir=b.clone().sub(a),yaw=Math.atan2(dir.x,dir.z),length=dir.length();
  const bridgeDeck=box(M.marble,middle.x,middle.y,middle.z,3.8,.38,length+.045);
  bridgeDeck.rotation.y=yaw;
  bridgeDeck.rotation.x=-Math.atan2(dir.y,Math.hypot(dir.x,dir.z));
  if(i%3===0){
   for(const side of [-1,1]){
    const dx=Math.cos(yaw)*side*1.77,dz=-Math.sin(yaw)*side*1.77;
    beam(M.rail,[middle.x+dx,middle.y+.15,middle.z+dz],[middle.x+dx,middle.y+1.15,middle.z+dz],.040);
   }
  }
  if(i%22===11&&i>13){
   const foot=middle.y-.18;
   beam(M.concrete,[middle.x-3,.22,middle.z-4],[middle.x,foot,middle.z],.48);
   beam(M.concrete,[middle.x+3,.22,middle.z+4],[middle.x,foot,middle.z],.48);
  }
  for(const side of [-1,1]){
   const pts=[];
   for(let j=0;j<=74;j++){
    const p=cv.getPoint(j/74),t=cv.getTangent(j/74);
    const v=new T.Vector3(t.z,0,-t.x).normalize().multiplyScalar(side*1.77);
    pts.push(p.add(v).add(new T.Vector3(0,1.10,0)));
   }
   mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts),74,.057,5,false),M.rail);
  }
 }
}
// Fixed proof that the two bridge tips are not joined by accidental hidden geometry.
const bridgeGap=Math.hypot(endpoints[0][0]-endpoints[1][0],endpoints[0][2]-endpoints[1][2]);
// Coastal quay, edging, decking and promenade benches.
for(let j=0;j<32;j++){
 const x=-61+j*2.55,z=-14.0;
 cyl(M.bronze,x,1.72,z,.095,1.2,10);
 if(j<31)beam(M.rail,[x,2.22,z],[x+2.55,2.22,z],.032);
}
for(const [x,z] of [[-46,-15],[-36,-20],[-15,-15],[11,-14]]){
 box(M.wood,x,2.0,z,2.0,.15,.58);
 for(const xx of [-.8,.8])box(M.rail,x+xx,1.60,z,.12,.80,.12);
}
let palmReady=false,palmInstances=0,palmError=null;
const gltf=new GLTFLoader();
const loc=[
 [-46,1.2,-18,7.7],[-39,1.2,-21,7.1],[-32,1.2,-16,8.0],
 [-26,1.2,-27,7.5],[-21,1.2,-17,8.2],[-15,1.2,-29,7.8],
 [-8,1.2,-18,7.2],[-5,1.2,-27,7.6],[1,1.2,-16,7.2],
 [7,1.2,-25,7.8],[13,1.2,-19,8.5],
 [-33,1.2,-35,7.1],[-25,1.2,-37,7.6],[-15,1.2,-36,7.2],
 [-1,1.2,-36,7.7],[11,1.2,-35,7.8]
];
gltf.load('models/palm.glb',g=>{
 const raw=g.scene;
 const bound=new T.Box3().setFromObject(raw),size=bound.getSize(new T.Vector3());
 const min=bound.min,center=bound.getCenter(new T.Vector3());
 for(const [x,y,z,height] of loc){
  const anchor=new T.Group();anchor.position.set(x,y,z);anchor.scale.setScalar(height/Math.max(.05,size.y));
  const clone=raw.clone(true);clone.position.set(-center.x,-min.y,-center.z);
  anchor.add(clone);scene.add(anchor);palmInstances++;
 }
 palmReady=true;
},undefined,e=>{palmError=String(e);palmReady=true});
const heroTown=buildHeroTown(scene);
const views={
 hillside:{eye:[24,52,-172],target:[-5,15,15],fov:58},
 promenade:{eye:[85,19,-76],target:[-29,17,26],fov:59},
 bridge:{eye:[-112,20,-106],target:[-14,12,-24],fov:59}
};
let active='hillside',frames=0,fps=0,last=performance.now(),sample=0,lastSample=last;
function view(name){
 if(!views[name])return;
 active=name;
 const v=views[name];camera.position.set(...v.eye);camera.fov=v.fov;camera.lookAt(...v.target);camera.updateProjectionMatrix();
 for(const b of document.querySelectorAll('[data-view]'))b.classList.toggle('selected',b.dataset.view===name);
}
function resize(){
 const w=Math.max(1,innerWidth),h=Math.max(1,innerHeight);
 camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false);
}
window.addEventListener('resize',resize);
for(const b of document.querySelectorAll('[data-view]'))b.addEventListener('click',()=>view(b.dataset.view));
resize();view('hillside');
let err=null;
renderer.setAnimationLoop(()=>{
 const now=performance.now();water.uniforms.time.value=now*.001;
 sky.position.copy(camera.position);
 renderer.render(scene,camera);frames++;sample++;
 if(now-lastSample>1350){
  fps=Math.round(sample*1000/(now-lastSample));sample=0;lastSample=now;
  document.getElementById('stats').textContent=nMeshes+' source meshes · '+Math.round(nTriangles).toLocaleString()+' triangles · '+fps+' FPS (browser emulation)';
 }
 if(frames>10&&palmReady)document.getElementById('loading').style.display='none';
});
window.SignatureArt={
 state:()=>({
  realWebGL:!!renderer.getContext(),frames,fps,view:active,meshCount:nMeshes,geometryTriangles:Math.round(nTriangles),
  bridgeGapMeters:Math.round(bridgeGap*100)/100,palmReady,palmInstances,palmError,
  sourceTruth:'PHOTO_REFERENCED_LANDMARK_GEOMETRY_UNSURVEYED',heroTown,
  visualApproval:'HOLD_NEEDS_HUMAN_REF_ALIGNMENT_AND_QUALITY_REVIEW',
  gameplayFrozen:true,playSiteUnchanged:true
 }),
 setView:view
};