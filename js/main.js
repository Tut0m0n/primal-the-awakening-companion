console.log("Primal App iniciada");

/* ============================================================
   VARIABLES GLOBALES
============================================================ */
let selectedCampaign = null;
let playersCount = 0;
let selectedCharacters = [];
let playerNames = {};
let selectedDifficulty = null;

let currentSave = null;
let selectedSave = null;
let deleteMode = false;


/* ============================================================
   UTILIDAD: MOSTRAR PANTALLAS CON FADE
============================================================ */
function showScreen(screenId) {
  document.querySelectorAll(".screen").forEach(screen => {
    screen.classList.remove("active");
  });

  const target = document.getElementById(screenId);
  if (target) {
    target.classList.add("active");
  }
}


/* ============================================================
   MÚSICA INTRO
============================================================ */
function playMusic() {
  const music = document.getElementById("intro-music");
  if (!music) return;

  music.play().catch(() => {
    console.log("Autoplay bloqueado. Se activará con interacción.");
  });
}

function toggleMusic() {
  const music = document.getElementById("intro-music");
  const btn = document.getElementById("btn-mute");

  if (!music || !btn) return;

  if (music.paused) {
    music.play();
    btn.innerText = "🔊";
  } else {
    music.pause();
    btn.innerText = "🔇";
  }
}


/* ============================================================
   MENÚ INICIO (ENTRAR -> MOSTRAR BOTONES)
============================================================ */
function showMainMenu() {
  playMusic();

  const enterBtn = document.getElementById("btn-enter");
  const menu = document.getElementById("main-menu");

  if (enterBtn) enterBtn.style.display = "none";
  if (menu) menu.classList.remove("hidden");
}

function hideMainMenu() {
  const menu = document.getElementById("main-menu");
  if (menu) menu.classList.add("hidden");
}


/* ============================================================
   BOTÓN GUARDAR / SALIR (VISIBLE SOLO EN PARTIDA)
============================================================ */
function showSaveExitButton() {
  const btn = document.getElementById("btn-save-exit");
  if (btn) btn.classList.remove("hidden");
}

function hideSaveExitButton() {
  const btn = document.getElementById("btn-save-exit");
  if (btn) btn.classList.add("hidden");
}


/* ============================================================
   NUEVA PARTIDA
============================================================ */
function newGame() {
  selectedSave = null;
  currentSave = {
    name: prompt("Nombre de la partida:", "Nueva Partida") || "Nueva Partida",
    campaign: null,
    playersCount: 0,
    characters: [],
    playerNames: {},
    difficulty: null
  };

  hideMainMenu();
  showSaveExitButton();

  showScreen("screen-campaign");
}


/* ============================================================
   SELECCIÓN CAMPAÑA
============================================================ */
function selectCampaign(type) {
  selectedCampaign = type;

  if (currentSave) {
    currentSave.campaign = type;
  }

  showScreen("screen-players");
}

function goBackToStart() {
  showScreen("screen-start");
}

function goBackToCampaign() {
  showScreen("screen-campaign");
}


/* ============================================================
   SELECCIÓN NÚMERO DE JUGADORES
============================================================ */
function selectPlayers(count) {
  playersCount = count;

  if (playersCount === 1) {
    playersCount = 2; // SOLO siempre usa 2 personajes
  }

  selectedCharacters = [];
  playerNames = {};

  if (currentSave) {
    currentSave.playersCount = playersCount;
    currentSave.characters = [];
    currentSave.playerNames = {};
  }

  updateSelectedCount();
  showScreen("screen-characters");
}

function goBackToPlayers() {
  showScreen("screen-players");
}


/* ============================================================
   SELECCIÓN DE PERSONAJES
============================================================ */
function toggleCharacter(character) {
  if (selectedCharacters.includes(character)) {
    selectedCharacters = selectedCharacters.filter(c => c !== character);
  } else {
    if (selectedCharacters.length < playersCount) {
      selectedCharacters.push(character);
    }
  }

  updateCharacterButtons();
  updateSelectedCount();
  checkConfirmButton();
}

