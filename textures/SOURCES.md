# Resonant demo — texture sources and processing

## v2.5 (2026-11-11) — high-resolution set + layered rim from photo evidence

- **Hires set** (`textures-hires/`, 16 files + README, `resonant-textures-hires.zip`
  18 MB): faces/back at 4096×3111 (Lanczos from the 2350 native), true
  handle1 re-extracted (922×2260), handle2 at 980×2670, decals 2–3×, rim
  (see below). Approved by Henry for the live demo, on condition it does
  not conflict with what the client published — it does not: every texture
  comes from the client's own published photos, except the rim (below).
- **Layered rim** (`blade_rim_albedo.jpg`, 1024×4096, md5 `b6c0fd138526`):
  the old fir strip was uniformly orange-tan (mean 180,116,63) — wrong tone
  and no layers. Evidence: the 3/4-angle official photo
  `tier1_67_palis_straight_4.jpg` (5475px) shows the real edge as a pale
  cream band (scanline: 235,215,198) with the dark face beginning abruptly
  at its inner side. The UV mapping was verified from `model/uv_map.json`
  (box projection): for blade rim primitives U = Z (the 6 mm thickness,
  full 0..1) and V = Y (perimeter) — so the layers vary across the image
  width. Built from the fir strip: middle retinted toward the photo's
  cream (209,177,147) keeping the fir grain, outer bands dark rosewood
  (72,46,46 at 0.85 alpha, grain showing through) at 12% of the thickness
  each side, feathered 8 px. Proportions are approximate (exact ply
  thicknesses still unknown); the structure (dark outer veneers + pale
  spruce middle) matches both the photo and the published ply facts
  (rosewood outer, Resonance Spruce intermediate, hide glue). Roughness
  map unchanged (fir-derived).

## v2.4 (2026-11-11) — high-resolution TRUE face (front + back), developed not copied

Henry's challenge: we develop the racket and make it more realistic — not
just take what's there. The answer is in the realism corpus itself: the
client's 2048px photos are downscaled copies of the official site's 6091px
originals (manifest-curated.json: tier0_01 = duplicate of tier1_77, 6091px).
The same photo, three times sharper, real detail — no invention.

- **Front** (`blade_face_*`, 2350×1784 native): re-extracted from
  `tier1_77_palis_flared_1.jpg` (6091×6091, official media library), same crop
  as v1 scaled ×6091/2048 (x1843–4193, y1338–3122), flat-field corrected
  (±10% cap). Mean RGB (76.4, 50.7, 50.0) matches v1 (74.9, 49.0, 48.5) —
  same photo, same tone, 3× the native pixels.
- **Back** (`blade_back_*`, 2350×1784 native): separate texture from
  `tier1_50_palis_flared_3.jpg` (6091×6091, the back photo), same crop —
  the real back has its own grain pattern. Mean RGB (74.1, 47.0, 45.7).
- viewer.js now classifies blade faces by **signed** normal Z: front (+Z) and
  back (−Z) get their own materials (`bladeFaceFront` / `bladeFaceBack`).
  Handle face_z primitives are unaffected (applyHandle treats any non-cap
  class as the face material).
- md5 (first 12): face albedo `3cb8854e59c0`, rough `be8088937de9`,
  normal `6ad5015872c4`; back albedo `54a3c2590461`, rough `2cd77781fe96`,
  normal `b654789896f2`.
- What is still NOT invented: the layered edge. Ply count/order/thicknesses
  are unknown, so the rim keeps the labelled fir stand-in; a layered edge
  would be fabrication, not development.

## v2.1 (2026-11-11) — fix: back face black + face figure mismatch

Live diagnosis (browser screenshots + pixel sampling, 2026-11-11 02:12–02:17):
- **Back face entirely black** (centre RGB 14,5,6 vs front 114,84,84 —
  8–10× darker, darker than the page background). Rotation test: turning
  the same back face toward the light brightened it ~6×, so the texture
  was present and correct — the cause was LIGHTING, not the texture.
  The front key light (180,260,320) leaves the back face almost
  unlit. Fix: a back key light mirroring the front key
  (-180,260,-320, intensity 2.0) in `viewer.js`.
- **Face figure mismatch.** The v2 library rosewood (rosewood_veneer1)
  shows large cathedral/flame ovals with dark centres; the real blade
  (client photos) has fine straight longitudinal grain, no figures.
  Every vertical band of the 16K master was checked — all contain
  cathedral figures; no straight-grain band exists in that texture.
  Fix: the face albedo + roughness were restored to v1 (the client's
  own photo — the only texture that can match by definition); the
  normal map is now Sobel-derived from that photo. The retired
  veneer1 masters stay in `v2-masters/` for reference.
- Also checked as an alternative: Poly Haven `rosewood_veneer_02`
  (free via API up to 8K — the earlier "Wood Vault" claim was wrong),
  straight horizontal grain, 8K masters downloaded + md5-verified
  (`rosewood_veneer_02_diff_8k.jpg`, `..._rough_8k.jpg`). NOT used:
  it is still a different piece of wood (elongated lens figures),
  and the goal is to match the original photo, not a similar wood.

