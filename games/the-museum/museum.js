


const {GLTFLoader}=LoaderKit;
const $=id=>document.getElementById(id);
const animatedExhibits=[];
const rooms=[
['Entrance Hall',0,-12.5,0],['Long White Corridor',0,14.5,0],['Tiger & Macaw Gallery',0,35,0],['Biplane Junction',0,59.5,0],['Underwater Portholes',0,88.5,0],['Pheasant & Camera Gallery',0,110.5,0],['Sports Car Atrium',0,138,0],['T. rex Star Dome',0,181,0],['Biome & Macaw Annex',0,233,0],
['Mammals & Predators',-49,40,1],['Elephant Great Hall',-49,80,1],['Geology & Volcanoes',-49,121,1],['Fossils & Skeletons',-49,165,1],['Birds & Jungle',-49,216,1],
['Marine Life',49,43,2],['Reptile Hall',49,83,2],['Earth & Geography',49,123,2],['Flight & Inventions',49,150,2],['Astronomy',49,184,2],['Optical Illusions',49,226,2]];
const scene=new THREE.Scene(); scene.background=new THREE.Color('#dbe5eb');scene.fog=new THREE.FogExp2('#e9f1f3',.0018);
const eyeHeight=1.82;
const cam=new THREE.PerspectiveCamera(78,innerWidth/innerHeight,.06,1000);const player=new THREE.Object3D();scene.add(player);player.position.set(0,eyeHeight,12);player.add(cam);cam.position.set(0,0,0);
const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setSize(innerWidth,innerHeight);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.35;renderer.shadowMap.enabled=false;$('stage').append(renderer.domElement);
scene.add(new THREE.HemisphereLight(0xffffff,0xc5d2db,3.2)); const sun=new THREE.DirectionalLight(0xffffff,2);sun.position.set(90,220,90);scene.add(sun);
const fillA=new THREE.DirectionalLight(0xffffff,1.0);fillA.position.set(-40,80,-90);scene.add(fillA);
let museum=null,yaw=0,pitch=0,fly=false,lowDetail=false,ready=false,last=performance.now();const keys=new Set();let joyX=0,joyY=0;
function setRoom(){const wx=player.position.x, originalY=-player.position.z;let best=rooms[0],dist=Infinity;for(const r of rooms){const d=(r[1]-wx)**2+(r[2]-originalY)**2;if(d<dist){best=r;dist=d;}}$('roomname').textContent=best[0];$('coords').textContent=`X ${wx.toFixed(1)}  ·  Y ${originalY.toFixed(1)}  ·  HEIGHT ${player.position.y.toFixed(1)}`;}
const jump=$('jump');for(const r of rooms){const op=document.createElement('option');op.value=r[0];op.textContent=r[0];jump.append(op);}jump.addEventListener('change',()=>{const r=rooms.find(x=>x[0]===jump.value);if(r)teleport(r);jump.value='';});
function teleport(r){
  inputX=inputZ=0;
  const candidates=[[0,0],[0,-3],[3,0],[-3,0],[0,3]];
  const offset=candidates.find(([x,z])=>!checkCollision(r[1]+x,-r[2]+z));
  if(offset)player.position.set(r[1]+offset[0],eyeHeight,-r[2]+offset[1]);
  yaw=0;pitch=0;applyCamera();setRoom();
}
function applyCamera(){player.rotation.y=yaw;cam.rotation.x=pitch;}
const lock=()=>{if(!ready||discoveryOpen||aquariumActive||usingPad||matchMedia('(pointer:coarse)').matches)return;renderer.domElement.requestPointerLock?.()?.catch?.(()=>{});};renderer.domElement.addEventListener('click',lock);document.addEventListener('mousemove',e=>{if(document.pointerLockElement!==renderer.domElement)return;yaw-=e.movementX*.00235;pitch=Math.max(-1.52,Math.min(1.52,pitch-e.movementY*.00235));applyCamera();});
document.addEventListener('keydown',e=>{if(discoveryOpen)return;if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault();keys.add(e.code);if(e.repeat)return;if(e.code==='KeyM')toggleMap();if(e.code==='KeyF')toggleFly();if(e.code==='KeyH')toggleHelp();});document.addEventListener('keyup',e=>keys.delete(e.code));window.addEventListener('blur',()=>keys.clear());
function toggleMap(){const el=$('mapWrap');el.style.display=el.style.display==='block'?'none':'block';drawMap();}function toggleHelp(){const el=$('help');el.style.display=el.style.display==='flex'?'none':'flex';}
function toggleFly(){fly=!fly;$('flyButton').textContent=fly?'FLY MODE · F':'WALK MODE · F';if(!fly && checkCollision(player.position.x,player.position.z))teleport([...rooms].sort((a,b)=>(a[1]-player.position.x)**2+(a[2]+player.position.z)**2-((b[1]-player.position.x)**2+(b[2]+player.position.z)**2))[0]);if(!fly)player.position.y=eyeHeight;}
$('mapButton').onclick=toggleMap;$('flyButton').onclick=toggleFly;$('helpButton').onclick=toggleHelp;$('closeHelp').onclick=toggleHelp;
$('qualityButton').onclick=()=>{lowDetail=!lowDetail;if(museum)museum.traverse(o=>{if(o.isMesh&&o.userData.isAccent)o.visible=!lowDetail;});renderer.setPixelRatio(lowDetail?Math.min(devicePixelRatio,1):Math.min(devicePixelRatio,1.5));$('qualityButton').textContent=lowDetail?'DETAIL: FAST':'DETAIL: HIGH';};
function drawMap(){const canvas=$('map'),c=canvas.getContext('2d'),w=canvas.width,h=canvas.height;c.clearRect(0,0,w,h);c.fillStyle='#101d29';c.fillRect(0,0,w,h);const cv=(x,y)=>[w/2+x*2.75,h-40-(y+25)*1.55];
 for(const r of rooms){const [x,y]=cv(r[1],r[2]);c.fillStyle=r[0].includes('Dome')?'#8c7650':'#2d475c';c.strokeStyle='#91a9b8';c.lineWidth=1.8;const rw=r[3]===0?52:58;c.fillRect(x-rw/2,y-11,rw,22);c.strokeRect(x-rw/2,y-11,rw,22);c.fillStyle='#e6edf2';c.font='12px system-ui';c.textAlign='center';const label=r[0].replace(' Gallery','').replace(' & ','/');c.fillText(label.length>15?label.slice(0,15)+'…':label,x,y+3);}
 const [px,py]=cv(player.position.x,-player.position.z);c.beginPath();c.arc(px,py,7,0,2*Math.PI);c.fillStyle='#ffdc91';c.fill();c.strokeStyle='#1c2630';c.lineWidth=2;c.stroke();c.beginPath();c.moveTo(px,py);c.lineTo(px-Math.sin(yaw)*18,py-Math.cos(yaw)*18);c.strokeStyle='#ffe3a7';c.lineWidth=3;c.stroke();}
