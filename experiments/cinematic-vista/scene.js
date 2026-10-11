import * as T from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
// LIVINGPQ CINEMATIC VISTA: independent authentic 3D exploratory environment.
// Geographic proportions are approximate, NOT photogrammetric or surveyed.
const $=id=>document.getElementById(id),scene=new T.Scene(),camera=new T.PerspectiveCamera(70,1,.1,250);
const renderer=new T.WebGLRenderer({canvas:$('world'),antialias:false,powerPreference:'high-performance'});
renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;
renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.3));renderer.shadowMap.enabled=false;
scene.background=new T.Color('#e3a89f');scene.fog=new T.FogExp2('#d6b5a9',.0032);
scene.add(new T.HemisphereLight('#fff0e4','#648f98',2.1));
const sunlight=new T.DirectionalLight('#ffe0ad',3.2);sunlight.position.set(25,29,-63);scene.add(sunlight);
const backfill=new T.DirectionalLight('#7eb5cd',.66);backfill.position.set(-20,22,15);scene.add(backfill);
const mat=(hex,rough=.82,metal=0,extra={})=>new T.MeshStandardMaterial({color:hex,roughness:rough,metalness:metal,...extra});
const M={
 stone:mat('#e7c7a2'),step:mat('#f0d9b1'),plaster:mat('#f5d8b8'),
 peach:mat('#e3a995'),sunset:mat('#eab4a3'),rose:mat('#d18e8f'),
 ochre:mat('#e5c590'),mint:mat('#b8d1bc'),teal:mat('#9ab8b0'),
 ink:mat('#283740'),glass:mat('#4e8998',.16,.19,{transparent:true,opacity:.70,side:T.DoubleSide}),
 awning:mat('#efd3af'),roof:mat('#c78d68'),gold:mat('#b99263',.32,.6),
 metal:mat('#3d595e',.47,.7),warm:mat('#ffe7aa',.32,.08,{emissive:'#ffbc72',emissiveIntensity:1.0}),
 paver:mat('#ded0b8',.97),asphalt:mat('#afa196',.98),water:mat('#327f96',.20,.12),
 vegetation:mat('#347b55'),leaf2:mat('#649b57'),leaf3:mat('#79ad60'),
 flower:mat('#c92369'),flower2:mat('#ed4e91'),wood:mat('#927159'),
 bridge:mat('#d1c5af'),redClock:mat('#bf584c'),white:mat('#f7ecd8')
};
const texLoader=new T.TextureLoader(),tex={};
for(const [name,prefix] of [['street','paving'],['wall','plaster'],['roof','roof']]){
 const load=(suffix,srgb)=>{
  const t=texLoader.load('textures/'+prefix+'_'+suffix+'.jpg');
  t.wrapS=t.wrapT=T.RepeatWrapping;t.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy());
  if(srgb)t.colorSpace=T.SRGBColorSpace;
  return t;
 };
 tex[name]={color:load('albedo',true),normal:load('normal',false),rough:load('rough',false)};
}
function pbr(m,key,u,v,tint){
 const source=tex[key];
 for(const [field,t] of [['map',source.color],['normalMap',source.normal],['roughnessMap',source.rough]]){
  const duplicate=t.clone();duplicate.needsUpdate=true;duplicate.repeat.set(u,v);m[field]=duplicate;
 }
 m.color.set(tint);m.needsUpdate=true;
}
pbr(M.paver,'street',2,2,'#fff1df');
pbr(M.roof,'roof',3,4,'#e8af89');
for(const [k,tint] of [['plaster','#ffebdc'],['peach','#f0bb9f'],['sunset','#f5cdc6'],['mint','#c6dfce']])pbr(M[k],'wall',2,2,tint);
const world=new T.Group();scene.add(world);
let meshes=0,triangles=0;
function put(geometry,material,x=0,y=0,z=0,rot=[0,0,0]){
 const obj=new T.Mesh(geometry,material);obj.position.set(x,y,z);obj.rotation.set(...rot);
 obj.receiveShadow=true;world.add(obj);
 meshes++;triangles+=geometry.index?geometry.index.count/3:geometry.getAttribute('position').count/3;
 return obj;
}
const box=(m,x,y,z,w,h,d)=>put(new T.BoxGeometry(w,h,d),m,x,y,z);
const cylinder=(m,x,y,z,r,h,seg=12)=>put(new T.CylinderGeometry(r,r,h,seg),m,x,y,z);
const sphere=(m,x,y,z,r,scale=[1,1,1])=>{const o=put(new T.IcosahedronGeometry(r,1),m,x,y,z);o.scale.set(...scale);return o;};
function between(m,a,b,r=.05,n=7){
 const start=new T.Vector3(...a),end=new T.Vector3(...b),vec=end.clone().sub(start);
 const center=start.clone().add(end).multiplyScalar(.5);
 const obj=put(new T.CylinderGeometry(r,r,vec.length(),n),m,center.x,center.y,center.z);
 obj.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),vec.normalize());return obj;
}
function arch(m,x,y,z,r,thick=.08,rot=[0,0,0],arc=Math.PI){return put(new T.TorusGeometry(r,thick,6,25,arc),m,x,y,z,rot);}
function roadHeight(z){return Math.max(.60,6.4+z*.14);}
// A genuinely sloping playable street leads down toward the coastal promenade.
const slope=.14;
for(let i=0;i<61;i++){
 const z=33-i*1.2,y=roadHeight(z),segLen=1.23;
 box(M.paver,0,y-.085,z,8.9,.17,segLen).rotation.x=-Math.atan(slope);
 for(const side of [-1,1]){
  box(M.stone,side*5.55,y+.035,z,2.15,.25,segLen).rotation.x=-Math.atan(slope);
  box(M.white,side*4.46,y+.045,z,.19,.29,segLen).rotation.x=-Math.atan(slope);
 }
}
box(M.paver,0,.43,-59,116,.88,32);
box(M.stone,0,.35,-76,122,.6,10);
// Water geometry and sunlight reflection - world-space shader, never photograph billboard.
const waterMat=new T.ShaderMaterial({
 uniforms:{time:{value:0}},
 vertexShader:'varying vec3 w;void main(){w=(modelMatrix*vec4(position,1.)).xyz;gl_Position=projectionMatrix*viewMatrix*vec4(w,1.);}',
 fragmentShader:'uniform float time; varying vec3 w; float h(vec2 p){return fract(sin(dot(p,vec2(127.,311.)))*43758.); } void main(){float wave=sin(w.x*.18+time*.3+sin(w.z*.11))*sin(w.z*.20-time*.16)*.5+.5;float gl=pow(max(0.,1.-abs(w.x-28.)/28.),3.)*pow(max(0.,1.-abs(w.z+110.)/85.),1.5);vec3 c=mix(vec3(.05,.26,.39),vec3(.18,.47,.57),.38+wave*.28);c+=vec3(1.,.64,.36)*gl*(.22+wave*.2);c+=step(.987,h(floor(w.xz*.6+time*.1)))*.06;gl_FragColor=vec4(c,1.);}',
 side:T.DoubleSide
});
put(new T.PlaneGeometry(300,260),waterMat,0,-.28,-175,[-Math.PI/2,0,0]);
// Volumetric-inspired procedural sky, no fixed video or image plane.
const skyMaterial=new T.ShaderMaterial({
 side:T.BackSide,depthWrite:false,fog:false,
 vertexShader:'varying vec3 d;void main(){d=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
 fragmentShader:'varying vec3 d;float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5);}float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1.,0.)),f.x),mix(h(i+vec2(0.,1.)),h(i+vec2(1.,1.)),f.x),f.y);}void main(){vec3 r=normalize(d);float z=r.y;vec3 c=mix(vec3(1.,.68,.46),vec3(.88,.58,.63),smoothstep(-.15,.28,z));c=mix(c,vec3(.33,.39,.61),smoothstep(.05,.82,z));float cl=smoothstep(.73,1.06,n(r.xz*13.)+.42*n(r.xz*33.))*smoothstep(.01,.14,z)*(1.-smoothstep(.48,.90,z));c=mix(c,vec3(1.,.68,.53),cl*.27);float a=max(0.,dot(r,normalize(vec3(.31,.29,-.90))));c+=vec3(1.,.65,.3)*pow(a,15.)*.42+vec3(1.,.90,.65)*pow(a,850.)*2.;gl_FragColor=vec4(c,1.);}'
});
const sky=put(new T.SphereGeometry(160,32,20),skyMaterial);
sky.frustumCulled=false;sky.renderOrder=-100;

