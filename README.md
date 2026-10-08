# WEBEAS website

Website design for the Workshop of Experimental and Behavioral Economics of the Americas.

## Folder structure

```text
Webeas_website/
|-- index.html            # Main page (site entry point): markup, styles, seminar logic
|-- assets/
|   |-- js/              # Supporting design runtime scripts
|   `-- images/
|       `-- logos/       # Optimized WebP logos used on the page
|           `-- originals/ # Original supplied PNG/JPEG files
|-- .github/workflows/   # GitHub Pages deployment
|-- docs/
|   `-- DESIGN.md        # Supplied design guidelines
|-- .thumbnail          # Original design preview metadata
|-- .gitattributes      # Git text normalization
`-- README.md
```

## Preview locally

From this folder, start a static server:

```powershell
python -m http.server 8000
```

Then open <http://localhost:8000/>. No build or package installation is required. Internet access is needed for Google Fonts and the runtime's external dependencies.

## Editing

- Edit `index.html` to change the page content, styling, or seminar data.
- Keep image assets in `assets/images/logos/`; reference them from the HTML with `./assets/images/logos/<filename>`.
- The Sponsors section displays all ten logos in the requested order, starting with Carleton University. Images use descriptive alternative text and fit inside their cards without clipping.
- Logos are served as lossless WebP with excess blank margins trimmed. Each logo uses the smaller of a full-resolution crop or a version sized for the cards. Original PNG/JPEG files are preserved in `assets/images/logos/originals/`.
- Consult `docs/DESIGN.md` for the supplied design guidelines.
- `assets/js/support.js` is a generated runtime; keep it intact. `assets/js/image-slot.js` is retained for future editable image placeholders; the current logos use standard images.
- If the design editor creates `.image-slots.state.json`, keep that file beside `index.html` so saved image selections can load.

## Publishing

Pushing to `main` deploys the site to GitHub Pages (production domain: webeas.org). See [docs/PUBLISHING.md](docs/PUBLISHING.md).