function updateCharacterButtons() {
  document.querySelectorAll(".character-btn").forEach(btn => {
    const name = btn.innerText.split("\n")[0].trim();

    if (selectedCharacters.includes(name)) {
      btn.classList.add("selected");
    } else {
      btn.classList.remove("selected");
    }
  });
}

function updateSelectedCount() {
  const counter = document.getElementById("selected-count");
  if (counter) {
    counter.innerText = `Seleccionados: ${selectedCharacters.length} / ${playersCount}`;
  }
}

function checkConfirmButton() {
  const btn = document.getElementById("btn-confirm");

  if (!btn) return;

  if (selectedCharacters.length === playersCount) {
    btn.disabled = false;
    btn.classList.remove("disabled");
  } else {
    btn.disabled = true;
    btn.classList.add("disabled");
  }
}

function confirmCharacters() {
  if (selectedCharacters.length !== playersCount) return;

  if (currentSave) {
    currentSave.characters = [...selectedCharacters];
  }

  buildNamesScreen();
  showScreen("screen-names");
}

function goBackToCharacters() {
  showScreen("screen-characters");
}


/* ============================================================
   PANTALLA NOMBRES DE JUGADORES (GUARDAR / EDITAR / BORRAR)
============================================================ */
function buildNamesScreen() {
  const container = document.getElementById("names-container");
  if (!container) return;

  container.innerHTML = "";

  selectedCharacters.forEach(character => {
    const row = document.createElement("div");
    row.className = "name-row";

    row.innerHTML = `
      <div class="name-label">${character}</div>

      <input id="name-${character}" class="name-input" type="text" placeholder="Nombre jugador..." />

      <button class="icon-btn" onclick="saveName('${character}')">✓</button>
      <button class="icon-btn" onclick="editName('${character}')">✏</button>
      <button class="icon-btn" onclick="clearName('${character}')">✖</button>
    `;

    container.appendChild(row);
  });
}

function saveName(character) {
  const input = document.getElementById(`name-${character}`);
  if (!input) return;

  const value = input.value.trim();
  if (value === "") return;

  playerNames[character] = value;

  input.disabled = true;

  if (currentSave) {
    currentSave.playerNames = playerNames;
  }

  checkStartCampaignButton();
}

function editName(character) {
  const input = document.getElementById(`name-${character}`);
  if (!input) return;

  input.disabled = false;
  input.focus();
}

function clearName(character) {
  const input = document.getElementById(`name-${character}`);
  if (!input) return;

  input.value = "";
  input.disabled = false;

  delete playerNames[character];

  if (currentSave) {
    currentSave.playerNames = playerNames;
  }

  checkStartCampaignButton();
}

function checkStartCampaignButton() {
  const btn = document.getElementById("btn-start-campaign");
  if (!btn) return;

  if (Object.keys(playerNames).length === selectedCharacters.length) {
    btn.disabled = false;
    btn.classList.remove("disabled");
  } else {
    btn.disabled = true;
    btn.classList.add("disabled");
  }
}

function goToDifficulty() {
  showScreen("screen-difficulty");
}

function goBackToNames() {
  showScreen("screen-names");
}


/* ============================================================
   DIFICULTAD
============================================================ */
function selectDifficulty(diff) {
  selectedDifficulty = diff;

  if (currentSave) {
    currentSave.difficulty = diff;
  }

  alert("Dificultad seleccionada: " + diff.toUpperCase());

  updateSave();
}


/* ============================================================
   GUARDAR PARTIDA COMPLETA
============================================================ */
function updateSave() {
  if (!currentSave) return;

  const saves = JSON.parse(localStorage.getItem("primal_saves")) || [];

  const existingIndex = saves.findIndex(s => s.name === currentSave.name);

  if (existingIndex !== -1) {
    saves[existingIndex] = currentSave;
  } else {
    saves.push(currentSave);
  }

  localStorage.setItem("primal_saves", JSON.stringify(saves));
}


