const tools = {
  "spin-the-wheel": {
    defaults: ["Pizza", "Burger", "Sushi", "Ramen", "Pasta", "Salad", "Steak", "Tacos"],
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

const colors = ["#f44336", "#ff8a00", "#7c3fe0", "#2f6fec", "#39aee0", "#42b94a", "#f4b400", "#e72d86"];
const wheelEmojis = ["🍕", "🍔", "🍣", "🍜", "🍝", "🥗", "🥩", "🌮", "🎁", "⭐", "🎲", "🎯"];
const decisionTemplates = {
  food: ["Pizza", "Burgers", "Sushi", "Tacos", "Pasta", "Salad"],
  games: ["3D Coin Flip", "Spin the Wheel", "Dice Roller", "Pick a Card", "Memory Match", "Truth or Dare"],
  tasks: ["Start the hardest task", "Reply to messages", "Clean your desk", "Take a short break", "Plan tomorrow", "Finish one small thing"],
  yesno: ["Yes", "No", "Maybe later", "Ask again", "Try once", "Skip it"],
  teams: ["Team A", "Team B", "Team C", "Team D", "Player 1", "Player 2"],
};
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
  renderWheelHistory();
}

function buildWheel(items) {
  const wheel = document.querySelector("[data-wheel]");
  if (!wheel) {
    if (typeof window.playPicksWheel3DSetItems === "function") window.playPicksWheel3DSetItems(items);
    return;
  }
  const size = wheel.width;
  const ctx = wheel.getContext("2d");
  const center = size / 2;
  const radius = center - 70;
  const slice = (Math.PI * 2) / items.length;
  ctx.clearRect(0, 0, size, size);

  const shadow = ctx.createRadialGradient(center, center + 30, radius * 0.25, center, center + 30, radius * 1.15);
  shadow.addColorStop(0, "rgba(36, 10, 89, 0.12)");
  shadow.addColorStop(0.68, "rgba(36, 10, 89, 0.25)");
  shadow.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.beginPath();
  ctx.ellipse(center, center + radius * 0.72, radius * 0.86, radius * 0.18, 0, 0, Math.PI * 2);
  ctx.fillStyle = shadow;
  ctx.fill();

  for (let layer = 0; layer < 18; layer += 1) {
    ctx.beginPath();
    ctx.arc(center, center + 20 + layer * 1.1, radius + 25, 0, Math.PI * 2);
    ctx.lineWidth = 5;
    ctx.strokeStyle = `rgba(102, 57, 12, ${0.12 - layer * 0.004})`;
    ctx.stroke();
  }

  items.forEach((item, index) => {
    const start = index * slice - Math.PI / 2;
    const end = start + slice;
    const mid = start + slice / 2;
    const base = colors[index % colors.length];
    const gradient = ctx.createRadialGradient(center - 80, center - 100, radius * 0.1, center, center, radius);
    gradient.addColorStop(0, "#fff1a8");
    gradient.addColorStop(0.18, base);
    gradient.addColorStop(1, base);
    ctx.beginPath();
    ctx.moveTo(center, center);
    ctx.arc(center, center, radius, start, end);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(255,255,255,0.52)";
    ctx.stroke();

    const labelRadius = radius * 0.58;
    const x = center + Math.cos(mid) * labelRadius;
    const y = center + Math.sin(mid) * labelRadius;
    const text = item.length > 12 ? `${item.slice(0, 11)}…` : item;
    const upright = mid > Math.PI / 2 && mid < (Math.PI * 3) / 2;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(upright ? mid + Math.PI : mid);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#ffffff";
    ctx.font = "900 24px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = "rgba(0,0,0,0.55)";
    ctx.shadowBlur = 3;
    ctx.shadowOffsetY = 2;
    ctx.fillText(text, 0, 0, radius * 0.46);
    ctx.restore();
  });

  const gloss = ctx.createLinearGradient(center - radius, center - radius, center + radius, center + radius);
  gloss.addColorStop(0, "rgba(255,255,255,0.38)");
  gloss.addColorStop(0.34, "rgba(255,255,255,0.04)");
  gloss.addColorStop(0.7, "rgba(0,0,0,0.12)");
  gloss.addColorStop(1, "rgba(255,255,255,0.16)");
  ctx.beginPath();
  ctx.arc(center, center, radius, 0, Math.PI * 2);
  ctx.fillStyle = gloss;
  ctx.fill();

  const rim = ctx.createLinearGradient(center - radius, center - radius, center + radius, center + radius);
  rim.addColorStop(0, "#fff6bf");
  rim.addColorStop(0.22, "#d78620");
  rim.addColorStop(0.5, "#ffd55f");
  rim.addColorStop(0.76, "#a85f12");
  rim.addColorStop(1, "#fff1ad");
  ctx.beginPath();
  ctx.arc(center, center, radius + 29, 0, Math.PI * 2);
  ctx.lineWidth = 34;
  ctx.strokeStyle = rim;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(center, center, radius + 47, 0, Math.PI * 2);
  ctx.lineWidth = 7;
  ctx.strokeStyle = "#7a4411";
  ctx.stroke();

  for (let i = 0; i < items.length * 2; i += 1) {
    const angle = (Math.PI * 2 * i) / (items.length * 2) - Math.PI / 2;
    const x = center + Math.cos(angle) * (radius + 46);
    const y = center + Math.sin(angle) * (radius + 46);
    const bolt = ctx.createRadialGradient(x - 2, y - 2, 1, x, y, 7);
    bolt.addColorStop(0, "#fff8d2");
    bolt.addColorStop(0.45, "#aeb4c2");
    bolt.addColorStop(1, "#4d5564");
    ctx.beginPath();
    ctx.arc(x, y, 6.2, 0, Math.PI * 2);
    ctx.fillStyle = bolt;
    ctx.fill();
  }

  const hub = ctx.createRadialGradient(center - 18, center - 24, 6, center, center, 54);
  hub.addColorStop(0, "#fff8c7");
  hub.addColorStop(0.28, "#ffd04b");
  hub.addColorStop(0.72, "#e59116");
  hub.addColorStop(1, "#8c4e0c");
  ctx.beginPath();
  ctx.arc(center, center, 45, 0, Math.PI * 2);
  ctx.fillStyle = hub;
  ctx.fill();
  ctx.lineWidth = 6;
  ctx.strokeStyle = "#fff0a2";
  ctx.stroke();
}

function spinWheel() {
  const items = parseItems();
  if (!items.length) return;
  buildWheel(items);
  const index = Math.floor(Math.random() * items.length);
  if (typeof window.playPicksSpinWheel3D === "function") {
    window.playPicksSpinWheel3D(index, items);
    setTimeout(() => setResult(items[index]), 4100);
    return;
  }
  const slice = 360 / items.length;
  rotation += 1440 + (360 - index * slice - slice / 2);
  document.querySelector("[data-wheel]").style.transform = `rotate(${rotation}deg)`;
  setTimeout(() => setResult(items[index]), 4100);
}

function syncWheelInputFromOptions() {
  const input = document.querySelector("[data-items]");
  const rows = [...document.querySelectorAll("[data-wheel-option-input]")];
  if (!input || !rows.length) return;
  input.value = rows.map((row) => row.value.trim()).filter(Boolean).join("\n");
  const items = parseItems();
  document.querySelector("[data-option-count]") && (document.querySelector("[data-option-count]").textContent = String(items.length));
  document.querySelector("[data-options-used]") && (document.querySelector("[data-options-used]").textContent = String(items.length));
  buildWheel(items.length ? items : tools["spin-the-wheel"].defaults);
  const result = document.querySelector("[data-result]");
  if (result && result.textContent !== "Ready to spin") result.textContent = "Ready to spin";
}

function renderWheelOptions() {
  const list = document.querySelector("[data-wheel-options]");
  const input = document.querySelector("[data-items]");
  if (!list || !input) return;
  const items = parseItems().filter(Boolean);
  list.innerHTML = items
    .map(
      (item, index) => `
        <label class="wheel-option-row">
          <span class="wheel-drag">⋮⋮</span>
          <input data-wheel-option-input value="${item.replace(/"/g, "&quot;")}" aria-label="Wheel option ${index + 1}" />
          <i style="--dot:${colors[index % colors.length]}"></i>
          <button type="button" data-remove-wheel-option="${index}" aria-label="Remove ${item}">×</button>
        </label>`,
    )
    .join("");
  document.querySelectorAll("[data-wheel-option-input]").forEach((field) => {
    field.addEventListener("input", syncWheelInputFromOptions);
  });
  document.querySelectorAll("[data-remove-wheel-option]").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.removeWheelOption);
      const next = parseItems().filter((_, itemIndex) => itemIndex !== index);
      input.value = next.join("\n");
      renderWheelOptions();
      syncWheelInputFromOptions();
    });
  });
  syncWheelInputFromOptions();
}

