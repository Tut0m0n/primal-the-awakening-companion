const screens = document.querySelectorAll(".screen");
const music = document.getElementById("bg-music");

const state = {
  saveName: null,
  currentScreen: "main-menu"
};

function showScreen(id) {
  screens.forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  state.currentScreen = id;
}

function loadSaves() {
  return JSON.parse(localStorage.getItem("primalSaves")) || {};
}

function saveAll(saves) {
  localStorage.setItem("primalSaves", JSON.stringify(saves));
}

document.getElementById("btn-enter").onclick = () => {
  document.getElementById("btn-enter").style.display = "none";
  showScreen("main-menu");
  music.play();
};

document.getElementById("btn-new-game").onclick = () => {
  showScreen("screen-new-game");
};

document.getElementById("btn-load-game").onclick = () => {
  const list = document.getElementById("save-list");
  list.innerHTML = "";
  const saves = loadSaves();

  Object.keys(saves).forEach(name => {
    const row = document.createElement("div");
    const loadBtn = document.createElement("button");
    loadBtn.textContent = "✔";
    loadBtn.className = "btn";

    loadBtn.onclick = () => {
      Object.assign(state, saves[name]);
      showScreen("screen-prologue");
      document.getElementById("btn-save-exit").disabled = false;
      music.pause();
    };

    const delBtn = document.createElement("button");
    delBtn.textContent = "✖";
    delBtn.className = "btn";

    delBtn.onclick = () => {
      delete saves[name];
      saveAll(saves);
      document.getElementById("btn-load-game").click();
    };

    row.textContent = name + " ";
    row.append(loadBtn, delBtn);
    list.appendChild(row);
  });

  showScreen("screen-load-game");
};

document.getElementById("btn-create-save").onclick = () => {
  const name = document.getElementById("new-save-name").value.trim();
  if (!name) return;

  state.saveName = name;
  const saves = loadSaves();
  saves[name] = { ...state };
  saveAll(saves);

  document.getElementById("btn-save-exit").disabled = false;
  showScreen("screen-prologue");
  music.pause();
};

document.getElementById("btn-save-exit").onclick = () => {
  const saves = loadSaves();
  saves[state.saveName] = { ...state };
  saveAll(saves);
  location.reload();
};

document.querySelectorAll(".btn-back").forEach(btn => {
  btn.onclick = () => showScreen(btn.dataset.back);
});

document.getElementById("btn-export").onclick = () => {
  const data = localStorage.getItem("primalSaves");
  const blob = new Blob([data], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "primal_saves.json";
  a.click();
};

document.getElementById("btn-import").onclick = () => {
  document.getElementById("import-file").click();
};

document.getElementById("import-file").onchange = e => {
  const reader = new FileReader();
  reader.onload = () => {
    localStorage.setItem("primalSaves", reader.result);
    alert("Importado correctamente");
  };
  reader.readAsText(e.target.files[0]);
};

document.getElementById("btn-mute").onclick = () => {
  music.muted = !music.muted;
};
