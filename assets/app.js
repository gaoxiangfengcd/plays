const tools = {
  "spin-the-wheel": {
    defaults: ["Pizza", "Tacos", "Sushi", "Burgers", "Salad", "Noodles"],
    type: "wheel",
  },
  "random-name-picker": {
    defaults: ["Ava", "Noah", "Mia", "Liam", "Emma", "Lucas", "Sophia", "Mason"],
    type: "picker",
  },
  "mystery-box-picker": {
    defaults: ["Free pass", "Bonus point", "Try again", "Mystery prize", "Pick a friend", "Lucky star"],
    type: "boxes",
  },
  "pick-a-card": {
    defaults: ["Take a break", "Ask a question", "Tell a joke", "Choose a player", "Skip a turn", "Double points"],
    type: "cards",
  },
  "flip-a-coin": {
    defaults: ["Heads", "Tails"],
    type: "coin",
  },
  "dice-roller": {
    defaults: ["1", "2", "3", "4", "5", "6"],
    type: "dice",
  },
  "decision-maker": {
    defaults: ["Do it now", "Wait a day", "Ask a friend", "Pick the safer choice", "Try something new"],
    type: "decision",
  },
  "truth-or-dare": {
    defaults: [
      "Truth: What made you laugh today?",
      "Dare: Do your best movie trailer voice.",
      "Truth: What is your favorite snack?",
      "Dare: Dance for ten seconds.",
      "Truth: What is one thing you are proud of?",
      "Dare: Give someone a compliment.",
    ],
    type: "wheel",
  },
  "would-you-rather": {
    defaults: [
      "Have unlimited pizza|Have unlimited tacos",
      "Travel to space|Explore the deep ocean",
      "Always be early|Always be perfectly on time",
      "Win a game night|Host the best party",
    ],
    type: "would",
  },
  "memory-match": {
    defaults: ["Star", "Moon", "Rocket", "Heart", "Crown", "Gem"],
    type: "memory",
  },
};

const colors = ["#3767ff", "#16a6c9", "#23a36d", "#ffbd3d", "#ee5d8f", "#7b61ff", "#ff7b54", "#00a88f"];
let rotation = 0;
let history = [];
let memoryState = { first: null, lock: false, matches: 0 };
let carpetState = null;

