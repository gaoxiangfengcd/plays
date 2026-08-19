import * as THREE from "./vendor/three.module.js";

const host = document.querySelector("[data-wheel-3d]");
const input = document.querySelector("[data-items]");
const colors = ["#f04435", "#ff8f16", "#ffc51c", "#35b83d", "#22aeca", "#2066d5", "#7d3bd6", "#e13283"];
const discArt = new Image();
discArt.src = new URL("./wheel-disc-rendered.png?v=20260819-fixed-hub", import.meta.url).href;
const frameArt = new Image();
frameArt.src = new URL("./wheel-frame-fixed.png?v=20260819-no-inner-ring", import.meta.url).href;
const pointerArt = new Image();
pointerArt.src = new URL("./wheel-pointer-sheet.png?v=20260819-no-inner-ring", import.meta.url).href;
const hubArt = new Image();
hubArt.src = new URL("./wheel-hub-fixed.png?v=20260819-fixed-hub", import.meta.url).href;
const faceArt = new Image();
faceArt.src = new URL("./wheel-face-texture.png", import.meta.url).href;
const cardArtNames = ["red", "orange", "yellow", "green", "cyan", "blue", "purple", "pink"];
const cardArts = cardArtNames.map((name) => {
  const image = new Image();
  image.src = new URL(`./wheel-card-${name}.png`, import.meta.url).href;
  return image;
});

let scene;
let camera;
let renderer;
let wheelGroup;
let face;
let faceTexture;
let spinning = false;
let targetRotation = 0;
let currentItems = [];

function parseItems() {
  if (!input) return ["Pizza", "Burger", "Sushi", "Ramen", "Pasta", "Salad", "Steak", "Tacos"];
  return input.value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function hexToRgb(hex) {
  const value = hex.replace("#", "");
  const full = value.length === 3 ? value.split("").map((part) => part + part).join("") : value;
  const number = Number.parseInt(full, 16);
  return {
    r: (number >> 16) & 255,
    g: (number >> 8) & 255,
    b: number & 255,
  };
}

function mixColor(hex, target, amount) {
  const base = hexToRgb(hex);
  const next = hexToRgb(target);
  const r = Math.round(base.r + (next.r - base.r) * amount);
  const g = Math.round(base.g + (next.g - base.g) * amount);
  const b = Math.round(base.b + (next.b - base.b) * amount);
  return `rgb(${r}, ${g}, ${b})`;
}

function makeWheelTexture(items) {
  const size = 4096;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  const center = size / 2;
  const radius = size * 0.465;
  const slice = (Math.PI * 2) / items.length;

  ctx.clearRect(0, 0, size, size);

  items.forEach((item, index) => {
      const start = index * slice - Math.PI / 2;
      const end = start + slice;
      const color = colors[index % colors.length];
      const gradient = ctx.createLinearGradient(center - radius, center - radius, center + radius, center + radius);
      gradient.addColorStop(0, mixColor(color, "#ffffff", 0.22));
      gradient.addColorStop(0.42, color);
      gradient.addColorStop(1, mixColor(color, "#11131f", 0.24));

      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, start, end);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();

      ctx.lineWidth = 6;
      ctx.strokeStyle = "rgba(42, 30, 40, 0.52)";
      ctx.stroke();

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, start, end);
      ctx.closePath();
      ctx.clip();
      const sheen = ctx.createLinearGradient(center - radius * 0.45, center - radius, center + radius * 0.35, center + radius);
      sheen.addColorStop(0, "rgba(255,255,255,0.16)");
      sheen.addColorStop(0.32, "rgba(255,255,255,0.03)");
      sheen.addColorStop(0.78, "rgba(0,0,0,0.08)");
      sheen.addColorStop(1, "rgba(0,0,0,0.2)");
      ctx.fillStyle = sheen;
      ctx.fillRect(center - radius, center - radius, radius * 2, radius * 2);

      ctx.lineWidth = 10;
      ctx.strokeStyle = "rgba(255,255,255,0.12)";
      ctx.stroke();
      ctx.restore();
    });

  items.forEach((item, index) => {
    const start = index * slice - Math.PI / 2;
    const mid = start + slice / 2;
    const textRadius = radius * 0.56;
    const x = center + Math.cos(mid) * textRadius;
    const y = center + Math.sin(mid) * textRadius;
    const label = item.length > 11 ? `${item.slice(0, 10)}...` : item;
    let angle = mid;
    if (Math.cos(mid) < 0) angle += Math.PI;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "950 150px Arial, Helvetica, sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.98)";
    ctx.lineWidth = 10;
    ctx.strokeStyle = "rgba(20,22,44,0.5)";
    ctx.shadowColor = "rgba(0,0,0,0.16)";
    ctx.shadowBlur = 1;
    ctx.shadowOffsetY = 1;
    ctx.strokeText(label, 0, 0, radius * 0.34);
    ctx.fillText(label, 0, 0, radius * 0.36);
    ctx.restore();
  });

  const gloss = ctx.createLinearGradient(center - radius, center - radius, center + radius, center + radius);
  gloss.addColorStop(0, items.length === colors.length ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.08)");
  gloss.addColorStop(0.34, "rgba(255,255,255,0.01)");
  gloss.addColorStop(0.72, items.length === colors.length ? "rgba(0,0,0,0.02)" : "rgba(0,0,0,0.05)");
  gloss.addColorStop(1, "rgba(255,255,255,0.03)");
  ctx.beginPath();
  ctx.arc(center, center, radius, 0, Math.PI * 2);
  ctx.fillStyle = gloss;
  ctx.fill();

  ctx.save();
  ctx.globalCompositeOperation = "destination-in";
  ctx.beginPath();
  ctx.arc(center, center, radius - 2, 0, Math.PI * 2);
  ctx.fillStyle = "#fff";
  ctx.fill();
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 16;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  return texture;
}

