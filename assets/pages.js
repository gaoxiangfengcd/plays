/* ==========================================================================
   Play Picks — Home page data & rendering
   Real pages link out normally; not-yet-built games are marked "Soon"
   and point back to the section anchor to avoid dead links (SEO safe).

   ICONS/COVERS: real cut-out art lives in /assets/img/. Each key below maps
   to a PNG sliced from the design mock. To swap art later, just drop a new
   file with the same name — the render functions won't need changes.
   ========================================================================== */

/* ---- icon key -> real image file (cut from the design mock) ---- */
const ICON_IMG = {
  coin: "ic-coin",
  wheel: "ic-wheel",
  card: "ic-card",
  dice: "ic-dice",
  gift: "ic-players",       // Random Name Picker -> player token
  bubble: "ic-question",    // Would You Rather -> question bubble
  star: "ic-memory",        // Memory Match -> 4-star tiles
  heartcard: "ic-heart",    // Truth or Dare -> heart
  rocket: "ic-rocket",
  map: "ic-map",
  puzzle: "ic-puzzle",
  wheel2: "ic-wheel2",      // Simulation -> steering wheel
  ball: "ic-basketball",
  redcar: "ic-redcar",
  joystick: "ic-pawn",      // Arcade -> gold pawn
  chess: "ic-rook",         // Strategy -> blue rook
  smile: "ic-smile",
};

function icon(key) {
  const svg = SVG_ICONS[key];
  return svg || "";
}

