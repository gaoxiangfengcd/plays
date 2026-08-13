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
