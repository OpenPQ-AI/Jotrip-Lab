# LivingPQ - Style-first continuous 3D micro-street experiment (2026-10-11)

Live isolated preview: https://play.openphuquoc.com/street/
Cloudflare Worker: `openpq-living-play` - static assets only, optional `/street/` path. New version: `e26722eb-e0aa-461a-8924-c0b8777518cb`. Previous version for rollback: `3bbf2e26-f8e2-4322-9748-dc8862c8ca51`.

## Design and truth
This is a **genuine continuous 3D environment** created using Three.js geometry with art direction inspired by Sunset Town / Mediterranean-style Phu Quoc. Approximately a 40m walkable street. Buildings include deep facade layers, cornices, arches, shutters, balconies, terracotta-colored roof ridges, glass café tower inspired by Apollo, art-inspired red sculptural element, outdoor café tables, lamps, scooters, bunting, pavers, trees and ocean vista. The exact architecture, coordinates and parcel layout are not verified and are NOT claimed to be a survey, COLMAP scan or accurate Apollo reconstruction. No external copyrighted photographs, AI textures or paid APIs were used for this scene.

## Implementation
`experiments/style-first-street/main.js` - source. `index.html` portrait-first controls. `build.cjs` uses already-installed local esbuild + three; external dependencies have to be installed/provided for independent builds. `server.cjs` supports local preview. `bundle.js` (539281 bytes) and HTML deployed as Cloudflare static assets.
About **56,446 triangles**, **31 batched draw mesh sets**. Browser screenshot at 390x844 and 1280x720 reviewed. Unlike single-view Gaussian, geometry remains solid while player walks and turns. Phone GPU performance and browser compatibility must still be tested on real hardware.

## QA
Local QA: WebGL PASS; continuous 3D PASS; arrow/WASD move PASS; mouse look PASS; no application JS errors. Browser Edge software rendering reports approx 44-57 FPS across sampled sizes; **not** actual iPhone/Android FPS.
Public QA: Android emulation 412x915 moved **1.72m** with touch joystick, 7 look pointer events; iPhone emulation 390x844 moved **1.69m** with touch joystick, 7 look events; no first-party HTTP or JS errors; old `/`, `/3d/` and `/health` remained live.

## Visual verdict
This is a first **stylized game environment** prototype. Visual quality still needs creator approval. Facade rhythm, lighting, color, materials, lighting and population are art-directed but remain a low/medium detail handmade proxy. Do not market as photoreal or complete Sunset Town. Do not overwrite root or other apps until owner chooses.

## Safety
Only added `/street/` static assets to existing Play Worker. NO Core V1.2, CMS, auth, schema, DNS, GitHub Actions, paid AI or Cloudflare repeated tests. UniKey, PhuQuocLux apps/data untouched. Existing Cloudflare Worker previous version supports rollback.

## Next visual gate
Owner evaluates direction on physical portrait Android/iPhone. If the **style** is approved, iterate environment art on a 30-40m stretch with fixed geographic key layout only, mesh library and distinct facade silhouettes, NPC scale references, weather/sky and performance. If not approved, change art direction instead of adding R25 style iterations blindly.