$('map').onclick=e=>{const rect=e.target.getBoundingClientRect(),x=e.offsetX*e.target.width/rect.width,y=e.offsetY*e.target.height/rect.height;let best=null,dist=1e9;for(const r of rooms){const px=232+r[1]*2.75,py=520-40-(r[2]+25)*1.55,d=(x-px)**2+(y-py)**2;if(d<dist){dist=d;best=r;}}if(best&&dist<850)teleport(best);};
function animate(t) {
  requestAnimationFrame(animate);
  const dt=Math.min((t-last)/1000,.05);
  last=t;
  const [stickX,stickZ,rise,descend,sprint]=controllerInput(dt);
  if(ready&&!aquariumActive&&!discoveryOpen&&!menuOpen()){
    const dx=Number(keys.has('KeyD'))-Number(keys.has('KeyA'))+joyX+stickX;
    const dz=Number(keys.has('KeyS'))-Number(keys.has('KeyW'))-joyY+stickZ;
    const magnitude=Math.max(1,Math.hypot(dx,dz));
    const response=1-Math.exp(-dt*16);
    inputX+=(dx/magnitude-inputX)*response;
    inputZ+=(dz/magnitude-inputZ)*response;
    const running=keys.has('ShiftLeft')||keys.has('ShiftRight')||sprint;
    const speed=(running?runSpeed:walkSpeed)*dt;
    const move=new THREE.Vector3(
      (Math.cos(yaw)*inputX+Math.sin(yaw)*inputZ)*speed,
      0,
      (-Math.sin(yaw)*inputX+Math.cos(yaw)*inputZ)*speed
    );
    const fromX=player.position.x, fromZ=player.position.z;
    movePlayer(move);
    const moved=Math.hypot(player.position.x-fromX,player.position.z-fromZ);
    updateFootsteps(!fly&&Math.hypot(dx,dz)>.05?moved:0,running);
    if(fly){
      player.position.y+=THREE.MathUtils.clamp(Number(keys.has('Space'))-Number(keys.has('KeyC'))+rise-descend,-1,1)*speed;
      player.position.y=THREE.MathUtils.clamp(player.position.y,1,50);
    }else player.position.y=eyeHeight;
    setRoom();
  }else{
    inputX=inputZ=0;
    updateFootsteps(0,false);
    if($('mapWrap').style.display==='block')drawMap();
  }
  for(const exhibit of discoveryMarkers)exhibit.sprite.visible=false;
  findDiscovery();
  for(const fn of animatedExhibits)fn(t*.001,dt);
  const eye=aquariumActive?aquariumCamera.position:player.position;
  for(const group of exhibitGroups)group.visible=group.position.distanceToSquared(eye)<58**2;
  const activeCamera=aquariumActive?aquariumCamera:cam;
  updateRoomSound(activeCamera);
  renderer.render(scene,activeCamera);
}

window.addEventListener('resize',()=>{cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});
if(matchMedia('(pointer:coarse)').matches){$('mobile').style.display='block';const joy=$('joy'),knob=$('knob');let joyId=null;function updateJoy(e){const b=joy.getBoundingClientRect(),dx=e.clientX-(b.left+b.width/2),dy=e.clientY-(b.top+b.height/2),r=Math.min(1,Math.hypot(dx,dy)/43),ang=Math.atan2(dy,dx);joyX=Math.cos(ang)*r;joyY=-Math.sin(ang)*r;knob.style.transform=`translate(${joyX*36}px,${-joyY*36}px)`;}joy.addEventListener('pointerdown',e=>{joyId=e.pointerId;joy.setPointerCapture(e.pointerId);updateJoy(e);});joy.addEventListener('pointermove',e=>{if(e.pointerId===joyId)updateJoy(e);});function resetJoy(){joyX=joyY=0;knob.style.transform='none';joyId=null;}joy.addEventListener('pointerup',resetJoy);joy.addEventListener('pointercancel',resetJoy);const look=$('look');let lastX=0,lastY=0,lookId=null;look.addEventListener('pointerdown',e=>{lookId=e.pointerId;lastX=e.clientX;lastY=e.clientY;look.setPointerCapture(e.pointerId);});look.addEventListener('pointermove',e=>{if(e.pointerId!==lookId)return;yaw-=(e.clientX-lastX)*.006;pitch=Math.max(-1.52,Math.min(1.52,pitch-(e.clientY-lastY)*.006));lastX=e.clientX;lastY=e.clientY;applyCamera();});look.addEventListener('pointerup',()=>lookId=null);}

const EXTRA_MODELS=[
  {id:'tiger',x:-5,y:.025,z:-41,length:3.05,rotation:.65,naturalSize:true,hide:/^Museum_TIGER_/},
  {id:'macaw',x:6,y:3.1,z:-44,length:3.3,rotation:-.62,hide:/^Museum_MACAW_/},
  {id:'macaw',x:8,y:3.3,z:-241,length:2.9,rotation:.8},
  {id:'elephant',x:-51,y:.025,z:-80,length:6.4,rotation:1.05,hide:/^Museum_(ELEPHANT_|elephant_(base|edge))/},
  {id:'crocodile',x:52,y:.025,z:-91,length:4.8,rotation:1.35,hide:/^Museum_ALLIGATOR_/},
  {id:'biplane',x:0,y:3.1,z:-67,length:12.1,rotation:.12,hide:/^Museum_(BIPLANE_|biplane_(base|edge))/},
  {id:'sports-car',x:7,y:.025,z:-139,length:6.4,rotation:.58,hide:/^Museum_(SPORTS_CAR_|sports_car_(base|edge))/},
  {id:'eagle',x:-52,y:3.05,z:-222,length:4.45,rotation:-.65}
];
const floors = [];
const walls = [];
const solid = new THREE.MeshStandardMaterial({color:0xe9edf0, roughness:.86});
const ground = new THREE.MeshStandardMaterial({color:0xd6dee4, roughness:.82});
const water = new THREE.MeshStandardMaterial({color:0x123a50, roughness:.67});
const glass = new THREE.MeshStandardMaterial({color:0x8bd7e4, transparent:true, opacity:.16, depthWrite:false, side:THREE.DoubleSide});
const bounds = mesh => new THREE.Box3().setFromObject(mesh);
const sizeOf = box => box.getSize(new THREE.Vector3());
const centerOf = box => box.getCenter(new THREE.Vector3());
const diagnostics = {mounted:0, assets:[], failed:[]};
const radius = .31;
const exhibitGroups=[];

function block(x,y,z,w,h,d,material=solid) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);
  mesh.position.set(x,y,z);
  scene.add(mesh);
  return mesh;
}

function rectFloor(box) {
  floors.push((x,z) => x>=box.min.x-.025 && x<=box.max.x+.025 && z>=box.min.z-.025 && z<=box.max.z+.025);
}

