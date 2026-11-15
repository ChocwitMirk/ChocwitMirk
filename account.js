// Chocwit Mirk Arcade: optional Google login and player profile.
// This module leaves the cartridge launcher and games untouched.
import { firebaseConfig } from './firebase-config.js';
const $ = (id) => document.getElementById(id);
const accountBtn = $('accountBtn');
const dialog = $('accountDialog');
const loginBtn = $('googleLoginBtn');
const logoutBtn = $('googleLogoutBtn');
const errorEl = $('accountError');
const setupEl = $('accountSetup');
const guestPanel = $('guestPanel');
const playerPanel = $('playerPanel');
const profileStatus = $('profileStatus');
const sdkVersion = '13.3.0';
const configured = ['apiKey','authDomain','projectId','appId'].every(key =>
  typeof firebaseConfig[key] === 'string' && firebaseConfig[key].length > 4 && !firebaseConfig[key].startsWith('PASTE_'));

accountBtn.addEventListener('click', () => dialog.showModal());
// Fail safe: the arcade remains fully playable when Firebase is not configured or unavailable.
if (!configured) {
  setupEl.hidden = false;
  loginBtn.disabled = true;
  accountBtn.title = 'Player login setup pending';
} else {
  startFirebase().catch(err => {
    setupEl.hidden = false;
    setupEl.textContent = 'Account service could not start. Games are still playable as a guest.';
    loginBtn.disabled = true;
    console.error('Firebase initialization failed:',err);
  });
}
function showError(err) {
  const code = String(err?.code || '');
  const messages = {
    'auth/popup-closed-by-user':'Sign-in window closed. You can try again.',
    'auth/popup-blocked':'Your browser blocked the sign-in popup. Allow popups for this website.',
    'auth/unauthorized-domain':'This website is not listed in Firebase Authentication authorized domains.',
    'auth/cancelled-popup-request':'Sign-in was canceled. Try again.',
    'permission-denied':'Firestore rules denied access to the profile.'
  };
  errorEl.textContent = messages[code] || `Unable to finish sign-in (${code || 'network error'}). Please try again.`;
  errorEl.hidden = false;
}
async function startFirebase() {
  const [{initializeApp},{getAuth,GoogleAuthProvider,signInWithPopup,signOut,onAuthStateChanged},{getFirestore,doc,getDoc,setDoc,serverTimestamp}] = await Promise.all([
    import(`https://www.gstatic.com/firebasejs/${sdkVersion}/firebase-app.js`),
    import(`https://www.gstatic.com/firebasejs/${sdkVersion}/firebase-auth.js`),
    import(`https://www.gstatic.com/firebasejs/${sdkVersion}/firebase-firestore.js`)
  ]);
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({prompt:'select_account'});

  loginBtn.addEventListener('click', async () => {
    errorEl.hidden = true;
    loginBtn.disabled = true;
    try { await signInWithPopup(auth,provider); }
    catch (err) { showError(err); }
    finally { loginBtn.disabled = false; }
  });
  logoutBtn.addEventListener('click', async () => {
    errorEl.hidden = true;
    try {await signOut(auth);} catch(err){showError(err);}
  });

  let profileSequence=0;
  onAuthStateChanged(auth, async (user) => {
    const token = ++profileSequence;
    accountBtn.classList.toggle('signed-in',!!user);
    guestPanel.hidden = !!user;
    playerPanel.hidden = !user;
    errorEl.hidden = true;
    if(!user) {
      accountBtn.textContent = '♙ PLAYER LOGIN';
      profileStatus.textContent = '';
      $('playerPhoto').hidden = true;
      window.dispatchEvent(new CustomEvent('chocwit:auth', {detail:{signedIn:false}}));
      return;
    }
    const displayName = user.displayName || 'Arcade Player';
    accountBtn.textContent = '● '+displayName.toUpperCase();
    $('playerName').textContent = displayName;
    $('playerEmail').textContent = user.email || '';
    const photo = $('playerPhoto');
    if(user.photoURL && /^https:\/\//.test(user.photoURL)) { photo.src = user.photoURL; photo.hidden = false; }
    else { photo.removeAttribute('src'); photo.hidden = true; }
    profileStatus.textContent = 'Syncing your player profile…';
    window.dispatchEvent(new CustomEvent('chocwit:auth', {detail:{signedIn:true,uid:user.uid,displayName}}));
    try {
      const ref = doc(db,'players',user.uid);
      const snap = await getDoc(ref);
      if(token!==profileSequence) return;
      if(!snap.exists()) {
        await setDoc(ref,{displayName,photoURL:user.photoURL||'',createdAt:serverTimestamp(),lastLoginAt:serverTimestamp()});
      } else {
        await setDoc(ref,{displayName,photoURL:user.photoURL||'',lastLoginAt:serverTimestamp()},{merge:true});
      }
      if(token===profileSequence) profileStatus.textContent = 'PROFILE READY · Cloud saves will be added to each game next.';
    } catch(err) {
      if(token===profileSequence) { profileStatus.textContent = 'Signed in, but your profile could not be saved.'; showError(err); }
    }
  });
}