faceArt.addEventListener("load", () => {
  if (currentItems.length === colors.length) buildWheelMesh(currentItems);
});

discArt.addEventListener("load", () => {
  if (currentItems.length === colors.length) buildWheelMesh(currentItems);
});

cardArts.forEach((cardArt) => {
  cardArt.addEventListener("load", () => {
    if (currentItems.length && currentItems.length !== colors.length) buildWheelMesh(currentItems);
  });
});

function buildWheelMesh(items) {
  if (!wheelGroup) return;
  currentItems = items;
  if (faceTexture) faceTexture.dispose();
  faceTexture = makeWheelTexture(items);
  face.material.map = faceTexture;
  face.material.needsUpdate = true;
}

function createWheel() {
  wheelGroup = new THREE.Group();
  wheelGroup.rotation.x = -0.05;
  scene.add(wheelGroup);

  const radius = 2.22;
  const depth = 0.18;
  const faceGeometry = new THREE.CircleGeometry(radius * 0.98, 192);
  face = new THREE.Mesh(
    faceGeometry,
    new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.02,
      roughness: 0.5,
      transparent: true,
      side: THREE.DoubleSide,
    }),
  );
  face.position.z = depth / 2 + 0.012;
  wheelGroup.add(face);

  buildWheelMesh(parseItems());
}

function createFrame() {
  const frameCanvas = document.createElement("canvas");
  frameCanvas.width = 1024;
  frameCanvas.height = 1024;
  const drawFrame = () => {
    const ctx = frameCanvas.getContext("2d");
    ctx.clearRect(0, 0, frameCanvas.width, frameCanvas.height);
    if (frameArt.complete && frameArt.naturalWidth) {
      ctx.drawImage(frameArt, 0, 0, frameCanvas.width, frameCanvas.height);
    }
  };
  drawFrame();
  const frameTexture = new THREE.CanvasTexture(frameCanvas);
  frameTexture.colorSpace = THREE.SRGBColorSpace;
  const frame = new THREE.Mesh(
    new THREE.PlaneGeometry(4.86, 4.86),
    new THREE.MeshBasicMaterial({
      map: frameTexture,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    }),
  );
  frame.position.set(0, -0.06, 0.38);
  frame.renderOrder = 4;
  scene.add(frame);
  frameArt.addEventListener("load", () => {
    drawFrame();
    frameTexture.needsUpdate = true;
  });
}