function getToolKey() {
  return document.body.dataset.tool;
}

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function parseItems() {
  const input = document.querySelector("[data-items]");
  if (!input) return [];
  return input.value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function setResult(text) {
  const result = document.querySelector("[data-result]");
  if (!result) return;
  result.textContent = text;
  history.unshift(text);
  history = history.slice(0, 8);
  const historyNode = document.querySelector("[data-history]");
  if (historyNode) historyNode.textContent = history.join(" · ");
}

function buildWheel(items) {
  const wheel = document.querySelector("[data-wheel]");
  if (!wheel) return;
  const size = wheel.width;
  const ctx = wheel.getContext("2d");
  const center = size / 2;
  const radius = center - 16;
  const slice = (Math.PI * 2) / items.length;
  ctx.clearRect(0, 0, size, size);

  items.forEach((item, index) => {
    const start = index * slice - Math.PI / 2;
    const end = start + slice;
    const mid = start + slice / 2;
    ctx.beginPath();
    ctx.moveTo(center, center);
    ctx.arc(center, center, radius, start, end);
    ctx.closePath();
    ctx.fillStyle = colors[index % colors.length];
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(255,255,255,0.22)";
    ctx.stroke();

    const labelRadius = radius * 0.58;
    const x = center + Math.cos(mid) * labelRadius;
    const y = center + Math.sin(mid) * labelRadius;
    const text = item.length > 16 ? `${item.slice(0, 15)}…` : item;
    const upright = mid > Math.PI / 2 && mid < (Math.PI * 3) / 2;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(upright ? mid + Math.PI : mid);
    ctx.fillStyle = "#ffffff";
    ctx.font = "900 22px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = "rgba(0,0,0,0.55)";
    ctx.shadowBlur = 3;
    ctx.shadowOffsetY = 2;
    ctx.fillText(text, 0, 0, radius * 0.46);
    ctx.restore();
  });

  ctx.beginPath();
  ctx.arc(center, center, radius, 0, Math.PI * 2);
  ctx.lineWidth = 14;
  ctx.strokeStyle = "#fff7df";
  ctx.stroke();
}

function spinWheel() {
  const items = parseItems();
  if (!items.length) return;
  buildWheel(items);
  const index = Math.floor(Math.random() * items.length);
  const slice = 360 / items.length;
  rotation += 1440 + (360 - index * slice - slice / 2);
  document.querySelector("[data-wheel]").style.transform = `rotate(${rotation}deg)`;
  setTimeout(() => setResult(items[index]), 4100);
}

function pickRandom() {
  const items = parseItems();
  if (items.length) setResult(randomItem(items));
}

function renderBoxes(kind) {
  const items = parseItems();
  const grid = document.querySelector("[data-box-grid]");
  if (!grid) return;
  grid.innerHTML = "";
  const shuffled = [...items].sort(() => Math.random() - 0.5);
  shuffled.forEach((item, index) => {
    const button = document.createElement("button");
    button.className = kind === "cards" ? "pick-card" : "mystery-box";
    button.type = "button";
    button.textContent = kind === "cards" ? `Card ${index + 1}` : `Box ${index + 1}`;
    button.addEventListener("click", () => {
      button.classList.add("revealed");
      button.textContent = item;
      setResult(item);
    });
    grid.appendChild(button);
  });
}

function flipCoin() {
  const coin = document.querySelector("[data-coin]");
  const result = Math.random() > 0.5 ? "Heads" : "Tails";
  coin.classList.add("flipping");
  setTimeout(() => {
    coin.textContent = result;
    coin.classList.remove("flipping");
    setResult(result);
  }, 900);
}

function rollDice() {
  const count = Number(document.querySelector("[data-dice-count]")?.value || 2);
  const sides = Number(document.querySelector("[data-dice-sides]")?.value || 6);
  const row = document.querySelector("[data-dice-row]");
  row.innerHTML = "";
  const rolls = [];
  for (let i = 0; i < count; i += 1) {
    const roll = Math.floor(Math.random() * sides) + 1;
    rolls.push(roll);
    const die = document.createElement("div");
    die.className = "die";
    die.textContent = roll;
    row.appendChild(die);
  }
  setResult(`Total ${rolls.reduce((a, b) => a + b, 0)} (${rolls.join(", ")})`);
}

function renderWould() {
  const pairs = parseItems();
  const pair = randomItem(pairs).split("|");
  const stack = document.querySelector("[data-choice-stack]");
  stack.innerHTML = "";
  pair.forEach((choice) => {
    const button = document.createElement("button");
    button.className = "choice";
    button.type = "button";
    button.textContent = choice.trim();
    button.addEventListener("click", () => setResult(choice.trim()));
    stack.appendChild(button);
  });
}

function renderMemory() {
  const items = parseItems().slice(0, 8);
  const deck = [...items, ...items].sort(() => Math.random() - 0.5);
  const grid = document.querySelector("[data-memory-grid]");
  grid.innerHTML = "";
  memoryState = { first: null, lock: false, matches: 0 };
  deck.forEach((item, index) => {
    const card = document.createElement("button");
    card.className = "memory-card";
    card.type = "button";
    card.dataset.value = item;
    card.textContent = "?";
    card.addEventListener("click", () => flipMemory(card, index));
    grid.appendChild(card);
  });
  setResult("Find all matching pairs");
}

function flipMemory(card, index) {
  if (memoryState.lock || card.classList.contains("matched") || card.classList.contains("revealed")) return;
  card.classList.add("revealed");
  card.textContent = card.dataset.value;
  if (!memoryState.first) {
    memoryState.first = { card, index };
    return;
  }
  if (memoryState.first.card.dataset.value === card.dataset.value) {
    card.classList.add("matched");
    memoryState.first.card.classList.add("matched");
    memoryState.first = null;
    memoryState.matches += 1;
    setResult(`Matched ${card.dataset.value}`);
    return;
  }
  memoryState.lock = true;
  setTimeout(() => {
    card.classList.remove("revealed");
    memoryState.first.card.classList.remove("revealed");
    card.textContent = "?";
    memoryState.first.card.textContent = "?";
    memoryState.first = null;
    memoryState.lock = false;
  }, 800);
}

function copyResult() {
  const result = document.querySelector("[data-result]")?.textContent || "";
  if (!result) return;
  navigator.clipboard?.writeText(result);
}

function shareResult() {
  const result = document.querySelector("[data-result]")?.textContent || "";
  if (navigator.share) {
    navigator.share({ title: document.title, text: result, url: location.href });
  } else {
    navigator.clipboard?.writeText(`${result} - ${location.href}`);
  }
}

function initTool() {
  const key = getToolKey();
  if (key === "carpet-cleaning") {
    initCarpetCleaning();
    return;
  }
  const config = tools[key];
  if (!config) return;
  const itemInput = document.querySelector("[data-items]");
  if (itemInput) itemInput.value = config.defaults.join("\n");
  buildWheel(config.defaults);
  if (config.type === "boxes" || config.type === "cards") renderBoxes(config.type);
  if (config.type === "dice") rollDice();
  if (config.type === "would") renderWould();
  if (config.type === "memory") renderMemory();
  document.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.action;
      if (action === "spin") spinWheel();
      if (action === "pick") pickRandom();
      if (action === "boxes") renderBoxes("boxes");
      if (action === "cards") renderBoxes("cards");
      if (action === "coin") flipCoin();
      if (action === "dice") rollDice();
      if (action === "would") renderWould();
      if (action === "memory") renderMemory();
      if (action === "copy") copyResult();
      if (action === "share") shareResult();
    });
  });
}

