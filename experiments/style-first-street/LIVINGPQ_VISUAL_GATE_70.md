# LivingPQ - Visual Fidelity 70 Gate (2026-10-11)

**User target: Sunset Town immediately recognizable at about 70% by human inspection. Current /street VISUAL REJECTED. Technical walking proof only.**

## Visual comparison
LIVINGPQ_70_TRUTH_VS_LAB.jpg compares two real Apollo photos (Vivu Vietnam, Commons CC BY-SA 4.0) and a WebGL screenshot of current /street. No quantitative similarity measurement has been claimed.
Photo 1: https://commons.wikimedia.org/wiki/File:Apollo_Cafe_daytime_street_view_Sunset_Town_Phu_Quoc_Vietnam.jpg
Photo 2: https://commons.wikimedia.org/wiki/File:Apollo_Cafe_Sunset_Town_Phu_Quoc_daytime_exterior.jpg
Drone context: https://commons.wikimedia.org/wiki/File:DJI_20260214173618_0031_D_SUNSHINE.jpg
Official design: https://sunworld.vn/vi/hon-thom/check-in/apollo-cafe-sunset-town-tuyet-tac-thi-tran-hoang-hon-lon-nguoc-cua-bill-bensley-20200

## Why the /street visual fails
1. Fake symmetric street corridor versus Apollo Square, curved road, landmarks and real varied building arrangement.
2. Cartoon polygon cylinder instead of characteristic patinated teal, articulated faceted Apollo café glass facade, bronze circular motifs, porch entrance and suns.
3. Separate Gallery and oversized red ribbon/bow are not shaped or placed recognizably.
4. Repetitive generic windows/floors/roofs, no observed real architectural diversity.
5. Trees are spheres; fake cloud solids and flat textures/plaster/stone ruin realism.

## Human visual rubric (not machine-calculated)
| Component | Weight | Evidence required |
|---|---:|---|
| Apollo + Gallery silhouette/relationship | 30 | Front, oblique, side views against real photo |
| Site geography and street perspective | 25 | Correct curved road, plaza, building order, position |
| PBR materials, lighting, realism | 20 | Patinated glass/teal metal, bronze rings, stucco, natural foliage, textured stone |
| Proportions and human scale | 15 | Width, height, windows, doors, floor heights plausible |
| Distinct local atmosphere | 10 | Recognizable tropical urban details |
| Total | 100 | At least 70/100 *human-rated* and NO signature failure |

The 70% threshold is the owner's acceptance target, not a calculated likeness metric. If Apollo signature or square layout is wrong, fail even when other categories rate highly.

## Implementation decision
- Do NOT write another generic-city script. Preserve /street only as a technical proof; no further deployment unless 3 real distinct WebGL view screenshots can be compared against the reference and the user is satisfied with the visual direction.
- Rebuild only a 15-25m accurate-looking Apollo frontage and neighboring Sun Signature Gallery with curved street, then expand.
- Use authored landmark mesh, photogrammetry reference and calibrated approximated proportions; use real PBR stone/glass/stucco and realistic foliage assets with compatible licenses. Many free modular building kits are still cartoon-like or geographically wrong.
- CC0 PBR source audited: https://polyhaven.com/a/cobblestone_pavement . Use 1k/2k maps and glTF mobile optimization, not 8k assets on 4GB Windows.
- Three reference-aligned angles first. Gameplay and performance QA after visual acceptance.
- No claim of production-ready photoreal 3D or achieved 70%. No Core V1.2 or other app modifications; no deploy, schema, CMS, auth, DNS, fake GPS, GitHub Actions, or paid API.