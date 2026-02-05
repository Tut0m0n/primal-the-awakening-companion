/* =======================
   ESTADO GLOBAL
======================= */

let currentSaveName = null;

let gameState = {
  campaign: null,
  playersCount: 0,
  characters: [],
  playerNames: {},
  difficulty: null,
  currentScene: "start"
};

/* =======================
   UTILIDAD PANTALLAS
======================= */

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s =>
    s.classList.remove("active")
  );
  document.getElementById(id).classList.add("active");
}

/* =======================
   MÚSICA
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
   GUARDADO LOCAL
======================= */

function saveGameState() {
  if (!currentSaveName) return;
  localStorage.setItem(
    "primal_save_" + currentSaveName,
    JSON.stringify(gameState)
  );
}

function saveAndExit() {
  saveGameState();
  location.reload();
}

/* =======================
   EXPORT / IMPORT JSON
======================= */

function exportJSON() {
  if (!currentSaveName) {
    alert("No hay partida cargada.");
    return;
  }

  const data = {
    saveName: currentSaveName,
    gameState: gameState
  };

  const blob = new Blob(
    [JSON.stringify(data, null, 2)],
    { type: "application/json" }
  );

  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = currentSaveName + ".json";
  a.click();
}

function importJSON() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json";

  input.onchange = e => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);

        if (!data.saveName || !data.gameState) {
          alert("Archivo inválido.");
          return;
        }

        currentSaveName = data.saveName;
        gameState = data.gameState;

        saveGameState();

        document.getElementById("intro-music").pause();
        document.getElementById("btn-save-exit").classList.remove("hidden");

        showScreen("screen-prologue");
      } catch {
        alert("Error al leer el archivo.");
      }
    };

    reader.readAsText(file);
  };

  input.click();
}

/* =======================
   INICIO
======================= */

function showMainMenu() {
  document.getElementById("enter-container").classList.add("hidden");
  document.getElementById("main-menu").classList.remove("hidden");
  document.getElementById("json-controls").classList.remove("hidden");

  document.getElementById("intro-music").play().catch(() => {});
}

function goBackToMainMenu() {
  document.getElementById("new-game-container").classList.add("hidden");
  document.getElementById("save-list-container").classList.add("hidden");
  document.querySelector(".menu-buttons").classList.remove("hidden");
}

/* =======================
   NUEVA PARTIDA
======================= */

function showNewGame() {
  document.querySelector(".menu-buttons").classList.add("hidden");
  document.getElementById("new-game-container").classList.remove("hidden");
}

function cancelNewGame() {
  document.getElementById("new-game-container").classList.add("hidden");
  document.querySelector(".menu-buttons").classList.remove("hidden");
}

function confirmNewGame() {
  const input = document.getElementById("new-save-name");
  const name = input.value.trim();

  if (!name) {
    alert("Debes ingresar un nombre para la partida.");
    return;
  }

  currentSaveName = name;
  gameState = {
    campaign: null,
    playersCount: 0,
    characters: [],
    playerNames: {},
    difficulty: null,
    currentScene: "campaign"
  };

  saveGameState();
  showScreen("screen-campaign");
}

/* =======================
   CARGAR PARTIDA
======================= */

function showSavedGames() {
  document.querySelector(".menu-buttons").classList.add("hidden");
  document.getElementById("save-list-container").classList.remove("hidden");

  const list = document.getElementById("save-list");
  list.innerHTML = "";

  Object.keys(localStorage)
    .filter(k => k.startsWith("primal_save_"))
    .forEach(key => {
      const name = key.replace("primal_save_", "");
      const row = document.createElement("div");

      row.innerHTML = `
        <span>${name}</span>
        <button onclick="loadGame('${name}')">🎟️</button>
        <button onclick="deleteGame('${name}')">❌</button>
      `;
      list.appendChild(row);
    });
}

function loadGame(name) {
  const data = localStorage.getItem("primal_save_" + name);
  if (!data) return;

  currentSaveName = name;
  gameState = JSON.parse(data);

  document.getElementById("intro-music").pause();
  document.getElementById("btn-save-exit").classList.remove("hidden");

  showScreen("screen-prologue");
}

function deleteGame(name) {
  if (!confirm("¿Eliminar partida?")) return;
  localStorage.removeItem("primal_save_" + name);
  showSavedGames();
}

