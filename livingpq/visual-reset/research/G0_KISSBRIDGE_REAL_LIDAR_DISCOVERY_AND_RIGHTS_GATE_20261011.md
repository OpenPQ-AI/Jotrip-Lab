# LivingPQ - SOURCE GATE: Genuine Kiss Bridge 3D laser scan located
**2026-10-11 · Visual Reset · G0 research · NO EXPORT / NO DEPLOY / NO GAMEPLAY CHANGES**

## Evidence: professional site geometry exists
- Real construction scanning vendor: **Hop Nhat Bach Viet Co., Ltd. (Hợp Nhất Bách Việt)**. Published [case study](https://bachvietunited.com/3d-laser-scanning-of-kiss-bridge-project-in-phu-quoc-city/) states Trimble X7 terrestrial laser scanning, geodetic control with Leica total station, both bridge arms, stitched point clouds by Trimble RealWorks.
- The public QR in their article was successfully decoded to **https://geo.bachvietunited.com/cau-hon-phu-quoc/**. On 2026-10-11 the URL returned HTTP 200, HTML title 'DỰ ÁN CẦU HÔN PHÚ QUỐC'. In a headless Microsoft Edge trial the page showed a loading indicator after ~12s and *no rendered point-cloud canvas*. Therefore **existence of advertised point cloud is verified by vendor, but current in-browser 3D viewing / access to raw points is not confirmed**.
- Professional designer [Archea Associati project page](https://www.archea.it/en/progetto/kiss-bridge/) documents **two curved arms** with a near-meeting **~0.50 m gap**, sloping sections >400m and central elevation roughly **16 m above sea level**. These numbers must be treated as published project specs, not inferred from generated model.
- Vendor phone: 0903692185; business email: viet@bachvietunited.com. Both are listed publicly in the vendor's case study. Consent and permissions are NOT yet acquired.

## Critical legal gate
**DO NOT download/copy/redistribute private point-cloud tiles, network responses, meshes or exported E57/LAS/LAZ/PTS** just because a QR exposes a viewer. A public online viewer is not a copyright/data-use license. Seek explicit written permission from the contractor AND the rights holder / commissioning client (Sun Group) for derived models and web gameplay redistribution.
Possible request: licensed, georeferenced, decimated ground truth .e57/.las/.laz or approved .obj/.glb of the bridge and support infrastructure, permission to derive and distribute web LOD assets, commercial/noncommercial scope, attribution, derivative rights, access and pricing. If permission denied, use published photo/dimension references only, manually author site-accurate mesh, never relabel guessed 3D as scan.

## Reference and terrain evidence (local, trusted)
- Local bounded OpenStreetMap snapshot: 664 objects, 636 ways, 480 generic building footprints, 66 footways, 22 stairs. This is only 2D route/footprint data; no accurate building geometry.
- SRTM30m via OpenTopoData: northern coastal C1 candidate ~17-21 m elevation over ~113 m; hillside steps C3 ~26-28 m over ~39 m. **30m DEM is NOT a surveyed street grade.**
- Existing CC-licensed Commons real site photo references include photo of hillside town towards the sea and an aerial of *separate* Kiss Bridge + shore show arches. Photo camera extrinsics and pixel-coordinate locations not validated, and Commons EXIF on at least one photo may not reflect shooting location.
- Map and candidate routes: `livingpq/visual-reset/research/G0_CARTOGRAPHIC_GATE_REPORT_20261011.json`. Ground truth G0 remains pending a verified street-level camera and fine-grade elevations.

## New graphics-only WebGL experiment (rejected)
- Isolated local path `C:\Users\Public\OpenPQ\livingpq-g0-signature-art-20261011` on PHUQUOCLUX. New scene; no old Apollo/Sunset boxes reused and no gameplay.
- Source-authored prototype stage arches, two separate curved bridge arms, real CC0 palm GLB and Poly Haven PBR. Captured 3 actual browser WebGL views (hillside, promenade, bridge), at 1200×800 plus portrait. Test had no JS errors and visual mesh continuity but **is NOT approved**.
- It visually fails: island looks like a floating slab, sky and water are unconvincing, geometry crude; Edge software rendering reported 3-10 FPS. More importantly the synthetic model's **~4.4m bridge tip gap** contradicts the authoritative ~0.5m design spec. It is a strict G0/visual FAIL, must not appear on Play and must not be used as a source of truth.
- Local QA `SIGNATURE_3D_QA.json`, screenshots `ACTUAL_3D_*.png`, asset provenance `LICENSED_ASSET_MANIFEST.json`. These are diagnostic evidence only, not user-facing visual achievement.

## Implementation priority from this discovery
1. **Acquire rights-approved survey/BIM or point cloud reference for signature structures**, starting with Bách Việt and/or design firm. If available, validate unit/metres, coordinate system, surveyed year, occlusion and coverage before any conversion.
2. Create a reproducible *site geometry* pipeline in adequately resourced VPS/DCC environment: point cloud → classify/decimate → watertight simplified architectural mesh with authored material UVs → compressed GLB/LOD for WebGL. Preserve raw source privately with access control, do not expose point data or license-breaching assets.
3. Separate **geometry truth** (licensed scans/dimensions) from **cinematic art** (PBR, lightmaps, trees, sky, props). One true scene must withstand 3 distinct unedited in-engine camera captures.
4. Freeze Play production and prior working walking/scooter code until graphics approval. No image-gen renders presented as game. Target visual beauty >= user's reference image; 70% geographic recognizability is a *human target*, not achieved.

## Strict verdict
**SOURCE DISCOVERY PASSED**: verifiable laser survey provider and link found.
**RAW ASSET ACCESS / LICENSE NOT PASSED**; the publicly linked viewer remained loading in Edge QA.
**GRAPHICS NOT PASSED**; no credible 70%-recognizable playable 3D scene yet. Do not claim otherwise.