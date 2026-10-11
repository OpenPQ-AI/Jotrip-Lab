# LivingPQ Visual Reset V3 | Actual WebGL Render Gate
Date: 2026-10-11. Target: user review, graphics-only, no Play deployment.

## Operational result
- On authorized Windows computer PHUQUOCLUX, isolated at C:\Users\Public\OpenPQ\livingpq-visual-reset-v3-20261011.
- Browser: Edge/Chromium software-rendered WebGL, Three.js scene-v3.js + signature-v3.js.
- Browser automation captured ACTUAL_3D_HILLSIDE.png, ACTUAL_3D_PROMENADE.png, ACTUAL_3D_BRIDGE.png, ACTUAL_3D_PORTRAIT.png. The four images are genuine screenshots from the same live 3D scene, not image-generation results, photographic panoramas or 2D impostors.
- Technical QA: REAL_WEBGL_RENDER_PASS_VISUAL_REVIEW_REQUIRED, no browser errors; 48 CC0 palm GLB instances, approx 34 modeled facade masses and 377 arched window details, bridge arms physically separate, three layered stage shells.
- Edge software FPS in final run (varies by camera and system): hillside 13, promenade 21, bridge 27. Not a measure of smartphone real hardware performance. Mobile viewport was screenshot-only.
- No gameplay, no production release, no deploy/merge to play.openphuquoc.com, no Core/CMS/auth/data write.

## Authoring decisions
- Removed V2's anonymous floating park layout from render path (V2 sources remain archived).
- Independently constructed 3D bay shoreline, two curving bridge arms with metal rail and support beams, oval real-geometry stage shell, sculpted clock tower, roof tile, arcade fronts, coastal palms, vegetated hills, smooth sky and sea shader.
- Roof PBR and paving albedo were reused from locally licensed assets; 3D palm model is CC0. Stucco was generated procedurally at runtime, with no licensed photo projected onto buildings.
- Reference 2026 CC BY/CC BY-SA photos used for **comparison only**. Source credits remain in source_image_manifest.json in G0 workspace. Attribution required when distributing the contact sheet.

## Art / G0 verification
Decision = VISUAL_HOLD_NOT_70_PERCENT.
The presentation is still too schematic and repetitive for the requested >=70% image-reference emotional recognizability. Empty broad terraces, simplified stage and support structure, coarse hillside vegetation and facades remain. The precise geometry of the bridge and site contours is **not** survey or photogrammetry calibrated. Relative positions are an art interpretation based on source photos.
The two bridge tip endpoints are separated by 9.4 *ART units* within a made-up coordinate system. This is NOT 9.4 physical meters and not a measurement of the actual Kiss Bridge gap.
The Bách Việt public point-cloud viewer is evidence the project exists, NOT authorization to copy geometry. Zero scan assets were downloaded or redistributed.
G0 remains PARTIAL/HOLD (three OSM paths are candidates only; no true ground-eye photo match, no verified street elevation/gradient).

## True graphics-completion gate
1. Obtain authorized bridge/stage survey or licensed BIM/photogrammetry, or independently photo-calibrate measured control points.
2. Pick exactly one verified ground-level sea-facing 20-30m hero section and model that section *by hand* as authentic architecture rather than cloned generic facades.
3. Match three camera viewpoints against the original photos with landmark reprojection tolerances documented and visible.
4. Replace generic mountains/park stage facade with actual terrain and licensed architectural models plus plausible textures and lighting.
5. Benchmark landscape iPhone WebGL hardware; performance target is separate from beauty target.
6. Owner assesses visual and explicitly approves >=70% before any Play merge.

## Source and output
scene-v3.js, signature-v3.js, build.cjs, qa-visual.cjs, index.html, server.cjs, related models/textures; SIGNATURE_3D_QA.json; 4 browser screenshots; VISUAL_V3_PHOTO_COMPARE.jpg.
Visual QA is HOLD. Technology QA is PASS. This distinction must not be collapsed.