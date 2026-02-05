/* =======================
   ESTADO GLOBAL
======================= */

let gameState = {
  saveName: "",
  campaign: null,
  playersCount: 0,
  characters: [],
  playerNames: {},
  difficulty: null,
  screen: "screen-start"
};

/* =======================
   GUARDAR / CARGAR
======================= */

function saveGameState() {
  localStorage.setItem("primal-save", JSON.stringify(gameState));
}

function loadGameState() {
  const saved = localStorage.getItem("primal-save");
  if (!saved) return;
  gameState = JSON.parse(saved);
}

/* =======================
   PANTALLAS
======================= */

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s =>
    s.classList.remove("active")
  );
  document.getElementById(id).classList.add("active");
  gameState.screen = id;
  saveGameState();
}

/* =======================
   INICIO
======================= */

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

  saveGameState();
  showScreen("screen-campaign");
}

function continueGame() {
  loadGameState();
  if (gameState.screen) {
    showScreen(gameState.screen);
  }
}

/* =======================
   CAMPAÑA
======================= */

function selectCampaign(campaign) {
  gameState.campaign = campaign;
  saveGameState();
  showScreen("screen-players");
}

/* =======================
   JUGADORES
======================= */

function selectPlayers(count) {
  gameState.playersCount = Math.min(count, 5);
  gameState.characters = [];
  gameState.playerNames = {};
  saveGameState();
  showScreen("screen-characters");
}

/* =======================
   PERSONAJES
======================= */

function toggleCharacter(name) {
  if (gameState.characters.includes(name)) {
    gameState.characters =
      gameState.characters.filter(c => c !== name);
  } else if (gameState.characters.length < gameState.playersCount) {
    gameState.characters.push(name);
  }

  updateCharactersUI();
  saveGameState();
}

function updateCharactersUI() {
  document.querySelectorAll(".character-btn").forEach(btn => {
    const name = btn.dataset.char;
    btn.classList.toggle(
      "selected",
      gameState.characters.includes(name)
    );
  });

  document.getElementById("selected-count").innerText =
    `Seleccionados: ${gameState.characters.length} / ${gameState.playersCount}`;

  document.getElementById("btn-confirm").disabled =
    gameState.characters.length !== gameState.playersCount;
}

function confirmCharacters() {
  buildNames();
  showScreen("screen-names");
}

/* =======================
   NOMBRES
======================= */

function buildNames() {
  const c = document.getElementById("names-container");
  c.innerHTML = "";

  gameState.characters.forEach(char => {
    const saved = gameState.playerNames[char] || "";

    c.innerHTML += `
      <div class="name-row">
        <strong>${char}</strong>
        <input id="input-${char}" value="${saved}">
        <button onclick="savePlayerName('${char}')">💾</button>
        <button onclick="editPlayerName('${char}')">✏️</button>
        <button onclick="deletePlayerName('${char}')">❌</button>
      </div>
    `;
  });
}

function savePlayerName(char) {
  const input = document.getElementById(`input-${char}`);
  if (!input.value.trim()) return;
  gameState.playerNames[char] = input.value.trim();
  saveGameState();
}

function editPlayerName(char) {
  document.getElementById(`input-${char}`).focus();
}

function deletePlayerName(char) {
  delete gameState.playerNames[char];
  buildNames();
  saveGameState();
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
  alert("Partida lista. Todo quedó guardado.");
}

/* =======================
   SALIR
======================= */

function saveAndExit() {
  saveGameState();
  showScreen("screen-start");
}

/* =======================
   INICIO AUTOMÁTICO
======================= */

window.onload = () => {
  loadGameState();
  if (gameState.screen) {
    showScreen(gameState.screen);
  }
};


