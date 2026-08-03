(function () {
  "use strict";

  if (window.calixieV3LoaderStarted) {
    return;
  }

  window.calixieV3LoaderStarted = true;

  var script = document.createElement("script");

  script.src =
    "https://cdn.jsdelivr.net/gh/baydar98kerem-stack/calixie-popup-engine-v3.js@main/popupengine-v3.js?engine=20260803-1";

  script.async = true;

  script.onload = function () {
    console.log(
      "Calixie Popup Engine V3 yüklendi:",
      window.calixiePopupEngineV3Initialized
    );
  };

  script.onerror = function (error) {
    console.error(
      "Calixie Popup Engine V3 yüklenemedi.",
      error
    );
  };

  document.head.appendChild(script);
})();
