# Apollo PhotoWalk - REAL PHOTOGRAPH INTERACTIVE PREVIEW
Date 2026-10-11. **VISUAL PHOTO PREVIEW ACCEPTABLE FOR REVIEW; FULL 3D STILL NOT BUILT**. NO MERGE / NO PROD.

## Product
Minimal dependency-free, single HTML + vanilla JS Apollo PhotoWalk built with genuine Wikimedia Commons photos of Apollo Cafe, surrounding street, Sunset Town plaza and aerial.
User can hold W / arrow-up to smoothly progress through real image viewpoints, S / down to reverse, use arrows or prev/next controls to switch viewpoints, drag mouse/touch to pan the photograph, and play/pause ~25s automatic tour.
Visuals show real Apollo architecture without low-quality synthesized meshes. Separate photo viewpoints and time-of-day/aerial transitions are EXPLICITLY identified: this is a source photo tour, not metric first-person 3D reconstruction.

## Verified local QA
Microsoft Edge (Windows) Playwright at 844x390: **7/7 PASS** after native image-drag pointer fix.
All four genuine images loaded; real key-hold progress, real pointer pan, auto play/pause, no JS/external network errors; truth state does not claim free 3D movement. Screenshot and WebM generated locally.
iPhone Safari physical hardware remains **UNTESTED**. No real 3D geometry, photogrammetry, collision, georegistration or video free-camera baseline.

## Repo files
`photowalk/index.html`, `photowalk/main.js`, `photowalk/view_07.jpg`, `view_06.jpg`, `view_04.jpg`, `view_08.jpg`, `photowalk/server.cjs`, `photowalk/qa-photowalk.cjs`.
All references use relative paths; bundle is runnable as a static site without API or paid AI.

## Windows local run on PHUQUOCLUX
Run `node server.cjs 4196` within `C:\Users\Public\OpenPQ\living-apollo-photowalk-20261011` and open `http://127.0.0.1:4196/` from the same PC, or use its launcher if present.

## Rights and attribution
Images from Wikimedia Commons by Vivu Vietnam, CC BY-SA 4.0; give photographer credit, link to license, indicate any adaptations, and share adapted image materials under compatible license. Files in this prototype are lower-resolution derivatives of licensed photo material, not user photos. Original reference Commons pages:
https://commons.wikimedia.org/wiki/File:Apollo_Cafe_daytime_street_view_Sunset_Town_Phu_Quoc_Vietnam.jpg
https://commons.wikimedia.org/wiki/File:Apollo_Cafe_Sunset_Town_Phu_Quoc_daytime_exterior.jpg
https://commons.wikimedia.org/wiki/File:Apollo-cafe.jpg
https://commons.wikimedia.org/wiki/File:DJI_20260214173618_0031_D_SUNSHINE.jpg

## Next only meaningful stage
Use this stable beautiful reference photo walkthrough as a visual baseline for building a genuinely 3D Apollo cell. Do NOT promote photograph crossfades as photogrammetry; build exact shape and topology only when enough source evidence supports it.
No Github Actions, no Cloudflare, no Core V1.2, no CMS/ID/auth/schema changes, no prod deployment, no fake GPS. UniKey and PhuQuocLux preserved.