document.addEventListener("DOMContentLoaded", initTool);

function initCarpetCleaning() {
  const canvas = document.querySelector("[data-carpet-canvas]");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const levels = [
    { name: "Level 1", title: "Small Bedroom Carpet", dirt: 0.34, reward: 50, scale: 0.82 },
    { name: "Level 2", title: "Family Room Carpet", dirt: 0.62, reward: 100, scale: 0.94 },
    { name: "Level 3", title: "Nightmare Carpet", dirt: 0.9, reward: 200, scale: 1 },
  ];
  const toolsConfig = {
    soap: { label: "PSSSSHHH", radius: 34, power: 0.07, color: "rgba(255,255,255,0.9)" },
    water: { label: "SHHHHHHH", radius: 44, power: 0.13, color: "rgba(78,202,255,0.72)" },
    brush: { label: "SCRUB SCRUB", radius: 30, power: 0.19, color: "rgba(255,216,77,0.82)" },
  };

  carpetState = {
    canvas,
    ctx,
    levelIndex: 0,
    level: levels[0],
    tool: "water",
    coins: Number(localStorage.getItem("carpetCoins") || 250),
    startedAt: 0,
    clean: null,
    dirt: null,
    drawing: false,
    complete: false,
    paused: false,
    raf: 0,
    lastPoint: null,
    settingsReturn: "menu",
  };

  bindCarpetUI(levels, toolsConfig);
  showCarpetScreen("menu");
  drawCarpetMenuPreview();
}

