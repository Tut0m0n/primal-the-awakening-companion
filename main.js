let gameState = {
  saveName: null,
  campaign: null,
  playersCount: 0,
  selectedCharacters: [],
  playerNames: {},
  difficulty: null,
  currentScreen: "screen-start"
};

/* ======================= */
function saveGameState() {
  localStorage.setItem("primal-save", JSON.stringify(gameState));
}

function loadGameState() {
  const saved = localStorage.getItem("primal-save");
  if (!saved) return false;
  gameState = JSON.parse(saved);
  return true;
}

/* ======================= */
function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  gameState.currentScreen = id;
  saveGameState();
}

/* ======================= */
function toggleMusic() {
  const music = document.getElementById("intro-music");
  const btn = document.getElementById("btn-mute");

  if (music.paused) {
    music.play();
    btn.textContent = "🔊";
  } else {
    music.pause();
    btn.textContent = "🔇";
  }
}

/* ======================= */
function showMainMenu() {
  document.getElementById("enter-container").classList.add("hidden");
  document.getElementById("main-menu").classList.remove("hidden");
  document.getElementById("intro-music").play().catch(() => {});
}

function newGame() {
  const name = prompt("Nombre de la partida:");
  if (!name) return;

  gameState = {
    saveName: name,
    campaign: null,
    playersCount: 0,
    selectedCharacters: [],
    playerNames: {},
    difficulty: null,
    currentScreen: "screen-campaign"
  };

  saveGameState();
  showScreen("screen-campaign");
  document.getElementById("btn-save-exit").classList.remove("hidden");
}

/* ======================= */
function selectCampaign(type) {
  gameState.campaign = type;
  saveGameState();
  showScreen("screen-players");
}

/* ======================= */
function selectPlayers(count) {
  gameState.playersCount = Math.min(count, 5);
  gameState.selectedCharacters = [];
  gameState.playerNames = {};
  saveGameState();
  updateSelectedCount();
  showScreen("screen-characters");
}

/* ======================= */
function toggleCharacter(name) {
  const arr = gameState.selectedCharacters;

  if (arr.includes(name)) {
    gameState.selectedCharacters = arr.filter(c => c !== name);
  } else if (arr.length < gameState.playersCount) {
    arr.push(name);
  }

  updateCharactersUI();
  saveGameState();
}

function updateCharactersUI() {
  document.querySelectorAll(".character-btn").forEach(btn => {
    const name = btn.textContent;
    btn.classList.toggle("selected", gameState.selectedCharacters.includes(name));
  });

  updateSelectedCount();

  const confirm = document.getElementById("btn-confirm");
  confirm.disabled = gameState.selectedCharacters.length !== gameState.playersCount;
  confirm.classList.toggle("disabled", confirm.disabled);
}

function updateSelectedCount() {
  document.getElementById("selected-count").innerText =
    `Seleccionados: ${gameState.selectedCharacters.length} / ${gameState.playersCount}`;
}

function confirmCharacters() {
  buildNames();
  showScreen("screen-names");
}

/* ======================= */
function buildNames() {
  const container = document.getElementById("names-container");
  container.innerHTML = "";

  gameState.selectedCharacters.forEach(c => {
    container.innerHTML += `
      <div class="name-row">
        <strong>${c}</strong>
        <input id="name-${c}" class="name-input" value="${gameState.playerNames[c] || ''}">
        <button onclick="savePlayerName('${c}')">💾</button>
        <button onclick="editPlayerName('${c}')">✏️</button>
        <button onclick="deletePlayerName('${c}')">❌</button>
      </div>
    `;
  });

  updateStartButton();
}

function savePlayerName(char) {
  const val = document.getElementById(`name-${char}`).value.trim();
  if (!val) return;
  gameState.playerNames[char] = val;
  saveGameState();
  updateStartButton();
}

function editPlayerName(char) {
  document.getElementById(`name-${char}`).focus();
}

function deletePlayerName(char) {
  delete gameState.playerNames[char];
  buildNames();
  saveGameState();
}

function updateStartButton() {
  const btn = document.getElementById("btn-start-campaign");
  const ok = Object.keys(gameState.playerNames).length === gameState.selectedCharacters.length;
  btn.disabled = !ok;
  btn.classList.toggle("disabled", !ok);
}

/* ======================= */
function goToDifficulty() {
  showScreen("screen-difficulty");
}

function selectDifficulty(diff) {
  gameState.difficulty = diff;
  saveGameState();
  alert("Partida guardada");
}

/* ======================= */
function saveAndExit() {
  saveGameState();
  location.reload();
}

/* ======================= */
window.onload = () => {
  if (loadGameState()) {
    showScreen(gameState.currentScreen);
    if (gameState.currentScreen === "screen-characters") updateCharactersUI();
    if (gameState.currentScreen === "screen-names") buildNames();
  }
};