function link(x1,y1,x2,y2) {
  // Horizontal joins leave the doorway square before angling toward the other gallery.
  const direction=Math.sign(x2-x1);
  const xs=[x1-.025*direction,x1+1.05*direction,x2-1.05*direction,x2+.025*direction];
  const zs=[-y1,-y1,-y2,-y2];
  function surface(y,sideA,sideB,material) {
    const vertices=[];
    const indices=[];
    xs.forEach((x,i)=>vertices.push(x,y,zs[i]+sideA,x,y,zs[i]+sideB));
    for(let i=0;i<6;i+=2) indices.push(i,i+1,i+2,i+1,i+3,i+2);
    const geo=new THREE.BufferGeometry();
    geo.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    const finish=material.clone();
    finish.side=THREE.DoubleSide;
    scene.add(new THREE.Mesh(geo,finish));
  }
  surface(-.006,-2.72,2.72,ground);
  surface(3.794,-.055,.055,new THREE.MeshBasicMaterial({color:0xfff2d9,toneMapped:false}));
  surface(3.8,-2.72,2.72,solid);
  for(const side of [-2.72,2.72]) {
    const geo=new THREE.BufferGeometry();
    geo.setAttribute('position',new THREE.Float32BufferAttribute(xs.flatMap((x,i)=>[x,-.02,zs[i]+side,x,3.8,zs[i]+side]),3));
    geo.setIndex([0,1,2,1,3,2,2,3,4,3,5,4,4,5,6,5,7,6]);
    geo.computeVertexNormals();
    const finish=solid.clone();finish.side=THREE.DoubleSide;
    scene.add(new THREE.Mesh(geo,finish));
  }
  floors.push((x,z)=>{
    if((x-xs[0])*direction<0 || (x-xs[3])*direction>0)return false;
    const fraction=THREE.MathUtils.clamp((x-xs[1])/(xs[2]-xs[1]),0,1);
    return Math.abs(z-THREE.MathUtils.lerp(zs[1],zs[2],fraction))<=2.72;
  });
}

const posterTextures=new Map();
const posterLabels={
 ANATOMY:'Human skeleton',EARTH:'Earth from Apollo 17',REPTILES:'Nile crocodile',REPTILES_ALT:'Green iguana',
 MARINE_LIFE:'Life on a coral reef',FOSSILS:'Triceratops',VOLCANOES:'Mount St. Helens',
 MAMMALS:'African bush elephant',BIRDS:'Scarlet macaw',BIRDS_ALT:'Bald eagle',
 FORESTS:'Old-growth forest',FISH:'Lionfish',FLIGHT:'The Wright Flyer',BIG_CATS:'Bengal tiger'
};
async function preparePosters(){
  const photos=window.museumPosterPhotos??{};
  await Promise.all(Object.entries(photos).map(async ([id,source])=>{
    const photo=new Image();
    photo.src=source;
    try{await photo.decode();}catch{return;}
    const canvas=document.createElement('canvas');
    canvas.width=1024;canvas.height=640;
    const paper=canvas.getContext('2d');
    paper.fillStyle='#eae6da';paper.fillRect(0,0,1024,640);
    paper.fillStyle='#16302f';paper.fillRect(34,31,956,474);
    const ratio=id==='ANATOMY'?Math.min(956/photo.width,474/photo.height):Math.max(956/photo.width,474/photo.height);
    const w=photo.width*ratio,h=photo.height*ratio;
    paper.save();
    paper.beginPath();paper.rect(34,31,956,474);paper.clip();
    paper.drawImage(photo,512-w/2,268-h/2,w,h);
    paper.restore();
    paper.fillStyle='#245556';paper.fillRect(34,526,36,3);
    paper.fillStyle='#193031';paper.font='42px Georgia';
    paper.fillText(posterLabels[id],34,585);
    const texture=new THREE.CanvasTexture(canvas);
    texture.colorSpace=THREE.SRGBColorSpace;
    texture.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());
    posterTextures.set(id,texture);
  }));
}

function mountArt(parts,wallEntries) {
  const panels=parts.filter(part=>part.name.includes('media_surface'));
  const used=new Map();
  const reveals=[];
  museum.traverse(mesh=>{
    if(mesh.isMesh&&mesh.name.includes('SHALLOW_WALL_REVEAL'))reveals.push({mesh,box:bounds(mesh)});
  });
  for(const face of panels) {
    const original=centerOf(bounds(face));
    const topic=face.name.replace(/_media_surface_\d+$/,'');
    const group=parts.filter(part=>{
      const p=centerOf(bounds(part));
      return part.name.startsWith(topic+'_') && Math.abs(p.x-original.x)<.3 && Math.abs(p.z-original.z)<3.3;
    });
    const back=new THREE.Box3();
    for(const piece of group) back.union(bounds(piece));
    const extents=sizeOf(back);
    const scale=.76;
    const width=extents.z*scale;
    const key=topic.replace('ACCENT_VHS_ERA_','');
    const variant=(key==='REPTILES'&&original.x<0)||(key==='BIRDS'&&original.z< -90)?key+'_ALT':key;
    const texture=posterTextures.get(variant)??posterTextures.get(key);
    if(texture){
      face.material=new THREE.MeshBasicMaterial({map:texture,side:THREE.DoubleSide,toneMapped:false});
      face.userData.exhibitPhoto=variant;
    }else if(face.material.map){
      face.material=face.material.clone();
      face.material.map=face.material.map.clone();
      face.material.map.repeat.y*=-1;
      face.material.map.offset.y=1-face.material.map.offset.y;
    }
    let target;
    for(const {mesh,box} of wallEntries) {
      const dimensions=sizeOf(box);
      if(dimensions.x>.8 || dimensions.z<width+1.05 || dimensions.y<5 || Math.abs(centerOf(box).x-original.x)>2)continue;
      const bayCenter=(box.min.z+box.max.z)/2;
      const z=THREE.MathUtils.clamp(THREE.MathUtils.lerp(original.z,bayCenter,.4),box.min.z+width/2+.5,box.max.z-width/2-.5);
      const shift=Math.abs(z-original.z);
      if(used.get(mesh)?.some(entry=>Math.abs(entry.z-z)<(entry.width+width)/2+.45))continue;
      if(!target || shift<target.shift)target={mesh,box,z,shift};
    }
    if(!target) {
      for(const piece of group)piece.visible=false;
      continue;
    }
    const {mesh,box,z}=target;
    const inward=original.x>0?-1:1;
    // Side-wing panels sit on the inner-facing side of the wing wall.
    const normal=Math.abs(original.x)>30?-inward:inward;
    const dx=normal>0?box.max.x+.006-back.min.x:box.min.x-.006-back.max.x;
    const dy=2.57-centerOf(back).y;
    const mount=new THREE.Group();
    mount.name=topic;
    mount.position.copy(original);
    scene.add(mount);
    for(const piece of group)mount.attach(piece);
    mount.scale.set(1,scale,scale);
    mount.position.add(new THREE.Vector3(dx,dy,z-original.z));
    mount.updateMatrixWorld(true);
    mesh.attach(mount);
    const framed=bounds(mount);
    for(const reveal of reveals){
      const r=reveal.box;
      if(r.max.x>=framed.min.x-.3&&r.min.x<=framed.max.x+.3&&r.max.z>=framed.min.z-.12&&r.min.z<=framed.max.z+.12&&r.max.y>=framed.min.y&&r.min.y<=framed.max.y){
        reveal.mesh.removeFromParent();
      }
    }
    const entries=used.get(mesh)??[];
    entries.push({z,width});used.set(mesh,entries);
    diagnostics.mounted++;
  }
}


const corridorRoutes=[
 [-17,42.5,-34,41],[-15,66,-34,80],[-13,110.5,-34,122.5],
 [-23,142,-34,167.5],[-18,235.5,-34,215.5],
 [15,66,34,59],[15,88.5,34,100.5],[23,142,34,140.5],[18,235.5,34,229]
];
const necks=[[163.98,166.2],[217.8,220.02]];
const portalTrim=new THREE.MeshStandardMaterial({color:0xa5b2b9,roughness:.78});
const windowGlass=new THREE.MeshStandardMaterial({color:0x9abccc,roughness:.18,transparent:true,opacity:.26,depthWrite:false});
const convertedWindows=[];

