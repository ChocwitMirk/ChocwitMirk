# Downhill Delinquents cartridge update — Chocwit Mirk Arcade V3

This update replaces the fourth **Looting Legends** cartridge with **Downhill Delinquents** while keeping the three already working games untouched.

## Upload to GitHub

At https://github.com/ChocwitMirk/ChocwitMirk, upload the CONTENTS of this folder to the repository root, not the outer folder. Upload the `index.html`, `app.js`, `styles.css`, and `games/downhill-delinquents/index.html`. Existing image files in `assets/` are unchanged and do not need reuploading. Keep the original `CNAME`.

**Important:** This ZIP contains ONLY launcher files and the new game's placeholder. It deliberately does not include the three other games, so it cannot overwrite your current playable builds.

## Add the real game

Replace `games/downhill-delinquents/index.html` with the latest working Downhill Delinquents HTML. For a self-contained build that's all you need; if it references other local files, upload those with the same relative paths.

After confirming the new cartridge works, you can delete the unused `games/looting-legends/` folder. Leave the three other game folders alone.

The fourth cartridge's text is drawn as an overlay atop the existing purple cartridge artwork (the actual background image has not been changed). For a completely new cartridge illustration, we'll replace that image asset in a later visual update.
