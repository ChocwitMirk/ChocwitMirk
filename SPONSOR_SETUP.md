# Chocwit Mirk Arcade — Sponsor Wall Poster

The image at `assets/sponsor-poster.webp` is displayed inside the ORIGINAL pixel-alien wall frame. The original CRT room art is NOT replaced. The click area is aligned with the full-size scene and scales with the page.

## Upload to GitHub

1. Extract this ZIP.
2. In `ChocwitMirk/ChocwitMirk`, choose **Add file → Upload files**.
3. Upload the **contents** of this folder to the repository ROOT, preserving `assets/sponsor-poster.webp`.
4. Commit. Do not delete `games/`, `account.js`, `firebase-config.js`, `app.js`, or `CNAME`.
5. Hard refresh the website (Ctrl+Shift+R).

## Change the poster

Replace `assets/sponsor-poster.webp` with a new square-ish poster image using the same name. Square artwork works best inside this existing wall frame, which is NOT a tall portrait frame.

## Make it link to a sponsor

Edit `sponsor.js` and set `sponsorUrl` to their `https://` website or Steam game page. When left blank, clicking the poster opens an on-site sponsor-inquiry pop-up. To enable the email contact button, put your *business* email in `contactEmail`. Both are intentionally blank until you decide what they should be. Sponsored links will open in a new tab.

## Technical notes

- Desktop poster uses coordinates relative to the room image (1672 × 941); portrait mobile sponsor teaser appears beneath the scene.
- The rest of the original room image and all games remain untouched.
- The poster is labeled AD / ADVERTISEMENT. Ad-network code is NOT included.
- This is a visual and code integration, not a functioning ad-network account or payment processing system.