function openingBox(portal,side,y,width,height,depth,material=solid){
  const {x,z,acrossX}=portal;
  return acrossX?block(x+side,y,z,depth,height,width,material):block(x,y,z+side,width,height,depth,material);
}

function finishPassage(portal,width,height){
  const openingWidth=portal.width+.08;
  const fillerHeight=portal.top-height+.035;
  if(fillerHeight>0)openingBox(portal,0,height+fillerHeight/2,openingWidth,fillerHeight,.56);
  const sideWidth=(openingWidth-width)/2;
  if(sideWidth>0){
    for(const direction of [-1,1]){
      const offset=direction*(width/2+sideWidth/2);
      const side=portal.acrossX?{...portal,z:portal.z+offset}:{...portal,x:portal.x+offset};
      openingBox(side,0,height/2,sideWidth,height,.59);
    }
  }
  for(const front of [-.312,.312]){
    openingBox(portal,front,height-.06,width+.09,.13,.075,portalTrim);
  }
}

function addGalleryWindow(portal){
  const sill=1.18,header=Math.min(portal.top,3.4),width=portal.width+.08;
  const support=openingBox(portal,0,sill/2,width,sill,.59);
  support.name='Gallery window sill';
  walls.push(bounds(support));
  openingBox(portal,0,(header+portal.top+.04)/2,width,Math.max(.05,portal.top-header+.04),.51);
  openingBox(portal,0,sill,width+.08,.13,.81,portalTrim);
  openingBox(portal,0,header,width,.14,.59,portalTrim);
  openingBox(portal,0,(sill+header)/2,width,header-sill,.042,windowGlass);
  for(const position of [-width/2+.055,0,width/2-.055]){
    const frame=portal.acrossX?{...portal,z:portal.z+position}:{...portal,x:portal.x+position};
    openingBox(frame,0,(sill+header)/2,.115,header-sill,.19,portalTrim);
  }
  convertedWindows.push(portal);
}

function finishGalleryOpenings(portals){
  for(const portal of portals.values()){
    const {x,z,acrossX}=portal;
    const endpoints=corridorRoutes.some(([x1,y1,x2,y2])=>
      acrossX&&((Math.abs(x-x1)<.1&&Math.abs(z+y1)<.1)||(Math.abs(x-x2)<.1&&Math.abs(z+y2)<.1))
    );
    if(endpoints){finishPassage(portal,5.44,3.8);continue;}
    if(!acrossX&&Math.abs(x)<.1&&(Math.abs(z+164)<.1||Math.abs(z+220)<.1)){
      finishPassage(portal,4.38,5.11);continue;
    }
    const dx=acrossX?.66:0,dz=acrossX?0:.66;
    if(checkCollision(x-dx,z-dz)||checkCollision(x+dx,z+dz))addGalleryWindow(portal);
  }
  for(const x of [-25.96,25.96]){
    addGalleryWindow({x,z:-192,acrossX:true,width:4.54,top:6});
  }
}

function prepareMuseum() {
  const art=[];
  const wallEntries=[];
  const shared=new Map();
  const portals=new Map();
  const discard=[];
  museum.traverse(mesh=>{
    if(!mesh.isMesh)return;
    const name=mesh.name;
    if(/^Museum_.*_lintel_/i.test(name)){
      const here=bounds(mesh),center=centerOf(here),extent=sizeOf(here);
      const acrossX=extent.x<extent.z;
      const id=center.x.toFixed(1)+','+center.z.toFixed(1);
      const existing=portals.get(id);
      if(!existing||existing.top>here.min.y){
        portals.set(id,{x:center.x,z:center.z,top:here.min.y,acrossX,width:acrossX?extent.z:extent.x});
      }
    }
    if(/^ACCENT_VHS_ERA_/.test(name)) {art.push(mesh);return;}
    mesh.userData.isAccent=/^(ACCENT|TRIM)_/.test(name);
    if(/^Museum_entry_logo_/i.test(name)){
      mesh.position.x+=4.8;mesh.updateWorldMatrix(true,false);
    }
    // The source dome contains five unfinished TV test cards.
    if(/^ORIGINAL_COLOR_TEST_CARD_PANEL_/.test(name)){
      discard.push(mesh);
      return;
    }
    if(/^Museum_bridge_|^DOME_TO_MUSEUM_CORRIDOR_|^Museum_FISH_|^Museum_SKELETON_exhibit_bone/.test(name)) {
      discard.push(mesh);return;
    }
    if(!/floor|_wall|_column|_base_|_plinth|CURVED_WALL/i.test(name) || mesh.userData.isAccent)return;
    const box=bounds(mesh);
    if(/^Museum_.*_floor_/.test(name))rectFloor(box);
    if(/_wall/i.test(name) && !/^DOME/.test(name)) {
      if(!mesh.geometry.hasAttribute('normal'))mesh.geometry.computeVertexNormals();
      mesh.material=solid;
      const key=[box.min.x,box.max.x,box.min.z,box.max.z].map(number=>number.toFixed(2)).join();
      const previous=shared.get(key);
      if(previous && previous.box.max.y>=box.max.y){discard.push(mesh);return;}
      if(previous)discard.push(previous.mesh);
      shared.set(key,{mesh,box});
    }
    if(box.min.y<eyeHeight && box.max.y>.23 && !/floor/i.test(name))wallEntries.push({mesh,box});
  });
  for(const mesh of discard)mesh.removeFromParent();
  const actualWalls=wallEntries.filter(({mesh})=>mesh.parent);
  for(const {mesh,box} of actualWalls){box.source=mesh;walls.push(box);}
  mountArt(art,actualWalls.filter(({mesh})=>/_wall_/i.test(mesh.name) && !/^DOME/.test(mesh.name)));

  floors.push((x,z)=>Math.hypot(x,z+192)<=26.02);
  for(const [start,end] of necks) {
    const middle=-(start+end)/2;
    const floor=block(0,-.16,middle,4.45,.31,end-start,ground);
    rectFloor(bounds(floor));
    for(const side of [-2.27,2.27])walls.push(bounds(block(side,2.6,middle,.15,5.2,end-start)));
    block(0,5.2,middle,4.65,.16,end-start);
  }
  for(const route of corridorRoutes)link(...route);
  finishGalleryOpenings(portals);
}

function checkCollision(x,z) {
  if(fly)return false;
  if(![[0,0],[radius,0],[-radius,0],[0,radius],[0,-radius]].every(([dx,dz])=>floors.some(contains=>contains(x+dx,z+dz))))return true;
  return walls.some(wall=>{
    const dx=x-THREE.MathUtils.clamp(x,wall.min.x,wall.max.x);
    const dz=z-THREE.MathUtils.clamp(z,wall.min.z,wall.max.z);
    return dx*dx+dz*dz<radius*radius;
  });
}

function movePlayer(move) {
  const steps=Math.max(1,Math.ceil(move.length()/.14));
  const dx=move.x/steps,dz=move.z/steps;
  for(let i=0;i<steps;i++){
    if(!checkCollision(player.position.x+dx,player.position.z))player.position.x+=dx;
    if(!checkCollision(player.position.x,player.position.z+dz))player.position.z+=dz;
  }
}