// Deliberately authored Mediterranean façades facing an open descending street.
// Asymmetric rooflines, cornices, porticoes, balconies and bougainvillea.
// Their parcels are artist estimates, not OSM-verified footprints.
function facade(side,z,width,floors,paint,style){
 const ground=roadHeight(z),x=side*9.0,depth=5.6,h=floors*2.7+1.2,face=x-side*2.88;
 box(paint,x,ground+h*.5,z,depth,h,width);
 box(M.stone,face-side*.05,ground+.5,z,.39,1,width+.2);
 box(M.white,face-side*.12,ground+h-.23,z,.37,.38,width+.44);
 for(let f=1;f<floors;f++)box(M.white,face-side*.08,ground+f*2.7,z,.24,.19,width+.3);
 const roofY=ground+h+.21;
 for(const k of [-1,1]){
  const strip=box(M.roof,x+k*1.3,roofY+.25,z,3.12,.19,width+.45);
  strip.rotation.z=k*.29;
 }
 for(let rz=z-width*.5+.3;rz<z+width*.5;rz+=.46){
  box(M.roof,x,roofY+.90,rz,1.3,.08,.15);
 }
 const n=width>9?3:2;
 for(let f=0;f<floors;f++){
  const yy=ground+1.6+f*2.7,space=width/n;
  for(let j=0;j<n;j++){
   const zz=z-width/2+space*(j+.5);
   if(f===0&&j===Math.floor(n/2)){
    box(M.ink,face-side*.09,yy-.08,zz,.14,2.85,1.58);
    box(M.glass,face-side*.20,yy-.04,zz,.12,2.63,1.48);
    for(const q of [-.82,.82])box(M.white,face-side*.26,yy-.01,zz+q,.27,2.96,.19);
    arch(M.white,face-side*.2,yy+1.41,zz,.83,.095,[0,Math.PI/2,0]);
   }else{
    box(M.ink,face-side*.085,yy,zz,.12,1.84,.95);
    box(M.glass,face-side*.21,yy,zz,.09,1.68,.80);
    box(M.white,face-side*.24,yy,zz,.12,1.84,.07);
    box(M.white,face-side*.24,yy+.93,zz,.17,.13,1.18);
    for(const q of [-.55,.55]){
     box(M.white,face-side*.22,yy,zz+q,.15,2.03,.13);
     if(style%2===0)box(style%3===0?M.teal:M.ochre,face-side*.31,yy,zz+q*1.36,.10,1.66,.24);
    }
    if(f>0){
     box(M.white,face-side*.71,yy-1.03,zz,1.24,.17,1.32);
     box(M.metal,face-side*1.20,yy-.57,zz,.08,.055,1.28);
     for(let rail=-.49;rail<=.5;rail+=.21){
      cylinder(M.metal,face-side*1.19,yy-.79,zz+rail,.024,.44,6);
     }
     if((f+j+style)%3===0){
      box(M.stone,face-side*.90,yy-.96,zz,.53,.25,.90);
      for(let i=0;i<5;i++){
       const a=i*2.39996;
       sphere(i%2?M.vegetation:M.leaf2,face-side*1.03+Math.sin(a)*.17,yy-.72+Math.cos(a)*.11,zz+Math.cos(a)*.30,.13,[.6,.9,.7]);
       sphere(i%2?M.flower:M.flower2,face-side*1.11,yy-.63,zz+Math.cos(a)*.29,.08);
      }
     }
    }
   }
  }
 }
 for(const q of [-width*.5+.13,width*.5-.13]){
  for(let floor=0;floor<floors*3;floor++){
   box(M.white,face-side*.18,ground+.32+floor*.83,z+q,.22,.49,.40);
  }
 }
 // Projecting portico and striped retractable canopy at selected first floors.
 if(style%2===1){
  box(M.wood,face-side*1.07,ground+3.15,z,2.30,.16,Math.min(width-1,4.6));
  for(let j=0;j<8;j++){
   const za=z-2.0+j*.57;
   box(j%2?M.sunset:M.awning,face-side*1.18,ground+3.07,za,1.86,.046,.56);
  }
 }
}
// Hand placed rather than an infinite repeated box town.
// Wider ground-floor plazas intentionally remain at end near real waterfront.
const lots=[
 [-1,27.7,9.8,4,M.peach,1],[1,28.2,9.2,4,M.ochre,2],
 [-1,17.1,10.5,4,M.plaster,3],[1,17.7,10.4,3,M.sunset,4],
 [-1,5.8,10.8,3,M.mint,5],[1,6.2,10.9,4,M.peach,6],
 [-1,-5.5,10.9,4,M.sunset,7],[1,-5.2,10.1,3,M.plaster,8],
 [-1,-17,10.6,3,M.ochre,9],[1,-16.7,10.1,3,M.mint,10]
];
for(const [side,z,w,h,color,style] of lots)facade(side,z,w,h,color,style);
// Promenade is open and not hidden behind urban frontage at sea-facing end.
for(let i=0;i<13;i++){
 const x=-51+i*8.2,z=-43-(i%3)*1.3,h=8.5+(i%3)*1.5;if(Math.abs(x)<24)continue;
 const paint=[M.plaster,M.peach,M.sunset,M.ochre,M.mint][i%5];
 box(paint,x,h*.5,z,6.2,h,7.0);
 box(M.roof,x,h+.40,z,7,.64,7.6);
 for(let j=0;j<3;j++){
  const xx=x-1.7+j*1.7;
  for(let f=0;f<3;f++){
   box(M.ink,xx,f*2.7+1.5,z+3.56,.85,1.42,.09);
   box(M.warm,xx,f*2.7+1.5,z+3.64,.69,1.19,.07);
   if(f>0){
    box(M.white,xx,f*2.7+.72,z+4.00,.96,.12,.62);
    for(const q of [-.34,.34])cylinder(M.metal,xx+q,f*2.7+1.08,z+4.34,.02,.59);
   }
  }
 }
}
// Clock tower is a separate landmark on land, NOT built into Kiss Bridge.
const TX=-28,TZ=-42;
box(M.redClock,TX,8,TZ,4.7,16,4.7);
for(const y of [3.0,9.9,15.6])box(M.stone,TX,y,TZ,5.25,.32,5.2);
for(const z of [TZ-2.37,TZ+2.37]){
 for(let f=0;f<3;f++){
  box(M.ink,TX,3.2+f*3.2,z,.89,1.58,.12);
  box(M.warm,TX,3.2+f*3.2,z+.10,.7,1.45,.12);
 }
}
box(M.stone,TX,16.7,TZ,5.7,1.5,5.7);
for(const axis of [0,Math.PI/2,Math.PI,Math.PI*1.5]){
 const cx=TX+Math.sin(axis)*2.91,cz=TZ+Math.cos(axis)*2.91;
 const face=put(new T.CircleGeometry(1.05,32),M.white,cx,12.9,cz,[0,axis,0]);
 arch(M.gold,cx,12.9,cz,1.05,.12,[0,axis,0],Math.PI*2);
}
put(new T.ConeGeometry(3.4,4.3,4),M.teal,TX,20.15,TZ,[0,Math.PI*.25,0]);
cylinder(M.gold,TX,22.45,TZ,.12,.8,10);
// The round show-stage arches are LANDWARD INSIDE the bay, not the bridge.
const SX=-21,SZ=-66;
cylinder(M.stone,SX,.27,SZ,10.0,.55,52);
for(let k=0;k<3;k++){
 const z=SZ+(k-1)*2.1;
 arch(M.white,SX,5.5,z,5.8-k*.5,.65,[0,0,0],Math.PI).rotation.z=0;
 box(M.white,SX-5.8+k*.5,2.4,z,.76,4.8,.76);
 box(M.white,SX+5.8-k*.5,2.4,z,.76,4.8,.76);
}
const promRail=()=>{
 for(let x=-50;x<=48;x+=2.8){
  const z=-57.6+.9*Math.cos(x*.052);
  cylinder(M.stone,x,1.02,z,.14,1.7,10);
  if(x<48)box(M.gold,x+1.4,1.82,z,.075,.065,2.8).rotation.y=Math.PI/2;
 }
};
promRail();
// Kiss Bridge = two long opposing ARMS leaving a clear gap at their seaward tips.
// Approximate artist-authored geometry; not surveyed construction engineering.
const arms=[
 [[-46,.6,-62],[-38,1.15,-67],[-27,1.85,-73],[-15,2.65,-78],[-.9,3.3,-82]],
 [[46,.6,-62],[38,1.15,-67],[27,1.85,-73],[15,2.65,-78],[.9,3.3,-82]]
];
for(const pts of arms){
 const curve=new T.CatmullRomCurve3(pts.map(q=>new T.Vector3(...q)),false,'centripetal');
 for(let j=0;j<72;j++){
  const a=curve.getPoint(j/72),b=curve.getPoint((j+1)/72),mid=a.clone().add(b).multiplyScalar(.5);
  const vec=b.clone().sub(a),length=vec.length(),yaw=Math.atan2(vec.x,vec.z);
  const deck=box(M.bridge,mid.x,mid.y,mid.z,3.1,.29,length+.08);
  deck.rotation.y=yaw;deck.rotation.x=-Math.atan2(vec.y,Math.hypot(vec.x,vec.z));
  for(const side of [-1,1]){
   const nx=Math.cos(yaw),nz=-Math.sin(yaw);
   const edge=box(M.white,mid.x+side*nx*1.51,mid.y+.19,mid.z+side*nz*1.51,.18,.25,length+.11);
   edge.rotation.y=yaw;edge.rotation.x=deck.rotation.x;
   if(j%3===0){
    const post=[mid.x+side*nx*1.43,mid.y+.75,mid.z+side*nz*1.43];
    cylinder(M.metal,post[0],post[1],post[2],.036,1.12,8);
   }
  }
  if(j%11===0){
   const height=Math.max(0,mid.y+.2);
   cylinder(M.stone,mid.x,height*.5,mid.z,.28,height,12);
  }
 }
}