/* ---- crisp vector icon set (scales to any size, always sharp) ---- */
const SVG_ICONS = {
  coin: `<svg viewBox="0 0 64 64"><defs><linearGradient id="g-coin" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffd766"/><stop offset="1" stop-color="#f0a323"/></linearGradient></defs><circle cx="32" cy="32" r="26" fill="url(#g-coin)"/><circle cx="32" cy="32" r="26" fill="none" stroke="#e0900f" stroke-width="2"/><circle cx="32" cy="32" r="18" fill="none" stroke="#fff3d0" stroke-width="2.5" opacity=".7"/><text x="32" y="42" font-size="26" text-anchor="middle" fill="#c9760a" font-weight="900" font-family="Arial">$</text><ellipse cx="24" cy="20" rx="7" ry="4" fill="#fff" opacity=".35"/></svg>`,
  wheel: `<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="27" fill="#2d2b45"/><g><path d="M32 32 L32 6 A26 26 0 0 1 54.5 19 Z" fill="#fd79a8"/><path d="M32 32 L54.5 19 A26 26 0 0 1 54.5 45 Z" fill="#fdcb6e"/><path d="M32 32 L54.5 45 A26 26 0 0 1 32 58 Z" fill="#00b894"/><path d="M32 32 L32 58 A26 26 0 0 1 9.5 45 Z" fill="#0984e3"/><path d="M32 32 L9.5 45 A26 26 0 0 1 9.5 19 Z" fill="#a29bfe"/><path d="M32 32 L9.5 19 A26 26 0 0 1 32 6 Z" fill="#6c5ce7"/></g><circle cx="32" cy="32" r="6" fill="#fff"/><circle cx="32" cy="32" r="6" fill="none" stroke="#2d2b45" stroke-width="1.5"/><path d="M32 2 l5 8 h-10 z" fill="#e74c3c"/></svg>`,
  card: `<svg viewBox="0 0 64 64"><g transform="rotate(-12 30 32)"><rect x="15" y="14" width="26" height="36" rx="5" fill="#fff" stroke="#dfe1ec" stroke-width="1.5"/></g><rect x="24" y="16" width="26" height="36" rx="5" fill="#fff" stroke="#dfe1ec" stroke-width="1.5"/><path d="M37 26 l5 8 -5 8 -5-8 z" fill="#e74c3c"/><path d="M30 22 l2 3 2-3 z" fill="#e74c3c"/><path d="M42 46 l2 -3 2 3 z" fill="#e74c3c"/></svg>`,
  dice: `<svg viewBox="0 0 64 64"><defs><linearGradient id="g-dice" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4a4763"/><stop offset="1" stop-color="#2d2b45"/></linearGradient></defs><rect x="12" y="12" width="40" height="40" rx="10" fill="url(#g-dice)"/><rect x="12" y="12" width="40" height="40" rx="10" fill="none" stroke="#1c1a30" stroke-width="1.5"/><g fill="#fff"><circle cx="23" cy="23" r="4"/><circle cx="41" cy="23" r="4"/><circle cx="32" cy="32" r="4"/><circle cx="23" cy="41" r="4"/><circle cx="41" cy="41" r="4"/></g><rect x="16" y="16" width="16" height="7" rx="4" fill="#fff" opacity=".14"/></svg>`,
  gift: `<svg viewBox="0 0 64 64"><defs><linearGradient id="g-gift" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff8fc0"/><stop offset="1" stop-color="#e6318f"/></linearGradient></defs><rect x="13" y="27" width="38" height="25" rx="4" fill="url(#g-gift)"/><rect x="10" y="19" width="44" height="11" rx="4" fill="#fd79a8"/><rect x="28" y="19" width="8" height="33" fill="#ffe08a"/><path d="M32 19c-3-8-14-6-11 0 M32 19c3-8 14-6 11 0" fill="none" stroke="#ffe08a" stroke-width="5" stroke-linecap="round"/><rect x="15" y="22" width="14" height="4" rx="2" fill="#fff" opacity=".25"/></svg>`,
  bubble: `<svg viewBox="0 0 64 64"><defs><linearGradient id="g-bub" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8f7bff"/><stop offset="1" stop-color="#6c5ce7"/></linearGradient></defs><path d="M14 10h36a8 8 0 0 1 8 8v18a8 8 0 0 1-8 8H30l-11 9v-9h-5a8 8 0 0 1-8-8V18a8 8 0 0 1 8-8z" fill="url(#g-bub)"/><text x="32" y="35" font-size="26" text-anchor="middle" fill="#fff" font-weight="900" font-family="Arial">?</text></svg>`,
  star: `<svg viewBox="0 0 64 64"><defs><linearGradient id="g-star" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2bd6a8"/><stop offset="1" stop-color="#00a884"/></linearGradient></defs><rect x="12" y="12" width="40" height="40" rx="8" fill="url(#g-star)"/><path d="M32 19l4.3 8.7 9.7 1.4-7 6.8 1.6 9.6L32 51l-8.6 4.5 1.6-9.6-7-6.8 9.7-1.4z" fill="#ffe08a"/></svg>`,
  heartcard: `<svg viewBox="0 0 64 64"><defs><linearGradient id="g-hc" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff9ec4"/><stop offset="1" stop-color="#fd5fa0"/></linearGradient></defs><rect x="12" y="12" width="40" height="40" rx="8" fill="url(#g-hc)"/><path d="M32 47c-9-6.5-14-11-14-17a7 7 0 0 1 14-2 7 7 0 0 1 14 2c0 6-5 10.5-14 17z" fill="#fff"/></svg>`,
  rocket: `<svg viewBox="0 0 64 64"><defs><linearGradient id="g-rk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff7b6b"/><stop offset="1" stop-color="#e0392b"/></linearGradient></defs><path d="M32 6c9 5 14 15 14 26l-6 8H24l-6-8c0-11 5-21 14-26z" fill="url(#g-rk)"/><circle cx="32" cy="25" r="5.5" fill="#dff9fb"/><circle cx="32" cy="25" r="2.5" fill="#0984e3"/><path d="M24 40l-7 11 11-4zM40 40l7 11-11-4z" fill="#f6b93b"/><path d="M28 46h8l-4 9z" fill="#ffb84d"/></svg>`,
  map: `<svg viewBox="0 0 64 64"><defs><linearGradient id="g-mp" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#34e2a0"/><stop offset="1" stop-color="#00a884"/></linearGradient></defs><path d="M12 16l14-4 12 4 14-4v36l-14 4-12-4-14 4z" fill="url(#g-mp)"/><path d="M26 12v36M38 16v36" stroke="#0a7a5a" stroke-width="2" fill="none" opacity=".6"/><path d="M40 22a6 6 0 0 1 6 6c0 4-6 10-6 10s-6-6-6-10a6 6 0 0 1 6-6z" fill="#e74c3c"/><circle cx="40" cy="28" r="2.2" fill="#fff"/></svg>`,
  puzzle: `<svg viewBox="0 0 64 64"><defs><linearGradient id="g-pz" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8f7bff"/><stop offset="1" stop-color="#6c5ce7"/></linearGradient></defs><path d="M14 14h16a5 5 0 0 1 10 0h10v16a5 5 0 0 1 0 10v10H34a5 5 0 0 0-10 0H14V34a5 5 0 0 1 0-10z" fill="url(#g-pz)"/><rect x="18" y="18" width="12" height="4" rx="2" fill="#fff" opacity=".3"/></svg>`,
  wheel2: `<svg viewBox="0 0 64 64"><defs><linearGradient id="g-w2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#48b6ff"/><stop offset="1" stop-color="#0984e3"/></linearGradient></defs><circle cx="32" cy="32" r="22" fill="none" stroke="url(#g-w2)" stroke-width="7"/><circle cx="32" cy="32" r="7" fill="url(#g-w2)"/><path d="M32 10v11M32 43v11M10 32h11M43 32h11" stroke="url(#g-w2)" stroke-width="5" stroke-linecap="round"/></svg>`,
  ball: `<svg viewBox="0 0 64 64"><defs><radialGradient id="g-bl" cx="38%" cy="32%" r="70%"><stop offset="0" stop-color="#ff9a44"/><stop offset="1" stop-color="#d35400"/></radialGradient></defs><circle cx="32" cy="32" r="24" fill="url(#g-bl)"/><path d="M32 8v48M8 32h48M15 16c13 9 20 24 20 40M49 16C37 25 29 40 29 56" stroke="#7a3e12" stroke-width="2" fill="none"/></svg>`,
  redcar: `<svg viewBox="0 0 64 64"><defs><linearGradient id="g-rc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff6b5e"/><stop offset="1" stop-color="#d63031"/></linearGradient></defs><path d="M10 40l5-15a6 6 0 0 1 6-4h22a6 6 0 0 1 6 4l5 15v6a3 3 0 0 1-3 3h-4a3 3 0 0 1-3-3H20a3 3 0 0 1-3 3h-4a3 3 0 0 1-3-3z" fill="url(#g-rc)"/><path d="M19 26h26l3 11H16z" fill="#cfeaff"/><circle cx="21" cy="47" r="6" fill="#2d3436"/><circle cx="21" cy="47" r="2.5" fill="#b2bec3"/><circle cx="43" cy="47" r="6" fill="#2d3436"/><circle cx="43" cy="47" r="2.5" fill="#b2bec3"/></svg>`,
  joystick: `<svg viewBox="0 0 64 64"><defs><linearGradient id="g-js" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a5560"/><stop offset="1" stop-color="#2d3436"/></linearGradient></defs><rect x="14" y="34" width="36" height="18" rx="7" fill="url(#g-js)"/><rect x="30" y="12" width="4" height="22" rx="2" fill="#636e72"/><circle cx="32" cy="11" r="7.5" fill="#e74c3c"/><circle cx="30" cy="9" r="2.5" fill="#fff" opacity=".5"/><circle cx="23" cy="43" r="3" fill="#fdcb6e"/><circle cx="41" cy="43" r="3" fill="#00b894"/></svg>`,
  chess: `<svg viewBox="0 0 64 64"><defs><linearGradient id="g-ch" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a55eea"/><stop offset="1" stop-color="#8e44ad"/></linearGradient></defs><path d="M26 14a6 6 0 0 1 12 0c0 3-2 4-2 7l3 3-3 6h-11l-3-6 3-3c0-3-2-4-2-7z" fill="url(#g-ch)"/><rect x="19" y="44" width="26" height="9" rx="2.5" fill="url(#g-ch)"/><rect x="24" y="34" width="16" height="3" rx="1.5" fill="#fff" opacity=".25"/></svg>`,
  smile: `<svg viewBox="0 0 64 64"><defs><radialGradient id="g-sm" cx="40%" cy="32%" r="70%"><stop offset="0" stop-color="#ffe07a"/><stop offset="1" stop-color="#f0a323"/></radialGradient></defs><circle cx="32" cy="32" r="24" fill="url(#g-sm)"/><circle cx="24" cy="27" r="3.5" fill="#2d3436"/><circle cx="40" cy="27" r="3.5" fill="#2d3436"/><path d="M22 38c4 6 16 6 20 0" stroke="#2d3436" stroke-width="3.5" fill="none" stroke-linecap="round"/></svg>`,
  gamepad: `<svg viewBox="0 0 64 64"><defs><linearGradient id="g-gp" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8f7bff"/><stop offset="1" stop-color="#6c5ce7"/></linearGradient></defs><rect x="6" y="24" width="52" height="24" rx="12" fill="url(#g-gp)"/><circle cx="21" cy="36" r="3.2" fill="#fff"/><path d="M16.5 31.5v9M12 36h9" stroke="#fff" stroke-width="3.2" stroke-linecap="round"/><circle cx="42" cy="31" r="3.2" fill="#fd79a8"/><circle cx="49" cy="38" r="3.2" fill="#00d0a0"/><circle cx="35" cy="38" r="3.2" fill="#ffd766"/></svg>`,
  shield: `<svg viewBox="0 0 64 64"><defs><linearGradient id="g-sh" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2bd6a8"/><stop offset="1" stop-color="#00a884"/></linearGradient></defs><path d="M32 8l20 7v14c0 14-9 22-20 27-11-5-20-13-20-27V15z" fill="url(#g-sh)"/><path d="M23 32l6 6 13-13" stroke="#fff" stroke-width="4.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  phone: `<svg viewBox="0 0 64 64"><defs><linearGradient id="g-ph" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#48b6ff"/><stop offset="1" stop-color="#0984e3"/></linearGradient></defs><rect x="19" y="7" width="26" height="50" rx="7" fill="url(#g-ph)"/><rect x="23" y="14" width="18" height="30" rx="2.5" fill="#eaf6ff"/><circle cx="32" cy="50" r="2.8" fill="#fff"/></svg>`,
  heart: `<svg viewBox="0 0 64 64"><defs><linearGradient id="g-ht" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff9ec4"/><stop offset="1" stop-color="#fd5fa0"/></linearGradient></defs><path d="M32 54C14 42 8 34 8 24a12 12 0 0 1 24-4 12 12 0 0 1 24 4c0 10-6 18-24 30z" fill="url(#g-ht)"/><path d="M18 22a8 8 0 0 1 8-4" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".5"/></svg>`,
};

