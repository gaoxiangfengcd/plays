import * as THREE from "/assets/vendor/three.module.js";

const host = document.querySelector("[data-coin]");
const resultNode = document.querySelector("[data-result]");
const historyNode = document.querySelector("[data-history]");
const historyListNode = document.querySelector("[data-coin-history-list]");

let renderer;
let scene;
let camera;
let coin;
let glow;
let isFlipping = false;
let currentSide = "Heads";
let localHistory = [];

function formatPercent(value, total) {
  if (!total) return "(0%)";
  return `(${((value / total) * 100).toFixed(1)}%)`;
}

function getLongestStreak(items) {
  let bestCount = 0;
  let bestSide = "-";
  let runCount = 0;
  let runSide = "";

  [...items].reverse().forEach((side) => {
    if (side === runSide) {
      runCount += 1;
    } else {
      runSide = side;
      runCount = 1;
    }
    if (runCount > bestCount) {
      bestCount = runCount;
      bestSide = runSide;
    }
  });

  return { count: bestCount, side: bestSide };
}

function updateCoinStats() {
  const total = localHistory.length;
  const heads = localHistory.filter((item) => item === "Heads").length;
  const tails = localHistory.filter((item) => item === "Tails").length;
  const streak = getLongestStreak(localHistory);
  const setStat = (name, value) => {
    document.querySelectorAll(`[data-coin-stat="${name}"]`).forEach((node) => {
      node.textContent = value;
    });
  };

  setStat("total", String(total));
  setStat("heads", String(heads));
  setStat("tails", String(tails));
  setStat("headsPct", formatPercent(heads, total));
  setStat("tailsPct", formatPercent(tails, total));
  setStat("streak", String(streak.count));
  setStat("streakSide", streak.side);

  if (!historyListNode) return;
  historyListNode.innerHTML = "";
  if (!total) {
    const empty = document.createElement("p");
    const span = document.createElement("span");
    span.dataset.history = "";
    span.textContent = "No flips yet";
    empty.appendChild(span);
    historyListNode.appendChild(empty);
    return;
  }

  localHistory.slice(0, 6).forEach((item, index) => {
    const row = document.createElement("p");
    const strong = document.createElement("strong");
    strong.textContent = item;
    const time = document.createElement("time");
    time.textContent = index === 0 ? "Just now" : `${index + 1} flips ago`;
    row.append(strong, time);
    historyListNode.appendChild(row);
  });
}

function setResultText(text) {
  if (resultNode) resultNode.textContent = text;
  localHistory.unshift(text);
  localHistory = localHistory.slice(0, 8);
  if (historyNode) historyNode.textContent = localHistory[0] || "No flips yet";
  updateCoinStats();
}