/* =======================
   CAMPAÑA
======================= */

function selectCampaign(type) {
  gameState.campaign = type;
  gameState.currentScene = "players";
  saveGameState();

  markSelected(event.target);
  showScreen("screen-players");
}

function goBackToCampaign() {
  showScreen("screen-campaign");
}

/* =======================
   JUGADORES
======================= */

function selectPlayers(count) {
  gameState.playersCount = count === 1 ? 2 : count;
  gameState.characters = [];
  gameState.playerNames = {};
  gameState.currentScene = "characters";
  saveGameState();

  markSelected(event.target);
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
  if (gameState.characters.includes(name)) {
    gameState.characters =
      gameState.characters.filter(c => c !== name);
  } else if (
    gameState.characters.length < gameState.playersCount
  ) {
    gameState.characters.push(name);
  }

  saveGameState();
  updateCharactersUI();
}

function updateCharactersUI() {
  document.querySelectorAll(".character-btn").forEach(btn => {
    const name = btn.innerText.split("\n")[0];
    btn.classList.toggle(
      "selected",
      gameState.characters.includes(name)
    );
  });

  updateSelectedCount();

  const confirm = document.getElementById("btn-confirm");
  confirm.disabled =
    gameState.characters.length !== gameState.playersCount;
  confirm.classList.toggle("disabled", confirm.disabled);

  if (!confirm.disabled) {
    confirm.onclick = () => {
      buildNames();
      showScreen("screen-names");
    };
  }
}

function updateSelectedCount() {
  document.getElementById("selected-count").innerText =
    `Seleccionados: ${gameState.characters.length} / ${gameState.playersCount}`;
}

function goBackToCharacters() {
  showScreen("screen-characters");
}

/* =======================
   NOMBRES
======================= */

function buildNames() {
  const container = document.getElementById("names-container");
  container.innerHTML = "";

  gameState.characters.forEach(char => {
    gameState.playerNames[char] =
      gameState.playerNames[char] || "";

    const row = document.createElement("div");
    row.className = "name-row";

    row.innerHTML = `
      <strong>${char}</strong><br>
      <input id="name-${char}" class="name-input"
        value="${gameState.playerNames[char]}">
      <button onclick="savePlayerName('${char}')">🎟️</button>
      <button onclick="editPlayerName('${char}')">✏</button>
      <button onclick="deletePlayerName('${char}')">❌</button>
    `;
    container.appendChild(row);
  });

  updateNamesContinue();
}

function savePlayerName(char) {
  const input = document.getElementById("name-" + char);
  if (!input.value.trim()) return;

  gameState.playerNames[char] = input.value.trim();
  input.disabled = true;
  saveGameState();
  updateNamesContinue();
}

function editPlayerName(char) {
  document.getElementById("name-" + char).disabled = false;
}

function deletePlayerName(char) {
  document.getElementById("name-" + char).value = "";
  document.getElementById("name-" + char).disabled = false;
  gameState.playerNames[char] = "";
  saveGameState();
  updateNamesContinue();
}

function updateNamesContinue() {
  const ready = gameState.characters.every(
    c => gameState.playerNames[c]
  );

  const btn = document.getElementById("btn-names-continue");
  btn.disabled = !ready;
  btn.classList.toggle("disabled", !ready);

  if (ready) {
    btn.onclick = () => showScreen("screen-difficulty");
  }
}

/* =======================
   DIFICULTAD
======================= */

function selectDifficulty(diff) {
  gameState.difficulty = diff;
  gameState.currentScene = "prologue";
  saveGameState();

  markSelected(event.target);

  const btn = document.getElementById("btn-difficulty-continue");
  btn.disabled = false;
  btn.classList.remove("disabled");

  btn.onclick = () => {
    document.getElementById("intro-music").pause();
    document.getElementById("btn-save-exit").classList.remove("hidden");
    showScreen("screen-prologue");
  };
}

function goBackToNames() {
  showScreen("screen-names");
}

/* =======================
   UTIL VISUAL
======================= */

function markSelected(el) {
  el.parentElement
    .querySelectorAll(".player-card")
    .forEach(b => b.classList.remove("selected"));

  el.classList.add("selected");
}
