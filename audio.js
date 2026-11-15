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

  function readPrefs() {
    try {
      return JSON.parse(localStorage.getItem(PREFS_KEY) || "{}");
    } catch (error) {
      return {};
    }
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
    if (muteControl) muteControl.checked = muted;
    if (muted || music.volume === 0) {
      music.pause();
    } else if (activated && music.paused) {
      const promise = music.play();
      if (promise && promise.catch) promise.catch(() => {});
    }
  }

  function playSound(name) {
    if (muted) return;
    const audio = sounds[name];
    if (!audio || audio.volume <= 0) return;
    try {
      audio.currentTime = 0;
      const promise = audio.play();
      if (promise && promise.catch) promise.catch(() => {});
    } catch (error) {}
  }

  function activateAudio() {
    activated = true;
    applyVolumes();
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
      slider.addEventListener("input", () => {
        applyVolumes();
        savePrefs();
      });
    });

    const muteControl = $("#audio-mute");
    if (muteControl) {
      muteControl.checked = muted;
      muteControl.addEventListener("change", () => {
        muted = muteControl.checked;
        applyVolumes();
        savePrefs();
      });
    }
    applyVolumes();
  }

  // Los navegadores permiten iniciar audio después de una interacción real.
  document.addEventListener("pointerdown", activateAudio, { once: true });
  document.addEventListener("keydown", activateAudio, { once: true });

  // Sonido breve para botones y controles de navegación.
  document.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button || button.disabled) return;
    activateAudio();
    applyVolumes();
    playSound("click");
  }, true);

  // Los eventos de misión reproducen la alarma de alerta al abrirse.
  const eventModal = $("#event-modal");
  if (eventModal) {
    eventWasVisible = !eventModal.classList.contains("hidden");
    new MutationObserver(() => {
      const visible = !eventModal.classList.contains("hidden");
      if (visible && !eventWasVisible) playSound("alert");
      eventWasVisible = visible;
    }).observe(eventModal, { attributes: true, attributeFilter: ["class"] });
  }

  // Sonido de victoria o derrota al aparecer el informe final.
  const resultScreen = $("#screen-result");
  if (resultScreen) {
    new MutationObserver(() => {
      const result = ["result-victory", "result-failed", "result-incomplete"]
        .find((className) => resultScreen.classList.contains(className)) || "";
      if (result && result !== lastResult) {
        playSound(result === "result-victory" ? "success" : "alert");
        lastResult = result;
      }
      if (!result) lastResult = "";
    }).observe(resultScreen, { attributes: true, attributeFilter: ["class"] });
  }

  // Alarma de recursos críticos: solo vuelve a sonar cuando se recuperan
  // y entran nuevamente en estado crítico.
  const systemStatus = $("#system-status");
  if (systemStatus) {
    wasCritical = /cr[ií]tic|critical|supervivencia en riesgo|survival at risk/i.test(systemStatus.textContent);
    new MutationObserver(() => {
      const critical = /cr[ií]tic|critical|supervivencia en riesgo|survival at risk/i.test(systemStatus.textContent);
      if (critical && !wasCritical) playSound("critical");
      wasCritical = critical;
    }).observe(systemStatus, { childList: true, characterData: true, subtree: true });
  }

  // Confirma las acciones completadas sin alterar la lógica de la partida.
  const logList = $("#log-list");
  if (logList) {
    lastLog = logList.firstElementChild?.textContent || "";
    new MutationObserver(() => {
      const message = logList.firstElementChild?.textContent || "";
      if (!message || message === lastLog) return;
      lastLog = message;
      if (/cultivado|hielo extra[ií]do|generaci[oó]n de ox[ií]geno|limpieza completada|reactor instalado|bater[ií]as instaladas|experimento completado|greenhouse grown|ice extracted|oxygen generated|cleaning complete|reactor installed|batteries installed|experiment complete/i.test(message)) {
        playSound("success");
      }
    }).observe(logList, { childList: true, subtree: true, characterData: true });
  }

  initialiseControls();
})();
