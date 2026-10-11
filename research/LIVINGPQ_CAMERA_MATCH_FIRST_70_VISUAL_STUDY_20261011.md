# LIVINGPQ - Realism Study, Camera-Match First
**Date:** 2026-10-11  **Status:** RESEARCH COMPLETE / NO VISUAL PROMOTION / NO DEPLOY

## Problem to solve
Current 40m Three.js /street is truly movable and technically stable but rejected by the owner as cartoon-like and insufficiently similar. The owner needs a 3D environment that feels at least **70%** like actual Sunset Town from human perception, not photographic 100%. This percentage is a human acceptance gate, not a calculable pixel metric.

## Tested findings (on authorized PHUQUOCLUX, isolated)
- Source R15 `apollo-ref.jpg` and R13 `photos/07.jpg` have identical SHA-256 (`e1d7f8dc124344d273b6...`) and identical file size 725,005 bytes / 1920×1280. The R15 hero reference is NOT an additional independent viewpoint.
- Image-space Hough line preflight on existing downsized 2D images found 338 useful lines (46 >150px) for the front street photo, and 804 lines (128 >150px) for the oblique outdoor photo, where both vertical and perspective architectural edges exist. These are candidate inputs for MANUAL camera matching, not solved calibrated cameras.
- Poly Haven API inventory (accessed directly): `assets?t=textures` returned 867 entries, `assets?t=models` returned 521 entries. Filtering returned 302 candidate textures and 132 potential props; this is only metadata discovery, NOT quality/rights audit of every matched result.
- PHUQUOCLUX lacks Blender and fSpy; free RAM ~1.3-1.4GB, previously 4GB total. Do not force Blender 5.x on this machine: official minimum 8GB RAM and 2GB VRAM. Use separate suitable modeling workstation or an isolated heavier-capacity compute node, then transfer an optimized GLB to existing Three.js runtime.

## Concrete winning hypothesis
**Reference-camera matching + hand-authored landmark mesh + true PBR + preserved playable Three.js runtime.** Not single-view SOG, not billboard photos, not generic AI Mediterranean village, not procedural boxes. Blender import from fSpy or camera matching add-on img2cube can reconstruct plausible camera and guide proportions from real images. Observed angles must drive facade, corner, roof, frame and background positioning; unseen sides can be plausible but explicitly artistic.

### Keep, rebuild, discard
| Keep existing work | Rebuild | No longer use as primary solution |
|---|---|---|
| Three.js/WebGL runtime, mobile portrait controls, touch/joystick, navigation gates, QA instrumentation, 20s walk harness | Apollo steel-and-glass landmark, gallery with red ribbon, curved plaza/street, specific surrounding street edges, UV/materials, natural trees | Repeated procedurally generated city houses, large low-poly spheres, falsely estimated drone/GPS footprints, single-image Gaussian as freewalk world, projected whole-image textures, auto world-gen as final geography |

### Hero-scene scope (15-25m; FIRST 3 still renders then runtime)
1. Apollo front and glass teal facade. Distinct panel/framing geometry, pitched/rounded roofing, bronze gear/ring ornaments, entrance signs and sun motifs visible in licensed source.
2. Nearby Gallery mass treated as a SEPARATE landmark, distinctive pale walls and oversized wrapped red bow/ribbon, correct relative placement.
3. Curved ground path, paving levels, near storefront and planters. Build facade just beyond walkable cells, not a whole city.
4. Make 3 matched perspective views: front street, oblique from plaza, and side/near street. Existing aerial shot is for roof and arrangement, not a substitute for unobserved pedestrian side. Human visually judge against source.
5. Only if those 3 still viewpoints pass landmark/shape acceptability, export mesh to glTF + compressed maps and plug into existing browser controller and iPhone portrait runtime.

### 70-point visual rubric (human only)
| Component | Weight | Qualifying evidence |
|---|---:|---|
| Landmark silhouette & relationship (Apollo + Gallery) | 30 | 3 side-by-side matched-camera captures |
| Curved street, building order, camera eye level & pedestrian scale | 25 | Direct visual comparisons |
| Weathered PBR walls/roof/stone/teal patina/glass/bronze | 20 | Close-up reference plausibility |
| Door/window ratios and architectural motifs | 15 | Non-repeating facade details |
| Tropical urban ambiance, human-size props, foliage | 10 | Scene plausibility, no sphere-tree aesthetic |
| **Target >=70/100** | **100** | Score is **not** automatic measured geographic likeness; no signature failure allowed |

