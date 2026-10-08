# Publishing WEBEAS

The site is a static page served by **GitHub Pages** from `danielfParra/Webeas_website`, deployed by `.github/workflows/pages.yml`.

- GitHub Pages URL: <https://danielfparra.github.io/Webeas_website/>
- Production domain: <https://webeas.org> (after the custom-domain steps below)

## What gets published

The workflow copies only these files into the deployed site:

| Published | Not published |
|---|---|
| `index.html` | `docs/` (design notes, screenshots, this file) |
| `assets/js/` | `assets/images/logos/originals/` (backup PNG/JPEG) |
| `assets/images/logos/*.webp` | `README.md`, `.thumbnail`, `.github/` |

There is a single copy of the page: `index.html`.

## Deploying

Pushing to `main` deploys automatically. To redeploy without a change: GitHub → **Actions** → *Deploy to GitHub Pages* → **Run workflow**.

One-time setting: repository **Settings → Pages → Build and deployment → Source: GitHub Actions**.

## Updating the site

1. Edit `index.html` (seminar data lives in the script block near the bottom: `TERM` for the current term, `ARCHIVE` for past terms).
2. Preview locally: `python -m http.server 8000`, open <http://localhost:8000/>.
3. `git add -A && git commit -m "Update seminars" && git push`.
4. Check the run in the **Actions** tab, then reload the site.

"Next seminar" is computed in the browser: the earliest scheduled date that is today or later, even if its speaker is not yet announced. Past dates move to the archive automatically; no redeploy is needed on the day.

To add or replace a logo, put an optimized `.webp` in `assets/images/logos/`, reference it as `./assets/images/logos/<file>.webp`, and keep the original in `originals/`.

## Custom domain (webeas.org)

Do this only after the GitHub Pages URL above renders correctly. We do not manage DNS; the person controlling DNS makes the DNS changes.

1. Repository **Settings → Pages → Custom domain**: enter `webeas.org`, Save. (This also creates/records the domain; a `CNAME` file in the repo root is copied into the deployed site if present.)
2. DNS changes (made by the DNS owner) — replace the existing website records for `webeas.org`:
   - Apex `webeas.org`: four `A` records → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`; optionally four `AAAA` records → `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`.
   - `www`: `CNAME` → `danielfparra.github.io`.
   - Remove old `A`/`AAAA`/`CNAME` records for the previous host. Do **not** touch `MX`, `TXT` (SPF/DKIM) or other mail records.
3. Wait for DNS to propagate, then in **Settings → Pages** wait for "DNS check successful" and tick **Enforce HTTPS** (the certificate can take up to ~1 hour to issue).
4. Verify: <https://webeas.org> loads, `http://` redirects to `https://`, and `www.webeas.org` redirects to the apex.

Check DNS from a terminal: `nslookup webeas.org` should list the `185.199.x.153` addresses.

Rollback: restore the old DNS records and clear the custom domain in Settings → Pages.