## v2 (2026-11-11) — library PBR masters (CC0), graded to the product

Masters are kept at full resolution in `textures/v2-masters/` (NOT shipped
to the page — the 16K files alone exceed GitHub's 100 MB file limit).
Shipped files are derived from them by the reproducible script
`../build_textures_v2.py` (build log: `../build_textures_v2_log.json`).

| Shipped file | Size | Master (verified) |
|---|---|---|
| blade_face_albedo.jpg | 4096×4096, 5.4 MB | Poly Haven `rosewood_veneer1` Diffuse 16K JPG (122.9 MB, md5 e1f7e96e…), CC0 |
| blade_face_roughness.jpg | 4096×4096, 1.2 MB | Poly Haven `rosewood_veneer1` Rough 16K JPG (42.8 MB, md5 45c1c589…), CC0 |
| blade_face_normal.jpg | 4096×4096, 2.4 MB | Poly Haven `rosewood_veneer1` nor_gl 16K JPG (82.3 MB, md5 c3f7158d…), CC0, OpenGL |
| handle1_albedo.jpg | 2048×2048, 1.2 MB | Meshy smooth-dark-wood PBR 4K (CC0, ambientCG Wood027), colour 4K |
| handle1_roughness.jpg | 2048×2048, 0.9 MB | Meshy smooth-dark-wood PBR 4K, roughness 4K |
| handle1_normal.jpg | 2048×2048, 0.6 MB | Sobel-derived from the graded handle1 albedo (rotation-safe) |
| blade_rim_albedo.jpg | 1024×4096, 0.7 MB | Meshy fir-wood PBR 4K (CC0, ambientCG Wood092), clean strip x2900–3500 |
| blade_rim_roughness.jpg | 1024×4096, 0.5 MB | Meshy fir-wood PBR 4K, roughness, same strip |
| handle2_albedo.jpg / handle2_roughness.jpg | unchanged v1 | Client photos (see v1 section) — a plain padauk texture would destroy the 3 light stripes |
| butt_medallion.png / handle1_label.png / serial.png | unchanged v1 | Client photos (see v1 section) |

Rules applied in v2 (and why):
- **Colour grading, not blind application.** The library rosewood is
  much redder/lighter than the real PALIS face (master mean RGB
  109/50/16 vs the real face 75/49/49 measured from the client photo).
  Each library albedo was matched per-channel (affine, mean exact, std
  ratio clamped to [0.5, 1.6]) to the tone of the actual product.
  Grain detail comes from the library; tone comes from the product.
  The same grading was applied to the near-black handle 1.
- **Grain direction.** Face grain must run along the blade length (Y).
  Rosewood grain is already vertical — no rotation. The dark-wood grain
  is horizontal in its pack, so albedo + roughness were rotated 90°
  together; the normal map was derived AFTER rotation to avoid any
  channel-transform error.
- **Fir is a stand-in, not a match.** Fir != Spruce (different species).
  It is used ONLY on the 6 mm blade rim as a light-wood strip, because
  the real edge is layered and no layered edge texture exists yet. The
  strip is a knot-free vertical band (x2900–3500 of the 4K master); an
  earlier band (x1800–2800) was rejected for a visible knot.
- **What v2 does NOT change.** Handle 2 keeps its client-photo albedo
  (padauk + stripes); all decals are untouched; geometry is untouched.
- **v1 is preserved** in `textures/v1/` (all 9 original files) so the
  demo can be reverted file-for-file.
- **Shipped sizes.** Masters are 16K/4K; shipped sizes are 4K (face)
  and 2K (handle 1) — far above v1 (face 1580×1200, handle 1 155×380)
  while keeping the page loadable on mobile (total textures ~13.5 MB
  vs 1.7 MB in v1). The 16K masters cannot ship: the 16K diffuse alone
  is 123 MB, over GitHub's 100 MB per-file limit.

## v1 (2026-11-10) — derived only from the supplied reference photos

All maps are derived **only** from the supplied contest reference photos
(crop / rectify / colour-balance). No procedural wood grain, no AI-generated
textures, no invented detail. Tools: Python 3, PIL 10.2, numpy 1.26.
Scripts: `../build_textures.py`, `../fix_textures.py`,
`../fix2_textures.py`, `../final_polish.py` (reproducible).

General notes
- Albedos are sRGB JPEG (quality 95, 4:4:4) unless noted as PNG.
- Roughness maps are **derived** from albedo luminance (darker pores =
  slightly rougher), not measured BRDF. Values are 8-bit grayscale JPEGs.
- No normal maps and no metalness maps are supplied (wood is dielectric:
  metalness 0 everywhere). If the demo needs a normal map, derive it from
  the albedo luminance in the 3D tool — do not expect one here.
- "2x/3x Lanczos" means interpolation upscale only; it adds no real detail.

## blade_face_albedo.jpg — 1580×1200, 505 KB
- Source: `Blade_1_9_emdo.jpeg` (2048×2048, front face straight-on).
- Crop: x 620–1410, y 450–1050 (790×600 native), an interior rectangle
  safely inside the oval face, above the serial number and clear of the
  face rim and handle junction.
- Processing: flat-field correction (heavy Gaussian blur, ±10% cap) to
  remove the photo's lighting gradient; 2x Lanczos upscale to 1580×1200.
- Limits: native resolution is only 790×600 — the whole blade face is
  ~1000 px wide in the photo, so ~2048 px on the long side is not
  achievable without inventing detail; the 2x upscale is interpolation.
  Interior tile only: the face rim/edge and the serial area are NOT in
  this map (serial is a separate decal). The demo must UV-map it to the
  face interior.

## blade_face_roughness.jpg — 1580×1200, 132 KB
- Derived from `blade_face_albedo.jpg` luminance (blurred 6 px),
  mapped to roughness 0.32–0.50 (darker grain = rougher). Subtle by design.

## handle1_albedo.jpg — 155×380, 18 KB
- Source: `Blade_3_7_1o1n.jpeg` (2048×2048, BACK face — same black handle
  wood as the front; the front handle in Blade_2 is interrupted by the
  PALIS/OFF label).
- Crop: x 950–1105, y 1300–1680 (155×380 native), inside the flat front
  face of the handle, above the Brazil-flag dot and below the
  blade junction.
- Processing: flat-field correction (±8% cap). No upscale.
- Limits: narrow (155 px) — the handle itself is only ~230 px wide in
  the photo. Uniform near-black wood with subtle vertical grain; no
  label, no dot, no edge veneer in frame.

## handle1_roughness.jpg — 155×380, 5 KB
- Derived from `handle1_albedo.jpg` luminance, mapped to 0.30–0.48.

## handle2_albedo.jpg — 490×1335, 218 KB
- Source: `Handle_201_3_g1bh.jpeg` (1517×2048, handle 2 straight-on).
- Crop: x 470–960, y 420–1780, then the top 25 px trimmed (490×1335
  final). The stripes were measured vertical (drift −0.20° over the
  handle length) so **no rotation was applied** — an early attempt that
  rotated −3.29° (driven by one contaminated measurement row at the top
  arch) was discarded.
- Processing: flat-field correction (±10% cap). No upscale.
- Limits: the top 25 px were trimmed to remove the top arch and slivers
  of blade wood / workbench at the corners, so the very top of the real
  handle (arch + end-grain at the blade junction) is NOT in this map.
  The light end cap is NOT in this map (separate butt geometry). A faint
  lighting gradient remains (left side marginally lighter).

## handle2_roughness.jpg — 490×1335, 39 KB
- Derived from `handle2_albedo.jpg` luminance, mapped to 0.32–0.52.

## butt_medallion.png — 614×614, 655 KB, transparent outside the circle
- Source: `logo_4_2qys.jpeg` (2047×2048, medallion close-up).
- Circle: centre (1022, 1024), radius 299 px, found by radial
  luminance-gradient search (median rim radius 302 px, 10–90% spread
  300–319 px); the mask sits 3 px inside the detected rim and is
  feathered ~2 px. Transparency verified (corner alpha = 0, centre = 255).
- Limits: the rim radius varies by a few px with direction (the
  medallion is very slightly elliptical in the photo from perspective);
  it is treated as a circle. The thin black outer ring of the medallion
  itself is kept (it is part of the medallion, not background).

## handle1_label.png — 122×564, 69 KB, transparent outside the pill
- Source: `Blade_2_5_m9x7.jpeg` (2048×2048, front).
- Pill: original x 926–986, y 1502–1783 (61×282 native), edges found by
  per-row luminance-gradient medians; capsule mask (radius = half width),
  2 px erosion to trim wood fringe, feathered ~2 px; 2x Lanczos upscale.
- Limits: the label black vs the handle black is VERY low contrast, so
  the edges are the least certain of any cutout here (left edge MAD
  3 px, right edge MAD 12 px). A hairline of dark handle wood may remain
  on one side — it is the same wood the label sits on, so it blends on
  the model. The label is tilted −2.46° in the photo; the mask is
  axis-aligned (a rotation-corrected rebuild was tried and cut the OFF
  text, so it was discarded). 2x upscale is interpolation.

## serial.png — 540×225, 34 KB, transparent background
- Source: `Blade_1_9_emdo.jpeg`. Crop: x 1030–1210, y 1065–1140
  (180×75 native) around "S02025148" (text itself x 1061–1180,
  y 1083–1122, ~39 px tall).
- Processing: alpha from darkness vs local background (12 px blur);
  adaptive threshold T=18 (grain band p99 = 15, text band p99 = 43, so
  the text is genuinely darker than the grain); restricted to the text
  band; isolated specks < 8 px removed; 3x Lanczos upscale.
- Limits: the "S" is the thinnest character and is slightly fragmented;
  a few faint grain specks may survive near the strokes. The text is
  only ~39 px tall in the source, so the decal is soft at large sizes —
  it is meant to be read at the small size it has on the real blade.
  An earlier character-shape filter was tried and dropped most
  characters; it was discarded.
