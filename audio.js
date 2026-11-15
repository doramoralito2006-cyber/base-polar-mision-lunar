(() => {
  "use strict";

  const AUDIO_PATH = "assets/audio/";
  const PREFS_KEY = "basePolarAudioPrefsV1";
  const $ = (selector) => document.querySelector(selector);

  const music = new Audio(AUDIO_PATH + "ambient-space-background.mp3");
  music.loop = true;
  music.preload = "auto";

  const sounds = {
    click: new Audio(AUDIO_PATH + "sci-fi-ui-click.mp3"),
    critical: new Audio(AUDIO_PATH + "sci-fi-ui-fast-alarm.mp3"),
    alert: new Audio(AUDIO_PATH + "ui-alert-alarm.mp3"),
    success: new Audio(AUDIO_PATH + "ui-authorised.mp3")
  };
  Object.values(sounds).forEach((audio) => { audio.preload = "auto"; });

  let activated = false;
  let muted = false;
  let lastLog = "";
  let wasCritical = false;
  let eventWasVisible = false;
  let lastResult = "";
  let lastActionMessage = "";

  function readPrefs() {
    try { return JSON.parse(localStorage.getItem(PREFS_KEY) || "{}"); }
    catch (error) { return {}; }
  }

  function savePrefs() {
    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify({
        musicVolume: Number($("#music-volume")?.value ?? 50),
        effectsVolume: Number($("#effects-volume")?.value ?? 70),
        muted
      }));
    } catch (error) {}
  }

  function applyVolumes() {
    const musicSlider = $("#music-volume");
    const effectsSlider = $("#effects-volume");
    music.volume = Math.max(0, Math.min(1, Number(musicSlider?.value ?? 50) / 100));
    Object.values(sounds).forEach((audio) => {
      audio.volume = Math.max(0, Math.min(1, Number(effectsSlider?.value ?? 70) / 100));
    });
    const muteControl = $("#audio-mute");
    if (muteControl) {
      muteControl.checked = muted;
      muteControl.setAttribute("aria-checked", String(muted));
    }
    if (muted || music.volume === 0) {
      music.pause();
    } else if (activated && music.paused) {
      const promise = music.play();
      if (promise?.catch) promise.catch(() => {});
    }
  }

  function stopSound(name) {
    const audio = sounds[name];
    if (!audio) return;
    audio.pause();
    try { audio.currentTime = 0; } catch (error) {}
  }

  function stopAllEffects() {
    Object.keys(sounds).forEach(stopSound);
  }

  function playSound(name, options = {}) {
    if (muted) return;
    const audio = sounds[name];
    if (!audio || audio.volume <= 0) return;
    try {
      audio.pause();
      audio.currentTime = 0;
      audio.playbackRate = options.rate || 1;
      if (options.volume != null) {
        audio.volume = Math.max(0, Math.min(1, Number($("#effects-volume")?.value ?? 70) / 100 * options.volume));
      } else {
        audio.volume = Math.max(0, Math.min(1, Number($("#effects-volume")?.value ?? 70) / 100));
      }
      const promise = audio.play();
      if (promise?.catch) promise.catch(() => {});
    } catch (error) {}
  }

  function activateAudio() {
    activated = true;
    applyVolumes();
  }

  function resetAudioForNewMission() {
    // Cancela cualquier alarma/sonido que haya quedado de la misión anterior.
    stopAllEffects();
    lastResult = "";
    lastActionMessage = "";
    lastLog = $("#log-list")?.firstElementChild?.textContent || "";
    eventWasVisible = false;
    wasCritical = false;
    if (activated && !muted && music.volume > 0) {
      try {
        music.currentTime = 0;
        const promise = music.play();
        if (promise?.catch) promise.catch(() => {});
      } catch (error) {}
    }
  }

  function initialiseControls() {
    const prefs = readPrefs();
    const musicSlider = $("#music-volume");
    const effectsSlider = $("#effects-volume");
    if (musicSlider && Number.isFinite(Number(prefs.musicVolume))) musicSlider.value = String(prefs.musicVolume);
    if (effectsSlider && Number.isFinite(Number(prefs.effectsVolume))) effectsSlider.value = String(prefs.effectsVolume);
    muted = prefs.muted === true;

    [musicSlider, effectsSlider].forEach((slider) => {
      if (!slider) return;
      slider.addEventListener("input", () => { applyVolumes(); savePrefs(); });
    });

    const muteControl = $("#audio-mute");
    if (muteControl) {
      muteControl.checked = muted;
      muteControl.addEventListener("change", () => {
        muted = muteControl.checked;
        if (muted) stopAllEffects();
        applyVolumes();
        savePrefs();
      });
    }
    applyVolumes();
  }

  document.addEventListener("pointerdown", activateAudio, { once: true });
  document.addEventListener("keydown", activateAudio, { once: true });

  // Al reiniciar o iniciar una misión nueva se cortan de inmediato las alarmas anteriores.
  document.addEventListener("click", (event) => {
    const target = event.target.closest("button");
    if (!target) return;
    if (target.id === "restart-btn" || target.id === "start-btn" ||
        /reintentar misión|retry mission|intentar misión|start mission/i.test(target.textContent || "")) {
      resetAudioForNewMission();
    }
  }, true);

  // Los botones de acciones reciben solo el clic corto; la confirmación suena al completarse.
  document.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button || button.disabled) return;
    if (button.id === "restart-btn" || button.id === "start-btn" ||
        button.classList.contains("action-card")) return;
    activateAudio();
    playSound("click", { volume: 0.55 });
  }, true);

  const eventModal = $("#event-modal");
  if (eventModal) {
    eventWasVisible = !eventModal.classList.contains("hidden");
    new MutationObserver(() => {
      const visible = !eventModal.classList.contains("hidden");
      if (visible && !eventWasVisible) playSound("alert");
      if (!visible && eventWasVisible) stopSound("alert");
      eventWasVisible = visible;
    }).observe(eventModal, { attributes: true, attributeFilter: ["class"] });
    eventModal.addEventListener("click", (event) => {
      if (event.target.closest("button")) stopSound("alert");
    }, true);
  }

  const resultScreen = $("#screen-result");
  if (resultScreen) {
    new MutationObserver(() => {
      const result = ["result-victory", "result-failed", "result-incomplete"]
        .find((className) => resultScreen.classList.contains(className)) || "";
      if (result && result !== lastResult) {
        stopAllEffects();
        playSound(result === "result-victory" ? "success" : "alert");
        lastResult = result;
      }
      if (!result) lastResult = "";
    }).observe(resultScreen, { attributes: true, attributeFilter: ["class"] });
  }

  const systemStatus = $("#system-status");
  if (systemStatus) {
    wasCritical = /cr[ií]tic|critical|supervivencia en riesgo|survival at risk/i.test(systemStatus.textContent);
    new MutationObserver(() => {
      const critical = /cr[ií]tic|critical|supervivencia en riesgo|survival at risk/i.test(systemStatus.textContent);
      if (critical && !wasCritical) playSound("critical");
      if (!critical && wasCritical) stopSound("critical");
      wasCritical = critical;
    }).observe(systemStatus, { childList: true, characterData: true, subtree: true });
  }

  const logList = $("#log-list");
  if (logList) {
    lastLog = logList.firstElementChild?.textContent || "";
    new MutationObserver(() => {
      const message = logList.firstElementChild?.textContent || "";
      if (!message || message === lastLog || message === lastActionMessage) return;
      lastLog = message;
      if (/cultivado|hielo extra[ií]do|generaci[oó]n de ox[ií]geno|limpieza completada|reactor instalado|bater[ií]as instaladas|experimento completado|greenhouse grown|ice extracted|oxygen generated|cleaning complete|reactor installed|batteries installed|experiment complete/i.test(message)) {
        lastActionMessage = message;
        stopSound("click");
        // Variación sutil de velocidad para que cada tipo de operación tenga su propio ritmo.
        const rate = /hielo|ice/i.test(message) ? 0.92 :
          /ox[ií]geno|oxygen/i.test(message) ? 1.08 :
          /cultivad|greenhouse/i.test(message) ? 0.96 :
          /limpieza|cleaning/i.test(message) ? 1.16 :
          /experimento|experiment/i.test(message) ? 1.04 : 1;
        playSound("success", { rate });
      }
    }).observe(logList, { childList: true, subtree: true, characterData: true });
  }

  initialiseControls();
})();