function bindCarpetUI(levels, toolsConfig) {
  document.querySelectorAll("[data-carpet-nav]").forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.carpetNav;
      if (target === "settings") showCarpetDialog("settings");
      else showCarpetScreen(target);
    });
  });

  document.querySelectorAll("[data-carpet-level]").forEach((button) => {
    button.addEventListener("click", () => startCarpetLevel(Number(button.dataset.carpetLevel || 0), levels));
  });

  document.querySelectorAll("[data-carpet-tool]").forEach((button) => {
    button.addEventListener("click", () => setCarpetTool(button.dataset.carpetTool, toolsConfig));
  });

  document.querySelector("[data-carpet-pause]")?.addEventListener("click", pauseCarpet);
  document.querySelector("[data-carpet-resume]")?.addEventListener("click", resumeCarpet);
  document.querySelectorAll("[data-carpet-restart]").forEach((button) => button.addEventListener("click", restartCarpet));
  document.querySelector("[data-carpet-exit]")?.addEventListener("click", () => {
    hideCarpetOverlay();
    showCarpetScreen("levels");
  });
  document.querySelector("[data-carpet-next]")?.addEventListener("click", restartCarpet);
  document.querySelector("[data-carpet-settings-back]")?.addEventListener("click", () => {
    if (carpetState?.paused) showCarpetDialog("pause");
    else hideCarpetOverlay();
  });

  const canvas = carpetState.canvas;
  canvas.addEventListener("pointerdown", (event) => {
    if (carpetState.complete || carpetState.paused) return;
    carpetState.drawing = true;
    canvas.setPointerCapture(event.pointerId);
    cleanCarpetAt(event, toolsConfig);
  });
  canvas.addEventListener("pointermove", (event) => {
    moveCarpetCursor(event);
    if (carpetState.drawing) cleanCarpetAt(event, toolsConfig);
  });
  canvas.addEventListener("pointerup", () => {
    carpetState.drawing = false;
    carpetState.lastPoint = null;
  });
  canvas.addEventListener("pointerleave", () => {
    carpetState.drawing = false;
    carpetState.lastPoint = null;
  });

  document.addEventListener("keydown", (event) => {
    if (!carpetState) return;
    if (event.key === "1") setCarpetTool("soap", toolsConfig);
    if (event.key === "2") setCarpetTool("water", toolsConfig);
    if (event.key === "3") setCarpetTool("brush", toolsConfig);
    if (event.key === "Escape" && document.querySelector('[data-carpet-screen="play"]').classList.contains("active")) {
      carpetState.paused ? resumeCarpet() : pauseCarpet();
    }
  });
}

function showCarpetScreen(name) {
  document.querySelectorAll("[data-carpet-screen]").forEach((screen) => {
    screen.classList.toggle("active", screen.dataset.carpetScreen === name);
  });
}

function showCarpetDialog(name) {
  const overlay = document.querySelector("[data-carpet-overlay]");
  overlay.hidden = false;
  document.querySelectorAll("[data-carpet-dialog]").forEach((dialog) => {
    dialog.hidden = dialog.dataset.carpetDialog !== name;
  });
}

function hideCarpetOverlay() {
  const overlay = document.querySelector("[data-carpet-overlay]");
  if (overlay) overlay.hidden = true;
}

function startCarpetLevel(index, levels) {
  carpetState.levelIndex = index;
  carpetState.level = levels[index];
  carpetState.startedAt = Date.now();
  carpetState.complete = false;
  carpetState.paused = false;
  carpetState.drawing = false;
  carpetState.lastPoint = null;
  hideCarpetOverlay();
  showCarpetScreen("play");
  document.querySelector("[data-carpet-level-title]").textContent = `${carpetState.level.name} · ${carpetState.level.title}`;
  document.querySelector("[data-carpet-coins]").textContent = `$${carpetState.coins}`;
  document.querySelector("[data-carpet-feedback]").textContent = "Hold left mouse and wash the dirty carpet.";
  resetCarpetMask();
  renderCarpet();
  updateCarpetProgress();
}

function restartCarpet() {
  startCarpetLevel(carpetState.levelIndex, [
    { name: "Level 1", title: "Small Bedroom Carpet", dirt: 0.34, reward: 50, scale: 0.82 },
    { name: "Level 2", title: "Family Room Carpet", dirt: 0.62, reward: 100, scale: 0.94 },
    { name: "Level 3", title: "Nightmare Carpet", dirt: 0.9, reward: 200, scale: 1 },
  ]);
}

function pauseCarpet() {
  if (!carpetState || carpetState.complete) return;
  carpetState.paused = true;
  showCarpetDialog("pause");
}

