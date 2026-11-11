import * as THREE from 'three';
import { OrbitControls } from './vendor/OrbitControls.js';
import { GLTFLoader } from './vendor/loaders/GLTFLoader.js';
import { RoomEnvironment } from './vendor/RoomEnvironment.js';

// ---------------------------------------------------------------------------
// Scene (millimetres after the x1000 group scale; model centred on origin)
// ---------------------------------------------------------------------------
const log = function (m) { if (window.__vlogAdd) window.__vlogAdd(m); };
log('module: start');
const app = document.getElementById('app');
const loadingEl = document.getElementById('loading');
const errorEl = document.getElementById('error');
const errorText = document.getElementById('errorText');
const handleInfo = document.getElementById('handleInfo');

let renderer;
try {
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
} catch (e) {
  loadingEl.style.display = 'none';
  errorEl.style.display = 'flex';
  errorText.textContent = 'WebGL is not available in this browser.';
  throw e;
}
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.outputColorSpace = THREE.SRGBColorSpace;
app.appendChild(renderer.domElement);
log('renderer: ok');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 5000);
camera.position.set(0, 20, 430);

const controls = new OrbitControls(camera, renderer.domElement);
log('controls: ok');
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.minDistance = 120;
controls.maxDistance = 900;
// Full 360 deg inspection, including the underside and the handle bottom.
controls.maxPolarAngle = Math.PI;

const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
log('environment: ok');

const key = new THREE.DirectionalLight(0xffffff, 2.0);
key.position.set(180, 260, 320);
scene.add(key);
// Back key (v2.1 fix, strengthened in v2.2 and v2.4): mirrors the front key.
// Without it the back face rendered ~10x darker than the front (measured
// live: back centre RGB 14,5,6 vs front 114,84,84). v2.1 raised it to 2.0 and
// the back reached only ~43% of the front (49 vs 114); v2.2 raised it to 3.0
// and the back reached ~62% (64 vs 103). The response is roughly +15 red
// per +1.0 intensity, so v2.4 raises it to 5.0 to close the remaining gap.
const back = new THREE.DirectionalLight(0xffffff, 5.0);
back.position.set(-180, 260, -320);
scene.add(back);
const fill = new THREE.DirectionalLight(0xdfe8ff, 0.55);
fill.position.set(-260, 60, -180);
scene.add(fill);
scene.add(new THREE.HemisphereLight(0xffffff, 0x1a1c20, 0.35));

// ---------------------------------------------------------------------------
// Textures (v2 PBR maps; see textures/SOURCES.md)
//   - Blade face (v2.1): the CLIENT'S OWN PHOTO texture (v1), restored.
//     The v2 library rosewood (Poly Haven rosewood_veneer1) was retired
//     for the face: its large cathedral/flame ovals with dark centres do
//     not exist in the real blade, which has fine straight longitudinal
//     grain. No library veneer can match the photo by definition — the
//     photo itself is the only exact match. PBR support stays improved:
//     roughness from the photo luminance, normal Sobel-derived from it.
//   - Handle 1: Meshy smooth dark wood (CC0, ambientCG Wood027), 4K masters,
//   - Handle 1: Meshy smooth dark wood (CC0, ambientCG Wood027), 4K masters,
//     shipped 2K, rotated so the grain runs along the handle, graded near-black.
//   - Blade rim: Meshy fir-wood strip (CC0, ambientCG Wood092) — a stand-in
//     for the intermediate spruce layer (Fir != Spruce); see SOURCES.md.
//   - Handle 2 (padauk + 3 light stripes) and all decals (serial, PALIS/OFF
//     label, medallion) stay v1, derived from the client photos.
// ---------------------------------------------------------------------------
const texLoader = new THREE.TextureLoader();
function albedo(path) {
  const t = texLoader.load(path);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  return t;
}
function rough(path) {
  const t = texLoader.load(path);
  t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  return t;
}
function normal(path) {
  // Normal maps stay in linear (non-colour) space — no colorSpace set.
  const t = texLoader.load(path);
  t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  return t;
}
const bladeFaceAlbedo = albedo('./textures/blade_face_albedo.jpg');
const bladeFaceRough = rough('./textures/blade_face_roughness.jpg');
const bladeFaceNormal = normal('./textures/blade_face_normal.jpg');
// v2.4: the back face gets its own texture — the real back has its own grain
// (same product, photographed from the back: tier1_50_palis_flared_3.jpg).
const bladeBackAlbedo = albedo('./textures/blade_back_albedo.jpg');
const bladeBackRough = rough('./textures/blade_back_roughness.jpg');
const bladeBackNormal = normal('./textures/blade_back_normal.jpg');
const rimAlbedo = albedo('./textures/blade_rim_albedo.jpg');
const rimRough = rough('./textures/blade_rim_roughness.jpg');
const handle1Albedo = albedo('./textures/handle1_albedo.jpg');
const handle1Rough = rough('./textures/handle1_roughness.jpg');
const handle1Normal = normal('./textures/handle1_normal.jpg');
const handle2Albedo = albedo('./textures/handle2_albedo.jpg');
const handle2Rough = rough('./textures/handle2_roughness.jpg');
const serialTex = albedo('./textures/serial.png');
const labelTex = albedo('./textures/handle1_label.png');
const medallionTex = albedo('./textures/butt_medallion.png');
log('textures: queued');

