# Sóng Living Water V1.1 - OpenPQ AI

**Owner-approved visual handoff:** `OPENPQ_AI_SONG_LIVING_WATER_IMPLEMENTATION_HANDOFF_V1_1_20261011.md` (11 October 2026).

**Target**: `https://ai.openphuquoc.com/` (existing isolated AI Guide Worker, not OpenPQ Core).

This folder is the exact **UI overlay source** for the existing AI Guide runtime, **not** a complete standalone Worker. Do not deploy it as a new Worker without the original worker modules and bound services.

## UI integration

- `public/index.html` - S0/S1/S2 markup; no static hero poster; deep-ocean default.
- `public/song-v1.js` - existing real text, STT, Whisper, Gemma, TTS event handlers. No fake timers to manipulate mic/STT/TTS states. Sets `document.body.dataset.state` on true runtime transitions.
- `public/song-v1.css` - existing layout and safe-area/keyboard fallbacks.
- `public/song-living-water.css` - 3 real compositor ripples, pearl float, light, water reflection and compact presence. Includes listening/thinking/speaking/error, reduced-motion and visibility pause.
- `public/song-symbol-water.png.base64` - **base64 of a PNG** (GitHub text-only upload). Decode to `public/song-symbol-water.png` before serving:

```bash
python3 -c "import base64,pathlib; p=pathlib.Path('public/song-symbol-water.png.base64'); p.with_suffix('').write_bytes(base64.b64decode(p.read_text()))"
```

The symbol is a **non-generative crop of the previously approved Sóng raster** already deployed in the AI Guide product. The supplied transparent `SONG_SYMBOL_PROVISIONAL.png` was QA-reference only and has edge noise; obtain a final QA-approved transparent master before branding lock. No AI-generated new symbol.

## Integration boundary

Copy these assets into an isolated release copy of the already-authorized `openpq-ai-guide-edge-preview` Worker, retain its existing `/api/turn`, `/api/transcribe`, `/api/speak`, modules, Cloudflare bindings, routes, limits and secrets. Add `/song-living-water.css` and `/song-symbol-water.png` to the allowlisted static assets. Never change `openphuquoc.com`, Core V1.2, /weather, /airport, /transit, CMS or identity.

## Evidence and caveats

Staging ran on Windows PHUQUOCLUX local HTTP server, with Puppeteer mobile viewports 320x640, 375x667, 390x844, 430x932 and desktop 1440x900. Result: S0/S1/S2 without overflow, 3 changing ripple transforms, source-of-truth thinking state when a mock AI HTTP request was pending, reduced motion, and no page errors. Background microphone, actual VieNeu waveform, STT and live quota failure conditions require device-level QA.

No screenshot or video is claimed to be captured on a physical iPhone. Screenshots from Chrome emulation must be labeled accordingly. Do not invent FPS, battery/heat metrics or real iPhone audio validation. Production rollout requires live smoke checks and a real-device Safari QA gate. Roll back by restoring the previous verified AI Guide Worker version with Wrangler.

## Performance

Static CSS transforms/opacity; no WebGL or third-party animation library; no new paid AI or GPU services. The transparent symbol PNG is approximately 15 KB; the water CSS approximately 15 KB before gzip.
