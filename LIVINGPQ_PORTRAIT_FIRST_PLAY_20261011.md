# LivingPQ orientation switch - PORTRAIT FIRST
Date: 2026-10-11. User tested play.openphuquoc.com on Android and confirmed forced landscape unusable. PhotoWalk-only experience also rejected as insufficiently game-like.

DECISION: On Play and for future LivingPQ designs, portrait is PRIMARY, usable on Android and iPhone without a rotate gate. Landscape optional, no mandatory orientation. Do not reinstate landscape gate without new explicit approval.

Verified current live Worker: `openpq-living-play`, version `3bbf2e26-f8e2-4322-9748-dc8862c8ca51`.
Public paths:
- `https://play.openphuquoc.com/` - true photo point-of-view browsing with 4 real licensed Apollo images; swipe/next, not a 3D game.
- `https://play.openphuquoc.com/3d/` - REAL interactive WebGL 3D Apollo art-prototype; joystick & drag look, still visually REJECTED; clearly labeled as artistic approximation, not surveyed scan.

Guardrails:
- 390x844 iPhone-like and 412x915 Android-like mobile browser dimensions, plus 844x390 landscape, local QA passed. CDP real simulated touch swipe, 3D joystick movement ~1.3m and look rotation passed. Public Edge mobile emulation passed both portrait sizes with zero app JS errors.
- On PHUQUOCLUX, deployed source candidate: `C:\Users\Public\OpenPQ\living-apollo-photowalk-20261011\portrait-candidate\public`, worker in adjacent `src`.
- No physical Android or iPhone Safari hardware QA performed; user is expected to test on phone.
- Visual 3D NOT approved, no game quality-pass, no continuous surveyed architecture or fake GPS.
- No Core V1.2 / CMS / identity / database changes, no paid AI, no GitHub-hosted Actions; reused existing Worker and domain.
Rollback to earlier approved photo-only Worker version `1d996234-57fc-43d1-ae99-ea609db42353` or original Proof A `79fb84f6-9a30-439d-9819-3804b807bf79` depending desired scope.

NEXT: improve true game architecture and 3D visual, without falling back to static photos posing as gameplay.