# Cinematic Sunset HDRI test - REJECTED, 2026-10-11

**NO LIVE DEPLOY.** A free CC0 1K sunset pure-sky HDRI from Poly Haven was downloaded and SHA/size-checked locally.
Asset: https://polyhaven.com/a/rosendal_park_sunset_puresky
Size: 1,234,480 bytes; MD5: 63bc9fde435342690300a6262e6e0cd7.

Experimental code added Three.js RGBELoader, switched the background/environment to HDR, hid existing shader sky. An actual local screenshot looked washed-out and overexposed, losing the saturated sunset mood; the first emulated iPhone QA also recorded unstable initial FPS (1 at sampling), Android later 45, and the overall QA resulted in HOLD. This is *not* reliable evidence of phone FPS.

The HDR integration was therefore REVERTED to the previous local procedural sky source; the small HDR file remains in the offline experiment for later calibrated lighting/lightmap research, **not served publicly**. Rebuilt and reran local tests: iPhone 390x844 and Android 412x915 BOTH gameplay PASS with software-renderer samples ~34/24 FPS, zero JS errors. No claim that performance satisfies physical mobile >=30 FPS.

Other experiment progress: True sloped 3D street with PBR paving/plaster/roof and actual game controls, seaward promenade, land clock tower, shoreline stage, two non-connected Kiss Bridge branches in the background and procedural foliage. Path test moved scooter 90.99m over 15s and hit its intended collision boundary. **Visual remains REJECTED**: facades repeat, palms/vehicles are simplistic, architecture and slopes not georegistered, current source is far below the quality of the approved cinematic image and cannot be represented as 70% accurate. User would rightly reject a premature live update.

Local archive: `C:\Users\My Day\Desktop\LivingPQ - Factory and Research\LIVINGPQ_CINEMATIC_VISTA_OFFLINE_20261011.zip` 15,024,548 bytes, SHA256 `276BCF4F863200F24AF67C0009AA07D538EF6D290F29644E1E22C8AA2593DF23`. Source remains at `C:\Users\Public\OpenPQ\livingpq-cinematic-vista-20261011` on authorized PHUQUOCLUX.

Required next: actual reference-aligned site modeling, professionally authored/blended geo-specific architecture, realistic optimized vegetation with alpha or scan assets, baked AO/lightmap; matched-angle 3 real WebGL previews before deploying to `play.openphuquoc.com`. Keep original Play runtime and Core V1.2 untouched.