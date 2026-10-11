# LIVINGPQ VISUAL RESET - HERO STREET MASTER LOCK V1.0
Date: 2026-10-11 | Status: DIRECTION APPROVED, GRAPHICS-FIRST | No deploy

## 1. End result
Create a real navigable 3D environment for Living Phu Quoc with image quality as emotionally rich as (or better than) the user-approved cinematic sunset/scooter reference. The reference is STYLE ONLY, never evidence of authentic geometry.
The target is a recognizable Sunset Town based on actual street orientation, plausible elevations and signature landmarks. User seeks >=70% recognizability (human-assessed, not a machine-verified geographic percentage) AND at least the approved reference's aesthetic ambition. No fake still image/video or single-view projections posing as a game.

## 2. Freeze and preservation
- FREEZE gameplay features, controls, car/scooter physics and expansion. Reuse working game runtime LATER, after visual approval.
- REJECT old generated house rows, box facades, sphere trees, procedural toy-city skyline and earlier geometry as the basis for this new environment. Preserve them only as technical/QA history. Do not try to cosmetically patch them.
- Keep play.openphuquoc.com unchanged, including existing root and /game. No Cloudflare, Core V1.2, CMS, ID/auth/schema, database, routes or DNS changes during graphics work.
- VPS-FIRST, local/offline graphics staging, Cloudflare-quota-safe. Protect UniKey and all PhuQuocLux apps/files. Do not force Blender workloads on the constrained 4GB Windows device.

## 3. Geographic gate G0 - before making visual meshes
- Select ONE real 20-30m downhill/terraced view with independently supported sea direction. If the desired straight route is imaginary, choose the closest actual route; NEVER invent a slope or alignment merely to match the key art.
- Use multiple independent ground photos, an aerial viewpoint and map/elevation evidence if available. Record source URL, credit, reuse rights, capture date/direction when known, and uncertainties. Deduplicate sources (R15 Apollo image = R13/07).
- Ground landmark geometry: Kiss Bridge comprises TWO seaward arms with a gap; the show-stage arches are separate onshore; the clock tower is landward. Validate relative order and bearing, not fabricated coordinates.
- Lock a consistent coordinate system and camera hypotheses. Camera/photo matching must state its fit errors; previous manual Apollo PnP error was too high to claim solved geometry.
- G0 HOLD when road/slope and landmark axis cannot be grounded. No invented GPS and no claims of geographic calibration.

## 4. Visual reset production - hero scene art
- Scope: a single 20-30m site-grounded hero stretch, its nearest facade geometry and appropriately detailed waterfront/sea distance. Do not model the entire island.
- Foreground: distinct actual-site-inspired facades modelled with DCC, not repeated boxes; balconies with real depth, arches, shutters, cornices, authentic varied roof silhouettes, awnings, signs and window recesses.
- Streetscape: true grade and retaining walls/railings, believable paving geometry and PBR material, steps and weathering. No giant tiled texture artifacts.
- Vegetation: optimized realistic tropical palms and flowering bougainvillea/planters. No cone palms, floating polygon branches, or sphere canopies in any hero view.
- Waterfront: correct separation of bridge and stage, credible shoreline, visible sea opening and depth. Low-detail background is acceptable only where geometry remains believable while viewing from other angles.
- Golden hour: controlled key/fill and shadow hierarchy, baked ambient occlusion or lightmap as appropriate, realistic window/glass/metal response, natural haze, water reflections, sky with restrained highlights. Avoid washed-out HDRI experiment.
- Production asset route: camera-reference guided manual modeling for site signatures; legal high-quality mesh/foliage assets for secondary dressing; optimized glTF/GLB and PBR texture maps, LOD/instancing/KTX2 for mobile as needed. Maintain provenance/license/mesh-scale/size manifests. Never assume a generic asset is faithful to Phu Quoc.

## 5. Only valid first deliverable: three TRUE 3D views
One and the same newly authored actual 3D scene must produce 3 saved UNEDITED WebGL/render-engine screenshots:
1) High-quality street-level hero looking seaward from the selected real path.
2) Distinct mid-street oblique view showing deep architectural geometry, vegetation and street surfaces.
3) Waterfront-facing or reverse-oblique view that checks signature shapes, their separations and scene consistency.
Include human-readable side-by-side contact sheet: real photographic references | actual 3D render | user-approved style image (explicitly labeled MOOD ONLY).
Also include sources and licenses, reproducible render steps/version hash, observed viewport/FPS and major visual defects. Desktop/software-rendered FPS is NOT actual phone performance.

## 6. Visual acceptance rubric - user approval gate
| Visual requirement | Weight | Example failure |
|---|---:|---|
| Signature landmark silhouette and relative position | 30 | Bridge wrongly connected, stage merged with bridge, false tower position |
| Grounded street alignment/grade and layout | 25 | Fantasy downhill axis or implausible geometry |
| PBR materials, professional cinematic lighting and atmosphere | 20 | Flat materials, plastic look, overexposed/washed-out sky |
| Believable architectural scale and unique facades | 15 | Identical cube facades, fake windows/balconies |
| Site character, foliage and lived-in atmosphere | 10 | Toy palms, absent depth or placeless decorations |
| TOTAL | 100 | User target >=70/100, but NOT an automatic similarity measurement |
FAIL regardless of score when a signature geographic relationship is wrong. FAIL when beauty is plainly inferior to approved sample. Do not call it ready because the scene compiles or movement works.

## 7. Only after graphics acceptance
- Reattach the EXISTING portrait walk and scooter controls (no new gameplay design). Verify same geometry persists through turns and a 20-30s uninterrupted journey.
- Run physical iPhone and Android profiling with graphics presets/LOD; aspire to stable >=30fps on agreed hardware, never misstate Edge emulation as real mobile QA.
- Deploy to an isolated, reversible Play preview route only after explicit owner approval. Root stays unchanged unless user later requests promotion.

## 8. Current truth and next action
Visual reset is approved as a direction, NOT implemented to target quality. No new hero assets or verified 70% likeness exist yet.
Next task is G0: assemble independently sourced true-site images/angles and decide the actual downhill/sea-facing route; then author source-grounded hero facade/terrain meshes in a capable DCC workflow. Next user-facing deliverable must contain three actual 3D screenshots, not a new AI moodboard, and a transparent pass/hold verdict.