/* --- 3D game covers -> real screenshots cut from the mock --- */
const COVER_3D = ["cover-carpet", "cover-carwash", "cover-house", "cover-treasure", "cover-door"];
// --- new game covers -> real screenshots cut from the mock ---
const COVER_NEW = ["new-bubble", "new-colormatch", "new-parking", "new-wordsearch", "new-stack", "new-finddiff"];

function cover(file, alt) {
  return `<img src="/assets/img/${file}.png" alt="${alt || ""}" loading="lazy">`;
}

// [title, href, iconKey, minutes, players]
const quickGames = [
  ["Coin Flip", "/tools/flip-a-coin/", "coin", "1 min", "12.5K"],
  ["Spin the Wheel", "/tools/spin-the-wheel/", "wheel", "2 min", "11.0K"],
  ["Pick a Card", "/tools/pick-a-card/", "card", "1 min", "9.3K"],
  ["Dice Roller", "/tools/dice-roller/", "dice", "1 min", "8.7K"],
  ["Random Name Picker", "/tools/random-name-picker/", "gift", "1 min", "7.1K"],
  ["Would You Rather", "/games/would-you-rather/", "bubble", "2 min", "10.2K"],
  ["Memory Match", "/games/memory-match/", "star", "3 min", "15.5K"],
  ["Truth or Dare", "/games/truth-or-dare/", "heartcard", "2 min", "8.2K"],
];