// Brazil-flag dot, drawn procedurally (green disc, yellow diamond, blue globe).
function brazilDotTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  g.fillStyle = '#009739';
  g.beginPath(); g.arc(64, 64, 62, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#fedf00';
  g.beginPath();
  g.moveTo(64, 10); g.lineTo(118, 64); g.lineTo(64, 118); g.lineTo(10, 64);
  g.closePath(); g.fill();
  g.fillStyle = '#002776';
  g.beginPath(); g.arc(64, 64, 22, 0, Math.PI * 2); g.fill();
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

// ---------------------------------------------------------------------------
// Materials
// ---------------------------------------------------------------------------
const std = (o) => new THREE.MeshStandardMaterial(Object.assign({ metalness: 0 }, o));
const MAT = {
  bladeFaceFront: std({ map: bladeFaceAlbedo, roughnessMap: bladeFaceRough, normalMap: bladeFaceNormal, normalScale: new THREE.Vector2(0.7, 0.7), roughness: 1.0 }),
  bladeFaceBack: std({ map: bladeBackAlbedo, roughnessMap: bladeBackRough, normalMap: bladeBackNormal, normalScale: new THREE.Vector2(0.7, 0.7), roughness: 1.0 }),
  // Blade rim: light spruce-like wood strip (fir stand-in, see SOURCES.md).
  // The real edge shows the ply layers; a layered edge texture is future work.
  bladeRim: std({ map: rimAlbedo, roughnessMap: rimRough, roughness: 1.0 }),
  handle1Face: std({ map: handle1Albedo, roughnessMap: handle1Rough, normalMap: handle1Normal, normalScale: new THREE.Vector2(0.5, 0.5), roughness: 1.0 }),
  handle1Cap: std({ color: 0x1a1210, roughness: 0.5 }),
  handle2Face: std({ map: handle2Albedo, roughnessMap: handle2Rough, roughness: 1.0 }),
  handle2Cap: std({ color: 0xd8cbb2, roughness: 0.6 }),
};

// ---------------------------------------------------------------------------
// Model load + classification
// The glTF stores metres (spec); the group scales x1000 so the scene is in mm.
// Primitives are classified by their mean normal (face_front / face_back /
// cap_y / rim) and by bounding box (blade vs front/back handle), using the
// verified CAD dimensions.
// ---------------------------------------------------------------------------
const modelGroup = new THREE.Group();
modelGroup.scale.setScalar(1000);
scene.add(modelGroup);

const bladeParts = [];   // { mesh, cls }
const handleParts = [];  // { mesh, cls }
let labelMesh = null, brazilMesh = null, medallionMesh = null;

function classify(mesh) {
  const n = mesh.geometry.attributes.normal;
  let sx = 0, sy = 0, sz = 0, szSigned = 0;
  for (let i = 0; i < n.count; i++) {
    sx += Math.abs(n.getX(i)); sy += Math.abs(n.getY(i)); sz += Math.abs(n.getZ(i));
    szSigned += n.getZ(i);
  }
  const m = [sx / n.count, sy / n.count, sz / n.count];
  // Front (+Z) and back (-Z) faces are separate textures since v2.4.
  if (m[2] > 0.9) return szSigned > 0 ? 'face_front' : 'face_back';
  if (m[1] > 0.9) return 'cap_y';
  return 'rim';
}

function addDecals() {
  // All decal positions are in metres, in the model's own frame (group scales them).
  const decalMat = (map) => std({
    map, transparent: true, roughness: 0.5,
    polygonOffset: true, polygonOffsetFactor: -1,
  });
  // Serial S02025148 on the front blade face (photo-measured at about +15, +117 mm).
  const serial = new THREE.Mesh(new THREE.PlaneGeometry(0.017, 0.009), decalMat(serialTex));
  serial.position.set(0.015, 0.117, 0.00315);
  modelGroup.add(serial);
  // PALIS / OFF label on the front handle face (Handle 1 only).
  labelMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.014, 0.048), decalMat(labelTex));
  labelMesh.position.set(0, 0.049, 0.01315);
  modelGroup.add(labelMesh);
  // RESONANT medallion on the handle butt, facing down (-Y).
  medallionMesh = new THREE.Mesh(new THREE.CircleGeometry(0.011, 48), decalMat(medallionTex));
  medallionMesh.rotation.x = Math.PI / 2;
  medallionMesh.position.set(0, -0.0001, 0);
  modelGroup.add(medallionMesh);
  // Brazil-flag dot on the back handle face (Handle 1 only).
  brazilMesh = new THREE.Mesh(
    new THREE.CircleGeometry(0.003, 32),
    decalMat(brazilDotTexture())
  );
  brazilMesh.rotation.y = Math.PI;
  brazilMesh.position.set(0, 0.030, -0.01315);
  modelGroup.add(brazilMesh);
}

