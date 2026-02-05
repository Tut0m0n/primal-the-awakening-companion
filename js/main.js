console.log("Primal App iniciada");

/* ==========================================
   VARIABLES GLOBALES
========================================== */
let playersCount = 0;
let selectedPlayers = null;
let selectedCharacters = [];
let playersNames = {};


/* ==========================================
   LISTA DE PERSONAJES
========================================== */
const characters = [
  { id: "DAREON", name: "DAREON", title: "LA GRAN ESPADA", available: true },
  { id: "LJONAR", name: "LJONAR", title: "ESCUDO Y ESPADA", available: true },
  { id: "THOREG", name: "THOREG", title: "EL MARTILLO", available: true },
  { id: "MIRAH", name: "MIRAH", title: "EL ARCO", available: true },
  { id: "KARAH", name: "KARAH", title: "LAS ESPADAS DUALES", available: true },
  { id: "HELEREN", name: "HELEREN", title: "EL ARCO PISTOLA", available: true },

  { id: "ZARAYA", name: "ZARAYA", title: "LA LANZA", available: false },
  { id: "DRUSK", name: "DRUSK", title: "EL TAMBOR DE GUERRA", available: false },
];


/* ==========================================
   UTILIDAD: CAMBIO DE PANTALLAS
========================================== */
function showScreen(screenId) {
  document.querySelectorAll(".screen").forEach((screen) => {
    screen.classList.remove("active");
  });

  document.getElementById(screenId).classList.add("active");
}


/* ==========================================
   PANTALLA INICIO
========================================== */
function goToSetup() {
  const music = document.getElementById("intro-music");

  if (music) {
    music.play().catch(() => {
      console.log("Autoplay bloqueado hasta interacción del usuario.");
    });
  }

  showScreen("screen-setup");
}

function toggleMusic() {
  const music = document.getElementById("intro-music");
  if (!music) return;

  if (music.paused) {
    music.play();
  } else {
    music.pause();
  }
}


/* ==========================================
   PANTALLA SETUP (SELECCIÓN DE JUGADORES)
========================================== */
function selectPlayers(num) {
  playersCount = num;
  selectedPlayers = num;

  selectedCharacters = [];
  playersNames = {};

  renderPlayers();
  renderCharacters();

  showScreen("screen-characters");
}

function renderPlayers() {
  const cards = document.querySelectorAll(".player-card");

  cards.forEach((card) => {
    card.classList.remove("selected");

    // SOLO
    if (card.innerText.trim() === "SOLO" && selectedPlayers === 1) {
      card.classList.add("selected");
    }

    // NÚMEROS 2-5
    if (parseInt(card.innerText) === selectedPlayers) {
      card.classList.add("selected");
    }
  });
}

function goBackToPlayers() {
  showScreen("screen-setup");
}


/* ==========================================
   PANTALLA PERSONAJES
========================================== */
function getRequiredCharacters() {
  if (playersCount === 1) return 2;
  return playersCount;
}

function renderCharacters() {
  const grid = document.getElementById("characters-grid");
  grid.innerHTML = "";

  const requiredCharacters = getRequiredCharacters();

  characters.forEach((char) => {
    const card = document.createElement("div");
    card.classList.add("character-card");

    if (!char.available) {
      card.classList.add("disabled");
    }

    if (selectedCharacters.includes(char.id)) {
      card.classList.add("selected");
    }

    card.innerHTML = `
      <div style="font-size:18px;">${char.name}</div>
      <div style="font-size:13px; font-weight:normal;">${char.title}</div>
      ${char.available ? "" : "<div style='margin-top:8px; font-size:12px;'>Pronto...</div>"}
    `;

    if (char.available) {
      card.onclick = () => toggleCharacter(char.id);
    }

    grid.appendChild(card);
  });

  document.getElementById("selection-info").innerText =
    `Seleccionados: ${selectedCharacters.length} / ${requiredCharacters}`;

  updateConfirmButton();
}

function toggleCharacter(charId) {
  const requiredCharacters = getRequiredCharacters();

  if (selectedCharacters.includes(charId)) {
    selectedCharacters = selectedCharacters.filter((id) => id !== charId);
  } else {
    if (selectedCharacters.length >= requiredCharacters) {
      alert("Ya seleccionaste el máximo permitido.");
      return;
    }
    selectedCharacters.push(charId);
  }

  renderCharacters();
}

