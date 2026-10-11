# LivingPQ - R24 playable Apollo source-guided art proof

Date: 11/10/2026. VISUAL_GATE: FAIL. Not production. R15 / R17G / R20 / R21 / R22 / R23 untouched.

## What was actually created
- A genuine Three.js playable first-person 3D trial with physical camera translation, W/A/S/D, mouse-look, touch joystick, rough source-guided collision perimeter.
- Approximate R15 Apollo mesh (turquoise glass tower, bronze pods, red bow), 456 mesh materials receive projective mapping from a real photographed Apollo view (Vivu Vietnam CC BY-SA 4.0). Adjacent distant facade is a 2D context plane.
- Photographic texture projection is an artistic projection: not registered camera poses or a scan. Hidden surfaces are hand-authored approximations.
- On the second build, automated Edge QA confirms ~3.24m camera movement, turning and stopping, no page/network errors, four actual WebGL screenshots. Browser FPS in software rendering ~13, not iPhone proof.

## Why it is REJECTED
- Actual R24_WEBGL_FRONT.png and R24_WEBGL_WALK.png show dark projected tower, cartoon brass/cobbles/flowers, odd facade compositing and unfaithful perspective.
- Overall visual does NOT meet owner-specified 'beautiful, architecture recognizably right' gate and is not superior to R17G hero-front photo fidelity.
- It therefore MUST NOT be deployed, merged, used as actual urban scan or described as production playable island.

## Objective blocker (after R17-R24)
No code-only treatment of 2-5 disparate street/drone photos can truthfully create the hidden surfaces, geometry and consistent freewalking imagery for a 10x10m Apollo cafe. R20 physically walks but original SOG tears; R15/R24 geometrical visual is unacceptable; R21 2-drone SIFT matches do not prove front/side geometry.

## Single legitimate unblock
Acquire ONE rights-cleared ground-level lateral traversal of 5-10m Apollo facade: ~60-100 seconds stable horizontal 4K30 footage filmed while WALKING sideways/slow arc (not fixed-position panning), repeat a few overlapping camera angles, include at least 2 perpendicular building sides and pedestrian ground. Avoid faces, private interiors, plates, shaking. OR obtain owner-authorized high-quality textured mesh/scan GLB/PLY/SPZ.
License must permit research, 3D derivatives and redistribution. Validate using R23 input gate then run SfM/3DGS only on a machine fit for heavy compute.

## Re-run local on Windows
node server.cjs 4194
Open http://127.0.0.1:4194/ on PHUQUOCLUX, not accessible via iPhone remotely by default.
node qa-r24.cjs (writes real WebGL screenshots and evidence).

Sources: Vivu Vietnam Apollo Cafe photo via Wikimedia Commons CC BY-SA 4.0. Derived texture must honor attribution/share-alike.
Safety: NO CORE V1.2, CMS, ID, auth, schema, production, Cloudflare, GitHub Actions, paid API, fake GPS. UniKey and PhuQuocLux preserved.