function applyHandle(design) {
  for (const p of handleParts) {
    if (p.cls === 'cap_y') {
      p.mesh.material = design === 1 ? MAT.handle1Cap : MAT.handle2Cap;
    } else {
      p.mesh.material = design === 1 ? MAT.handle1Face : MAT.handle2Face;
    }
  }
  const isH1 = design === 1;
  if (labelMesh) labelMesh.visible = isH1;
  if (brazilMesh) brazilMesh.visible = isH1;
  handleInfo.textContent = isH1
    ? 'Handle 1 — black wood · PALIS / OFF · serial S02025148'
    : 'Handle 2 — padauk with three light stripes · same CAD geometry';
  document.querySelectorAll('#handles button').forEach((b) => {
    b.classList.toggle('active', Number(b.dataset.handle) === design);
  });
}

log('glb: fetch start');
new GLTFLoader().load(
  './model/blade_uv.glb',
  (gltf) => {
    log('glb: loaded');
    const model = gltf.scene;
    modelGroup.add(model);
    // Classify every primitive mesh, then assign materials.
    model.traverse((obj) => {
      if (!obj.isMesh) return;
      obj.geometry.computeBoundingBox();
      const bb = obj.geometry.boundingBox;
      const cls = classify(obj);
      // Blade: z within ±3 mm. Handles: z +3..+13 mm (front) or -13..-3 mm (back).
      const isBlade = bb.min.z > -0.0035 && bb.max.z < 0.0035;
      if (isBlade) {
        obj.material = cls === 'face_front' ? MAT.bladeFaceFront
          : cls === 'face_back' ? MAT.bladeFaceBack : MAT.bladeRim;
        bladeParts.push({ mesh: obj, cls });
      } else {
        handleParts.push({ mesh: obj, cls });
      }
    });
    // Centre the scaled model on the origin (bbox Y 0..258 mm -> centre 0).
    const box = new THREE.Box3().setFromObject(modelGroup);
    const centre = box.getCenter(new THREE.Vector3());
    modelGroup.position.sub(centre);
    addDecals();
    log('classified: ' + bladeParts.length + ' blade + ' + handleParts.length + ' handle parts; decals: ok');
    // Deep-link initial state: ?handle=1|2&view=front|back|edge|handle|butt
    // (also used by the automated screenshot checks).
    const params = new URLSearchParams(window.location.search);
    const h = Number(params.get('handle'));
    applyHandle(h === 2 ? 2 : 1);
    const v = params.get('view');
    currentBase = (v && VIEWS[v]) ? VIEWS[v] : VIEWS.front;
    const f = applyFraming(currentBase);
    camera.position.copy(f.pos);
    controls.target.copy(f.tgt);
    loadingEl.style.display = 'none';
    window.__viewerReady = true;
    log('ready: animate start');
    animate();
  },
  undefined,
  (err) => {
    loadingEl.style.display = 'none';
    errorEl.style.display = 'flex';
    errorText.textContent = 'Could not load the 3D model (./model/blade_uv.glb). ' + (err && err.message ? err.message : '');
    log('GLB ERROR: ' + (err && err.message ? err.message : err));
    window.__vlogShow();
    console.error(err);
  }
);