function resumeCarpet() {
  carpetState.paused = false;
  hideCarpetOverlay();
}

function setCarpetTool(tool, toolsConfig) {
  carpetState.tool = tool;
  document.querySelectorAll("[data-carpet-tool]").forEach((button) => {
    button.classList.toggle("active", button.dataset.carpetTool === tool);
  });
  document.querySelector("[data-carpet-feedback]").textContent = `${toolsConfig[tool].label} · drag over dirty areas`;
  document.querySelector("[data-carpet-cursor]").textContent = tool.toUpperCase();
}

function resetCarpetMask() {
  const size = carpetState.canvas.width * carpetState.canvas.height;
  carpetState.clean = new Float32Array(size);
  carpetState.dirt = new Float32Array(size);
  const { width, height } = carpetState.canvas;
  const dirtTarget = carpetState.level.dirt;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const noise =
        Math.sin(x * 0.026) * 0.16 +
        Math.cos(y * 0.031) * 0.14 +
        Math.sin((x + y) * 0.017) * 0.1 +
        Math.random() * 0.12;
      const stain = Math.max(0, Math.min(1, dirtTarget + noise));
      carpetState.dirt[y * width + x] = stain;
    }
  }
}

function renderCarpet() {
  const { ctx, canvas, clean, dirt } = carpetState;
  const { width, height } = canvas;
  const img = ctx.createImageData(width, height);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const i = y * width + x;
      const p = i * 4;
      const stripe = Math.sin((x + y * 0.22) * 0.042) > 0 ? 1 : 0;
      const base = stripe ? [77, 153, 176] : [238, 195, 102];
      const mud = [88, 59, 40];
      const grease = [30, 31, 42];
      const d = dirt[i] * (1 - clean[i]);
      const greaseMix = Math.max(0, d - 0.55) * 0.8;
      img.data[p] = Math.round(base[0] * (1 - d) + mud[0] * d * (1 - greaseMix) + grease[0] * greaseMix);
      img.data[p + 1] = Math.round(base[1] * (1 - d) + mud[1] * d * (1 - greaseMix) + grease[1] * greaseMix);
      img.data[p + 2] = Math.round(base[2] * (1 - d) + mud[2] * d * (1 - greaseMix) + grease[2] * greaseMix);
      img.data[p + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  drawCarpetDetails(ctx, width, height);
}

function drawCarpetDetails(ctx, width, height) {
  ctx.save();
  ctx.globalAlpha = 0.28;
  ctx.strokeStyle = "rgba(255,255,255,0.34)";
  ctx.lineWidth = 3;
  for (let x = 34; x < width; x += 56) {
    ctx.beginPath();
    ctx.moveTo(x, 18);
    ctx.lineTo(x - 22, height - 18);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  ctx.lineWidth = 18;
  ctx.strokeStyle = "rgba(255,247,223,0.85)";
  ctx.strokeRect(8, 8, width - 16, height - 16);
  ctx.restore();
}

function cleanCarpetAt(event, toolsConfig) {
  const point = getCarpetPoint(event);
  if (!point) return;
  const tool = toolsConfig[carpetState.tool];
  const points = carpetState.lastPoint ? interpolatePoints(carpetState.lastPoint, point) : [point];
  points.forEach((p) => applyCarpetBrush(p.x, p.y, tool));
  carpetState.lastPoint = point;
  renderCarpet();
  drawToolEffect(point, tool);
  updateCarpetProgress();
}

function getCarpetPoint(event) {
  const rect = carpetState.canvas.getBoundingClientRect();
  return {
    x: Math.round(((event.clientX - rect.left) / rect.width) * carpetState.canvas.width),
    y: Math.round(((event.clientY - rect.top) / rect.height) * carpetState.canvas.height),
  };
}

function interpolatePoints(a, b) {
  const distance = Math.hypot(b.x - a.x, b.y - a.y);
  const steps = Math.max(1, Math.ceil(distance / 18));
  return Array.from({ length: steps }, (_, index) => {
    const t = (index + 1) / steps;
    return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
  });
}

function applyCarpetBrush(cx, cy, tool) {
  const { canvas, clean, dirt } = carpetState;
  const radius = tool.radius;
  const minX = Math.max(0, Math.floor(cx - radius));
  const maxX = Math.min(canvas.width - 1, Math.ceil(cx + radius));
  const minY = Math.max(0, Math.floor(cy - radius));
  const maxY = Math.min(canvas.height - 1, Math.ceil(cy + radius));
  for (let y = minY; y <= maxY; y += 1) {
    for (let x = minX; x <= maxX; x += 1) {
      const dx = x - cx;
      const dy = y - cy;
      const distance = Math.hypot(dx, dy);
      if (distance > radius) continue;
      const i = y * canvas.width + x;
      const falloff = 1 - distance / radius;
      const stubbornBonus = carpetState.tool === "brush" && dirt[i] > 0.52 ? 0.09 : 0;
      const soapBonus = carpetState.tool === "soap" && dirt[i] > 0.68 ? 0.05 : 0;
      clean[i] = Math.min(1, clean[i] + (tool.power + stubbornBonus + soapBonus) * falloff);
    }
  }
}

function drawToolEffect(point, tool) {
  const { ctx } = carpetState;
  ctx.save();
  ctx.globalAlpha = 0.68;
  ctx.fillStyle = tool.color;
  for (let i = 0; i < 10; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * tool.radius;
    ctx.beginPath();
    ctx.arc(point.x + Math.cos(angle) * distance, point.y + Math.sin(angle) * distance, 3 + Math.random() * 8, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function updateCarpetProgress() {
  const { clean, dirt } = carpetState;
  let dirtyTotal = 0;
  let removed = 0;
  for (let i = 0; i < dirt.length; i += 12) {
    dirtyTotal += dirt[i];
    removed += dirt[i] * clean[i];
  }
  const rawProgress = Math.round((removed / dirtyTotal) * 100);
  const progress = rawProgress >= 96 ? 100 : Math.min(100, rawProgress);
  document.querySelector("[data-carpet-progress]").textContent = `${progress}%`;
  document.querySelector("[data-carpet-bar]").style.width = `${progress}%`;
  if (progress >= 100 && !carpetState.complete) completeCarpet();
}

function completeCarpet() {
  carpetState.complete = true;
  carpetState.coins += carpetState.level.reward;
  localStorage.setItem("carpetCoins", String(carpetState.coins));
  document.querySelector("[data-carpet-coins]").textContent = `$${carpetState.coins}`;
  document.querySelector("[data-carpet-shine]").classList.add("active");
  const seconds = Math.max(1, Math.round((Date.now() - carpetState.startedAt) / 1000));
  const stars = seconds < 120 ? 5 : seconds < 180 ? 4 : 3;
  document.querySelector("[data-carpet-stars]").textContent = "★★★★★".slice(0, stars);
  document.querySelector("[data-carpet-time]").textContent = `Time ${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
  setTimeout(() => {
    document.querySelector("[data-carpet-shine]").classList.remove("active");
    showCarpetDialog("result");
  }, 700);
}

function moveCarpetCursor(event) {
  const cursor = document.querySelector("[data-carpet-cursor]");
  const board = document.querySelector(".carpet-board");
  if (!cursor || !board) return;
  const rect = board.getBoundingClientRect();
  cursor.style.left = `${event.clientX - rect.left}px`;
  cursor.style.top = `${event.clientY - rect.top}px`;
}

function drawCarpetMenuPreview() {
  const preview = document.querySelector(".preview-rug");
  if (!preview) return;
  preview.animate(
    [
      { transform: "rotateX(58deg) rotateZ(-10deg) translateY(0)" },
      { transform: "rotateX(58deg) rotateZ(-10deg) translateY(-10px)" },
      { transform: "rotateX(58deg) rotateZ(-10deg) translateY(0)" },
    ],
    { duration: 2600, iterations: Infinity, easing: "ease-in-out" },
  );
}
