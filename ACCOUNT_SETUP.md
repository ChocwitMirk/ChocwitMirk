# Chocwit Mirk — Google Sign-in (configured)

Firebase Web App configuration has been inserted into `firebase-config.js` from your provided config.

## Install (GitHub Pages)

1. Open your `ChocwitMirk/ChocwitMirk` GitHub repository.
2. Select **Add file → Upload files** in the *repository root*, next to `index.html` and `CNAME`.
3. Extract this ZIP, open its extracted folder, and upload the **six files inside**, not the folder itself.
4. Commit directly to `main`. Keep `CNAME`, `assets/`, `games/`, and existing `app.js` as they are.
5. Check the newest Pages deployment under **Actions**, then visit `https://chocwitmirkgames.com` and refresh (Ctrl+Shift+R).
6. Click **PLAYER LOGIN → CONTINUE WITH GOOGLE**; complete Google's popup. Verify the name/profile appears.
7. In Firebase Console → Firestore → Data, check for a document at `players/{yourFirebaseUid}`.

## Already configured in Firebase

- Google provider enabled in Authentication
- Authorized domains include `chocwitmirkgames.com` and `www.chocwitmirkgames.com`
- Firestore private player rules have been published for `players/{uid}` and `players/{uid}/saves/{gameId}`

## Scope

- This patch updates the site login UI, Google authentication, and the private player profile.
- It does **not** save existing games' scores, unlocks, or progress automatically. Each game will require integration with its own save format.
- Public high-score leaderboards need separate verification/anti-cheat measures.
- Guest play still works without a sign-in.
- Before public rollout, add a user account/data deletion flow and privacy notice.

## Troubleshooting

- An `auth/unauthorized-domain` message means the exact browser hostname is not listed in Firebase authorized domains.
- If Chrome blocks the Google popup, allow popups for the site.
- The Firebase modules load online; adblockers and offline operation can prevent login even when games still work.
- For `permission-denied`, check your published Firestore rules.
- A signed-in player with no saved games is expected at this stage.