function renderWheelHistory() {
  const list = document.querySelector("[data-history-list]");
  if (!list) return;
  if (!history.length) {
    list.innerHTML = "<p>No spins yet</p>";
    return;
  }
  list.innerHTML = history
    .map(
      (item, index) => `
        <div>
          <i style="--dot:${colors[index % colors.length]}"></i>
          <strong>${item}</strong>
          <span>${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
        </div>`,
    )
    .join("");
  const total = document.querySelector("[data-total-spins]");
  if (total) total.textContent = String(history.length);
}

function pickRandom() {
  const items = parseItems();
  if (items.length) setResult(randomItem(items));
}

function applyDecisionTemplate(name) {
  const template = decisionTemplates[name];
  const input = document.querySelector("[data-items]");
  if (!template || !input) return;
  document.querySelectorAll("[data-template]").forEach((button) => {
    const active = button.dataset.template === name;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", active ? "true" : "false");
  });
  input.value = template.join("\n");
  setResult(`Template: ${name.replace(/yesno/i, "yes or no")}`);
}

function clearDecisionMaker() {
  const input = document.querySelector("[data-items]");
  if (input) input.value = "";
  history = [];
  const result = document.querySelector("[data-result]");
  if (result) result.textContent = "Waiting for options";
  const historyNode = document.querySelector("[data-history]");
  if (historyNode) historyNode.textContent = "No decisions yet";
  document.querySelectorAll("[data-template]").forEach((button) => {
    button.classList.remove("is-active");
    button.setAttribute("aria-pressed", "false");
  });
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
  if (typeof window.playPicksFlipCoin3D === "function") {
    window.playPicksFlipCoin3D();
    return;
  }
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
  if (key === "spin-the-wheel") renderWheelOptions();
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
      if (action === "clear") clearDecisionMaker();
    });
  });
  document.querySelectorAll("[data-template]").forEach((button) => {
    button.addEventListener("click", () => applyDecisionTemplate(button.dataset.template));
  });
  document.querySelector("[data-add-option]")?.addEventListener("click", () => {
    const input = document.querySelector("[data-items]");
    if (!input) return;
    const next = [...parseItems(), `Option ${parseItems().length + 1}`];
    input.value = next.join("\n");
    renderWheelOptions();
  });
  document.querySelector("[data-wheel-clear]")?.addEventListener("click", () => {
    history = [];
    renderWheelHistory();
    const result = document.querySelector("[data-result]");
    if (result) result.textContent = "Ready to spin";
  });
}