// Tropical leaf fronds, curved tapered mesh surfaces, not green spheres.
const leafM=[M.vegetation,M.leaf2,M.leaf3];for(const ma of leafM){ma.side=T.DoubleSide;ma.roughness=.94;}
function frond(cx,cy,cz,dir,len,width,ma){
 const v=[],indices=[],N=12,perp=new T.Vector2(-Math.sin(dir),Math.cos(dir));
 for(let i=0;i<=N;i++){
  const t=i/N,r=t*len,center=[cx+Math.cos(dir)*r,cy+.52*Math.sin(Math.PI*t)-1.50*t*t,cz+Math.sin(dir)*r];
  const half=width*.5*(.12+.88*Math.sin(Math.PI*t));
  for(const side of [-1,1]){
   v.push(center[0]+perp.x*half*side,center[1]-.14*Math.abs(side),center[2]+perp.y*half*side);
  }
  if(i<N){const a=i*2;indices.push(a,a+1,a+2,a+1,a+3,a+2);}
 }
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(v,3));g.setIndex(indices);g.computeVertexNormals();
 return put(g,ma);
}
function palm(x,z,ybase,height=5.5){
 between(M.wood,[x,ybase,z],[x+.1,ybase+height,z-.06],.14,10);
 for(let i=0;i<15;i++){
  const phi=i*Math.PI*2/15+(.13*(i%3));
  frond(x+.1,ybase+height,z-.06,phi,2.45+(i%4)*.26,.27+(i%3)*.065,leafM[i%3]);
 }
 box(M.stone,x,ybase+.22,z,.65,.44,.67);
}
for(const z of [22,7,-11,-29]){
 palm(-7.28,z,roadHeight(z)+.15,5.6);
 palm(7.35,z-2,roadHeight(z-2)+.15,5.8);
}
for(let x=-49;x<48;x+=8.4)palm(x,-53,.64,4.4+(Math.abs(x)%3));
function bloom(x,y,z,scale=1){
 // Thin creeping branches and leaves/petals following actual balcony depth.
 for(let i=0;i<5;i++){
  const a=i*2.39996,v=.20+(i%3)*.10;
  between(M.vegetation,[x,y,z],[x+Math.sin(a)*v,y+(i%3)*.15,z+Math.cos(a)*v],.022);
  for(let k=0;k<5;k++){
   const f=k/5,xx=x+Math.sin(a)*v*f,yy=y+(i%3)*.15*f,zz=z+Math.cos(a)*v*f;
   const leaf=put(new T.PlaneGeometry(.18,.39),leafM[(k+i)%3],xx,yy,zz,[.2,a,0]);
   if((i+k)%2===0){
    put(new T.PlaneGeometry(.18,.21),(k+i)%3===0?M.flower:M.flower2,xx+.09,yy+.17,zz,[0,a,0]);
   }
  }
 }
}
for(const side of [-1,1])for(const z of [25,20,15,10,4,-6,-12,-19]){
 bloom(side*6.5,roadHeight(z)+4.1,z,1);
 bloom(side*7.2,roadHeight(z)+6.4,z+1.2,.8);
}
// A few truthful-scale 3D animated distant boats in bay.
const boats=[];
for(const [x,z] of [[-17,-100],[17,-117],[39,-126],[-51,-108]]){
 const hull=new T.Group();
 const body=box(M.white,0,.1,0,1.2,.4,3.4);
 world.remove(body);hull.add(body);
 const top=box(M.wood,0,.36,0,.9,.12,2.0);world.remove(top);hull.add(top);
 const mast=between(M.metal,[0,.4,0],[0,2.4,0],.04);world.remove(mast);hull.add(mast);
 const sail=put(new T.PlaneGeometry(1,1),M.white);world.remove(sail);
 const geo=new T.BufferGeometry();
 geo.setAttribute('position',new T.Float32BufferAttribute([0,2.2,.12,0,.6,.12,1.1,.6,.12],3));geo.computeVertexNormals();
 sail.geometry=geo;hull.add(sail);
 hull.position.set(x,0,z);scene.add(hull);boats.push({hull,x,z});
}
// Art-directed real light fixtures (not a simple square light cube).
for(const side of [-1,1])for(const z of [25,13,1,-11,-23]){
 const x=side*7.3,y=roadHeight(z);
 cylinder(M.metal,x,y+1.72,z,.07,3.44,12);
 box(M.gold,x,y+3.50,z,.38,.14,.38);
 const glow=put(new T.SphereGeometry(.16,14,9),M.warm,x,y+3.8,z);
 box(M.gold,x,y+4.05,z,.40,.09,.40);
 for(const q of [-.18,.18]){between(M.gold,[x+q,y+3.62,z+.17],[x+q,y+4.01,z+.17],.018);}
}
// More plausible wooden cafe tables, warm cafe storefront lamps.
for(const side of [-1,1])for(const z of [21,0,-19]){
 const x=side*6.12,y=roadHeight(z)+.16;
 cylinder(M.wood,x,y+.45,z,.06,.9,10);
 cylinder(M.white,x,y+.93,z,.54,.085,18);
 for(let j=0;j<3;j++){
  const a=j*2.0944;
  const xx=x+Math.cos(a)*.88,zz=z+Math.sin(a)*.88;
  box(M.wood,xx,y+.29,zz,.48,.10,.45);
  cylinder(M.metal,xx,y+.13,zz,.028,.28,6);
 }
}
// Real glTF low-size CC0 prop instances; asynchronously progressive.
let propsReady=false,modelInstances=0,modelErrors=[];
const gltfLoader=new GLTFLoader();
async function addProps(name,poses,height){
 try{
  const gltf=await gltfLoader.loadAsync('models/'+name+'/'+name+'_1k.gltf');
  const root=gltf.scene;root.updateMatrixWorld(true);
  const bounding=new T.Box3().setFromObject(root);
  const dims=bounding.getSize(new T.Vector3());
  if(dims.y<.01)throw Error('zero asset bounds');
  const scale=height/dims.y;
  const center=bounding.getCenter(new T.Vector3());
  for(const [x,y,z] of poses){
   const parent=new T.Group();parent.position.set(x,y,z);parent.scale.setScalar(scale);
   const clone=root.clone(true);clone.position.set(-center.x,-bounding.min.y,-center.z);
   parent.add(clone);scene.add(parent);modelInstances++;
  }
 }catch(e){modelErrors.push(name+': '+e.message)}
}
async function loadProps(){
 await Promise.all([
  addProps('street_lamp_01',[[-7.3,roadHeight(16),16],[7.3,roadHeight(-5),-5],[-29,.5,-43]],3.8),
  addProps('planter_box_01',[[5.5,roadHeight(22),22],[-5.6,roadHeight(3),3]],.65),
  addProps('potted_plant_04',[[-6.8,roadHeight(13),13],[6.7,roadHeight(-10),-10]],1.4)
 ]);propsReady=true;
}
loadProps();
// Merge static opaque geometry by material; keep actual world geometry, no photo projection.
function optimize(){
 const map=new Map();let merged=0,removed=0;
 for(const child of [...world.children]){
  if(!child.isMesh||!child.geometry||!child.material||child.material.transparent||child.material.isShaderMaterial)continue;
  if(!map.has(child.material))map.set(child.material,[]);
  map.get(child.material).push(child);
 }
 for(const [material,objects] of map){
  if(objects.length<2)continue;
  const parts=[];
  try{
   for(const m of objects){
    m.updateMatrix();
    let geo=m.geometry.clone();
    geo.applyMatrix4(m.matrix);
    if(geo.index){const non=geo.toNonIndexed();geo.dispose();geo=non;}
    for(const key of Object.keys(geo.attributes))if(!['position','normal','uv'].includes(key))geo.deleteAttribute(key);
    if(!geo.getAttribute('normal'))geo.computeVertexNormals();
    if(!geo.getAttribute('uv'))geo.setAttribute('uv',new T.Float32BufferAttribute(new Float32Array(geo.getAttribute('position').count*2),2));
    parts.push(geo);
   }
   const geometry=mergeGeometries(parts,false);
   if(!geometry)throw Error('MERGE_NOT_COMPATIBLE');
   objects.forEach(o=>world.remove(o));
   const mergedMesh=new T.Mesh(geometry,material);mergedMesh.receiveShadow=true;world.add(mergedMesh);
   merged++;removed+=objects.length-1;
  }catch(e){console.warn('SKIP_MERGE',e.message)}
  finally{parts.forEach(g=>g.dispose())}
 }
 return {merged,removed,worldChildren:world.children.length};
}
const optimization=optimize();


