# Living Phu Quoc - Visual Quality Reference Lock
Date: 2026-10-11
Status: USER-APPROVED TARGET, NOT IMPLEMENTED
Branch: isolated research. NO DEPLOY, NO MERGE, NO CORE V1.2 CHANGE.

## User decision
The approved generated cinematic Sunset Town downhill-to-waterfront image sets the **minimum visual aspiration** ("từ cỡ này hoặc hơn"). It is a mood and production-quality reference, NOT geographic or architectural truth. Never present the image itself, a photo slideshow, a 2.5D billboard, or an AI video as a playable 3D world.

## Two distinct gates
- **Geographic plausibility**: use actual street axes, elevation direction, relation of buildings, real landmarks (especially Kiss Bridge) from independent trustworthy aerial/ground photos and maps. A game's player should immediately recognize the real Sunset Town. User's aspirational relative similarity threshold is >=70% human evaluated, not an automated metric. Do not claim achieved 70% or invent coordinates.
- **Cinematic experience**: rich golden-hour sky; strong light/dark hierarchy; believable cobblestone PBR (base/normal/roughness); architecturally distinct façades; natural tropical foliage/bougainvillea, warm lamps, visible sea and atmospheric depth, crowds and movement at believable scale. This style must survive camera rotation and user movement. Screenshot comparisons must show actual rendered WebGL frames, NOT generated stills.

## No false performance promises
The approved sample is a *pre-rendered illustration*, not a proof that same fidelity is achievable on all mobile browsers in real time. The implementation must be performance-tiered: foreground high-detail mesh and materials, midground modular faithful 3D, distance LOD/instancing/impostors only where spatially safe. Measure on physical mobile devices; software-rendered Edge frames are not physical-phone FPS. Target portrait 30 FPS on specified test phones, with graceful downscaling.

## Preserve prior work
Keep the existing Play WebGL runtime, keyboard/touch, scooter/walking controls, collision checks, input feedback, QA, Cloudflare-safe static delivery and rollback. Existing /street and Apollo hero tests remain technical/architectural learning, NOT visually approved scenes. Do not start over from a screenshot or use generic low-poly box-building procedural town as the primary scene.

## Next production gate: 15-30 meter signature route
1. Pick a real downhill viewpoint with geographic evidence from photos/map. Lock street axis, nearest building masses and sea/landmark bearing.
2. Create three real WebGL stills from the *same persistent 3D scene* (street eye-height, street-oblique, looking toward waterfront), side-by-side with verified reference photos and the aspirational mood image. Stage quality: no crude spheres, toy-looking roofs or flat sky.
3. Rate against landmark silhouette/position (30%), street layout/direction (25%), surface/lighting (20%), scale/proportions (15%), local life/ambience (10%). Fail outright when signature landmarks or road direction are wrong. User must explicitly approve the visual gate.
4. Add 20-30 seconds *continuous, controllable* walking and scooter movement through the accepted 3D scene. Verify no scenery breaks behind the camera, no fake parallax, and mobile portrait controls.
5. After owner visual approval, move isolated build to play.openphuquoc.com in a separate versioned route with rollback. Do not overwrite approved content until required QA passes.

## Explicitly out of scope for this lock
This document does NOT claim any new scene, GLB or gameplay has reached the approved image's visual quality. No assets/deploys needed just to record this quality bar. No new image generation is requested by the user's approval. Respect VPS-FIRST, Core V1.2 immutable, no CMS/schema/auth changes and Cloudflare quota safety.
