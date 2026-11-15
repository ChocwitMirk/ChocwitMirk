/* Chocwit Mirk Arcade — sponsor slot settings. No accounts or game code changed.
   To activate a sponsor: set sponsorUrl to a full https:// address.
   To accept inquiries: set contactEmail to your business contact email.
   To replace artwork: upload another assets/sponsor-poster.webp. */
const sponsorSettings = { sponsorUrl: '', contactEmail: '' };
(() => {
  const poster = document.getElementById('wallSponsor');
  const mobile = document.querySelector('.mobile-sponsor');
  const modal = document.getElementById('sponsorInfo');
  const link = document.getElementById('sponsorContactLink');
  const text = document.getElementById('sponsorContactText');
  const url = sponsorSettings.sponsorUrl.trim();
  const isValid = /^https:\/\/[^\s/]+/.test(url);
  if(isValid){
    for(const a of [poster,mobile]) if(a){a.href=url;a.target='_blank';a.rel='noopener noreferrer sponsored';a.setAttribute('aria-label','Sponsored advertisement — visit sponsor website');}
  } else {
    for(const a of [poster,mobile]) if(a) a.addEventListener('click',e=>{e.preventDefault();modal?.showModal();});
  }
  if(sponsorSettings.contactEmail.trim() && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(sponsorSettings.contactEmail)){
    if(link){link.href='mailto:'+sponsorSettings.contactEmail+'?subject=Chocwit%20Mirk%20Arcade%20Sponsorship';link.hidden=false;}
    if(text)text.textContent='Want to feature your indie game or brand? Contact the studio to discuss this sponsorship space.';
  }
})();
