# LivingPQ Apollo + Gallery - Hero Geometry Experiment

**Date: 2026-10-11. VISUAL REJECTED / 70% NOT MET. LOCAL ONLY.** This is a continuation of LivingPQ R15-24, not a restart.

## Actual work completed
An isolated real Three.js/Edge WebGL scene modelled from the distinctive outlines of two separate structures. Apollo glass pavilion in front (teal framed curved tower, attached glazed wing, bronze coupling ring assembly), Sun Signature Gallery behind (mottled mint drum, green roof, oversized red bow), a curved plaza edge, background buildings and sculptural fountain. Most dimensions and coordinates are artist approximations, NOT a measured site.
Poly Haven CC0 assets downloaded by their official asset API and hashes checked: 1K color, normal and roughness maps for blue plaster, cobblestone pavement, clay roof tiles (9 maps); glTF models street_lamp_01, planter_box_01, potted_plant_04 (~6.3MB total). Links and per-map provenance: `TEXTURE_PROVENANCE.json`, `CC0_MODEL_MANIFEST.json`.

## Human comparison - please review this first
[REAL PHOTOS vs actual WebGL screenshots](evidence/LIVINGPQ_APOLLO_GEO_2X2_REVIEW.jpg) shows 2 source viewpoints next to their **approximate** game views. Photography: Vivu Vietnam, Wikimedia Commons, licensed CC BY-SA 4.0. Comparison is qualitative, not an exact matched focal camera.
[Actual rendered front screenshot](evidence/HERO_plaza-front.png).

## What passed
- Built a real, continuous geometric environment with genuine 3D surfaces and project-owned JavaScript source (`scene.js`), compiled through esbuild on PHUQUOCLUX.
- Rendered 4 viewpoint screenshots on Microsoft Edge in a separate local static server, no live play domain access; WebGL initialization, 3D material loading and images PASS, no app errors.
- Approximately 94,214 manually-authored mesh triangles and 1,523 geometry meshes in local test. Edge software-based sample reports about 17-21 FPS, **NOT iPhone FPS**.
- No OpenPQ Core changes or Play deploy.

## What failed / remains missing
- Qualitative visual goal of 70% similarity to actual Sunset Town remains **NOT PASSED**. Rooflines, Gallery's actual facade levels, broad cafe wing and bronze ports, proportions of buildings at street level and foliage are still too schematic.
- Experimental solvePnP with 8 **manually estimated** photo<>model correspondences of Commons aerial photo 08 yielded RMS reprojection error **65.4 pixels**, maximum **89.6 pixels**; test marked `REJECT_CAMERA_NOT_RELIABLE`. Not a calibrated real camera, no georegistration. See `MANUAL_PNP_CAMERA_CHECK.json`.
- This is a stationary camera-view **visual gate**, NOT a new fully playable game yet. The old /street remains a walking physics / touch control reference.
- Did not run on physical iPhone or Android. Browser FPS on software renderer cannot be treated as mobile GPU performance.

## Next specific engineering gate
1. Annotate reliable architectural points on independently licensed front, oblique and aerial views; remove duplicate photo sources (R15 hero and R13/07 SHA identical).
2. Correct model's world-space dimensions and shape **before** camera fitting; verify reprojection across at least two independent images. Accept only when the residual is meaningfully lower and perspectives line up with observed structural edges. Never manipulate matches solely to produce a good number.
3. Replace remaining synthetic facades, radial bronze gear, cloth bow and generic roof domes with separately authored detailed mesh components from observed images. Keep realistic CC0 textures and props; do not add low-poly repeated towers.
4. Produce three human-comparable WebGL screenshots, obtain explicit visual direction approval, THEN integrate GLB/mesh into existing Play portrait controller. Draw-call optimization is needed before mobile (current >1500 draw objects).

## Reproduction on authorized PHUQUOCLUX
Local directory: `C:\Users\Public\OpenPQ\living-apollo-camera-matched-hero-20261011`.
`node build.cjs` (depends on existing offline Three.js/esbuild node_modules in original authorized environment).
`node qa.cjs` renders four browser screenshots and `HERO_QA.json`.
`python test-manual-pnp.py` yields `MANUAL_PNP_CAMERA_CHECK.json` and overlay evidence.
Source asset download scripts `fetch-pbr.py`, `fetch-cc0-models.py` use public CC0 Poly Haven endpoints with hash verification, but downloading repeatedly is unnecessary. All files are packed locally for handoff.

## Master lock
NO MERGE/DEPLOY, no changes to `play.openphuquoc.com`, Core V1.2, CMS, ID/auth/schema, Cloudflare quota experiments, paid APIs, GitHub Actions. UniKey/PhuQuocLux apps and data untouched. Do not claim 70% achieved.