function updateConfirmButton() {
  const btn = document.getElementById("btn-confirm");
  if (!btn) return;

  const requiredCharacters = getRequiredCharacters();

  if (selectedCharacters.length === requiredCharacters) {
    btn.disabled = false;
    btn.classList.remove("disabled");
  } else {
    btn.disabled = true;
    btn.classList.add("disabled");
  }
}

function confirmCharacters() {
  const requiredCharacters = getRequiredCharacters();

  if (selectedCharacters.length !== requiredCharacters) {
    alert(`Debes seleccionar exactamente ${requiredCharacters} personajes.`);
    return;
  }

  goToNames();
}


/* ==========================================
   PANTALLA NOMBRES (ASIGNAR JUGADORES)
========================================== */
function goToNames() {
  const container = document.getElementById("names-form");
  container.innerHTML = "";

  selectedCharacters.forEach((charId) => {
    const char = characters.find((c) => c.id === charId);

    const div = document.createElement("div");
    div.classList.add("name-row");

    div.innerHTML = `
      <label><b>${char.name}</b> - ${char.title}</label>

      <input type="text" id="player-${charId}" placeholder="Nombre del jugador..." />

      <div class="name-actions">
        <button onclick="saveName('${charId}')">✔</button>
        <button onclick="editName('${charId}')">✏️</button>
        <button onclick="clearName('${charId}')">❌</button>
      </div>
    `;

    container.appendChild(div);
  });

  showScreen("screen-names");
}


function goBackToCharacters() {
  showScreen("screen-characters");
}

function startGame() {
  playersNames = {};

  for (const charId of selectedCharacters) {
    const input = document.getElementById(`player-${charId}`);

    if (!input) {
      alert("Error: input no encontrado.");
      return;
    }

    if (input.value.trim() === "") {
      alert("Debes ingresar todos los nombres.");
      return;
    }

    if (!input.disabled) {
      alert("Debes guardar todos los nombres (✔) antes de continuar.");
      return;
    }

    playersNames[charId] = input.value.trim();
  }

  console.log("Jugadores asignados:", playersNames);

  goToDifficulty();
}


function saveName(charId) {
  const input = document.getElementById(`player-${charId}`);
  if (!input) return;

  if (input.value.trim() === "") {
    alert("No puedes guardar un nombre vacío.");
    return;
  }

  input.disabled = true;
}

function editName(charId) {
  const input = document.getElementById(`player-${charId}`);
  if (!input) return;

  input.disabled = false;
  input.focus();
}

function clearName(charId) {
  const input = document.getElementById(`player-${charId}`);
  if (!input) return;

  input.value = "";
  input.disabled = false;
  input.focus();
}

let difficulty = null;

function goBackToNames() {
  showScreen("screen-names");
}

function goToDifficulty() {
  difficulty = null;

  const btn = document.getElementById("btn-difficulty");
  btn.disabled = true;
  btn.classList.add("disabled");

  showScreen("screen-difficulty");
}

function selectDifficulty(mode) {
  difficulty = mode;

  const btn = document.getElementById("btn-difficulty");
  btn.disabled = false;
  btn.classList.remove("disabled");

  console.log("Dificultad seleccionada:", difficulty);
}

function startCampaign() {
  if (!difficulty) {
    alert("Selecciona una dificultad.");
    return;
  }

  alert("Campaña iniciada: " + difficulty);

  console.log("Campaña iniciada con:");
  console.log("Personajes:", selectedCharacters);
  console.log("Jugadores:", playersNames);
  console.log("Dificultad:", difficulty);

  // Aquí después crearemos el Dashboard de campaña
}

// =======================================
// CAMPAÑA INICIAL
// =======================================

let selectedCampaign = null;

// Ir a pantalla selección campaña
function goToCampaign() {
  showScreen("screen-campaign");
}

// Volver al inicio
function goBackToStart() {
  showScreen("screen-start");
}

// Seleccionar campaña
function selectCampaign(campaign) {
  selectedCampaign = campaign;

  console.log("Campaña seleccionada:", selectedCampaign);

  if (selectedCampaign === "normal") {
    showScreen("screen-setup");
  }
}