## Verified CC0 material/model leads (NOT YET RENDERED)
- Weathered exterior blue plaster: https://polyhaven.com/a/blue_plaster_weathered
- Weathered roof clay tiles: https://polyhaven.com/a/clay_roof_tiles_02
- Stone paving: https://polyhaven.com/a/cobblestone_pavement
- Naturalized tree model (must assess tropical fit): https://polyhaven.com/a/island_tree_01
- Street lamp model: https://polyhaven.com/a/street_lamp_01
These are generic licensed *detail* assets, not replacement for hand-authored Apollo/Gallery landmark geometry. Poly Haven license: https://polyhaven.com/license (CC0). Evaluate each chosen asset's scale and polygon count before importing, and aim for 1K/2K maps, not automatic full 8K/16K downloads.

## Evidence reference materials
- https://commons.wikimedia.org/wiki/File:Apollo_Cafe_daytime_street_view_Sunset_Town_Phu_Quoc_Vietnam.jpg
- https://commons.wikimedia.org/wiki/File:Apollo_Cafe_Sunset_Town_Phu_Quoc_daytime_exterior.jpg
- https://commons.wikimedia.org/wiki/File:DJI_20260214173618_0031_D_SUNSHINE.jpg
- https://sunworld.vn/vi/hon-thom/check-in/apollo-cafe-sunset-town-tuyet-tac-thi-tran-hoang-hon-lon-nguoc-cua-bill-bensley-20200
- https://sunworld.vn/vi/hon-thom/cong-trinh-bieu-tuong/muc-so-thi-bao-tang-nghe-thuat-sun-signature-gallery-tai-phu-quoc-29032
Commons images by Vivu Vietnam carry CC BY-SA 4.0; preserve provenance/credits and licensing if derivative photo textures are distributed. Owner/publisher photography outside those licensed sources is used for visual references, not automatically for redistributable game textures.

## Tool options reviewed
- fSpy: https://github.com/stuffmatic/fSpy and Blender importer https://github.com/stuffmatic/fSpy-Blender. Open-source still camera matching, not automatic hidden-side reconstruction.
- img2cube: https://extensions.blender.org/add-ons/img2cube/ - vanishing point camera match and points with known scale, unvalidated in our host.
- Alternative Perspective Match multi-camera Blender 5.1 add-on: https://github.com/soswow/blender-perspective-match, richer but more complex and Blender hardware cost.
- Three.js optimization: https://threejs.org/docs/pages/LOD.html and https://threejs.org/docs/pages/KTX2Loader.html
- Blender actual hardware minimum: https://www.blender.org/download/requirements/

## Hard gates and execution sequence
1. Deduplicate existing sources by SHA/pHash, classify actual camera direction. Build a 3-view reference sheet, where R15 and R13/07 count only ONCE.
2. Calibrate a single street reference manually (fSpy/Blender or equivalent) and model ONLY Apollo silhouette + Gallery relative mass. 1 hero-view render; evaluate against photo. If structural visual fails, iterate landmark mesh, NOT effects or controls.
3. Match another photo and test 3 different camera positions with same world-space geometry. If impossible, correct proportions and mark inferred surfaces; do not project unobserved facades from unrelated photos.
4. Upgrade surfaces via CC0 PBR (plaster, stone, terracotta, glass, metal), natural foliage/props, one deliberate afternoon lighting setup.
5. Visual board passes before any deploy: owner rates silhouette, layout, material and atmosphere. After pass, export optimized glTF 15-25m cell and reuse original portrait control in /street ONLY when explicitly approved.
6. Actual Android/iPhone device 20s navigation and FPS >=30 target after visual pass. No claim of mobile FPS from Windows SwiftShader.

## Decision
**Approve this as a RESEARCH DIRECTION, not as an accomplished 70% world.** No new attractive rendered model is yet built, no changes to public Play, no GitHub Actions, no worker deploy, no OpenPQ Core V1.2/CMS/auth/schema touched. Protect UniKey and PhuQuocLux files. Stop auto-numbering R versions for minor changes.