function createPointer() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const drawPointer = () => {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const gradient = ctx.createLinearGradient(256, 72, 256, 430);
    gradient.addColorStop(0, "#ffe58a");
    gradient.addColorStop(0.42, "#f3a51f");
    gradient.addColorStop(1, "#b95b12");
    ctx.shadowColor = "rgba(0,0,0,0.24)";
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 10;
    ctx.beginPath();
    ctx.moveTo(130, 112);
    ctx.lineTo(382, 112);
    ctx.lineTo(256, 430);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.shadowColor = "transparent";
    ctx.lineWidth = 8;
    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(176, 126);
    ctx.lineTo(250, 126);
    ctx.lineTo(220, 240);
    ctx.closePath();
    ctx.fillStyle = "rgba(255,255,255,0.2)";
    ctx.fill();
    texture.needsUpdate = true;
  };
  drawPointer();
  const pointer = new THREE.Mesh(
    new THREE.PlaneGeometry(0.42, 0.42),
    new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false, side: THREE.DoubleSide }),
  );
  pointer.position.set(0, 2.72, 0.72);
  pointer.renderOrder = 8;
  scene.add(pointer);
}

function createHub() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const drawHub = () => {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (hubArt.complete && hubArt.naturalWidth) ctx.drawImage(hubArt, 0, 0, canvas.width, canvas.height);
    texture.needsUpdate = true;
  };
  drawHub();
  const hub = new THREE.Mesh(
    new THREE.PlaneGeometry(0.78, 0.78),
    new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false, side: THREE.DoubleSide }),
  );
  hub.position.set(0, 0, 0.74);
  hub.renderOrder = 9;
  scene.add(hub);
  hubArt.addEventListener("load", drawHub);
}

function createStand() {
  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(1.72, 2.05, 0.28, 96),
    new THREE.MeshStandardMaterial({ color: 0x212343, metalness: 0.52, roughness: 0.34 }),
  );
  base.position.set(0, -2.28, -0.26);
  base.scale.z = 0.34;
  scene.add(base);

  const glow = new THREE.Mesh(
    new THREE.TorusGeometry(1.55, 0.035, 16, 120),
    new THREE.MeshBasicMaterial({ color: 0x8b4cff, transparent: true, opacity: 0.95 }),
  );
  glow.position.set(0, -2.15, -0.08);
  scene.add(glow);
}

function init() {
  if (!host) return;
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
  camera.position.set(0, 0.03, 7.1);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 3));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  host.innerHTML = "";
  host.appendChild(renderer.domElement);

  const hemi = new THREE.HemisphereLight(0xffffff, 0x18245e, 1.2);
  scene.add(hemi);
  const key = new THREE.DirectionalLight(0xfff1ba, 3.8);
  key.position.set(2.8, 3.8, 4.5);
  scene.add(key);
  const fill = new THREE.PointLight(0x8ab4ff, 3.2, 8);
  fill.position.set(-3, 1.4, 3);
  scene.add(fill);
  const rim = new THREE.PointLight(0xa85cff, 4.2, 7);
  rim.position.set(0, -2.5, 2.4);
  scene.add(rim);

  createWheel();
  createPointer();
  createHub();
  resize();
  animate();
  window.addEventListener("resize", resize);
}

function resize() {
  if (!host || !renderer) return;
  const rect = host.getBoundingClientRect();
  const size = Math.max(260, Math.min(rect.width || 460, rect.height || 460));
  renderer.setSize(size, size, false);
  camera.aspect = 1;
  camera.updateProjectionMatrix();
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function spinTo(index, items) {
  if (!wheelGroup || spinning) return;
  if (items?.length) buildWheelMesh(items);
  const count = currentItems.length || 1;
  const slice = (Math.PI * 2) / count;
  const current = wheelGroup.rotation.z;
  const normalized = ((current % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
  const desired = index * slice + slice / 2;
  targetRotation = current + Math.PI * 8 + (desired - normalized);

  const start = current;
  const startedAt = performance.now();
  const duration = 4050;
  spinning = true;

  function step(now) {
    const t = Math.min(1, (now - startedAt) / duration);
    wheelGroup.rotation.z = start + (targetRotation - start) * easeOutCubic(t);
    if (t < 1) {
      requestAnimationFrame(step);
    } else {
      wheelGroup.rotation.z = targetRotation;
      spinning = false;
    }
  }
  requestAnimationFrame(step);
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

globalThis.playPicksWheel3DSetItems = (items) => {
  if (!items?.length) return;
  if (!wheelGroup) {
    currentItems = items;
    return;
  }
  buildWheelMesh(items);
  if (!spinning) wheelGroup.rotation.z = 0;
};

globalThis.playPicksSpinWheel3D = spinTo;

init();