const placements = [
  {id:'triceratops',x:-55,y:.05,z:-171,length:6, rotation:.55},
  {id:'shepherd',x:-55,y:.02,z:-44,length:1.56,rotation:1.1,naturalSize:true,animated:true},
  // Extra animal and vehicle models are added to this list when source files are available.
  ...EXTRA_MODELS
];

const walkSpeed=5.2, runSpeed=9.0;
const ceilingHeights=[9,9,11,13,10,10,17,21,11,10,15,13,12,13,13,11,12,12,20,12];
const ceilingSpeakers=rooms.map(([,x,depth],i)=>new THREE.Vector3(x,ceilingHeights[i]-.45,-depth));
const listenerPosition=new THREE.Vector3(),listenerForward=new THREE.Vector3(),listenerUp=new THREE.Vector3();
const audioContext=window.AudioContext?new AudioContext():null;
const speaker=audioContext?.createPanner();
const roomTone=audioContext?.createBiquadFilter();
const walkingAudio=new Audio();
walkingAudio.loop=true;
walkingAudio.preservesPitch=true;
let walkingSoundPending=null;
let activeSpeaker=null;
if(speaker){
  speaker.panningModel='HRTF';
  speaker.distanceModel='inverse';
  speaker.refDistance=8;
  speaker.rolloffFactor=.72;
  roomTone.type='lowpass';
  roomTone.frequency.value=2400;
  roomTone.Q.value=.28;
  roomTone.connect(speaker).connect(audioContext.destination);
}

async function readAudio(id){
  const data=await assetScript(id);
  delete exhibits[id];
  return unpack(data);
}
async function prepareAudio(){
  if(!audioContext)return;
  const results=await Promise.allSettled([
    readAudio('steps-audio'),
    readAudio('flute-audio')
  ]);
  if(results[0].status==='fulfilled'){
    walkingAudio.src=URL.createObjectURL(new Blob([results[0].value],{type:'audio/mpeg'}));
    const walkingGain=audioContext.createGain();
    walkingGain.gain.value=.65;
    audioContext.createMediaElementSource(walkingAudio).connect(walkingGain).connect(audioContext.destination);
  }
  if(results[1].status==='fulfilled'){
    flute.src=URL.createObjectURL(new Blob([results[1].value],{type:'audio/mpeg'}));
    audioContext.createMediaElementSource(flute).connect(roomTone);
  }
}

function updateFootsteps(distance,running){
  if(distance<=0||document.hidden){
    if(!walkingAudio.paused)walkingAudio.pause();
    return;
  }
  walkingAudio.playbackRate=running?1.22:1;
  if(walkingAudio.paused&&!walkingSoundPending){
    walkingSoundPending=walkingAudio.play().catch(()=>{}).finally(()=>{walkingSoundPending=null;});
  }
}
window.addEventListener('blur',()=>updateFootsteps(0,false));

function updateRoomSound(camera){
  if(!speaker||audioContext.state!=='running')return;
  camera.updateWorldMatrix(true,false);
  camera.getWorldPosition(listenerPosition);
  camera.getWorldDirection(listenerForward);
  listenerUp.set(0,1,0).transformDirection(camera.matrixWorld);
  const {listener,currentTime:now}=audioContext;
  const p=listenerPosition;
  listener.positionX.value=p.x;listener.positionY.value=p.y;listener.positionZ.value=p.z;
  listener.forwardX.value=listenerForward.x;listener.forwardY.value=listenerForward.y;listener.forwardZ.value=listenerForward.z;
  listener.upX.value=listenerUp.x;listener.upY.value=listenerUp.y;listener.upZ.value=listenerUp.z;
  let closest=ceilingSpeakers[0],distance=Infinity;
  for(const point of ceilingSpeakers){
    const horizontal=(p.x-point.x)**2+(p.z-point.z)**2;
    if(horizontal<distance){closest=point;distance=horizontal;}
  }
  if(closest===activeSpeaker)return;
  activeSpeaker=closest;
  speaker.positionX.setTargetAtTime(closest.x,now,.085);
  speaker.positionY.setTargetAtTime(closest.y,now,.085);
  speaker.positionZ.setTargetAtTime(closest.z,now,.085);
}

const habitatRock=new THREE.IcosahedronGeometry(.55,0);
const habitatBlade=new THREE.ConeGeometry(.10,.85,5);
const tankStyles=[
  {label:'SCHOOLING FISH', habitat:'Open water', sand:0x9ca98f, stone:0x556f70, plants:0x428888, back:0x123943, light:0x80ccd0},
  {label:'CORAL REEF FISH', habitat:'Coral reef', sand:0xc7aa80, stone:0x9b686b, plants:0xd38e67, back:0x153d55, light:0x83dbe1},
  {label:'LIONFISH', habitat:'Rocky reef', sand:0xbbac98, stone:0x53617c, plants:0x8a637f, back:0x19344b, light:0xa1c7f6},
  {label:'GOLIATH TIGERFISH', habitat:'Congo River', sand:0x91765a, stone:0x655c47, plants:0x667747, back:0x263d32, light:0xc3d394}
];

function addTankHabitat(x,z,index){
  const {label,habitat,sand,stone,plants,back,light}=tankStyles[index];
  const viewingSide=x<0?1:-1;
  const material=color=>new THREE.MeshStandardMaterial({color,roughness:.87});
  block(x,.91,z,5.42,.13,7.61,material(sand));
  block(x-viewingSide*2.69,2.05,z,.07,2.4,7.57,material(back));
  const rockMaterial=material(stone),plantMaterial=material(plants);
  for(let i=0;i<8;i++){
    const rock=new THREE.Mesh(habitatRock,rockMaterial);
    rock.position.set(x-viewingSide*(1.12+(i%3)*.43),1.01+(i%3)*.06,z+(i-3.5)*.95);
    rock.rotation.set(i*.43,i*.72,i*.35);
    rock.scale.set(.82+(i%3)*.16,.54+(i%4)*.16,1.1);
    scene.add(rock);
  }
  for(let cluster=0;cluster<3;cluster++){
    for(let blade=0;blade<4;blade++){
      const sprig=new THREE.Mesh(habitatBlade,plantMaterial);
      const height=(index===0?.46:.70)+(blade%3)*.19;
      sprig.position.set(x-viewingSide*(1.3+blade*.21),.97+height*.34,z+(cluster-1)*2.6+blade*.13);
      sprig.scale.y=height;
      sprig.rotation.x=(blade-1.5)*.28;
      scene.add(sprig);
    }
  }
  const tankGlow=new THREE.PointLight(light,14,6,2);
  tankGlow.position.set(x,3.03,z);scene.add(tankGlow);
  const droplets=new THREE.BufferGeometry();
  const positions=new Float32Array(15);
  droplets.setAttribute('position',new THREE.BufferAttribute(positions,3));
  const bubbles=new THREE.Points(droplets,new THREE.PointsMaterial({color:light,size:.055,transparent:true,opacity:.66,depthWrite:false}));
  bubbles.position.set(x-viewingSide*1.1,0,z+2.2);bubbles.frustumCulled=false;scene.add(bubbles);
  animatedExhibits.push(t=>{
    for(let i=0;i<5;i++){
      positions[i*3]=Math.sin(t*1.4+i)*.12;
      positions[i*3+1]=1.03+((t*.57+i*.38)%1.98);
      positions[i*3+2]=i*.09;
    }
    droplets.attributes.position.needsUpdate=true;
  });

  const canvas=document.createElement('canvas');canvas.width=768;canvas.height=160;
  const ctx=canvas.getContext('2d');
  ctx.fillStyle='#102e3a';ctx.fillRect(0,0,768,160);
  ctx.fillStyle='#91c5c4';ctx.fillRect(0,0,768,5);
  ctx.textAlign='center';ctx.fillStyle='#e8f0e9';ctx.font='bold 44px Georgia';
  ctx.fillText(label,384,76);
  ctx.fillStyle='#b4d1d3';ctx.font='31px sans-serif';ctx.fillText(habitat,384,124);
  const map=new THREE.CanvasTexture(canvas);map.colorSpace=THREE.SRGBColorSpace;
  const plaque=new THREE.Mesh(new THREE.PlaneGeometry(3.15,.66),new THREE.MeshBasicMaterial({map,toneMapped:false}));
  plaque.position.set(x+viewingSide*2.81,3.65,z);
  plaque.rotation.y=viewingSide*Math.PI/2;scene.add(plaque);
}