// [title, href, scene-grad, subtitle, minutes, rating, badge, feature]
const games3d = [
  ["Carpet Cleaning", "/games/carpet-cleaning/", ["#8e7bff", "#fd79a8"], "Clean, relax and make it shine!", "10-15 min", "4.8", "HOT", true],
  ["Car Wash", "#games-3d", ["#0984e3", "#74b9ff"], "Make the car look brand new!", "10-15 min", "4.7", "NEW", false],
  ["Hidden House", "#games-3d", ["#00b894", "#55efc4"], "Find hidden objects and explore!", "15-20 min", "4.6", "NEW", false],
  ["Treasure Hunt", "#games-3d", ["#e17055", "#fab1a0"], "Find clues and uncover ancient treasures!", "15-20 min", "4.7", "NEW", false],
  ["Escape Room", "#games-3d", ["#6c5ce7", "#a29bfe"], "Solve puzzles and escape the room!", "15-20 min", "4.6", "NEW", false],
];

// [name, iconKey, count]
const categories = [
  ["Action", "rocket"],
  ["Adventure", "map"],
  ["Puzzle", "puzzle"],
  ["Simulation", "wheel2"],
  ["Sports", "ball"],
  ["Racing", "redcar"],
  ["Arcade", "joystick"],
  ["Strategy", "chess"],
  ["Kids", "smile"],
];

