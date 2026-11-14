# Chocwit Mirk Studios — CRT Cartridge Arcade v2

A static website for GitHub Pages based on the approved, original Chocwit Mirk retro CRT/console art direction. The console is a fictional **Chocwit Mirk Game System**, not a Nintendo reproduction.

## What works

- Desktop: click any of the four cartridges under the TV.
- Mobile: tap a large cartridge in the easy-to-tap 2-column catalog.
- Custom cartridge-flying-to-console animation, CRT boot static, and live game frame.
- Fullscreen TV game view, with new-tab fallback for browsers that restrict fullscreen.
- Eject and select another game, keyboard shortcuts `1`-`4`, `F`, `E`.
- Native phone-friendly layout, reduced-motion support, basic accessibility labels.
- Can be installed from supported browsers as a standalone site (manifest/icons).

**NOTE:** The included four HTML game files are clearly marked **placeholders**, not your original finished game builds. The launcher itself is functional. Replace each placeholder with the real HTML game. If a game is multi-file, put it in its own folder, then update its `url` in `app.js`. Paths are relative; no server backend is required.

## Website files

```
index.html               Home page
styles.css               Layout and UI styles
app.js                   Cartridge list and game launching
assets/                  Licensed-to-this-project generated artwork and icons
games/                   Four replaceable game slots
manifest.webmanifest     App metadata
CNAME                    Custom domain for GitHub Pages
```

## Deployment to the existing GitHub Pages website

1. Make a backup of the current repository first.
2. Open the existing GitHub repository `chocwitmirk/chocwit-mirk-studios`.
3. Upload the **contents** of this ZIP to the **repository root** (not a nested subfolder). Commit all files, ensuring `index.html`, `styles.css`, `app.js`, `CNAME`, `assets/`, and `games/` all appear at the top level.
4. In **Settings → Pages**, keep `Deploy from a branch`, `main`, `/ (root)`.
5. Leave the Wix DNS configuration alone if the custom domain already works. Check **Settings → Pages → Custom domain** is `chocwitmirkgames.com`; enable HTTPS after the certificate is available.
6. Visit `https://chocwitmirkgames.com/` after publishing. On a first deploy or DNS update, propagation can take time. This package includes `CNAME` to retain the custom domain.

### Pointing at real games

In `app.js`, each game includes a file path:

```
moonies:  { title: "Moonie's Fun Farm", url: 'games/moonies-fun-farm.html', ... }
fish:     { title: 'Fish Is Fish',       url: 'games/fish-is-fish.html', ... }
foozball: { title: 'Fantasy Foozball',  url: 'games/fantasy-foozball.html', ... }
looting:  { title: 'Looting Legends',    url: 'games/looting-legends.html', ... }
```

If a game references external CSS, JS, audio or images, preserve its relative folder layout. Verify touch controls and display scaling inside each game; the launcher cannot retrofit controls into an unrelated game's own code.

### Local preview

From the extracted folder, run `python -m http.server 8000` and open `http://localhost:8000/`. Running as a local server is more dependable for embedded games than opening `index.html` as a file.

### Design disclaimer

Original fictional console design and generated site artwork. This project does not use Nintendo names, logos, game assets, or official console trade dress. A distinct design reduces confusion but does not guarantee freedom from legal claims.
