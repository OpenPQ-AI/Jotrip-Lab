# LivingPQ - Real Sunset Vista, CINEMATIC GAME PROOF
Date: 2026-10-11. Status: ISOLATED WEBGL PLAYABLE / VISUAL FAIL / NOT DEPLOYED

## Objective
Carry forward the user's reference-image quality target as a *minimum aspiration* for a true free-roaming 3D game, but never reproduce the sample's fabricated Kiss Bridge, buildings, road alignment or fake minimap. No new still image or slideshow.

## Verified visual anchors
- Original 2026 photo used only as reference: https://commons.wikimedia.org/wiki/File:Kiss_Bridge_Phu_Quoc_aerial_sunset_view.jpg (Vivu Vietnam, Commons CC BY 4.0; Commons's EXIF creation date differs from file upload date and camera-location tag so do not assert precise photo GPS).
- Actual Kiss Bridge is TWO independent arms with a near-meeting gap over the sea, while show-stage arches are a SEPARATE structure on the shore. The model separates them. The La Festa clock tower belongs on land.
- Town is terraced Mediterranean-inspired housing facing southwest sea. Official brochure and Sun Group property references anchor district composition; coordinates and elevations for *this prototype* are not surveyed. https://sungroup.com.vn/en/sunsettown
- The Center developer/property examples document 5-storey shophouses and higher hillside terrain, but this 70-m experimental road is NOT an accurate digital-twin route. Source: https://www.sunset-town.com/en/kham-pha-thi-tran-hoang-hon-sunset-town-thi-tran-dam-chat-dia-trung-hai-tai-phu-quoc/

## Implementation completed
- New, isolated, 100% realtime Three.js scene with shader-driven sunset sky and bay water, continuous sloped paved walkable corridor, two separate curving Kiss Bridge arms with a visible gap, shore show arches, landward clock tower, asymmetric facade modules, tropical vegetation, warm lamps and CC0 PBR stone/plaster/roof textures.
- Reused and adjusted established mobile portrait joystick, free-look, walk/scooter, reset, camera and conservative collision runtime from prior Play Apollo. Actual geometry remains solid when moving camera; neither single image projection nor fake gameplay.
- Reused real Poly Haven CC0 glTF props and textures from previous source. Batching static meshes. GLTF props load after game can begin.
- Removed waterfront shop buildings blocking straight-line sea vista; corrected road texture repetition and sky palette after *visual* inspection of Edge screenshots.

## Factual QA
- `GAME_QA.json`: BOTH Chromium emulated iPhone 390x844 and Android 412x915 pass movement/turn/drive/restart with zero application JS errors. Edge software FPS samples 49 and 19 on last QA (not real phone FPS).
- `VISTA_ROUTE_QA.json`: 15-second continuous scooter input: 5sec ~32.5m; 10sec ~75.45m; 15sec ~90.99m, stops at designated promenade collision bound (185 collision frames accumulated while holding forward). Final `ACTUAL_DRIVE_ROUTE_PASS` means functioning controls, NOT visually accepted game.
- Screenshots available locally on authorized PHUQUOCLUX: `GAME_IPHONE_390x844_START.png`, `GAME_IPHONE_390x844_SCOOTER.png`, `VISTA_SCOOTER_5S.png`, `VISTA_SCOOTER_10S.png`. User explicitly rejects toy-like city; these real WebGL screenshots remain aesthetically far below approved cinematic key art.
- Source at `C:\Users\Public\OpenPQ\livingpq-cinematic-vista-20261011\scene.js`, with `index.html`, `build.cjs`, `server.cjs`, `textures/`, `models/`, `qa-game.cjs`, `qa-route.cjs`. Build `node build.cjs`, local QA `node qa-game.cjs`, route test `node qa-route.cjs` on authorized Windows machine with prior local Three.js/esbuild deps.

## Visual verdict: REJECT, despite real playability
Current frontend screenshot reveals duplicated detailed-but-regular facades, basic low-poly palm fronds and scooter, flat facade shading, missing visible people, too small distant bridge from starting viewpoint, and weak cinematic composition compared to user's approved image. The shore photo and terrain should drive a *site-specific Blender/glTF art asset pipeline* instead of deeper ad-hoc cube generation. Do not claim 70% geographic match or 'at least as beautiful as reference image'.

## Next high-value tasks (not another R-number iteration)
1. Establish actual site camera path and rough 3D positions with independent photos, aerial references and ground elevation evidence. Select a 20-30m true route with seaward view and visual landmarks that the user recognizes.
2. Author actual recognizable facade assets and landmark meshes in a proper DCC workflow, UV unwrap weathered materials, use geometry-based shutters, door arches, balconies, rooftop trims, flowers, and realistic trees with alpha cards or scanned foliage. Use actual site references for signature features rather than generic procedural houses.
3. Bake ambient occlusion, add appropriate lighting volumes/lightmaps, denoise sunset environment and a realistic sky/water reflection; then optimize LOD/KTX2/Draco for phone.
4. THREE MATCHED WebGL still shots at 3 different camera positions must first pass owner visual review. Only then run 20-30 second game movement and real physical iPhone/Android FPS target >=30.
5. Existing `play.openphuquoc.com` root stays unchanged with previous Apollo game until a substantially better visual passes. Do not merge this experiment just because QA is green.

## Safeguards
NO prod/Cloudflare tests, no Core V1.2/CMS/identity/auth/schema, no paid API, no installed Windows apps, preserve UniKey and PhuQuocLux. Work VPS-first if additional computation needed. No invented exact coordinates, no AI-generated 2D images falsely presented as rendered game.