// [title, href, scene-grad, rating, minutes, isNew]
const newGames = [
  ["Bubble Shooter", "#new-games", ["#6c5ce7", "#a29bfe"], "4.6", "2 min", false],
  ["Color Match", "#new-games", ["#00b894", "#55efc4"], "4.5", "2 min", false],
  ["Parking Jam", "#new-games", ["#0984e3", "#74b9ff"], "4.7", "3 min", false],
  ["Word Search", "#new-games", ["#e17055", "#fab1a0"], "4.6", "3 min", false],
  ["Stack Tower", "#new-games", ["#fdcb6e", "#ffeaa7"], "4.5", "2 min", false],
  ["Find the Difference", "#new-games", ["#e84393", "#fd79a8"], "4.6", "3 min", false],
];

// Games not yet built. They still appear on the page but are clearly marked
// "Soon" — no fake rating, not linked to a real page, so users are not misled.
const SOON_3D = new Set(["Car Wash", "Hidden House", "Treasure Hunt", "Escape Room"]);
const SOON_NEW = new Set(["Bubble Shooter", "Color Match", "Parking Jam", "Word Search", "Stack Tower", "Find the Difference"]);

// only real, playable pages feed the random picker
const randomLinks = [
  "/games/carpet-cleaning/",
  "/games/memory-match/",
  "/games/truth-or-dare/",
  "/games/would-you-rather/",
  "/tools/spin-the-wheel/",
  "/tools/flip-a-coin/",
  "/tools/dice-roller/",
  "/tools/random-name-picker/",
  "/tools/pick-a-card/",
  "/tools/mystery-box-picker/",
  "/tools/decision-maker/",
];