function tank(x,z,index) {
  block(x,.42,z,5.6,.84,7.8,water);
  block(x,3.28,z,5.65,.16,7.85,water);
  for(const side of [-1,1]){
    block(x+side*2.8,2.05,z,.075,2.45,7.8,glass);
    block(x,2.05,z+side*3.9,5.6,2.45,.075,glass);
  }
  walls.push(bounds(block(x,.62,z,5.55,1.24,7.75,glass)));
  addTankHabitat(x,z,index);
}

async function unpack(value) {
  const bytes=new Uint8Array(value.length*3/4);
  let at=0;
  for(let i=0;i<value.length;i+=262144){
    const chunk=atob(value.slice(i,i+262144));
    for(let j=0;j<chunk.length;j++)bytes[at++]=chunk.charCodeAt(j);
  }
  const blob=new Blob([bytes.subarray(0,at)]);
  return new Response(blob.stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer();
}

const exhibits=Object.create(null);
window.museumAsset=(id,data)=>{exhibits[id]=data;};
function assetScript(id) {
  return new Promise((resolve,reject)=>{
    const tag=document.createElement('script');
    tag.src='assets/'+id+'.js';
    tag.onload=()=>{tag.remove(); if(exhibits[id])resolve(exhibits[id]);else reject(Error(id+' asset is empty'));};
    tag.onerror=()=>{tag.remove();reject(Error(id+' asset file is unavailable'));};
    document.head.append(tag);
  });
}

async function loadExhibits(loader) {
  tanks.forEach(([x,z],index)=>tank(x,z,index));
  const fish=tankFish.flatMap((group,index)=>group.map(([id,x,y,z,length])=>({
    id,x:tanks[index][0]+x,y,z:tanks[index][1]+z,length,swim:true,animated:id==='school'
  })));
  for(const spec of [...placements,...fish]) {
    $('progress').textContent='Installing '+spec.id+' exhibit…';
    try {
      const data=await unpack(await assetScript(spec.id));
      delete exhibits[spec.id];
      const file=await loader.parseAsync(data,'');
      const model=file.scene;
      if(!spec.naturalSize)model.rotation.y=spec.rotation??0;
      model.updateMatrixWorld(true);
      const original=bounds(model);
      const dimensions=sizeOf(original);
      const factor=spec.length/Math.max(dimensions.x,dimensions.y,dimensions.z);
      if(!Number.isFinite(factor))throw Error('model has no bounds');
      const middle=centerOf(original);
      model.scale.multiplyScalar(factor);
      model.position.set(-middle.x*factor,-original.min.y*factor,-middle.z*factor);
      const stand=new THREE.Group();
      stand.name='Exhibit_'+spec.id;
      stand.position.set(spec.x,spec.y,spec.z);
      if(spec.naturalSize)stand.rotation.y=spec.rotation??0;
      stand.add(model);
      scene.add(stand);
      exhibitGroups.push(stand);
      if(spec.y<.1 && !spec.swim){
        const collider=bounds(stand);if(collider.max.y>.25)walls.push(collider);
      }
      if(spec.animated && file.animations.length) {
        const mixer=new THREE.AnimationMixer(model);
        const clip=file.animations.find(clip=>/idle|swim/i.test(clip.name))??file.animations[0];
        mixer.clipAction(clip).play();
        animatedExhibits.push((time,dt)=>mixer.update(dt));
      }
      if(spec.swim)animatedExhibits.push(time=>{
        const phase=time*.38+spec.x*.09+spec.z*.08;
        stand.position.set(spec.x+.49*Math.cos(phase),spec.y+.14*Math.sin(phase*1.5),spec.z+.65*Math.sin(phase));
        stand.rotation.y=Math.atan2(-.49*Math.sin(phase),.65*Math.cos(phase));
      });
      if(spec.hide){
        const deprecated=[];
        museum.traverse(mesh=>{if(spec.hide.test(mesh.name))deprecated.push(mesh);});
        for(const mesh of deprecated){mesh.visible=false;const old=walls.findIndex(box=>box.source===mesh);if(old>=0)walls.splice(old,1);}
      }
      if(!diagnostics.assets.includes(spec.id))diagnostics.assets.push(spec.id);
    }catch(error){
      diagnostics.failed.push(spec.id);
      console.error(error);
    }
  }
}



const tankFish=[
  [
    ['school', .5,1.66,.25,1.35],['school',-.65,1.4,-1.3,1.18],
    ['school',-.5,1.85,1.4,1.1],['school',.9,1.2,1.8,1.05],
    ['school',.2,2.15,-2,.92],['school',.45,1.65,-2.6,.87],
    ['school',-.6,1.2,-.25,.95]
  ],
  [
    ['butterflyfish',0,1.42,.16,1.55],['butterflyfish',-.35,1.7,-1.82,1.22],
    ['clownfish',.4,1.18,2.15,1.64],['triggerfish',.15,1.7,-2.46,1.45]
  ],
  [['lionfish',0,1.3,0,2.1]],
  [['tigerfish',0,1.3,0,3.1]]
];

const aquariumCamera=new THREE.PerspectiveCamera(54,innerWidth/innerHeight,.06,1000);
const tanks=[
  [-11.93,-95.8,'Schooling fish','Moving as a group can make it harder for a predator to single out one fish.'],
  [11.93,-95.8,'Coral reef fish','Many reef butterflyfish have a dark stripe across the eye, which makes the eye harder to spot.'],
  [62.93,-46,'Lionfish','Lionfish spread their broad fins to corner prey. Native to the Indo-Pacific, they are invasive on many Atlantic reefs.'],
  [62.93,-57,'Goliath tigerfish','This large freshwater predator lives in the Congo River basin and has prominent interlocking teeth.']
];
let aquariumActive=false,tankIndex=0;
const flute=new Audio('assets/Filtered Flute.mp3');
flute.loop=true;
flute.volume=.52;
function viewTank(){
  const [x,z,title,fact]=tanks[tankIndex];
  aquariumCamera.aspect=innerWidth/innerHeight;
  aquariumCamera.updateProjectionMatrix();
  aquariumCamera.position.set(x+(x>45?-7.3:(x<0?7.3:-7.3)),2.45,z+1.5);
  aquariumCamera.lookAt(x,1.95,z);
  $('tankTitle').textContent=title;
  $('tankHabitat').textContent=tankStyles[tankIndex].habitat;
  $('tankFact').textContent=fact;
}
function closeAquarium(){
  aquariumActive=false;
  document.body.classList.remove('aquarium');
  $('aquariumPanel').style.display='none';
  keys.clear();
}
function openAquarium(preferredTank){
  if(!ready)return;
  document.exitPointerLock?.();
  keys.clear();
  tankIndex=preferredTank??tanks.map(([x,z],index)=>({index,d:Math.hypot(player.position.x-x,player.position.z-z)})).sort((a,b)=>a.d-b.d)[0].index;
  aquariumActive=true;
  document.body.classList.add('aquarium');
  $('aquariumPanel').style.display='block';
  viewTank();
};
$('aquariumButton').onclick=()=>openAquarium();
$('nextTank').onclick=()=>{tankIndex=(tankIndex+1)%tanks.length;viewTank();};
$('quietTank').onclick=()=>{
  $('tankFact').hidden=!$('tankFact').hidden;
  $('quietTank').textContent=$('tankFact').hidden?'SHOW FACT':'HIDE FACT';
};
let musicEnabled=true;
const musicButtons=[$('musicButton'),$('tankSound')];
function syncMusicButtons(){
  for(const button of musicButtons){
    button.textContent=flute.paused?'MUSIC OFF':'MUSIC ON';
    button.setAttribute('aria-pressed',String(!flute.paused));
  }
}
function startMusic(){
  if(!ready)return;
  audioContext?.resume().catch(()=>{});
  if(musicEnabled&&flute.paused)flute.play().catch(syncMusicButtons);
}
function toggleMusic(){
  musicEnabled=flute.paused;
  if(musicEnabled)startMusic();
  else flute.pause();
  syncMusicButtons();
}
for(const button of musicButtons)button.onclick=toggleMusic;
flute.addEventListener('playing',syncMusicButtons);
flute.addEventListener('pause',syncMusicButtons);
window.addEventListener('pointerdown',event=>{
  if(!musicButtons.includes(event.target))startMusic();
},{capture:true});
window.addEventListener('keydown',startMusic,{capture:true});
$('exitTank').onclick=closeAquarium;
document.addEventListener('keydown',event=>{
  if(!aquariumActive)return;
  if(event.code==='Escape')closeAquarium();
  event.stopImmediatePropagation();
},true);
window.addEventListener('resize',()=>{if(aquariumActive)viewTank();});

const discoveryEntries=[
  ['Bengal tiger',-4.6,1.75,-40,'A tiger’s stripe pattern is unique. The stripes break up its outline among grasses and shadows.'],
  ['Macaw',5.5,2.5,-43,'A macaw’s hooked bill cracks hard nuts. Two toes point forward and two point back, making it easier to grip branches.'],
  ['Biplane',4.6,1.7,-67,'Early aircraft often stacked two wings to get more wing area in a compact span. Struts and bracing wires helped hold the wings in shape.'],
  ['Aquarium',-8.75,1.85,-95.8,'Watch fish swim up close and switch between four tanks.',0],
  ['Coral reef fish',8.75,1.85,-95.8,'Look for the dark stripe near the eye. That marking can make the fish’s real eye harder to spot.',1],
  ['Sports car',5,1.7,-138,'A low, wide body helps a sports car manage airflow and keep its center of gravity low.'],
  ['T. rex',5,1.8,-180,'Large areas of muscle attachment on the skull helped T. rex deliver a powerful bite. Its teeth could break bone.'],
  ['German Shepherd',-54,1.7,-43,'The breed grew out of regional German herding dogs. Max von Stephanitz began formalizing the breed in the late 1800s.'],
  ['Guard hairs and undercoat',-56,1.65,-50,'A German Shepherd has two layers of fur. The outer guard hairs are coarser, while the soft undercoat helps insulate the dog.'],
  ['From pastures to search teams',-47,1.65,-47,'German Shepherds were bred for farm and herding work. Today some train for search and rescue, guide work, or other jobs that involve working closely with a person.'],
  ['Elephant',-47,1.75,-79,'An elephant uses its trunk for breathing, smelling, drinking, and handling objects. The trunk contains muscle, with no bones.'],
  ['Lionfish',59.75,1.85,-46,'The long spines contain venom and help protect the lionfish from predators.',2],
  ['Goliath tigerfish',59.75,1.85,-57,'This freshwater hunter comes from the Congo basin. Look for its prominent interlocking teeth.',3],
  ['Crocodile',50,1.65,-90,'A crocodile’s eyes and nostrils sit high on its head, so it can watch and breathe while most of its body is underwater.'],
  ['Triceratops',-52,1.75,-170,'Triceratops means three-horned face. Its beak cropped plants, which rows of teeth then processed.'],
  ['Eagle',-51,2.0,-221,'Broad wings help an eagle soar. Rising columns of warm air can let it gain altitude with little flapping.']
];
const discoveryMarkers=[];
const discoveries=new Set();
let discoveryTarget=null, discoveryOpen=false, usingPad=false;
let padIndex=null, pressedButtons=[],mapSelection=0;
let inputX=0,inputZ=0;
const viewDirection=new THREE.Vector3(), markerDirection=new THREE.Vector3(), markerRay=new THREE.Ray();
const promptPanel=$('discoveryPrompt');

function installDiscoveries(){
  const canvas=document.createElement('canvas');canvas.width=canvas.height=96;
  const ctx=canvas.getContext('2d');
  ctx.fillStyle='#101e29';ctx.strokeStyle='#eee0ac';ctx.lineWidth=5;
  ctx.beginPath();ctx.arc(48,48,34,0,Math.PI*2);ctx.fill();ctx.stroke();
  ctx.font='bold 49px Georgia';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#fff2cc';
  ctx.fillText('i',48,50);
  const map=new THREE.CanvasTexture(canvas);map.colorSpace=THREE.SRGBColorSpace;
  const material=new THREE.SpriteMaterial({map,transparent:true,depthWrite:false});
  for(const [title,x,y,z,description,tank] of discoveryEntries){
    const sprite=new THREE.Sprite(material);
    sprite.position.set(x,y,z);
    sprite.scale.set(.54,.54,1);sprite.visible=false;
    scene.add(sprite);
    discoveryMarkers.push({title,description,tank,sprite});
  }
}

function findDiscovery(){
  let best=null;
  let score=0;
  if(ready&&!fly&&!aquariumActive&&!discoveryOpen&&!menuOpen()){
    cam.updateWorldMatrix(true,false);
    cam.getWorldDirection(viewDirection);
    for(const exhibit of discoveryMarkers){
      markerDirection.subVectors(exhibit.sprite.position,player.position);
      const distance=markerDirection.length();
      if(distance>7.5)continue;
      markerDirection.normalize();
      const facing=viewDirection.dot(markerDirection);
      if(facing<.55)continue;
      markerRay.set(player.position,markerDirection);
      const occluded=walls.some(box=>box.source&&/_wall/i.test(box.source.name)&&markerRay.intersectBox(box,occlusionPoint)&&occlusionPoint.distanceTo(player.position)<distance-.12);
      if(occluded)continue;
      exhibit.sprite.visible=true;
      const rank=facing-distance*.025;
      if(distance<=4.2&&facing>.77&&rank>score){best=exhibit;score=rank;}
    }
  }
  discoveryTarget=best;
  promptPanel.hidden=!best;
  if(best){
    const input=usingPad?'A':'E';
    const caption=input+'  ·  '+(discoveries.has(best.title)?'Read again':'Discover')+' '+best.title;
    if(promptPanel.textContent!==caption)promptPanel.textContent=caption;
  }
}
const occlusionPoint=new THREE.Vector3();

function openDiscovery(){
  if(!discoveryTarget||discoveryOpen)return;
  const item=discoveryTarget;
  discoveries.add(item.title);
  inputX=inputZ=0;
  keys.clear();
  document.exitPointerLock?.();
  discoveryOpen=true;
  $('discoveryTitle').textContent=item.title;
  $('discoveryText').textContent=item.description;
  $('discoveryView').hidden=item.tank===undefined;
  $('discoveryView').onclick=()=>{closeDiscovery();openAquarium(item.tank);};
  $('discoveryClose').textContent=usingPad?'B · Continue':'Continue';
  $('discoveryView').textContent=usingPad?'A · View tank':'View tank';
  $('discoveryCard').hidden=false;
}
function closeDiscovery(){
  discoveryOpen=false;
  $('discoveryCard').hidden=true;
  keys.clear();
}
$('discoveryClose').onclick=closeDiscovery;
promptPanel.onclick=openDiscovery;

function menuOpen(){
  return $('help').style.display==='flex'||$('mapWrap').style.display==='block';
}
function stick(x=0,y=0,deadZone=.18){
  const magnitude=Math.hypot(x,y);
  const strength=Math.min(1,Math.max(0,(magnitude-deadZone)/(1-deadZone)));
  if(!strength)return [0,0];
  return [x/magnitude*strength,y/magnitude*strength];
}

function showMapSelection(){
  $('mapHint').textContent='D-pad · '+rooms[mapSelection][0]+'   A · Travel   B · Close';
}
function controllerInput(dt){
  let pads;
  try{pads=Array.from(navigator.getGamepads?.()??[]);}catch{pads=[];}
  const pad=pads.find(candidate=>candidate?.connected&&candidate.index===padIndex)??pads.find(candidate=>candidate?.connected&&candidate.mapping==='standard');
  if(!pad){padIndex=null;pressedButtons=[];return [0,0,0,0,false];}
  if(padIndex!==pad.index){padIndex=pad.index;pressedButtons=[];}
  const buttons=pad.buttons.map(button=>button.pressed);
  const tapped=index=>buttons[index]&&!pressedButtons[index];
  const [x,y]=stick(pad.axes[0],pad.axes[1]);
  const [lookX,lookY]=stick(pad.axes[2],pad.axes[3],.16);
  if(buttons.some(Boolean)||Math.abs(x)+Math.abs(y)+Math.abs(lookX)+Math.abs(lookY)>.05)usingPad=true;
  if(!ready){
    if(tapped(0)&&!$('enter').disabled)$('enter').click();
  }else if(aquariumActive){
    if(tapped(1))closeAquarium();
    if(tapped(0)||tapped(5))$('nextTank').click();
    if(tapped(2))$('quietTank').click();
    if(tapped(3))toggleMusic();
  }else if(discoveryOpen){
    if(tapped(1))closeDiscovery();
    else if(tapped(0)){
      if($('discoveryView').hidden)closeDiscovery();
      else $('discoveryView').click();
    }
  }else if(menuOpen()){
    if($('mapWrap').style.display==='block'){
      if(tapped(12)||tapped(13)){
        mapSelection=(mapSelection+(tapped(12)?-1:1)+rooms.length)%rooms.length;
        showMapSelection();
      }
      if(tapped(0)){teleport(rooms[mapSelection]);toggleMap();}
    }
    if(tapped(1)||tapped(8)||tapped(9)){
      if($('help').style.display==='flex')toggleHelp();
      if($('mapWrap').style.display==='block')toggleMap();
    }
  }else{
    if(tapped(0))openDiscovery();
    if(tapped(8)){toggleMap();showMapSelection();}
    if(tapped(3))toggleMusic();
    if(tapped(9))toggleHelp();
    yaw-=lookX*Math.abs(lookX)*2.25*dt;
    pitch=THREE.MathUtils.clamp(pitch-lookY*Math.abs(lookY)*1.7*dt,-1.52,1.52);
    if(lookX||lookY)applyCamera();
  }
  pressedButtons=buttons;
  return [x,y,Number(buttons[5]),Number(buttons[4]),Boolean(buttons[10])];
}

document.addEventListener('keydown',event=>{
  if(aquariumActive)return;
  if(!['KeyE','Escape'].includes(event.code)){usingPad=false;return;}
  if(event.repeat)return;
  if(discoveryOpen){
    if(event.code==='Escape'||event.code==='KeyE')closeDiscovery();
  }else if(event.code==='KeyE'){
    usingPad=false;
    openDiscovery();
  }
});
window.addEventListener('pointerdown',()=>{usingPad=false;});

async function loadModel(){try{$('progress').textContent='Loading museum geometry (optimized for faster startup)…';$('fill').style.width='8%';const str=$('glbdata').textContent.trim();if(!str)throw new Error('Museum data missing');const chunks=[];const step=300000;for(let i=0;i<str.length;i+=step){const txt=atob(str.slice(i,i+step));const a=new Uint8Array(txt.length);for(let j=0;j<txt.length;j++)a[j]=txt.charCodeAt(j);chunks.push(a);if(i%(step*20)===0){$('fill').style.width=`${8+Math.round(40*i/str.length)}%`;await new Promise(r=>setTimeout(r,0));}}const compressed=new Blob(chunks,{type:'application/gzip'});chunks.length=0;$('progress').textContent='Restoring textured 3D museum…';$('fill').style.width='54%';if(!('DecompressionStream' in window))throw new Error('This browser cannot unpack the embedded museum. Use current Chrome, Edge or Firefox.');const glb=await new Response(compressed.stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer();$('progress').textContent='Building galleries, lighting and navigation…';$('fill').style.width='75%';const loader=new GLTFLoader();const gltf=await loader.parseAsync(glb,'');museum=gltf.scene;museum.rotation.x=-Math.PI/2;scene.add(museum);museum.updateMatrixWorld(true);
 await preparePosters();prepareMuseum();await Promise.all([loadExhibits(loader),prepareAudio()]);installDiscoveries();setRoom();requestAnimationFrame(animate);$('fill').style.width='100%';$('progress').textContent='Museum ready to explore';$('enter').disabled=false;$('enter').textContent='ENTER THE MUSEUM';$('enter').onclick=()=>{$('intro').style.display='none';ready=true;startMusic();setRoom();lock();};}catch(err){console.error(err);$('progress').textContent='Unable to load museum';$('error').textContent=String(err?.message||err);$('enter').textContent='LOAD FAILED';}}
if(location.search.includes('verify'))window.museumTest={diagnostics,rooms,scene,player,checkCollision,teleport,renderer,aim(y,p){yaw=y;pitch=p;applyCamera();},get discovery(){return discoveryTarget?.title;}};
loadModel();




