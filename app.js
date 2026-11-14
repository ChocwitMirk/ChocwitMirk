'use strict';
/* Chocwit Mirk Studios cartridge launcher. Replace files in /games with actual self-contained game builds. */
const catalog = Object.freeze({
  moonies:{title:"Moonie's Fun Farm",url:'games/moonies-fun-farm.html',art:'assets/moonies.webp'},
  fish:{title:'Fish Is Fish',url:'games/fish-is-fish.html',art:'assets/fish.webp'},
  foozball:{title:'Fantasy Foozball',url:'games/fantasy-foozball.html',art:'assets/foozball.webp'},
  looting:{title:'Looting Legends',url:'games/looting-legends.html',art:'assets/looting.webp'}
});
const $ = id=>document.getElementById(id);
const desktop=$('desktopScreen'),mobile=$('mobileScreen'),status=$('status'),fullscreenBtn=$('fullscreenBtn'),ejectBtn=$('ejectBtn'),newTabBtn=$('newTabBtn');
const mq=window.matchMedia('(max-width: 800px)');
const gameFrame=document.createElement('iframe');
gameFrame.id='gameFrame';gameFrame.title='Chocwit Mirk selected game';gameFrame.allow='fullscreen; autoplay; gamepad';gameFrame.setAttribute('allowfullscreen','');gameFrame.setAttribute('loading','eager');
gameFrame.style.cssText='position:absolute;inset:0;width:100%;height:100%;border:0;background:#090719;';
let current=null,seq=0,bootTimeout=null,toastTimeout=null;
const activeScreen=()=>mq.matches?mobile:desktop;
const activeContent=()=>mq.matches?$('mobileContent'):$('desktopContent');
function setStatus(message){status.textContent=message}
function toast(message){const el=$('toast');el.textContent=message;el.classList.add('show');clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>el.classList.remove('show'),2800)}
function setButtons(enabled){fullscreenBtn.disabled=!enabled;ejectBtn.disabled=!enabled;newTabBtn.disabled=!enabled;document.querySelectorAll('[data-game]').forEach(b=>b.classList.toggle('selected',enabled&&b.dataset.game===current)) ;document.querySelector('.power-dot').classList.toggle('on',enabled)}
function blankFrame(){gameFrame.removeAttribute('src');gameFrame.remove();for(const id of ['desktopContent','mobileContent']){$(id).querySelector('.idle').hidden=false}}
function animateCartridge(gameId,source){if(matchMedia('(prefers-reduced-motion: reduce)').matches)return Promise.resolve();const mobileMode=mq.matches;const destination=mobileMode?document.querySelector('.mobile-console'):$('consoleHit');const start=source?.getBoundingClientRect(),end=destination?.getBoundingClientRect();if(!start||!end)return Promise.resolve();const ghost=document.createElement('img');ghost.src=catalog[gameId].art;ghost.alt='';ghost.className='flying-cartridge';const w=Math.min(mobileMode?110:125,Math.max(start.width*.55,75));ghost.style.cssText=`position:fixed;z-index:100;pointer-events:none;object-fit:contain;width:${w}px;height:${w*.65}px;left:${start.left+start.width/2-w/2}px;top:${start.top+start.height/2-w*.32}px;filter:drop-shadow(0 0 12px #ffaaff);`;
document.body.append(ghost);document.body.classList.add('inserting');const tx=end.left+end.width*(mobileMode?.47:.46)-(start.left+start.width/2);const ty=end.top+end.height*(mobileMode?.2:.2)-(start.top+start.height/2);
const animation=ghost.animate([{transform:'translate(0,0) scale(1) rotate(-6deg)',opacity:1},{transform:`translate(${tx}px,${ty-20}px) scale(.68) rotate(1deg)`,opacity:1,offset:.72},{transform:`translate(${tx}px,${ty}px) scale(.55)`,opacity:0}],{duration:650,easing:'ease-in-out',fill:'forwards'});
return animation.finished.catch(()=>{}).then(()=>{ghost.remove();document.body.classList.remove('inserting')})}
async function selectGame(gameId,source){if(!Object.hasOwn(catalog,gameId))return;const token=++seq;clearTimeout(bootTimeout);current=gameId;const g=catalog[gameId];setButtons(true);blankFrame();setStatus('INSERTING '+g.title.toUpperCase()+'…');document.querySelectorAll('.tv-screen').forEach(s=>s.classList.remove('booting'));
await animateCartridge(gameId,source);if(token!==seq)return;const screen=activeScreen();screen.classList.add('booting');setStatus('BOOTING '+g.title.toUpperCase()+'…');bootTimeout=setTimeout(()=>{if(token!==seq)return;activeContent().querySelector('.idle').hidden=true;activeContent().append(gameFrame);gameFrame.src=g.url;screen.classList.remove('booting');setStatus('NOW PLAYING · '+g.title.toUpperCase());},720)}
function eject(){seq++;clearTimeout(bootTimeout);current=null;blankFrame();document.querySelectorAll('.tv-screen').forEach(s=>s.classList.remove('booting'));document.body.classList.remove('inserting');setButtons(false);setStatus('CARTRIDGE EJECTED · SELECT A GAME');toast('Cartridge ejected')}
async function fullscreen(){if(!current)return toast('Select a game first');const screen=activeScreen();try{if(document.fullscreenElement){await document.exitFullscreen();return}if(typeof screen.requestFullscreen==='function'){await screen.requestFullscreen({navigationUI:'hide'});return}throw new Error('Fullscreen unsupported')}catch{toast('Fullscreen unavailable — opening game in a new tab');openGame()}}
function openGame(){if(current){const g=catalog[current];const win=window.open(g.url,'_blank','noopener,noreferrer');if(!win)toast('Allow pop-ups to open the game')}}
document.querySelectorAll('[data-game]').forEach(b=>b.addEventListener('click',()=>selectGame(b.dataset.game,b)));
$('consoleHit').addEventListener('click',()=>current?eject():toast('Choose a cartridge below'));
$('desktopFullscreen').addEventListener('click',fullscreen);fullscreenBtn.addEventListener('click',fullscreen);ejectBtn.addEventListener('click',eject);newTabBtn.addEventListener('click',openGame);
$('helpBtn').addEventListener('click',()=>$('helpDialog').showModal());$('closeHelp').addEventListener('click',()=>$('helpDialog').close());$('year').textContent=new Date().getFullYear();
document.addEventListener('keydown',event=>{const t=event.target;if(t?.matches('input, textarea, select')||$('helpDialog').open)return;const keys=['moonies','fish','foozball','looting'];if(/^[1-4]$/.test(event.key))selectGame(keys[Number(event.key)-1],document.querySelector(`[data-game="${keys[Number(event.key)-1]}"]`));else if(event.key.toLowerCase()==='f'&&current)fullscreen();else if(event.key.toLowerCase()==='e'&&current)eject()});
const onLayoutChange=()=>{if(current&&gameFrame.isConnected){const content=activeContent();content.querySelector('.idle').hidden=true;content.append(gameFrame);for(const id of ['desktopContent','mobileContent'])if($(id)!==content)$(id).querySelector('.idle').hidden=false;toast('Layout changed — game reloaded')}};
if(mq.addEventListener)mq.addEventListener('change',onLayoutChange);else mq.addListener(onLayoutChange);
// Direct-link selections: #moonies, #fish, #foozball, #looting
const deepLink=location.hash.slice(1).toLowerCase();if(catalog[deepLink])selectGame(deepLink,document.querySelector(`[data-game="${deepLink}"]`));
