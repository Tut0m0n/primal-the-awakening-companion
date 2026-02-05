let gameState = {
  saveName: "",
  campaign: null,
  playersCount: 0,
  characters: [],
  playerNames: {},
  difficulty: null,
  screen: "screen-start"
};

function saveGameState() {
  localStorage.setItem("primal-save", JSON.stringify(gameState));
}

function loadGameState() {
  const saved = localStorage.getItem("primal-save");
  if (!saved) return;
  gameState = JSON.parse(saved);
}

function showScreen(id) {
  const target = document.getElementById(id);
  if (!target) return; // 🔒 evita el crash

  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  target.classList.add("active");
  gameState.screen = id;
  saveGameState();
}

/* ===== AUDIO ===== */
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
    characters: [],
    playerNames: {},
    difficulty: null,
    screen: "screen-campaign"
  };

  document.getElementById("btn-save-exit").classList.remove("hidden");
  saveGameState();
  showScreen("screen-campaign");
}

/* ===== CAMPAÑA ===== */
function selectCampaign(type) {
  gameState.campaign = type;
  saveGameState();
  showScreen("screen-players");
}

/* ===== JUGADORES ===== */
function selectPlayers(count) {
  gameState.playersCount = count === 1 ? 2 : Math.min(count, 5);
  gameState.characters = [];
  gameState.playerNames = {};
  saveGameState();
  showScreen("screen-characters");
  updateSelectedCount();
}

/* ===== PERSONAJES ===== */
function toggleCharacter(name) {
  if (gameState.characters.includes(name)) {
    gameState.characters = gameState.characters.filter(c => c !== name);
  } else if (gameState.characters.length < gameState.playersCount) {
    gameState.characters.push(name);
  }
  updateCharactersUI();
  saveGameState();
}

function updateCharactersUI() {
  document.querySelectorAll(".character-btn").forEach(btn => {
    btn.classList.toggle("selected", gameState.characters.includes(btn.textContent));
  });

  updateSelectedCount();

  const btn = document.getElementById("btn-confirm");
  btn.disabled = gameState.characters.length !== gameState.playersCount;
  btn.classList.toggle("disabled", btn.disabled);
}

function updateSelectedCount() {
  document.getElementById("selected-count").innerText =
    `Seleccionados: ${gameState.characters.length} / ${gameState.playersCount}`;
}

function confirmCharacters() {
  buildNames();
  showScreen("screen-names");
}

/* ===== NOMBRES ===== */
function buildNames() {
  const c = document.getElementById("names-container");
  c.innerHTML = "";

  gameState.characters.forEach(ch => {
    c.innerHTML += `
      <div class="name-row">
        <strong>${ch}</strong>
        <input id="name-${ch}" class="name-input" value="${gameState.playerNames[ch] || ""}">
        <button onclick="savePlayerName('${ch}')">💾</button>
        <button onclick="deletePlayerName('${ch}')">❌</button>
      </div>
    `;
  });
}

function savePlayerName(ch) {
  const v = document.getElementById(`name-${ch}`).value.trim();
  if (!v) return;
  gameState.playerNames[ch] = v;
  saveGameState();
}

function deletePlayerName(ch) {
  delete gameState.playerNames[ch];
  buildNames();
  saveGameState();
}

/* ===== DIFICULTAD ===== */
function goToDifficulty() {
  showScreen("screen-difficulty");
}

function selectDifficulty(d) {
  gameState.difficulty = d;
  saveGameState();
  alert("Partida guardada correctamente");
}

/* ===== SALIR ===== */
function saveAndExit() {
  saveGameState();
  location.reload();
}

/* ===== INIT ===== */
window.onload = () => {
  loadGameState();
  showScreen(gameState.screen || "screen-start");
};