document.addEventListener("DOMContentLoaded", initTool);

function initCarpetCleaning() {
  const canvas = document.querySelector("[data-carpet-canvas]");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const levels = getCarpetLevels();
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
    timer: 0,
    lastPoint: null,
    settingsReturn: "menu",
  };

  bindCarpetUI(levels, toolsConfig);
  showCarpetScreen("menu");
  drawCarpetMenuPreview();
}

function getCarpetLevels() {
  return [
    { name: "Level 1", title: "Cozy Bedroom Rug", dirt: 0.28, reward: 50, scale: 0.78, palette: [[242, 145, 96], [54, 183, 166]] },
    { name: "Level 2", title: "Family Room Carpet", dirt: 0.46, reward: 100, scale: 0.88, palette: [[77, 153, 226], [255, 199, 82]] },
    { name: "Level 3", title: "Pet Mess Runner", dirt: 0.58, reward: 160, scale: 0.94, palette: [[150, 114, 230], [245, 245, 255]] },
    { name: "Level 4", title: "Luxury Pattern Rug", dirt: 0.72, reward: 230, scale: 1, palette: [[210, 64, 84], [30, 42, 76]] },
    { name: "Level 5", title: "Disaster Carpet", dirt: 0.88, reward: 350, scale: 1.04, palette: [[38, 188, 142], [255, 220, 82]] },
  ];
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
  document.querySelectorAll("[data-carpet-next]").forEach((button) => button.addEventListener("click", nextCarpetLevel));
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
  const safeIndex = Math.max(0, Math.min(levels.length - 1, index));
  carpetState.levelIndex = safeIndex;
  carpetState.level = levels[safeIndex];
  carpetState.startedAt = Date.now();
  carpetState.complete = false;
  carpetState.paused = false;
  carpetState.drawing = false;
  carpetState.lastPoint = null;
  clearInterval(carpetState.timer);
  carpetState.timer = window.setInterval(updateCarpetTimer, 1000);
  hideCarpetOverlay();
  showCarpetScreen("play");
  document.querySelector("[data-carpet-level-number]").textContent = String(safeIndex + 1);
  document.querySelector("[data-carpet-level-title]").textContent = carpetState.level.title;
  document.querySelector("[data-carpet-coins]").textContent = `$${carpetState.coins}`;
  document.querySelector("[data-carpet-feedback]").textContent = "Hold left mouse and wash the dirty carpet.";
  document.querySelectorAll(".level-thumb").forEach((thumb, thumbIndex) => {
    thumb.classList.toggle("active", thumbIndex === safeIndex);
  });
  updateCarpetTimer();
  resetCarpetMask();
  renderCarpet();
  updateCarpetProgress();
}

