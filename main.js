/* =======================
   ESTADO GLOBAL
======================= */

let gameState = {
  saveName: null,
  campaign: null,
  playersCount: 0,
  selectedCharacters: [],
  playerNames: {},
  difficulty: null,
  currentScreen: "screen-start"
};

/* =======================
   GUARDADO
======================= */

function saveGameState() {
  localStorage.setItem("primal-save", JSON.stringify(gameState));
}

function loadGameState() {
  const saved = localStorage.getItem("primal-save");
  if (!saved) return false;
  gameState = JSON.parse(saved);
  return true;
}

/* =======================
   PANTALLAS
======================= */

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s =>
    s.classList.remove("active")
  );
  document.getElementById(id).classList.add("active");
  gameState.currentScreen = id;
  saveGameState();
}

/* =======================
   MÚSICA (NO TOCAR)
======================= */

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

/* =======================
   INICIO
======================= */

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

/* =======================
   CAMPAÑA
======================= */

function selectCampaign(type) {
  gameState.campaign = type;
  saveGameState();
  showScreen("screen-players");
}

/* =======================
   JUGADORES (MAX 5)
======================= */

function selectPlayers(count) {
  gameState.playersCount = Math.min(count, 5);
  gameState.selectedCharacters = [];
  gameState.playerNames = {};
  saveGameState();
  updateSelectedCount();
  showScreen("screen-characters");
}

/* =======================
   PERSONAJES
======================= */

function toggleCharacter(name) {
  if (gameState.selectedCharacters.includes(name)) {
    gameState.selectedCharacters =
      gameState.selectedCharacters.filter(c => c !== name);
  } else if (gameState.selectedCharacters.length < gameState.playersCount) {
    gameState.selectedCharacters.push(name);
  }

  updateCharactersUI();
  saveGameState();
}

function updateCharactersUI() {
  document.querySelectorAll(".character-btn").forEach(btn => {
    const name = btn.innerText.split("\n")[0];
    btn.classList.toggle(
      "selected",
      gameState.selectedCharacters.includes(name)
    );
  });

  updateSelectedCount();

  const confirm = document.getElementById("btn-confirm");
  confirm.disabled =
    gameState.selectedCharacters.length !== gameState.playersCount;
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

/* =======================
   NOMBRES (GUARDAR / EDITAR / BORRAR)
======================= */

function buildNames() {
  const container = document.getElementById("names-container");
  container.innerHTML = "";

  gameState.selectedCharacters.forEach(c => {
    const savedName = gameState.playerNames[c] || "";

    container.innerHTML += `
      <div class="name-row">
        <strong>${c}</strong>
        <input id="name-${c}" class="name-input" value="${savedName}">
        <button onclick="savePlayerName('${c}')">💾</button>
        <button onclick="editPlayerName('${c}')">✏️</button>
        <button onclick="deletePlayerName('${c}')">❌</button>
      </div>
    `;
  });

  updateStartCampaignButton();
}

function savePlayerName(char) {
  const input = document.getElementById(`name-${char}`);
  if (!input.value.trim()) return;
  gameState.playerNames[char] = input.value.trim();
  saveGameState();
  updateStartCampaignButton();
}

function editPlayerName(char) {
  document.getElementById(`name-${char}`).focus();
}

function deletePlayerName(char) {
  delete gameState.playerNames[char];
  buildNames();
  saveGameState();
}

function updateStartCampaignButton() {
  const btn = document.getElementById("btn-start-campaign");
  const filled =
    Object.keys(gameState.playerNames).length ===
    gameState.selectedCharacters.length;

  btn.disabled = !filled;
  btn.classList.toggle("disabled", !filled);
}

/* =======================
   DIFICULTAD
======================= */

function goToDifficulty() {
  showScreen("screen-difficulty");
}

function selectDifficulty(diff) {
  gameState.difficulty = diff;
  saveGameState();
  alert("Partida guardada correctamente.");
}

/* =======================
   SALIR
======================= */

function saveAndExit() {
  saveGameState();
  location.reload();
}

/* =======================
   RESTAURAR AL RECARGAR
======================= */

window.onload = () => {
  if (loadGameState()) {
    showScreen(gameState.currentScreen);
    if (gameState.currentScreen === "screen-characters") {
      updateCharactersUI();
    }
    if (gameState.currentScreen === "screen-names") {
      buildNames();
    }
  }
};
