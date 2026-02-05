let playersCount = 0;
let selectedCharacters = [];
let selectedPlayers = null;
let playersNames = {};

function startGame() {
  playersNames = {};

  selectedCharacters.forEach((charId) => {
    const input = document.getElementById(`player-${charId}`);
    playersNames[charId] = input.value.trim() || "Sin nombre";
  });

  console.log("Jugadores asignados:", playersNames);
  alert("¡Jugadores guardados! (Mira la consola)");

  // después aquí vamos a mandar al dashboard de campaña
}


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

function showScreen(screenId) {
  document.querySelectorAll(".screen").forEach(screen => {
    screen.classList.remove("active");
  });

  document.getElementById(screenId).classList.add("active");
}

function goToSetup() {
  const music = document.getElementById("intro-music");

  if (music) {
    music.play().catch(() => {
      console.log("Autoplay bloqueado hasta interacción del usuario.");
    });
  }

  showScreen("screen-setup");
}

function selectPlayers(num) {
  playersCount = num;
  selectedPlayers = num;
  selectedCharacters = [];

 renderPlayers();
  renderCharacters();
  showScreen("screen-characters");
}


function renderCharacters() {
  const grid = document.getElementById("characters-grid");
  grid.innerHTML = "";

  let requiredCharacters = playersCount;
  if (playersCount === 1) requiredCharacters = 2;

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
}


function toggleCharacter(charId) {
  let requiredCharacters = playersCount;
  if (playersCount === 1) requiredCharacters = 2;

  if (selectedCharacters.includes(charId)) {
    selectedCharacters = selectedCharacters.filter(id => id !== charId);
  } else {
    if (selectedCharacters.length >= requiredCharacters) {
      alert("Ya seleccionaste el máximo permitido.");
      return;
    }
    selectedCharacters.push(charId);
  }

  renderCharacters();
}


function renderNameInputs() {
  const form = document.getElementById("names-form");
  form.innerHTML = "";

  selectedCharacters.forEach((charId, index) => {
    const char = characters.find(c => c.id === charId);

    const div = document.createElement("div");
    div.innerHTML = `
      <h3>${char.name}</h3>
      <input type="text" id="player-${index}" placeholder="Nombre del jugador">
    `;

    form.appendChild(div);
  });
}

function savePlayers() {
  let playerData = [];

  selectedCharacters.forEach((charId, index) => {
    const input = document.getElementById(`player-${index}`);
    const playerName = input.value.trim();

    if (playerName === "") {
      alert("Debes ingresar todos los nombres.");
      return;
    }

    playerData.push({
      character: charId,
      player: playerName
    });
  });

  localStorage.setItem("primal_players", JSON.stringify(playerData));

  alert("Jugadores guardados correctamente.");
  console.log(playerData);
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

function toggleCharacter(characterId) {
  let requiredCharacters = playersCount;
  if (playersCount === 1) requiredCharacters = 2;

  if (selectedCharacters.includes(characterId)) {
    selectedCharacters = selectedCharacters.filter((c) => c !== characterId);
  } else {
    if (selectedCharacters.length >= requiredCharacters) {
      alert("Ya seleccionaste el máximo de personajes permitidos.");
      return;
    }
    selectedCharacters.push(characterId);
  }

  renderCharacters();
}

function confirmCharacters() {
  let requiredCharacters = playersCount;
  if (playersCount === 1) requiredCharacters = 2;

  if (selectedCharacters.length !== requiredCharacters) {
    alert(`Debes seleccionar exactamente ${requiredCharacters} personajes.`);
    return;
  }

  goToNames();
}

function renderPlayers() {
  const cards = document.querySelectorAll(".player-card");

  cards.forEach((card) => {
    card.classList.remove("selected");

    if (parseInt(card.innerText) === selectedPlayers) {
      card.classList.add("selected");
    }
  });
}

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
    `;

    container.appendChild(div);
  });

  showScreen("screen-names");
}