function resize() {
  if (!host || !renderer || !camera) return;
  const rect = host.parentElement.getBoundingClientRect();
  const width = Math.max(320, Math.floor(rect.width));
  const height = Math.max(360, Math.floor(rect.height));
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

function loadFaceTexture(url, rotateArtwork = false) {
  const texture = new THREE.TextureLoader().load(url);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  texture.center.set(0.5, 0.5);
  if (rotateArtwork) texture.rotation = Math.PI;
  return texture;
}

function createCoin() {
  const group = new THREE.Group();
  const radius = 1.16;
  const thickness = 0.2;
  const headsMap = loadFaceTexture("/assets/img/coin-head-real.png");
  const tailsMap = loadFaceTexture("/assets/img/coin-tail-real.png", true);

  const edgeGeometry = new THREE.CylinderGeometry(radius, radius, thickness, 96, 1, true);
  const edgeMaterial = new THREE.MeshStandardMaterial({
    color: 0xf4b83d,
    metalness: 0.86,
    roughness: 0.18,
  });
  const edge = new THREE.Mesh(edgeGeometry, edgeMaterial);
  edge.rotation.x = Math.PI / 2;
  group.add(edge);

  const faceGeometry = new THREE.CircleGeometry(radius * 0.985, 96);
  const heads = new THREE.Mesh(
    faceGeometry,
    new THREE.MeshStandardMaterial({
      map: headsMap,
      color: 0xffe4a6,
      emissive: 0x4d3512,
      emissiveIntensity: 0.18,
      metalness: 0.5,
      roughness: 0.32,
    }),
  );
  heads.position.z = thickness / 2 + 0.006;
  group.add(heads);

  const tails = new THREE.Mesh(
    faceGeometry,
    new THREE.MeshStandardMaterial({
      map: tailsMap,
      color: 0xffe4a6,
      emissive: 0x4d3512,
      emissiveIntensity: 0.18,
      metalness: 0.5,
      roughness: 0.32,
    }),
  );
  tails.rotation.y = Math.PI;
  tails.position.z = -thickness / 2 - 0.006;
  group.add(tails);

  const rimGeometry = new THREE.TorusGeometry(radius, 0.035, 16, 120);
  const rimMaterial = new THREE.MeshStandardMaterial({
    color: 0xffd66b,
    metalness: 0.85,
    roughness: 0.18,
  });
  const frontRim = new THREE.Mesh(rimGeometry, rimMaterial);
  frontRim.position.z = thickness / 2 + 0.018;
  group.add(frontRim);

  const backRim = frontRim.clone();
  backRim.position.z = -thickness / 2 - 0.018;
  group.add(backRim);

  group.rotation.x = 0;
  group.rotation.y = -0.16;
  return group;
}

function init() {
  if (!host) return;
  host.classList.add("coin-3d-host");
  host.textContent = "";

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  camera.position.set(0, 0.02, 11.8);
  camera.lookAt(0, 0.28, 0);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.24;
  renderer.shadowMap.enabled = true;
  host.appendChild(renderer.domElement);

  coin = createCoin();
  coin.position.set(0, 1.08, 0);
  scene.add(coin);

  const key = new THREE.DirectionalLight(0xfff4d5, 3.7);
  key.position.set(-2.6, 3.4, 5.2);
  scene.add(key);

  const front = new THREE.DirectionalLight(0xffd66b, 1.7);
  front.position.set(0.6, 0.8, 4.8);
  scene.add(front);

  const upperRightSpot = new THREE.SpotLight(0xfff1a6, 5.8, 9, Math.PI / 8, 0.34, 0.6);
  upperRightSpot.position.set(2.6, 2.7, 5.2);
  upperRightSpot.target.position.set(0.16, 0.82, 0);
  scene.add(upperRightSpot);
  scene.add(upperRightSpot.target);

  const fill = new THREE.PointLight(0x9cc8ff, 4.8, 8);
  fill.position.set(2.8, -1.2, 2.8);
  scene.add(fill);

  const shine = new THREE.PointLight(0xfff0a6, 5.2, 6);
  shine.position.set(1.25, 1.8, 2.8);
  scene.add(shine);

  const ambient = new THREE.HemisphereLight(0xffffff, 0x1c3f89, 1.45);
  scene.add(ambient);

  const glowGeometry = new THREE.RingGeometry(0.72, 1.62, 96);
  const glowMaterial = new THREE.MeshBasicMaterial({
    color: 0x58a9ff,
    transparent: true,
    opacity: 0.28,
    side: THREE.DoubleSide,
  });
  glow = new THREE.Mesh(glowGeometry, glowMaterial);
  glow.position.y = -1.1;
  glow.rotation.x = -Math.PI / 2;
  scene.add(glow);

  resize();
  window.addEventListener("resize", resize);
  document.querySelector(".coin-card-head button")?.addEventListener("click", () => {
    localHistory = [];
    if (resultNode) resultNode.textContent = "Heads or Tails?";
    if (historyNode) historyNode.textContent = "No flips yet";
    updateCoinStats();
  });
  updateCoinStats();
  animate();
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function normalizeAngle(angle) {
  const fullTurn = Math.PI * 2;
  return ((angle % fullTurn) + fullTurn) % fullTurn;
}

function flip3D() {
  if (!coin || isFlipping) return;
  isFlipping = true;
  const result = Math.random() > 0.5 ? "Heads" : "Tails";
  const start = performance.now();
  const duration = 1700;
  const fullTurn = Math.PI * 2;
  const startX = normalizeAngle(coin.rotation.x);
  const desiredX = result === "Heads" ? 0 : Math.PI;
  let deltaToResult = desiredX - startX;
  while (deltaToResult < 0) deltaToResult += fullTurn;
  const targetX = startX + fullTurn * 5 + deltaToResult;
  coin.rotation.x = startX;

  host.classList.add("is-flipping");
  if (resultNode) resultNode.textContent = "Flipping...";

  function tick(now) {
    const t = Math.min(1, (now - start) / duration);
    const eased = easeOutCubic(t);
    coin.rotation.x = startX + (targetX - startX) * eased;
    coin.rotation.y = -0.16 + Math.sin(t * Math.PI * 2) * 0.1;
    coin.position.y = 1.08 + Math.sin(t * Math.PI) * 0.38;
    coin.scale.setScalar(1 + Math.sin(t * Math.PI) * 0.06);
    glow.scale.setScalar(1 + Math.sin(t * Math.PI) * 0.18);

    if (t < 1) {
      requestAnimationFrame(tick);
      return;
    }

    currentSide = result;
    coin.rotation.x = desiredX;
    coin.rotation.y = -0.16;
    coin.position.y = 1.08;
    coin.scale.setScalar(1);
    host.classList.remove("is-flipping");
    isFlipping = false;
    setResultText(result);
  }

  requestAnimationFrame(tick);
}

function animate() {
  requestAnimationFrame(animate);
  if (glow) {
    glow.material.opacity = 0.2 + Math.sin(performance.now() * 0.002) * 0.05;
  }
  renderer.render(scene, camera);
}

window.playPicksFlipCoin3D = flip3D;

try {
  init();
} catch (error) {
  console.error("Coin 3D failed to initialize", error);
  if (host) {
    host.classList.add("coin-3d-error");
    host.textContent = "3D coin failed to load";
  }
}