// ---------------------------------------------------------------------------
// Camera presets + smooth tween + band-aware framing
// The blade is framed into the free band between the header and the bottom
// panel, so the title never covers the model and the hint stays readable.
// ---------------------------------------------------------------------------
const VIEWS = {
  front:  { pos: [0, 0, 430],     tgt: [0, 0, 0] },
  back:   { pos: [0, 0, -430],    tgt: [0, 0, 0] },
  edge:   { pos: [430, 0, 0],     tgt: [0, 0, 0] },
  handle: { pos: [90, -40, 300],  tgt: [0, -75, 0] },
  butt:   { pos: [0, -430, 90],   tgt: [0, -129, 0] },
};
// Base (unframed) view currently shown; framing adds distance + band offset.
let currentBase = VIEWS.front;

// Distance + vertical target offset so the 258 mm blade fits the free band
// (header height .. panel top) with a margin, on any viewport.
function bandFrame() {
  const headerEl = document.querySelector('header');
  const panelEl = document.getElementById('panel');
  const top = (headerEl ? headerEl.offsetHeight : 90) + 10;
  const bottom = window.innerHeight - (panelEl ? panelEl.offsetHeight : 120) - 12;
  const bandH = Math.max(200, bottom - top);
  const bandCenterPx = (top + bottom) / 2;
  const needVisH = 258 * 1.06 * (window.innerHeight / bandH);
  const needVisW = 151 * 1.08;
  const visH = Math.max(needVisH, needVisW / camera.aspect);
  const dist = THREE.MathUtils.clamp(
    visH / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))), 160, 900);
  // Target below the blade centre moves the blade up on screen (and vice versa).
  const offY = (bandCenterPx - window.innerHeight / 2) * (visH / window.innerHeight);
  return { dist, offY };
}

function applyFraming(view) {
  const f = bandFrame();
  const base = new THREE.Vector3(...view.tgt);
  const dir = new THREE.Vector3(...view.pos).sub(base).normalize();
  const tgt = new THREE.Vector3(base.x, base.y + f.offY, base.z);
  const pos = tgt.clone().add(dir.multiplyScalar(f.dist));
  return { pos, tgt };
}

let tween = null;
function flyTo(view) {
  const v = VIEWS[view];
  if (!v) return;
  currentBase = v;
  const f = applyFraming(v);
  tween = {
    t: 0,
    fromPos: camera.position.clone(),
    toPos: f.pos,
    fromTgt: controls.target.clone(),
    toTgt: f.tgt,
  };
}
document.querySelectorAll('#views button').forEach((b) => {
  b.addEventListener('click', () => flyTo(b.dataset.view));
});
document.querySelectorAll('#handles button').forEach((b) => {
  b.addEventListener('click', () => applyHandle(Number(b.dataset.handle)));
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  const f = applyFraming(currentBase);
  camera.position.copy(f.pos);
  controls.target.copy(f.tgt);
});

function animate() {
  requestAnimationFrame(animate);
  if (tween) {
    tween.t += 1 / 42; // ~0.7 s at 60 fps
    const k = Math.min(tween.t, 1);
    const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
    camera.position.lerpVectors(tween.fromPos, tween.toPos, e);
    controls.target.lerpVectors(tween.fromTgt, tween.toTgt, e);
    if (k >= 1) tween = null;
  }
  controls.update();
  renderer.render(scene, camera);
}
