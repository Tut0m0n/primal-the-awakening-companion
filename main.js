/* =======================
   ESTADO GLOBAL
======================= */
let playersCount = 0;
let selectedCharacters = [];
let playerNames = {};
let campaignType = null;
let difficulty = null;
let currentScreen = "screen-start";
let currentSaveId = null;

/* =======================
   STORAGE
======================= */
const STORAGE_KEY = "primal_saves";

/* =======================
   UTILIDAD GENERAL
======================= */
function $(id) {
  return document.getElementById(id);
}

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  const el = $(id);
  if (!el) return;
  el.classList.add("active");
  currentScreen = id;
  autoSave();
}

/* =======================
   MÚSICA
======================= */
function toggleMusic() {
  const music = $("intro-music");
  const btn = $("btn-mute");

  if (!music) return;

  if (music.paused) {
    music.play().catch(() => {});
    btn.textContent = "🔊";
  } else {
    music.pause();
    btn.textContent = "🔇";
  }
}

/* =======================
   INICIO
======================= */
function showMainMenu() {
  $("enter-container").classList.add("hidden");
  $("main-menu").classList.remove("hidden");
  $("intro-music")?.play().catch(() => {});
}

function goBackToStart() {
  showScreen("screen-start");
  $("main-menu").classList.add("hidden");
  $("enter-container").classList.remove("hidden");
}

/* =======================
   NUEVA PARTIDA
======================= */
function newGame() {
  currentSaveId = crypto.randomUUID();
  playersCount = 0;
  selectedCharacters = [];
  playerNames = {};
  campaignType = null;
  difficulty = null;

  showScreen("screen-campaign");
}

/* =======================
   CAMPAÑA
======================= */
function selectCampaign(type) {
  campaignType = type;
  showScreen("screen-players");
}

function goBackToCampaign() {
  showScreen("screen-campaign");
}

/* =======================
   JUGADORES
======================= */
function selectPlayers(count) {
  playersCount = count;
  selectedCharacters = [];
  playerNames = {};
  updateSelectedCount();
  showScreen("screen-characters");
}

function goBackToPlayers() {
  showScreen("screen-players");
}

/* =======================
   PERSONAJES
======================= */
function toggleCharacter(name) {
  if (selectedCharacters.includes(name)) {
    selectedCharacters = selectedCharacters.filter(c => c !== name);
  } else if (selectedCharacters.length < playersCount) {
    selectedCharacters.push(name);
  }
  updateCharactersUI();
}

function updateCharactersUI() {
  document.querySelectorAll(".character-btn").forEach(btn => {
    const name = btn.dataset.char;
    btn.classList.toggle("selected", selectedCharacters.includes(name));
  });

  updateSelectedCount();

  const confirm = $("btn-confirm");
  confirm.disabled = selectedCharacters.length !== playersCount;
  confirm.classList.toggle("disabled", confirm.disabled);
}

function updateSelectedCount() {
  $("selected-count").innerText =
    `Seleccionados: ${selectedCharacters.length} / ${playersCount}`;
}

function confirmCharacters() {
  buildNames();
  showScreen("screen-names");
}

/* =======================
   NOMBRES
======================= */
function buildNames() {
  const container = $("names-container");
  container.innerHTML = "";

  selectedCharacters.forEach(c => {
    const value = playerNames[c] || "";
    container.innerHTML += `
      <div class="name-row">
        <strong>${c}</strong><br>
        <input
          class="name-input"
          value="${value}"
          oninput="setPlayerName('${c}', this.value)"
          placeholder="Nombre jugador"
        />
      </div>
    `;
  });

  validateNames();
}

function setPlayerName(char, value) {
  playerNames[char] = value.trim();
  validateNames();
  autoSave();
}

function validateNames() {
  const valid = selectedCharacters.every(c => playerNames[c]?.length > 0);
  const btn = $("btn-start-campaign");
  btn.disabled = !valid;
  btn.classList.toggle("disabled", !valid);
}

function goBackToCharacters() {
  showScreen("screen-characters");
}

function goToDifficulty() {
  showScreen("screen-difficulty");
}

function goBackToNames() {
  showScreen("screen-names");
}

/* =======================
   DIFICULTAD
======================= */
function selectDifficulty(diff) {
  difficulty = diff;
  goToPrologue();
}

/* =======================
   PRÓLOGO
======================= */
function goToPrologue() {
  $("intro-music")?.pause();
  $("btn-save-exit").classList.remove("hidden");
  showScreen("screen-prologue");
}

/* =======================
   GUARDADO
======================= */
function getAllSaves() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
}

function saveAllSaves(saves) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(saves));
}

function autoSave() {
  if (!currentSaveId) return;

  const saves = getAllSaves();

  saves[currentSaveId] = normalizeSave({
    id: currentSaveId,
    state: {
      campaignType,
      playersCount,
      selectedCharacters,
      playerNames,
      difficulty,
      currentScreen
    }
  });

  saveAllSaves(saves);
}

function saveAndExit() {
  autoSave();
  location.reload();
}

/* =======================
   NORMALIZAR PARTIDAS ANTIGUAS
======================= */
function normalizeSave(save) {
  return {
    id: save.id || crypto.randomUUID(),
    name: save.name || "Partida sin nombre",
    state: {
      campaignType: save.state?.campaignType || "normal",
      playersCount: save.state?.playersCount || 1,
      selectedCharacters: save.state?.selectedCharacters || [],
      playerNames: save.state?.playerNames || {},
      difficulty: save.state?.difficulty || "normal",
      currentScreen: save.state?.currentScreen || "screen-prologue"
    }
  };
}

/* =======================
   CARGAR PARTIDA
======================= */
function loadGame(id) {
  const saves = getAllSaves();
  const save = normalizeSave(saves[id]);
  if (!save) return;

  currentSaveId = id;

  ({
    campaignType,
    playersCount,
    selectedCharacters,
    playerNames,
    difficulty,
    currentScreen
  } = save.state);

  $("intro-music")?.pause();
  $("btn-save-exit").classList.remove("hidden");
  showScreen("screen-prologue");
}

/* =======================
   EXPORT / IMPORT
======================= */
function exportJSON() {
  const data = JSON.stringify(getAllSaves(), null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "primal_saves.json";
  a.click();
}

function importJSON(file) {
  const reader = new FileReader();
  reader.onload = e => {
    const imported = JSON.parse(e.target.result);
    const current = getAllSaves();
    saveAllSaves({ ...current, ...imported });
    location.reload();
  };
  reader.readAsText(file);
}