function renderQuickGames() {
  const root = document.querySelector("[data-quick-games]");
  if (!root) return;
  root.innerHTML = quickGames
    .map(
      ([title, href, ic, mins, players]) => `
      <a class="pp-quick-card" href="${href}">
        <span class="pp-quick-ic">${icon(ic)}</span>
        <strong>${title}</strong>
        <span class="q-meta"><span class="q-time">${mins}</span><span class="q-players">${players}</span></span>
      </a>`,
    )
    .join("");
}

function renderGames3d() {
  const root = document.querySelector("[data-games-3d]");
  if (!root) return;
  root.innerHTML = games3d
    .map(
      ([title, href, grad, sub, mins, rating, badge, feature], i) => {
        const soon = SOON_3D.has(title);
        const badgeHtml = soon
          ? `<span class="pp-3d-badge soon">SOON</span>`
          : badge
          ? `<span class="pp-3d-badge${badge === "HOT" ? " hot" : " new"}">${badge}</span>`
          : "";
        const cta = soon ? "Coming Soon" : "Play Now";
        const meta = soon
          ? `<span class="g-tag">3D GAME</span><span>${mins}</span><span>Coming soon</span>`
          : `<span class="g-tag">3D GAME</span><span>${mins}</span><span><b>★</b> ${rating}</span>`;
        return `
      <a class="pp-3d-card${feature ? " feature" : ""}${soon ? " is-soon" : ""}" href="${href}"${soon ? ' aria-disabled="true"' : ""}>
        <span class="pp-3d-cover">${cover(COVER_3D[i], title)}
          ${badgeHtml}
        </span>
        <span class="pp-3d-body">
          <strong>${title}</strong>
          <span class="pp-3d-sub">${sub}</span>
          <span class="pp-3d-cta${soon ? " soon" : ""}">${cta}</span>
          <span class="g-meta">${meta}</span>
        </span>
      </a>`;
      },
    )
    .join("");
}

function renderCategories() {
  const root = document.querySelector("[data-category-row]");
  if (!root) return;
  root.innerHTML = categories
    .map(
      ([name, ic]) => `
      <a class="pp-cat-card" href="#quick-games">
        <span class="pp-cat-ic">${icon(ic)}</span>
        <strong>${name}</strong>
        <small class="soon">Coming soon</small>
      </a>`,
    )
    .join("");
}

function renderNewGames() {
  const root = document.querySelector("[data-new-games]");
  if (!root) return;
  root.innerHTML = newGames
    .map(
      ([title, href, grad, rating, mins, isNew], i) => {
        const soon = SOON_NEW.has(title);
        const badge = soon ? `<em class="soon">SOON</em>` : isNew ? "<em>NEW</em>" : "";
        const meta = soon
          ? `<span>Coming soon</span><span>${mins}</span>`
          : `<span><b>★</b> ${rating}</span><span>${mins}</span>`;
        return `
      <a class="pp-new-card${soon ? " is-soon" : ""}" href="${href}"${soon ? ' aria-disabled="true"' : ""}>
        <span class="pp-new-cover">${cover(COVER_NEW[i], title)}${badge}</span>
        <span class="pp-new-info">
          <strong>${title}</strong>
          <span class="n-meta">${meta}</span>
        </span>
      </a>`;
      },
    )
    .join("");
}

function bindRandom() {
  document.querySelectorAll("[data-random-game]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const href = randomLinks[Math.floor(Math.random() * randomLinks.length)];
      window.location.href = href;
    });
  });
}

function bindScrollNext() {
  document.querySelectorAll(".scroll-next").forEach((btn) => {
    btn.addEventListener("click", () => {
      const row = btn.parentElement.querySelector(".pp-quick-row, .pp-new-row");
      if (row) row.scrollBy({ left: 360, behavior: "smooth" });
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderQuickGames();
  renderGames3d();
  renderCategories();
  renderNewGames();
  bindRandom();
  bindScrollNext();
});