function restartCarpet() {
  startCarpetLevel(carpetState.levelIndex, getCarpetLevels());
}

function nextCarpetLevel() {
  const levels = getCarpetLevels();
  const nextIndex = carpetState.complete ? carpetState.levelIndex + 1 : carpetState.levelIndex;
  startCarpetLevel(nextIndex >= levels.length ? 0 : nextIndex, levels);
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
      const palette = carpetState.level.palette || [[77, 153, 176], [238, 195, 102]];
      const base = stripe ? palette[0] : palette[1];
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
  ctx.globalAlpha = 0.42;
  ctx.strokeStyle = "rgba(12,28,42,0.58)";
  ctx.lineWidth = 8;
  ctx.strokeRect(58, 58, width - 116, height - 116);
  ctx.lineWidth = 4;
  ctx.strokeStyle = "rgba(255,247,223,0.5)";
  ctx.strokeRect(82, 82, width - 164, height - 164);

  for (let ring = 0; ring < 5; ring += 1) {
    const inset = 108 + ring * 22;
    ctx.beginPath();
    ctx.ellipse(width / 2, height / 2, Math.max(24, width / 2 - inset), Math.max(20, height / 2 - inset * 0.62), 0, 0, Math.PI * 2);
    ctx.strokeStyle = ring % 2 ? "rgba(201,72,56,0.42)" : "rgba(19,67,92,0.44)";
    ctx.lineWidth = ring % 2 ? 4 : 6;
    ctx.stroke();
  }

  for (let i = 0; i < 34; i += 1) {
    const x = 96 + (i * 73) % (width - 192);
    const y = 96 + (i * 47) % (height - 192);
    ctx.beginPath();
    ctx.ellipse(x, y, 14 + (i % 5) * 3, 8 + (i % 3) * 4, i * 0.6, 0, Math.PI * 2);
    ctx.fillStyle = i % 2 ? "rgba(17,68,90,0.38)" : "rgba(172,55,45,0.33)";
    ctx.fill();
  }

  ctx.globalAlpha = 0.22;
  ctx.strokeStyle = "rgba(255,255,255,0.38)";
  ctx.lineWidth = 2;
  for (let x = 34; x < width; x += 42) {
    ctx.beginPath();
    ctx.moveTo(x, 18);
    ctx.lineTo(x - 14, height - 18);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  ctx.lineWidth = 20;
  ctx.strokeStyle = "rgba(82,36,22,0.88)";
  ctx.strokeRect(8, 8, width - 16, height - 16);
  ctx.lineWidth = 6;
  ctx.strokeStyle = "rgba(255,247,223,0.76)";
  ctx.strokeRect(28, 28, width - 56, height - 56);
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
  document.querySelectorAll("[data-carpet-progress]").forEach((node) => {
    node.textContent = `${progress}%`;
  });
  document.querySelectorAll("[data-carpet-bar]").forEach((node) => {
    node.style.width = `${progress}%`;
  });
  const ring = document.querySelector("[data-carpet-ring]");
  if (ring) ring.style.setProperty("--clean", `${progress}%`);
  const ringText = document.querySelector("[data-carpet-progress-ring]");
  if (ringText) ringText.textContent = `${progress}%`;
  document.querySelector("[data-objective-stains]")?.classList.toggle("done", progress >= 65);
  document.querySelector("[data-objective-finish]")?.classList.toggle("done", progress >= 100);
  document.querySelector("[data-carpet-live-stars]").textContent = progress >= 100 ? "★★★★★" : progress >= 60 ? "★★★★☆" : "★★★☆☆";
  if (progress >= 100 && !carpetState.complete) completeCarpet();
}

function completeCarpet() {
  carpetState.complete = true;
  clearInterval(carpetState.timer);
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

function updateCarpetTimer() {
  if (!carpetState || !carpetState.startedAt || carpetState.paused) return;
  const seconds = Math.max(0, Math.floor((Date.now() - carpetState.startedAt) / 1000));
  const timer = document.querySelector("[data-carpet-timer]");
  if (timer) timer.textContent = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
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
