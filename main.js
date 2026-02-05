/* =======================
   SISTEMA DE PARTIDAS
======================= */

let saves = JSON.parse(localStorage.getItem("primal-saves")) || {};
let currentSaveName = null;

/* =======================
   UTILIDADES
======================= */

function saveAll() {
  localStorage.setItem("primal-saves", JSON.stringify(saves));
}

function getCurrent() {
  return saves[currentSaveName];
}

function showScreen(id) {
  const screen = document.getElementById(id);
  if (!screen) return;

  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  screen.classList.add("active");

  if (currentSaveName) {
    getCurrent().screen = id;
    saveAll();
  }
}

/* =======================
   AUDIO
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

function enterApp() {
  document.getElementById("enter-container").classList.add("hidden");
  document.getElementById("main-menu").classList.remove("hidden");
  document.getElementById("btn-save-exit").classList.remove("hidden");

  document.getElementById("intro-music").play().catch(() => {});
}

function backToStart() {
  showScreen("screen-start");
}

function saveAndExit() {
  saveAll();
  location.reload();
}

/* =======================
   NUEVA PARTIDA
======================= */

function openNewGame() {
  const name = prompt("Nombre de la partida:");
  if (!name || saves[name]) return;

  saves[name] = {
    name,
    campaign: null,
    playersCount: 0,
    characters: [],
    playerNames: {},
    difficulty: null,
    screen: "screen-campaign"
  };

  currentSaveName = name;
  saveAll();
  showScreen("screen-campaign");
}

/* =======================
   CARGAR PARTIDA
======================= */

function openLoadGame() {
  const list = document.getElementById("save-list");
  list.innerHTML = "";

  const names = Object.keys(saves);
  if (names.length === 0) {
    list.innerHTML = "<p>No hay partidas guardadas</p>";
  }

  names.forEach(name => {
    const row = document.createElement("div");
    row.className = "name-row";
    row.innerHTML = `
      <strong>${name}</strong>
      <button onclick="loadGame('${name}')">🎟️</button>
      <button onclick="deleteGame('${name}')">❌</button>
    `;
    list.appendChild(row);
  });

  document.getElementById("main-menu").classList.add("hidden");
  document.getElementById("save-list-container").classList.remove("hidden");
}

function closeLoadGame() {
  document.getElementById("save-list-container").classList.add("hidden");
  document.getElementById("main-menu").classList.remove("hidden");
}

function loadGame(name) {
  currentSaveName = name;
  saveAll();
  showScreen(getCurrent().screen);
}

function deleteGame(name) {
  if (!confirm("¿Borrar partida?")) return;
  delete saves[name];
  saveAll();
  openLoadGame();
}

/* =======================
   CAMPAÑA
======================= */

function selectCampaign(type) {
  getCurrent().campaign = type;
  saveAll();
  showScreen("screen-players");
}

/* =======================
   JUGADORES
======================= */

function selectPlayers(count) {
  const s = getCurrent();
  s.playersCount = count === 1 ? 2 : Math.min(count, 5);
  s.characters = [];
  s.playerNames = {};
  saveAll();
  showScreen("screen-characters");
  updateSelectedCount();
}

/* =======================
   PERSONAJES
======================= */

function toggleCharacter(name) {
  const s = getCurrent();
  if (s.characters.includes(name)) {
    s.characters = s.characters.filter(c => c !== name);
  } else if (s.characters.length < s.playersCount) {
    s.characters.push(name);
  }
  saveAll();
  updateCharactersUI();
}

function updateCharactersUI() {
  const s = getCurrent();

  document.querySelectorAll(".character-btn").forEach(btn => {
    btn.classList.toggle("selected", s.characters.includes(btn.textContent));
  });

  updateSelectedCount();

  const btn = document.getElementById("btn-confirm");
  btn.disabled = s.characters.length !== s.playersCount;
  btn.classList.toggle("disabled", btn.disabled);
}

function updateSelectedCount() {
  const s = getCurrent();
  document.getElementById("selected-count").innerText =
    `Seleccionados: ${s.characters.length} / ${s.playersCount}`;
}

function confirmCharacters() {
  buildNames();
  showScreen("screen-names");
}

/* =======================
   NOMBRES
======================= */

function buildNames() {
  const s = getCurrent();
  const c = document.getElementById("names-container");
  c.innerHTML = "";

  s.characters.forEach(ch => {
    c.innerHTML += `
      <div class="name-row">
        <strong>${ch}</strong>
        <input id="name-${ch}" class="name-input" value="${s.playerNames[ch] || ""}">
        <button onclick="savePlayerName('${ch}')">🎟️</button>
        <button onclick="deletePlayerName('${ch}')">❌</button>
      </div>
    `;
  });

  updateNamesButton();
}

function savePlayerName(ch) {
  const s = getCurrent();
  const val = document.getElementById(`name-${ch}`).value.trim();
  if (!val) return;
  s.playerNames[ch] = val;
  saveAll();
  updateNamesButton();
}

function deletePlayerName(ch) {
  const s = getCurrent();
  delete s.playerNames[ch];
  buildNames();
  saveAll();
}

function updateNamesButton() {
  const s = getCurrent();
  const btn = document.getElementById("btn-start-campaign");
  const ok = Object.keys(s.playerNames).length === s.characters.length;
  btn.disabled = !ok;
  btn.classList.toggle("disabled", !ok);
}

/* =======================
   DIFICULTAD
======================= */

function goToDifficulty() {
  showScreen("screen-difficulty");
}

function selectDifficulty(d) {
  getCurrent().difficulty = d;
  saveAll();
  alert("Partida guardada correctamente");
}
