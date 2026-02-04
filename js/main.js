let playersCount = 0;
let selectedCharacters = [];

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

  let requiredCharacters = playersCount;
  if (playersCount === 1) requiredCharacters = 2;

  selectedCharacters = [];

  document.getElementById("selection-info").innerText =
    `Debes seleccionar ${requiredCharacters} personaje(s).`;

  renderCharacters();
  showScreen("screen-characters");
}

function renderCharacters() {
  const list = document.getElementById("character-list");
  list.innerHTML = "";

  characters.forEach(char => {
    const div = document.createElement("div");
    div.classList.add("character-item");

    if (char.locked) {
      div.classList.add("locked");
    }

    if (selectedCharacters.includes(char.id)) {
      div.classList.add("selected");
    }

    div.innerText = char.name;

    div.onclick = () => {
      if (char.locked) return;
      toggleCharacter(char.id);
    };

    list.appendChild(div);
  });
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

function confirmCharacters() {
  let requiredCharacters = playersCount;
  if (playersCount === 1) requiredCharacters = 2;

  if (selectedCharacters.length !== requiredCharacters) {
    alert(`Debes seleccionar exactamente ${requiredCharacters} personaje(s).`);
    return;
  }

  renderNameInputs();
  showScreen("screen-names");
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

