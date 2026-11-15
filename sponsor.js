/* Chocwit Mirk Arcade — sponsored wall and community settings.
   Sponsor ads: set sponsorUrl to a sponsor's full https:// URL when active.
   When sponsorUrl is blank, the poster opens the sponsorship inquiry dialog.
   Community link: update discordInvite if the invite ever changes. */
const sponsorSettings = {
  sponsorUrl: '',
  discordInvite: 'https://discord.gg/mawjuNT2dh'
};

(() => {
  const poster = document.getElementById('wallSponsor');
  const mobile = document.querySelector('.mobile-sponsor');
  const modal = document.getElementById('sponsorInfo');
  const contactLink = document.getElementById('sponsorContactLink');
  const contactText = document.getElementById('sponsorContactText');
  const sponsorUrl = sponsorSettings.sponsorUrl.trim();
  const inviteUrl = sponsorSettings.discordInvite;
  const hasSponsor = /^https:\/\/[^\s/]+/.test(sponsorUrl);

  if (hasSponsor) {
    for (const a of [poster, mobile]) {
      if (!a) continue;
      a.href = sponsorUrl;
      a.target = '_blank';
      a.rel = 'noopener noreferrer sponsored';
      a.setAttribute('aria-label', 'Sponsored advertisement — visit sponsor website');
    }
  } else {
    for (const a of [poster, mobile]) {
      if (!a) continue;
      a.addEventListener('click', (event) => {
        event.preventDefault();
        if (modal && !modal.open) modal.showModal();
      });
    }
  }

  // Contact button inside the sponsorship modal.
  if (contactLink) {
    contactLink.href = inviteUrl;
    contactLink.target = '_blank';
    contactLink.rel = 'noopener noreferrer';
    contactLink.textContent = 'CONTACT THE STUDIO ON DISCORD';
    contactLink.hidden = false;
  }
  if (contactText) {
    contactText.textContent = 'Interested in advertising your indie game or brand? Join our Discord community to contact Chocwit Mirk Studios. For private sponsorship discussions, please request a private conversation with the studio team.';
  }

  // Community entry point independent of the sponsored wall.
  const footer = document.querySelector('footer');
  if (footer && !document.getElementById('discordCommunityLink')) {
    const link = document.createElement('a');
    link.id = 'discordCommunityLink';
    link.href = inviteUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = 'JOIN OUR DISCORD';
    link.setAttribute('aria-label', 'Join Chocwit Mirk Studios on Discord');
    link.style.cssText = 'display:inline-block;margin-left:1rem;color:#e2b5ff;text-decoration:underline;text-underline-offset:3px;font-weight:700;';
    footer.appendChild(link);
  }
})();
