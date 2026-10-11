import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {buildSignatureV3} from './signature-v3.js';
// Real WebGL geometry, no sky image, geographic billboard or gameplay.
const T=THREE,canvas=document.getElementById('world'),scene=new T.Scene();
const camera=new T.PerspectiveCamera(60,1,.1,1600);
const renderer=new T.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance',alpha:false});
renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.18;renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.3));
renderer.shadowMap.enabled=false;scene.fog=new T.FogExp2('#b4a9a2',.0009);
scene.add(new T.HemisphereLight('#daeaf3','#726963',2.2));
const sunlight=new T.DirectionalLight('#ffe7cb',3.2);sunlight.position.set(80,115,-105);scene.add(sunlight);
const bounce=new T.DirectionalLight('#abd2d3',.9);bounce.position.set(-80,35,70);scene.add(bounce);
const sky=new T.Mesh(new T.SphereGeometry(580,48,24),new T.ShaderMaterial({
 side:T.BackSide,depthWrite:false,fog:false,
 vertexShader:'varying vec3 d;void main(){d=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
 fragmentShader:'varying vec3 d;float h(vec2 v){return fract(sin(dot(v,vec2(127.1,311.7)))*43758.5453123);}float n(vec2 x){vec2 a=floor(x),f=fract(x);f=f*f*(3.-2.*f);return mix(mix(h(a),h(a+vec2(1.,0.)),f.x),mix(h(a+vec2(0.,1.)),h(a+vec2(1.,1.)),f.x),f.y);}void main(){vec3 r=normalize(d);float y=r.y;vec3 c=mix(vec3(.99,.70,.53),vec3(.69,.60,.62),smoothstep(-.22,.43,y));c=mix(c,vec3(.29,.50,.70),smoothstep(.22,.93,y));vec2 uv=r.xz/max(.17,r.y+.46);float f=.53*n(uv*2.3)+.3*n(uv*5.8)+.17*n(uv*12.);float cl=smoothstep(.56,.73,f)*(.7-smoothstep(.05,.69,y)*.5);c=mix(c,vec3(1.,.82,.74),clamp(cl*.52,0.,.55));float s=max(0.,dot(r,normalize(vec3(.41,.19,-.89))));c+=vec3(1.,.69,.45)*pow(s,21.)*.31+vec3(1.,.86,.68)*pow(s,700.)*1.2;gl_FragColor=vec4(c,1.);}'
}));scene.add(sky);
const waterMat=new T.ShaderMaterial({
 uniforms:{uTime:{value:0}},side:T.DoubleSide,
 vertexShader:'varying vec3 p;void main(){p=(modelMatrix*vec4(position,1.)).xyz;gl_Position=projectionMatrix*viewMatrix*vec4(p,1.);}',
 fragmentShader:'varying vec3 p;uniform float uTime;float h(vec2 v){return fract(sin(dot(v,vec2(127.1,311.7)))*43758.5453123);}float n(vec2 v){vec2 i=floor(v),f=fract(v);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1.,0.)),f.x),mix(h(i+vec2(0.,1.)),h(i+vec2(1.,1.)),f.x),f.y);}void main(){vec2 q=p.xz;float wav=.22*sin(q.x*.025+q.y*.038+uTime*.20)+.15*sin(q.x*.081-q.y*.028-uTime*.18)+.06*sin(q.x*.115+q.y*.089+uTime*.31);float r=n(q*.007+uTime*.012);float s=smoothstep(.33,.84,.5+.25*wav+.28*r);vec3 col=mix(vec3(.056,.245,.33),vec3(.16,.41,.47),s);float g=pow(max(0.,1.-abs(p.x-30.)/285.),2.)*pow(max(0.,1.-abs(p.z+180.)/335.),2.);float glitter=pow(max(0.,sin(q.x*.7+q.y*.44+uTime*.77)),14.)*.08;col+=g*vec3(1.,.69,.44)*(.11+.16*r+glitter);gl_FragColor=vec4(col,1.);}'
});
const sea=new T.Mesh(new T.PlaneGeometry(1400,1400),waterMat);
sea.rotation.x=-Math.PI/2;sea.position.y=-.2;scene.add(sea);
const signature=buildSignatureV3(scene);
let palmReady=false,palmInstances=0,palmError=null;
const palmPts=[];
for(let i=0;i<38;i++){let x=-150+i*8,z=28+3.7*Math.sin(i*.38);
 if(Math.abs(x+86)>=38)palmPts.push([x,4.4,z,7.2+(i%7)*.46]);}
for(let i=0;i<23;i++){let x=-115+i*10.3,z=43+3*Math.sin(i*.3);
 if(Math.abs(x+57)>=20)palmPts.push([x,4.4,z,7.5+(i%4)*.65]);}
const gltf=new GLTFLoader();
gltf.load('models/palm.glb',g=>{
 const original=g.scene,bb=new T.Box3().setFromObject(original);
 const dim=bb.getSize(new T.Vector3()),center=bb.getCenter(new T.Vector3());
 for(let i=0;i<palmPts.length;i++){
  const [x,y,z,h]=palmPts[i],root=new T.Group();
  root.position.set(x,y,z);root.scale.setScalar(h/Math.max(dim.y,.01));root.rotation.y=i*2.39996323;
  const clone=original.clone(true);clone.position.set(-center.x,-bb.min.y,-center.z);
  root.add(clone);scene.add(root);palmInstances++;
 }palmReady=true;
},undefined,e=>{palmError=String(e);palmReady=true});
const views={
 hillside:{eye:[8,91,-165],target:[-5,18,21],fov:62},
 promenade:{eye:[144,34,-105],target:[-38,17,16],fov:61},
 bridge:{eye:[-131,36,-114],target:[-49,17,-10],fov:59}
};
let active='hillside',frames=0,fps=0,ts=performance.now(),cnt=0;
function view(name){
 const v=views[name];if(!v)return;active=name;
 camera.position.set(...v.eye);camera.fov=v.fov;camera.lookAt(...v.target);
 camera.updateProjectionMatrix();
 for(const b of document.querySelectorAll('[data-view]'))b.classList.toggle('selected',b.dataset.view===name);
}
function resize(){
 const w=Math.max(innerWidth,1),h=Math.max(innerHeight,1);
 renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();
}
addEventListener('resize',resize);
for(const b of document.querySelectorAll('[data-view]'))b.addEventListener('click',()=>view(b.dataset.view));
resize();view('hillside');
renderer.setAnimationLoop(()=>{
 const now=performance.now();waterMat.uniforms.uTime.value=now*.001;sky.position.copy(camera.position);
 renderer.render(scene,camera);frames++;cnt++;
 if(now-ts>1400){fps=Math.round(cnt*1000/(now-ts));cnt=0;ts=now;
  document.getElementById('stats').textContent=
   signature.townBuildings+' modeled façades · '+signature.windowCount+' windows · '+
   signature.meshes+' batches · '+fps+' FPS (Edge software benchmark)';}
 if(frames>10&&palmReady)document.getElementById('loading').style.display='none';
});
window.SignatureArt={setView:view,state:()=>({
 realWebGL:!!renderer.getContext(),frames,fps,view:active,meshCount:signature.meshes,
 geometryTriangles:signature.triangles,bridgeGapMeters:signature.bridgeTipGapArtUnits,
 palmReady,palmInstances,palmError,signature,
 sourceTruth:'PHOTO_REFERENCED_ARTIST_BLOCKOUT_NOT_SURVEYED',
 visualApproval:'HOLD_OWNER_ART_REVIEW_REQUIRED',gameplayFrozen:true,playSiteUnchanged:true
})};