(function () {
  "use strict";

  /*
   * =========================================================
   * CALIXIE POPUP ENGINE V3
   * Welcome Popup + Minimal Reminder Card
   * =========================================================
   */

  var ENGINE_KEY = "calixiePopupEngineV3Initialized";

  if (window[ENGINE_KEY]) {
    return;
  }

  window[ENGINE_KEY] = true;

  var CONFIG = {
    targetUrl: "https://calixie.com/new-in",

    imageUrl:
      "https://res.cloudinary.com/ylbbwkdr/image/upload/f_auto,q_auto/Pop-up_ekv3is",

    welcome: {
      enabled: true,
      delayMs: 4000,
      repeatAfterDays: 3,

      overlayId: "calixie-v3-welcome-overlay",
      styleId: "calixie-v3-welcome-style",

      storageKey:
        "calixie_v3_welcome_closed_at"
    },

    reminder: {
      enabled: true,

      /*
       * Hoş geldin pop-up'ı kapandıktan sonra
       * hatırlatma kartının çıkacağı süre.
       */
      delayAfterWelcomeCloseMs: 45000,

      cardId: "calixie-v3-reminder-card",
      styleId: "calixie-v3-reminder-style",

      shownKey:
        "calixie_v3_reminder_shown",

      dismissedKey:
        "calixie_v3_reminder_dismissed"
    }
  };

  var STATE = {
    welcomeOpen: false,
    welcomeClosedAtThisVisit: null,
    reminderTimer: null
  };

  /*
   * =========================================================
   * STORAGE HELPERS
   * =========================================================
   */

  function localGet(key) {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  }

  function localSet(key, value) {
    try {
      localStorage.setItem(key, String(value));
    } catch (error) {
      // localStorage engellense bile sistem çalışır.
    }
  }

  function sessionGet(key) {
    try {
      return sessionStorage.getItem(key);
    } catch (error) {
      return null;
    }
  }

  function sessionSet(key, value) {
    try {
      sessionStorage.setItem(key, String(value));
    } catch (error) {
      // sessionStorage engellense bile sistem çalışır.
    }
  }

  /*
   * =========================================================
   * GENERAL HELPERS
   * =========================================================
   */

  function safeRemove(element) {
    if (element && element.parentNode) {
      element.parentNode.removeChild(element);
    }
  }

  function removeById(id) {
    var element = document.getElementById(id);

    if (element) {
      safeRemove(element);
    }
  }

  function addClassSafe(element, className) {
    if (element && element.classList) {
      element.classList.add(className);
    }
  }

  function removeClassSafe(element, className) {
    if (element && element.classList) {
      element.classList.remove(className);
    }
  }

  function lockPage() {
    addClassSafe(
      document.documentElement,
      "calixie-v3-scroll-lock"
    );

    addClassSafe(
      document.body,
      "calixie-v3-scroll-lock"
    );
  }

  function unlockPage() {
    removeClassSafe(
      document.documentElement,
      "calixie-v3-scroll-lock"
    );

    removeClassSafe(
      document.body,
      "calixie-v3-scroll-lock"
    );
  }

  /*
   * =========================================================
   * WELCOME POPUP
   * =========================================================
   */

  function shouldShowWelcomePopup() {
    if (!CONFIG.welcome.enabled) {
      return false;
    }

    var closedAt = Number(
      localGet(CONFIG.welcome.storageKey)
    );

    if (!closedAt || Number.isNaN(closedAt)) {
      return true;
    }

    var repeatAfterMs =
      CONFIG.welcome.repeatAfterDays *
      24 *
      60 *
      60 *
      1000;

    return (
      Date.now() - closedAt >= repeatAfterMs
    );
  }

  function saveWelcomeCloseTime() {
    var currentTime = Date.now();

    STATE.welcomeClosedAtThisVisit =
      currentTime;

    localSet(
      CONFIG.welcome.storageKey,
      currentTime
    );
  }

  function removeWelcomeElements() {
    removeById(CONFIG.welcome.overlayId);
    removeById(CONFIG.welcome.styleId);

    STATE.welcomeOpen = false;

    unlockPage();
  }

  function createWelcomePopup() {
    if (
      !document.body ||
      !document.head ||
      STATE.welcomeOpen ||
      document.getElementById(
        CONFIG.welcome.overlayId
      )
    ) {
      return;
    }

    var style =
      document.createElement("style");

    style.id = CONFIG.welcome.styleId;

    style.textContent = `
      html.calixie-v3-scroll-lock,
      body.calixie-v3-scroll-lock {
        overflow: hidden !important;
        overscroll-behavior: none;
      }

      #${CONFIG.welcome.overlayId} {
        position: fixed;
        inset: 0;
        z-index: 2147483647;

        display: flex;
        align-items: center;
        justify-content: center;

        padding: 28px;
        box-sizing: border-box;

        background: rgba(0, 0, 0, 0.72);

        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);

        opacity: 0;
        visibility: hidden;

        transition:
          opacity 380ms ease,
          visibility 380ms ease;
      }

      #${CONFIG.welcome.overlayId}.is-visible {
        opacity: 1;
        visibility: visible;
      }

      .calixie-v3-welcome-dialog {
        position: relative;

        width: min(760px, 86vw);
        max-height: 84vh;

        border-radius: 3px;

        background: #080808;

        box-shadow:
          0 30px 95px rgba(0, 0, 0, 0.66),
          0 0 0 1px
          rgba(210, 173, 100, 0.20);

        opacity: 0;

        transform:
          translateY(22px)
          scale(0.94);

        transition:
          opacity 420ms ease,
          transform 520ms
          cubic-bezier(0.22, 1, 0.36, 1);

        will-change:
          transform,
          opacity;
      }

      #${CONFIG.welcome.overlayId}.is-visible
      .calixie-v3-welcome-dialog {
        opacity: 1;

        transform:
          translateY(0)
          scale(1);
      }

      .calixie-v3-welcome-link {
        display: block;

        overflow: hidden;

        border-radius: inherit;

        line-height: 0;
        cursor: pointer;
      }

      .calixie-v3-welcome-image {
        display: block;

        width: 100%;
        height: auto;

        max-height: 84vh;

        object-fit: contain;

        user-select: none;
        -webkit-user-drag: none;
      }

      .calixie-v3-welcome-close {
        position: absolute;

        top: -14px;
        right: -14px;

        z-index: 3;

        display: flex;
        align-items: center;
        justify-content: center;

        width: 34px;
        height: 34px;

        padding: 0;

        border:
          1px solid
          rgba(214, 177, 101, 0.9);

        border-radius: 50%;

        background:
          rgba(10, 10, 10, 0.97);

        color: #d6b165;

        font-family:
          Arial,
          sans-serif;

        font-size: 21px;
        font-weight: 300;
        line-height: 1;

        cursor: pointer;

        box-shadow:
          0 8px 26px
          rgba(0, 0, 0, 0.48);

        transition:
          transform 220ms ease,
          background-color 220ms ease,
          color 220ms ease,
          border-color 220ms ease;
      }

      .calixie-v3-welcome-close:hover {
        transform:
          rotate(90deg)
          scale(1.04);

        background: #d6b165;
        color: #090909;
        border-color: #d6b165;
      }

      .calixie-v3-welcome-close:focus-visible {
        outline:
          2px solid #ffffff;

        outline-offset: 4px;
      }

      @media (max-width: 768px) {
        #${CONFIG.welcome.overlayId} {
          padding: 18px;
        }

        .calixie-v3-welcome-dialog {
          width:
            min(92vw, 620px);

          max-height: 82vh;
        }

        .calixie-v3-welcome-image {
          max-height: 82vh;
        }

        .calixie-v3-welcome-close {
          top: -11px;
          right: -8px;

          width: 33px;
          height: 33px;

          font-size: 20px;
        }
      }

      @media (max-width: 480px) {
        #${CONFIG.welcome.overlayId} {
          padding: 12px;
        }

        .calixie-v3-welcome-dialog {
          width: 94vw;
          max-height: 80vh;
        }

        .calixie-v3-welcome-image {
          max-height: 80vh;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        #${CONFIG.welcome.overlayId},
        .calixie-v3-welcome-dialog,
        .calixie-v3-welcome-close {
          transition: none !important;
        }
      }
    `;

    document.head.appendChild(style);

    var overlay =
      document.createElement("div");

    overlay.id =
      CONFIG.welcome.overlayId;

    overlay.setAttribute(
      "role",
      "dialog"
    );

    overlay.setAttribute(
      "aria-modal",
      "true"
    );

    overlay.setAttribute(
      "aria-label",
      "Calixie hoş geldin indirimi"
    );

    var dialog =
      document.createElement("div");

    dialog.className =
      "calixie-v3-welcome-dialog";

    var closeButton =
      document.createElement("button");

    closeButton.className =
      "calixie-v3-welcome-close";

    closeButton.type = "button";

    closeButton.innerHTML =
      "&times;";

    closeButton.setAttribute(
      "aria-label",
      "Hoş geldin pop-up'ını kapat"
    );

    var link =
      document.createElement("a");

    link.className =
      "calixie-v3-welcome-link";

    link.href = CONFIG.targetUrl;

    link.setAttribute(
      "aria-label",
      "Calixie yeni gelenler koleksiyonunu keşfet"
    );

    var image =
      document.createElement("img");

    image.className =
      "calixie-v3-welcome-image";

    image.src =
      CONFIG.imageUrl;

    image.alt =
      "Calixie dünyasına hoş geldiniz. İlk alışverişinize özel yüzde 10 indirim.";

    image.decoding = "async";

    link.appendChild(image);

    dialog.appendChild(closeButton);
    dialog.appendChild(link);

    overlay.appendChild(dialog);

    document.body.appendChild(overlay);

    STATE.welcomeOpen = true;

    var isClosing = false;

    function closeWelcomePopup(
      rememberClose
    ) {
      if (isClosing) {
        return;
      }

      isClosing = true;

      if (rememberClose !== false) {
        saveWelcomeCloseTime();
      }

      removeClassSafe(
        overlay,
        "is-visible"
      );

      unlockPage();

      document.removeEventListener(
        "keydown",
        handleWelcomeKeydown
      );

      window.setTimeout(function () {
        safeRemove(overlay);
        safeRemove(style);

        STATE.welcomeOpen = false;

        scheduleReminderAfterWelcome();
      }, 540);
    }

    function handleWelcomeKeydown(event) {
      if (event.key === "Escape") {
        closeWelcomePopup(true);
        return;
      }

      if (event.key === "Tab") {
        event.preventDefault();
        closeButton.focus();
      }
    }

    closeButton.addEventListener(
      "click",
      function (event) {
        event.preventDefault();
        event.stopPropagation();

        closeWelcomePopup(true);
      }
    );

    overlay.addEventListener(
      "click",
      function (event) {
        if (event.target === overlay) {
          closeWelcomePopup(true);
        }
      }
    );

    link.addEventListener(
      "click",
      function () {
        saveWelcomeCloseTime();
        unlockPage();
      }
    );

    image.addEventListener(
      "error",
      function () {
        console.error(
          "Calixie pop-up görseli yüklenemedi."
        );

        closeWelcomePopup(false);
      }
    );

    document.addEventListener(
      "keydown",
      handleWelcomeKeydown
    );

    lockPage();

    window.requestAnimationFrame(
      function () {
        window.requestAnimationFrame(
          function () {
            addClassSafe(
              overlay,
              "is-visible"
            );

            try {
              closeButton.focus({
                preventScroll: true
              });
            } catch (error) {
              closeButton.focus();
            }
          }
        );
      }
    );
  }

  /*
   * =========================================================
   * REMINDER CARD
   * =========================================================
   */

  function reminderWasShown() {
    return (
      sessionGet(
        CONFIG.reminder.shownKey
      ) === "true"
    );
  }

  function reminderWasDismissed() {
    return (
      sessionGet(
        CONFIG.reminder.dismissedKey
      ) === "true"
    );
  }

  function removeReminderElements() {
    removeById(CONFIG.reminder.cardId);
    removeById(CONFIG.reminder.styleId);
  }

  function createReminderCard() {
    if (
      !CONFIG.reminder.enabled ||
      !document.body ||
      !document.head ||
      STATE.welcomeOpen ||
      reminderWasShown() ||
      reminderWasDismissed() ||
      document.getElementById(
        CONFIG.reminder.cardId
      )
    ) {
      return;
    }

    sessionSet(
      CONFIG.reminder.shownKey,
      "true"
    );

    var style =
      document.createElement("style");

    style.id =
      CONFIG.reminder.styleId;

    style.textContent = `
      #${CONFIG.reminder.cardId} {
        position: fixed;

        right: 24px;
        bottom: 24px;

        z-index: 2147483600;

        width:
          min(
            370px,
            calc(100vw - 48px)
          );

        box-sizing: border-box;

        overflow: hidden;

        border:
          1px solid
          rgba(211, 173, 96, 0.50);

        border-radius: 4px;

        background:
          radial-gradient(
            circle at top right,
            rgba(118, 22, 36, 0.24),
            transparent 46%
          ),
          linear-gradient(
            135deg,
            rgba(45, 5, 13, 0.99),
            rgba(13, 8, 9, 0.995)
          );

        box-shadow:
          0 25px 70px
          rgba(0, 0, 0, 0.46),
          0 0 0 1px
          rgba(255, 255, 255, 0.025);

        opacity: 0;
        visibility: hidden;

        transform:
          translateY(28px)
          scale(0.96);

        transition:
          opacity 420ms ease,
          visibility 420ms ease,
          transform 520ms
          cubic-bezier(0.22, 1, 0.36, 1);

        font-family:
          Arial,
          Helvetica,
          sans-serif;
      }

      #${CONFIG.reminder.cardId}.is-visible {
        opacity: 1;
        visibility: visible;

        transform:
          translateY(0)
          scale(1);
      }

      #${CONFIG.reminder.cardId}::before {
        content: "";

        position: absolute;

        top: 0;
        left: 24px;
        right: 24px;

        height: 1px;

        background:
          linear-gradient(
            90deg,
            transparent,
            rgba(224, 190, 119, 0.98),
            transparent
          );
      }

      .calixie-v3-reminder-content {
        position: relative;

        padding:
          25px
          56px
          23px
          25px;
      }

      .calixie-v3-reminder-label {
        margin:
          0 0 9px;

        color: #d9b66e;

        font-size: 10px;
        font-weight: 600;

        line-height: 1.4;

        letter-spacing: 2.3px;

        text-transform: uppercase;
      }

      .calixie-v3-reminder-title {
        margin:
          0 0 9px;

        color: #fff8ec;

        font-family:
          Georgia,
          "Times New Roman",
          serif;

        font-size: 23px;
        font-weight: 400;

        line-height: 1.18;
      }

      .calixie-v3-reminder-text {
        margin:
          0 0 18px;

        color:
          rgba(255, 248, 236, 0.78);

        font-size: 13px;
        font-weight: 400;

        line-height: 1.55;
      }

      .calixie-v3-reminder-link {
        display: inline-flex;

        align-items: center;

        gap: 9px;

        color: #dab66e;

        font-size: 11px;
        font-weight: 700;

        line-height: 1;

        letter-spacing: 1.55px;

        text-decoration: none;

        text-transform: uppercase;

        transition:
          color 200ms ease,
          gap 200ms ease;
      }

      .calixie-v3-reminder-link::after {
        content: "→";

        font-size: 16px;
        font-weight: 400;

        line-height: 1;

        transition:
          transform 200ms ease;
      }

      .calixie-v3-reminder-link:hover {
        gap: 13px;
        color: #f0d392;
      }

      .calixie-v3-reminder-link:hover::after {
        transform:
          translateX(2px);
      }

      .calixie-v3-reminder-close {
        position: absolute;

        top: 15px;
        right: 15px;

        display: flex;

        align-items: center;
        justify-content: center;

        width: 29px;
        height: 29px;

        padding: 0;

        border:
          1px solid
          rgba(218, 182, 110, 0.42);

        border-radius: 50%;

        background: transparent;

        color:
          rgba(218, 182, 110, 0.92);

        font-family:
          Arial,
          sans-serif;

        font-size: 18px;
        font-weight: 300;

        line-height: 1;

        cursor: pointer;

        transition:
          color 200ms ease,
          background-color 200ms ease,
          border-color 200ms ease,
          transform 200ms ease;
      }

      .calixie-v3-reminder-close:hover {
        color: #1a090c;

        background: #d9b66e;

        border-color: #d9b66e;

        transform:
          rotate(90deg);
      }

      .calixie-v3-reminder-close:focus-visible,
      .calixie-v3-reminder-link:focus-visible {
        outline:
          2px solid #ffffff;

        outline-offset: 3px;
      }

      @media (max-width: 600px) {
        #${CONFIG.reminder.cardId} {
          right: 12px;
          left: 12px;

          bottom:
            calc(
              12px +
              env(safe-area-inset-bottom)
            );

          width: auto;
        }

        .calixie-v3-reminder-content {
          padding:
            21px
            52px
            21px
            21px;
        }

        .calixie-v3-reminder-title {
          font-size: 21px;
        }

        .calixie-v3-reminder-text {
          font-size: 12.5px;
        }

        .calixie-v3-reminder-close {
          top: 13px;
          right: 13px;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        #${CONFIG.reminder.cardId},
        .calixie-v3-reminder-close,
        .calixie-v3-reminder-link,
        .calixie-v3-reminder-link::after {
          transition: none !important;
        }
      }
    `;

    document.head.appendChild(style);

    var card =
      document.createElement("aside");

    card.id =
      CONFIG.reminder.cardId;

    card.setAttribute(
      "aria-label",
      "Calixie hoş geldin indirimi hatırlatması"
    );

    card.innerHTML = `
      <div class="calixie-v3-reminder-content">
        <button
          class="calixie-v3-reminder-close"
          type="button"
          aria-label="Hatırlatma kartını kapat"
        >
          &times;
        </button>

        <p class="calixie-v3-reminder-label">
          Calixie ayrıcalığı
        </p>

        <h2 class="calixie-v3-reminder-title">
          Hoş geldin ayrıcalığın hazır.
        </h2>

        <p class="calixie-v3-reminder-text">
          İlk alışverişine özel %10 indirim ile
          Calixie'nin yeni parçalarını keşfet.
        </p>

        <a
          class="calixie-v3-reminder-link"
          href="${CONFIG.targetUrl}"
          aria-label="Calixie yeni gelenler koleksiyonunu keşfet"
        >
          Yeni Gelenleri Keşfet
        </a>
      </div>
    `;

    document.body.appendChild(card);

    var closeButton =
      card.querySelector(
        ".calixie-v3-reminder-close"
      );

    var link =
      card.querySelector(
        ".calixie-v3-reminder-link"
      );

    var isClosing = false;

    function closeReminderCard() {
      if (isClosing) {
        return;
      }

      isClosing = true;

      sessionSet(
        CONFIG.reminder.dismissedKey,
        "true"
      );

      removeClassSafe(
        card,
        "is-visible"
      );

      window.setTimeout(function () {
        safeRemove(card);
        safeRemove(style);
      }, 520);
    }

    closeButton.addEventListener(
      "click",
      closeReminderCard
    );

    link.addEventListener(
      "click",
      function () {
        sessionSet(
          CONFIG.reminder.dismissedKey,
          "true"
        );
      }
    );

    window.requestAnimationFrame(
      function () {
        window.requestAnimationFrame(
          function () {
            addClassSafe(
              card,
              "is-visible"
            );
          }
        );
      }
    );
  }

  function scheduleReminderAfterWelcome() {
    if (
      !CONFIG.reminder.enabled ||
      reminderWasShown() ||
      reminderWasDismissed()
    ) {
      return;
    }

    if (STATE.reminderTimer) {
      window.clearTimeout(
        STATE.reminderTimer
      );
    }

    STATE.reminderTimer =
      window.setTimeout(
        createReminderCard,
        CONFIG.reminder
          .delayAfterWelcomeCloseMs
      );
  }

  function scheduleReminderWithoutWelcome() {
    if (
      !CONFIG.reminder.enabled ||
      reminderWasShown() ||
      reminderWasDismissed()
    ) {
      return;
    }

    STATE.reminderTimer =
      window.setTimeout(
        createReminderCard,
        CONFIG.reminder
          .delayAfterWelcomeCloseMs
      );
  }

  /*
   * =========================================================
   * ENGINE START
   * =========================================================
   */

  function startEngine() {
    removeWelcomeElements();
    removeReminderElements();

    if (shouldShowWelcomePopup()) {
      window.setTimeout(
        createWelcomePopup,
        CONFIG.welcome.delayMs
      );
    } else {
      scheduleReminderWithoutWelcome();
    }

    console.log(
      "Calixie Popup Engine V3 çalışıyor."
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      startEngine,
      { once: true }
    );
  } else {
    startEngine();
  }
})();
