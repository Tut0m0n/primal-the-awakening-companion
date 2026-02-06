/*************************************************
 * ESTADO GLOBAL
 *************************************************/
let gameState = {
  campaign: null,
  playersCount: 0,
  selectedCharacters: [],
  playerNames: [],
  difficulty: null
};

const SAVE_KEY = "primal_save";

/*************************************************
 * UTILIDADES
 *************************************************/
function qs(id) {
  return document.getElementById(id);
}

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => {
    s.classList.remove("active");
  });
  qs(id).classList.add("active");
}

/*************************************************
 * AUDIO
 *************************************************/
function toggleMusic() {
  const audio = qs("intro-music");
  const btn = qs("btn-mute");

  if (audio.paused) {
    audio.play();
    btn.textContent = "🔊";
  } else {
    audio.pause();
    btn.textContent = "🔇";
  }
}

/*************************************************
 * GUARDADO AUTOMÁTICO
 *************************************************/
function autoSave() {
  localStorage.setItem(SAVE_KEY, JSON.stringify(gameState));
}

/*************************************************
 * GUARDAR / SALIR
 *************************************************/
function saveAndExit() {
  autoSave();
  location.reload();
}

/*************************************************
 * EXPORT / IMPORT
 *************************************************/
function exportJSON() {
  const blob = new Blob(
    [JSON.stringify(gameState, null, 2)],
    { type: "application/json" }
  );

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "primal_save.json";
  link.click();
}

function importJSON(file) {
  if (!file) return;

  const reader = new FileReader();
  reader.onload = e => {
    gameState = JSON.parse(e.target.result);
    autoSave();
    alert("Partida importada correctamente");
    location.reload();
  };
  reader.readAsText(file);
}

/*************************************************
 * INICIO
 *************************************************/
function showMainMenu() {
  qs("main-menu").classList.remove("hidden");
}

function goBackToStart() {
  qs("save-list-container").classList.add("hidden");
  qs("main-menu").classList.remove("hidden");
}

/*************************************************
 * NUEVA / CARGAR PARTIDA
 *************************************************/
function newGame() {
  gameState = {
    campaign: null,
    playersCount: 0,
    selectedCharacters: [],
    playerNames: [],
    difficulty: null
  };
  autoSave();
  showScreen("screen-campaign");
}

function showSavedGames() {
  const saved = localStorage.getItem(SAVE_KEY);
  const container = qs("save-list");

  container.innerHTML = "";

  if (!saved) {
    container.innerHTML = "<p>No hay partidas guardadas</p>";
  } else {
    const btn = document.createElement("button");
    btn.className = "btn";
    btn.textContent = "Cargar partida";
    btn.onclick = () => {
      gameState = JSON.parse(saved);
      resumeGame();
    };
    container.appendChild(btn);
  }

  qs("main-menu").classList.add("hidden");
  qs("save-list-container").classList.remove("hidden");
}

function resumeGame() {
  if (!gameState.campaign) return showScreen("screen-campaign");
  if (!gameState.playersCount) return showScreen("screen-players");
  if (gameState.selectedCharacters.length === 0) return showScreen("screen-characters");
  if (gameState.playerNames.length === 0) return showScreen("screen-names");
  if (!gameState.difficulty) return showScreen("screen-difficulty");

  showScreen("screen-prologue");
}

/*************************************************
 * CAMPAÑA
 *************************************************/
function selectCampaign(type) {
  gameState.campaign = type;
  autoSave();
  showScreen("screen-players");
}

function goBackToCampaign() {
  showScreen("screen-campaign");
}

/*************************************************
 * JUGADORES
 *************************************************/
function selectPlayers(count) {
  gameState.playersCount = count === 1 ? 2 : count; // SOLO = 2
  gameState.selectedCharacters = [];
  gameState.playerNames = [];
  autoSave();

  updateSelectedCount();
  showScreen("screen-characters");
}

function goBackToPlayers() {
  showScreen("screen-players");
}

/*************************************************
 * PERSONAJES
 *************************************************/
function toggleCharacter(name) {
  const max = gameState.playersCount;
  const idx = gameState.selectedCharacters.indexOf(name);

  if (idx >= 0) {
    gameState.selectedCharacters.splice(idx, 1);
  } else {
    if (gameState.selectedCharacters.length >= max) return;
    gameState.selectedCharacters.push(name);
  }

  updateCharacterUI();
  autoSave();
}

function updateCharacterUI() {
  const max = gameState.playersCount;

  document.querySelectorAll(".character-btn").forEach(btn => {
    const char = btn.dataset.char;
    btn.classList.toggle(
      "selected",
      gameState.selectedCharacters.includes(char)
    );
  });

  qs("selected-count").textContent =
    `Seleccionados: ${gameState.selectedCharacters.length} / ${max}`;

  const btn = qs("btn-confirm");
  btn.disabled = gameState.selectedCharacters.length !== max;
  btn.classList.toggle(
    "disabled",
    gameState.selectedCharacters.length !== max
  );
}

function updateSelectedCount() {
  qs("selected-count").textContent =
    `Seleccionados: 0 / ${gameState.playersCount}`;
}

function confirmCharacters() {
  autoSave();
  buildNameInputs();
  showScreen("screen-names");
}

function goBackToCharacters() {
  showScreen("screen-characters");
}

/*************************************************
 * NOMBRES
 *************************************************/
function buildNameInputs() {
  const container = qs("names-container");
  container.innerHTML = "";

  gameState.selectedCharacters.forEach((char, i) => {
    const input = document.createElement("input");
    input.placeholder = `Jugador ${i + 1} (${char})`;
    input.value = gameState.playerNames[i] || "";
    input.oninput = () => {
      gameState.playerNames[i] = input.value;
      checkNames();
      autoSave();
    };
    container.appendChild(input);
  });

  checkNames();
}

function checkNames() {
  const btn = qs("btn-start-campaign");
  const ok = gameState.playerNames.length === gameState.playersCount &&
             gameState.playerNames.every(n => n.trim() !== "");

  btn.disabled = !ok;
  btn.classList.toggle("disabled", !ok);
}

function goBackToNames() {
  showScreen("screen-names");
}

/*************************************************
 * DIFICULTAD
 *************************************************/
function goToDifficulty() {
  autoSave();
  showScreen("screen-difficulty");
}

function selectDifficulty(diff) {
  gameState.difficulty = diff;
  autoSave();
  showScreen("screen-prologue");
}
