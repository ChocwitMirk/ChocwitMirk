# Chocwit Mirk Studios — Discord contact update

This is a one-file update for the existing sponsor wall system.

## Install
1. Extract this ZIP.
2. Visit https://github.com/ChocwitMirk/ChocwitMirk .
3. Choose **Add file → Upload files** in the repository root.
4. Upload **only `sponsor.js`** and commit to `main`.
5. After GitHub Pages redeploys, refresh https://chocwitmirkgames.com with Ctrl+Shift+R.

## What changes
- Clicking the **Your Game Here** poster still opens the sponsorship popup while no sponsor URL is configured.
- **CONTACT THE STUDIO ON DISCORD** opens https://discord.gg/mawjuNT2dh in a new tab.
- **JOIN OUR DISCORD** appears in the website footer.
- No game files, account files, existing HTML, CSS, or artwork are touched.

## Changing the invite
Update `discordInvite` near the top of `sponsor.js`.

## Future sponsors
Set `sponsorUrl` to an actual sponsor link to direct poster clicks to the sponsor. That doesn't remove the independent community link. Consider a business email or private ticket workflow for confidential sponsorship proposals.
