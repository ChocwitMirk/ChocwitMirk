# Chocwit Mirk Studios — CRT Cartridge Arcade V3

## Replacing and updating games

Each cartridge launches the `index.html` file in a dedicated subfolder under `/games`.

| Cartridge | Upload your game here |
|---|---|
| Moonie’s Fun Farm | `games/moonies-fun-farm/index.html` |
| Fish Is Fish | `games/fish-is-fish/index.html` |
| Fantasy Foozball | `games/fantasy-foozball/index.html` |
| Looting Legends | `games/looting-legends/index.html` |

**The included games are placeholders**, not the latest actual playable builds. To publish a real game, replace its folder's `index.html` with the latest HTML file renamed to `index.html`. If the game references sound, images, scripts, styles or other assets, put those files inside the same game folder too, preserving their relative paths.

You do **not** need to update `app.js` or the homepage for replacements of these four games.

## Uploading to GitHub

1. Open `https://github.com/ChocwitMirk/ChocwitMirk`. The current publishing branch is `main` and folder `/ (root)`.
2. Replace the existing root `app.js` with the one from this package.
3. Delete the four OLD flat game files (`games/moonies-fun-farm.html`, `games/fish-is-fish.html`, `games/fantasy-foozball.html`, `games/looting-legends.html`) if they still exist.
4. Upload the new `games/` folders, keeping the paths shown above. If using GitHub's web uploader, drag the **four subfolders**, not just loose HTML files, onto the root upload page. Ensure GitHub shows `games/<game>/index.html` in the upload list.
5. Commit changes to `main`. Keep the existing root `CNAME` with `chocwitmirkgames.com`.
6. After successful Pages deployment, reload the website with Ctrl+Shift+R.

**Alternative:** Upload the full V3 package contents into the repository root, replacing existing same-named files. Unused old game HTML files can be deleted separately.

**Note:** Opening games locally through `file://` may not behave identically to GitHub Pages. Test deployed URLs directly, e.g. `https://chocwitmirkgames.com/games/fish-is-fish/`.

## Later updates

For a game-only update, open that game's GitHub folder, select `index.html`, click the pencil icon to edit (if small) or use GitHub's Upload files to replace its contents. GitHub's web uploader may not overwrite a same-named existing file cleanly in every flow; GitHub Desktop is a simpler option for replacing large files. With GitHub Desktop, replace the local `index.html`, then commit and push.

The CRT launcher continues loading the same URL, so you do not need to change cartridge links.

## Files

- Root `index.html`: arcade homepage and player
- Root `styles.css`: styling/layout
- Root `app.js`: cartridge buttons, loading, fullscreen, eject
- Root `CNAME`: custom domain
- `assets/`: website graphics
- `games/<slug>/index.html`: each playable game
