# Linxi Li — Portfolio

Static site (plain HTML/CSS/JS, no build step), built from the Figma file
"Portfolio – Web Homepage" (frame `LinxiWebsite-MainPage`).

```
index.html            Home page
work/*.html           Case-study sub pages (placeholders for now)
assets/css/style.css  All styles (colors/fonts as CSS variables at the top)
assets/js/main.js     Scroll reveals, diagram scaling, nav highlight
assets/img/           Images and SVGs exported from Figma
```

## Preview locally

```bash
python3 -m http.server 8123
```

Then open http://localhost:8123

## Publish on GitHub Pages

1. Create a new **public** repository on github.com.
   - Name it `<your-username>.github.io` to get the address `https://<your-username>.github.io/`
   - Or give it any name (e.g. `portfolio`) to get `https://<your-username>.github.io/portfolio/`
2. Push this folder:
   ```bash
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```
3. On GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch**,
   pick `main` and `/ (root)`, then Save. The site is live in about a minute.

Every later `git push` updates the live site automatically.

## Writing a case study

Each project card links to a file in `work/`. Replace the "Being written — coming soon"
block in that file with the real content.
