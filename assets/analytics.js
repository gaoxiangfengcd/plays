/**
 * Play Picks - lightweight analytics layer (Google Analytics 4).
 *
 * SETUP: replace GA_MEASUREMENT_ID below with your real GA4 ID (looks like "G-XXXXXXXXXX").
 * Get it from GA4 admin -> Data Streams -> Web. Until it is replaced, events are
 * logged to the console only (safe no-op), so you can verify tracking locally.
 *
 * What it tracks:
 *  - page_view: sent automatically by GA4 config on every page load
 *  - tool_action: clicks on any [data-action] button (spin / pick / roll / flip / share ...)
 *  - game_card_click: clicks on a game card on the homepage
 *  - outbound_nav: clicks on nav / CTA links
 */
(function () {
  var GA_MEASUREMENT_ID = "G-0RD45ETC3N"; // GA4 measurement ID

  var enabled = /^G-[A-Z0-9]+$/.test(GA_MEASUREMENT_ID);

  // --- bootstrap gtag ---
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = window.gtag || gtag;

  if (enabled) {
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_MEASUREMENT_ID;
    document.head.appendChild(s);
    gtag("js", new Date());
    gtag("config", GA_MEASUREMENT_ID);
  }

  // Unified event sender. Falls back to console.log when GA is not configured.
  function track(eventName, params) {
    params = params || {};
    if (enabled && typeof window.gtag === "function") {
      window.gtag("event", eventName, params);
    } else {
      console.log("[analytics]", eventName, params);
    }
  }
  window.ppTrack = track; // expose for manual use if needed

  var pageName = document.body.getAttribute("data-tool") || document.title;

  // --- delegated click tracking (works for dynamically rendered cards/buttons) ---
  document.addEventListener("click", function (e) {
    var actionBtn = e.target.closest("[data-action]");
    if (actionBtn) {
      track("tool_action", {
        action: actionBtn.getAttribute("data-action"),
        tool: pageName,
      });
      return;
    }

    var card = e.target.closest(".card, .pp-quick-card, .pp-3d-card, .pp-new-card, .pp-cat-card, .pp-hero-card");
    if (card) {
      var titleEl = card.querySelector("h3, strong");
      track("game_card_click", {
        game: titleEl ? titleEl.textContent.trim() : card.getAttribute("href"),
        href: card.getAttribute("href") || "",
      });
      return;
    }

    var navLink = e.target.closest(".nav a, .pp-links a, .pp-random, .btn-primary, .btn-ghost, .sec-more, .play-btn, .mini-btn, .pill, .related-list a, .foot-col a");
    if (navLink) {
      track("outbound_nav", {
        label: (navLink.textContent || "").trim().slice(0, 60),
        href: navLink.getAttribute("href") || "",
        page: pageName,
      });
    }
  });
})();