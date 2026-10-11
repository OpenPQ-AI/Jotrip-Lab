# LivingPQ Apollo PhotoWalk - live deploy evidence, 2026-10-11

Production-isolated preview: https://play.openphuquoc.com/
Cloudflare Worker: `openpq-living-play`, reused existing custom domain and same Worker; no DNS or OpenPQ Core changes.
Current live Worker version: `1d996234-57fc-43d1-ae99-ea609db42353`.
Pre-deploy Proof A version retained for explicit rollback: `79fb84f6-9a30-439d-9819-3804b807bf79`.
Rollback: `npx wrangler rollback 79fb84f6-9a30-439d-9819-3804b807bf79 --name openpq-living-play --message "Restore Proof A"`.

Deployed local source of truth on authorized PHUQUOCLUX:
`C:\Users\Public\OpenPQ\living-apollo-photowalk-20261011\cloudflare-play`
Config `wrangler.jsonc` with `assets.directory=./public`, `assets.binding=ASSETS`, and `run_worker_first=['/health']` for quota-safe static serving.
9 assets: main.js, index.html, credits.html, robots.txt, favicon.svg, four CC BY-SA 4.0 Vivu Vietnam photos (Wikimedia Commons).
Predeploy public-only snapshot of old site: `C:\Users\Public\OpenPQ\living-play-proof-a-backup-20261011`, plus Cloudflare old version history.

Production verification: `GET /health` HTTP 200 JSON release livingpq-apollo-photowalk-20261011; GET /, /main.js, photos, /credits.html all 200.
Public Microsoft Edge QA: 12/12 checks PASS including image loading, W control, mouse-look, auto toggle, touch pointer handler safety, credits, mobile landscape and portrait fallback, /health, zero application JS errors.
Cloudflare injects one third-party Analytics beacon request, classified separately from application errors; browser network without extras is not claimed.

IMPORTANT: This is a **photo viewpoint slideshow with pan/crossfade**, NOT a reconstructed continuous 3D game. R24 3D playable visual remains FAIL. Physical iPhone Safari NOT tested; user should test on phone.
Do not merge to Core or deploy any other product. GitHub research branch may lag deployed source patches; reimport from the local deployed folder before future changes. Preserve UniKey/PhuQuocLux.