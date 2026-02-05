/* =======================
   ESTADO GLOBAL
======================= */
let playersCount = 0;
let selectedCharacters = [];
let playerNames = {};
let currentSave = null;

/* =======================
   UTILIDAD PANTALLAS
======================= */
function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
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
   INICIO
======================= */
function showMainMenu() {
  document.getElementById("enter-container").classList.add("hidden");
  document.getElementById("main-menu").classList.remove("hidden");
  document.getElementById("intro-music").play().catch(() => {});
}

function goBackToStart() {
  showScreen("screen-start");
  document.getElementById("main-menu").classList.add("hidden");
  document.getElementById("enter-container").classList.remove("hidden");
}

/* =======================
   NUEVA PARTIDA
======================= */
function newGame() {
  currentSave = {};
  showScreen("screen-campaign");
  document.getElementById("btn-save-exit").classList.remove("hidden");
}

/* =======================
   CAMPAÑA
======================= */
function selectCampaign() {
  showScreen("screen-players");
}

function goBackToCampaign() {
  showScreen("screen-campaign");
}

/* =======================
   JUGADORES
======================= */
function selectPlayers(count) {
  playersCount = count === 1 ? 2 : count;
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
    const name = btn.innerText.split("\n")[0];
    btn.classList.toggle("selected", selectedCharacters.includes(name));
  });

  updateSelectedCount();

  const confirm = document.getElementById("btn-confirm");
  confirm.disabled = selectedCharacters.length !== playersCount;
  confirm.classList.toggle("disabled", confirm.disabled);
}

function updateSelectedCount() {
  document.getElementById("selected-count").innerText =
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
  const container = document.getElementById("names-container");
  container.innerHTML = "";

  selectedCharacters.forEach(c => {
    container.innerHTML += `
      <div class="name-row">
        <strong>${c}</strong>
        <input id="name-${c}" class="name-input" placeholder="Nombre jugador">
      </div>
    `;
  });
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
  alert("Dificultad: " + diff.toUpperCase());
}

/* =======================
   SALIR
======================= */
function saveAndExit() {
  location.reload();
}


