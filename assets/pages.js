const toolCards = [
  ["Spin the Wheel", "/tools/spin-the-wheel/", "Wheel", "⭐ 4.9", "22.8k plays"],
  ["Random Name Picker", "/tools/random-name-picker/", "Picker", "⭐ 4.8", "18.4k plays"],
  ["Mystery Box Picker", "/tools/mystery-box-picker/", "Mystery", "⭐ 4.7", "15.2k plays"],
  ["Pick a Card", "/tools/pick-a-card/", "Cards", "⭐ 4.8", "12.6k plays"],
  ["Flip a Coin", "/tools/flip-a-coin/", "Quick", "⭐ 4.5", "9.9k plays"],
  ["Dice Roller", "/tools/dice-roller/", "Dice", "⭐ 4.6", "11.3k plays"],
  ["Decision Maker", "/tools/decision-maker/", "Decision", "⭐ 4.7", "13.7k plays"],
  ["Truth or Dare", "/games/truth-or-dare/", "Party", "⭐ 4.8", "19.5k plays"],
  ["Would You Rather", "/games/would-you-rather/", "Social", "⭐ 4.6", "8.8k plays"],
  ["Memory Match", "/games/memory-match/", "Puzzle", "⭐ 4.9", "16.1k plays"],
  ["Carpet Cleaning", "/games/carpet-cleaning/", "Satisfying", "⭐ 4.9", "New"],
];

function renderToolCards() {
  const root = document.querySelector("[data-tool-cards]");
  if (!root) return;
  root.innerHTML = toolCards
    .map(
      ([title, href, category, rating, plays], index) => `
        <a class="card" href="${href}">
          <span class="card-icon">${["🎡", "🎯", "🎁", "🃏", "🪙", "🎲", "✨", "🎉", "⚡", "🧠", "🧼"][index]}</span>
          <span class="card-info">
            <h3>${title}</h3>
            <small>${category}</small>
            <span class="card-meta"><span>${rating}</span><span>${plays}</span></span>
          </span>
        </a>
      `,
    )
    .join("");
}

document.addEventListener("DOMContentLoaded", renderToolCards);