/* ============================================================
   GUARDAR / SALIR
============================================================ */
function saveAndExit() {
  updateSave();

  currentSave = null;
  selectedSave = null;
  selectedCampaign = null;
  playersCount = 0;
  selectedCharacters = [];
  playerNames = {};
  selectedDifficulty = null;

  hideSaveExitButton();

  const enterBtn = document.getElementById("btn-enter");
  if (enterBtn) enterBtn.style.display = "block";

  const menu = document.getElementById("main-menu");
  if (menu) menu.classList.add("hidden");

  const savesContainer = document.getElementById("save-list-container");
  if (savesContainer) savesContainer.classList.add("hidden");

  showScreen("screen-start");
}


/* ============================================================
   CARGAR PARTIDAS GUARDADAS
============================================================ */
function showSavedGames() {
  const container = document.getElementById("save-list-container");
  if (container) container.classList.remove("hidden");

  renderSaveList();
}

function renderSaveList() {
  const list = document.getElementById("save-list");
  const actions = document.getElementById("save-actions");
  const btnPlay = document.getElementById("btn-play-save");
  const btnDelete = document.getElementById("btn-delete-save");
  const btnDeleteMode = document.getElementById("btn-delete-mode");

  if (!list) return;

  list.innerHTML = "";
  selectedSave = null;

  if (actions) actions.classList.add("hidden");

  if (btnPlay) {
    btnPlay.disabled = true;
    btnPlay.classList.add("disabled");
  }

  if (btnDelete) {
    btnDelete.disabled = true;
    btnDelete.classList.add("disabled");
  }

  const saves = JSON.parse(localStorage.getItem("primal_saves")) || [];

  if (btnDeleteMode) {
    btnDeleteMode.disabled = saves.length === 0;
    btnDeleteMode.classList.toggle("disabled", saves.length === 0);
  }

  saves.forEach(save => {
    const div = document.createElement("div");
    div.className = "save-item";

    div.innerHTML = `
      <span>${save.name}</span>
      <button onclick="selectSave('${save.name}')">Seleccionar</button>
    `;

    list.appendChild(div);
  });
}

function selectSave(name) {
  const saves = JSON.parse(localStorage.getItem("primal_saves")) || [];
  selectedSave = saves.find(s => s.name === name);

  const actions = document.getElementById("save-actions");
  const btnPlay = document.getElementById("btn-play-save");
  const btnDelete = document.getElementById("btn-delete-save");

  if (actions) actions.classList.remove("hidden");

  if (btnPlay) {
    btnPlay.disabled = false;
    btnPlay.classList.remove("disabled");
  }

  if (btnDelete) {
    btnDelete.disabled = false;
    btnDelete.classList.remove("disabled");
  }
}

function playSelectedSave() {
  if (!selectedSave) return;

  currentSave = selectedSave;

  selectedCampaign = currentSave.campaign;
  playersCount = currentSave.playersCount;
  selectedCharacters = currentSave.characters || [];
  playerNames = currentSave.playerNames || {};
  selectedDifficulty = currentSave.difficulty;

  hideMainMenu();
  showSaveExitButton();

  showScreen("screen-players");
}

function toggleDeleteMode() {
  deleteMode = !deleteMode;
  alert(deleteMode ? "Modo borrado activado" : "Modo borrado desactivado");
}

function deleteSelectedSave() {
  if (!selectedSave) return;

  const confirmDelete = confirm("¿Estás seguro de borrar esta partida?");
  if (!confirmDelete) return;

  let saves = JSON.parse(localStorage.getItem("primal_saves")) || [];
  saves = saves.filter(s => s.name !== selectedSave.name);

  localStorage.setItem("primal_saves", JSON.stringify(saves));

  selectedSave = null;
  renderSaveList();
}