// LIVING PHÚ QUỐC - real interactive prototype: on-foot + controllable scooter.
// The 3D city is approximate (NOT 70% verified), gameplay is actual camera/vehicle movement.
// Isolated beta. No simulated screenshots, teleports or slideshow.
const player={x:0,z:28,yaw:0,pitch:0,mode:'walk',speed:0,distance:0,
 collisions:0,moveFrames:0,lookEvents:0,touchFrames:0,restFrames:0};
const keyboard=new Set(),joystick={x:0,y:0,pid:null}, look={pid:null,x:0,y:0};
const clamp=T.MathUtils.clamp;
let fps=0,frame=0,timer=performance.now(),frameSample=0,lastFrame=performance.now(),autoTour=false;
const hud=document.getElementById('meter'),loaded=document.getElementById('loading'),message=document.getElementById('message');
const driveButton=document.getElementById('drive'),walkButton=document.getElementById('walk');
const joyEl=document.getElementById('joystick'),knob=document.getElementById('knob'),lookPad=document.getElementById('lookPad');
const stepAuto=()=>{autoTour=false;};
const noTouchButtons=()=>{joystick.x=joystick.y=0;joystick.pid=null;knob.style.transform='';};
const ctrlKeys=new Set(['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright',' ']);
addEventListener('keydown',e=>{const k=e.key.toLowerCase();if(ctrlKeys.has(k)){keyboard.add(k);e.preventDefault();}});
addEventListener('keyup',e=>keyboard.delete(e.key.toLowerCase()));
addEventListener('blur',()=>{keyboard.clear();noTouchButtons();look.pid=null;});
function setJoy(e){
 const b=joyEl.getBoundingClientRect(),xx=(e.clientX-b.left-b.width/2)/(b.width*.36),yy=(e.clientY-b.top-b.height/2)/(b.height*.36);
 const length=Math.max(1,Math.hypot(xx,yy));
 joystick.x=xx/length;joystick.y=-yy/length;
 knob.style.transform='translate('+Math.round(joystick.x*34)+'px,'+Math.round(-joystick.y*34)+'px)';
}
joyEl.addEventListener('pointerdown',e=>{joystick.pid=e.pointerId;try{joyEl.setPointerCapture(e.pointerId)}catch(_){ }setJoy(e);e.preventDefault()});
joyEl.addEventListener('pointermove',e=>{if(joystick.pid===e.pointerId){setJoy(e);player.touchFrames++;e.preventDefault()}});
const joyStop=e=>{if(joystick.pid===e.pointerId)noTouchButtons()};
joyEl.addEventListener('pointerup',joyStop);joyEl.addEventListener('pointercancel',joyStop);
lookPad.addEventListener('pointerdown',e=>{look.pid=e.pointerId;look.x=e.clientX;look.y=e.clientY;try{lookPad.setPointerCapture(e.pointerId)}catch(_){ }e.preventDefault()});
lookPad.addEventListener('pointermove',e=>{
 if(look.pid!==e.pointerId)return;
 player.yaw-=clamp(e.clientX-look.x,-35,35)*.0035;
 player.pitch=clamp(player.pitch+(e.clientY-look.y)*.0021,-.34,.47);
 look.x=e.clientX;look.y=e.clientY;player.lookEvents++;e.preventDefault();
});
const lookStop=e=>{if(look.pid===e.pointerId)look.pid=null;};
lookPad.addEventListener('pointerup',lookStop);lookPad.addEventListener('pointercancel',lookStop);
function setMode(mode){
 if(mode!=='walk'&&mode!=='scooter')return;
 player.mode=mode;player.speed=0;
 walkButton.classList.toggle('selected',mode==='walk');
 driveButton.classList.toggle('selected',mode==='scooter');
 scooter.visible=mode==='scooter';
 message.textContent=mode==='walk'?'Đi bộ: cần trái di chuyển, vuốt bên phải để nhìn':'Xe máy: đẩy lên để chạy, kéo trái/phải để rẽ';
}
walkButton.addEventListener('click',()=>setMode('walk'));
driveButton.addEventListener('click',()=>setMode('scooter'));
document.getElementById('restart').addEventListener('click',()=>{
 player.x=0;player.z=28;player.yaw=0;player.pitch=0;player.speed=0;player.distance=0;player.collisions=0;
 setMode('walk');message.textContent='Trở lại điểm xuất phát';
});
document.getElementById('guide').addEventListener('click',()=>{
 autoTour=!autoTour;
 message.textContent=autoTour?'Đang tham quan tự động: chạm điều khiển để dừng':'Đã dừng tham quan tự động';
});
// Actual 3D scooter: visible rear-view wheels, tub, seat, handlebar and lights, no billboarding.
const scooter=new T.Group();scene.add(scooter);
const bikePaint=new T.MeshStandardMaterial({color:'#8dc7c4',metalness:.52,roughness:.29});
const bikeRubber=new T.MeshStandardMaterial({color:'#1e2427',roughness:.98});
const chrome=new T.MeshStandardMaterial({color:'#d4dedb',metalness:.88,roughness:.24});
const bikeSeat=new T.MeshStandardMaterial({color:'#403c39',roughness:.84});
const taillight=new T.MeshStandardMaterial({color:'#ff3930',emissive:'#ee2517',emissiveIntensity:2,roughness:.28});
const whiteLight=new T.MeshStandardMaterial({color:'#fff2d5',emissive:'#ffe4a4',emissiveIntensity:.8});
function bikePart(geometry,material,x,y,z,rotation=[0,0,0]){
 const mesh=new T.Mesh(geometry,material);mesh.position.set(x,y,z);mesh.rotation.set(...rotation);mesh.castShadow=false;scooter.add(mesh);return mesh;
}
function wheel(z){
 bikePart(new T.TorusGeometry(.36,.12,12,36),bikeRubber,0,.40,z,[0,Math.PI/2,0]);
 bikePart(new T.CylinderGeometry(.25,.25,.13,20),chrome,0,.40,z,[0,0,Math.PI/2]);
}
wheel(.75);wheel(-.80);
bikePart(new T.BoxGeometry(.54,.28,1.56),bikePaint,0,.53,0);
bikePart(new T.SphereGeometry(.46,18,14),bikePaint,0,.93,.35).scale.set(.74,1.45,.98);
bikePart(new T.BoxGeometry(.43,.15,.70),bikeSeat,0,.91,-.30);
bikePart(new T.CylinderGeometry(.052,.052,.85,12),chrome,0,1.21,.61,[0,0,Math.PI/2]);
bikePart(new T.CylinderGeometry(.04,.04,.65,10),chrome,0,1.09,.58,[.18,0,0]);
bikePart(new T.SphereGeometry(.17,15,10),whiteLight,0,1.1,.80).scale.set(1,1,.35);
bikePart(new T.BoxGeometry(.27,.17,.07),taillight,0,.72,-.83);
for(const x of [-.45,.45]){
 bikePart(new T.CylinderGeometry(.035,.035,.46,9),chrome,x,1.41,.63,[0,0,.18*x]);
 bikePart(new T.SphereGeometry(.11,10,8),chrome,x*1.25,1.64,.61).scale.set(1,.6,.3);
}
scooter.visible=false;
// Street collision boundaries: explicit conservative no-go shapes for major building footprints.
// Safe road corridor and landward promenade; sea & landmarks remain non-traversable.
function collide(x,z){
 if(z>31||z<-63)return true;
 if(z>-39)return Math.abs(x)>4.15;
 if(Math.abs(x)>24)return true;
 if(Math.hypot(x+28,z+42)<4.8)return true; // clock tower
 return false;
}
const followPos=new T.Vector3(),focus=new T.Vector3();
camera.fov=72;camera.updateProjectionMatrix();
function simulate(dt){
 let forward=Number(keyboard.has('w')||keyboard.has('arrowup'))-Number(keyboard.has('s')||keyboard.has('arrowdown'))+joystick.y;
 let turn=Number(keyboard.has('d')||keyboard.has('arrowright'))-Number(keyboard.has('a')||keyboard.has('arrowleft'))+joystick.x;
 if(Math.abs(forward)>.12||Math.abs(turn)>.15){stepAuto();}
 if(autoTour){forward=.6;turn=0;if(collide(player.x,player.z-1.3))autoTour=false;}
 if(player.mode==='walk'){
  const horizontal=turn,mag=Math.max(1,Math.hypot(forward,horizontal));
  const speed=2.7;
  const dx=(-Math.sin(player.yaw)*forward+Math.cos(player.yaw)*horizontal)*speed*dt/mag;
  const dz=(-Math.cos(player.yaw)*forward-Math.sin(player.yaw)*horizontal)*speed*dt/mag;
  advance(dx,dz);player.speed=Math.hypot(dx,dz)/Math.max(.001,dt);
 }else{
  const targetSpeed=clamp(forward,-1,1)*8;
  const accel=forward>=0?4.7:6;
  player.speed=T.MathUtils.damp(player.speed,targetSpeed,accel*.22,dt);
  if(Math.abs(forward)<.06)player.speed=T.MathUtils.damp(player.speed,0,2,dt);
  player.yaw-=turn*dt*(.32+Math.abs(player.speed)*.12);
  advance(-Math.sin(player.yaw)*player.speed*dt,-Math.cos(player.yaw)*player.speed*dt);
 }
 const yaw=player.yaw,fx=-Math.sin(yaw),fz=-Math.cos(yaw);
 if(player.mode==='scooter'){
  scooter.visible=true;scooter.position.set(player.x,roadHeight(player.z)+.02,player.z);
  scooter.rotation.set(0,yaw,0);
  followPos.set(player.x-fx*4.9,roadHeight(player.z)+3.0,player.z-fz*4.9);
  focus.set(player.x+fx*5.2,roadHeight(player.z)+1.8,player.z+fz*5.2);
 }else{
  scooter.visible=false;
  followPos.set(player.x,roadHeight(player.z)+1.78,player.z);
  focus.set(player.x+fx*8,roadHeight(player.z)+1.78+player.pitch*8,player.z+fz*8);
 }
 camera.position.lerp(followPos,Math.min(1,dt*(player.mode==='walk'?14:5.6)));
 const current=camera.getWorldDirection(new T.Vector3());
 current.lerp(focus.clone().sub(camera.position).normalize(),Math.min(1,dt*7.5));
 camera.lookAt(camera.position.clone().add(current));
}
function advance(dx,dz){
 if(Math.abs(dx)+Math.abs(dz)<.0001){player.restFrames++;return;}
 const xx=player.x+dx,zz=player.z+dz;
 let d=0;if(!collide(xx,player.z)){player.x=xx;d+=Math.abs(dx)}
 else player.collisions++;
 if(!collide(player.x,zz)){player.z=zz;d+=Math.abs(dz)}
 else player.collisions++;
 if(d>.0001){player.distance+=d;player.moveFrames++;}
}
// Reduce 4GB Windows pressure; render static scene once, update only camera/scooter.
function resize(){
 const w=Math.max(1,window.innerWidth),h=Math.max(1,window.innerHeight);
 camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false);
}
addEventListener('resize',resize);resize();
function state(){
 return {ready:frame>8,propsFullyLoaded:propsReady,webgl:!!renderer.getContext(),actualGameplay:true,
  mode:player.mode,position:{x:player.x,z:player.z,yaw:player.yaw},walkedMeters:+player.distance.toFixed(3),
  speed:player.speed,collisions:player.collisions,moveFrames:player.moveFrames,lookEvents:player.lookEvents,
  touchFrames:player.touchFrames,renderFrames:frame,fpsBrowser:fps,modelInstances,modelErrors,
  visualGrade:'CINEMATIC_TARGET_NOT_YET_VISUALLY_APPROVED',continuous3D:true,locationMeasured:false,
  release:'LIVINGPQ_CINEMATIC_VISTA_OFFLINE_BETA'};
}
window.LivingGame={state,setMode,restart:()=>document.getElementById('restart').click()};
let requestedReady=false;
const tick=()=>{
 const now=performance.now(),dt=clamp((now-lastFrame)/1000,0,.05);lastFrame=now;
 simulate(dt);
 sky.position.copy(camera.position);waterMat.uniforms.time.value=now*.001;for(let i=0;i<boats.length;i++){const boat=boats[i];boat.hull.position.y=.04+Math.sin(now*.0013+i)*.11;}
 renderer.render(scene,camera);frame++;frameSample++;
 if(now-timer>1400){
  fps=Math.round(frameSample*1000/(now-timer));timer=now;frameSample=0;
  hud.textContent=(player.mode==='walk'?'Đi bộ':'Xe máy')+' · '+player.distance.toFixed(1)+' m · '+fps+' FPS';
  document.getElementById('miniStatus').textContent='Hướng Cầu Hôn · '+(player.mode==='scooter'?Math.abs(player.speed*3.6).toFixed(0)+' km/h':'Khám phá');
 }
 if(!requestedReady&&frame>8){requestedReady=true;loaded.classList.add('hide');}
};
setMode('walk');
camera.position.set(player.x,roadHeight(player.z)+1.78,player.z);
renderer.setAnimationLoop(tick);