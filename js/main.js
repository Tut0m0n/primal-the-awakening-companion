let playersCount = 1;
let selectedCharacters = [];

const characters = [
  { id: "DAREON", name: "DAREON - LA GRAN ESPADA", locked: false },
  { id: "LJONAR", name: "LJONAR - ESCUDO Y ESPADA", locked: false },
  { id: "THOREG", name: "THOREG - EL MARTILLO", locked: false },
  { id: "MIRAH", name: "MIRAH - EL ARCO", locked: false },
  { id: "KARAH", name: "KARAH - LAS ESPADAS DUALES", locked: false },
  { id: "HELEREN", name: "HELEREN - EL ARCO PISTOLA", locked: false },

  { id: "ZARAYA", name: "ZARAYA - LA LANZA (Pronto disponible)", locked: true },
  { id: "DRUSK", name: "DRUSK - EL TAMBOR DE GUERRA (Pronto disponible)", locked: true }
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

function goToCharacterSelection() {
  playersCount = parseInt(document.getElementById("players").value);

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
