/* =====================================================
   VARIABLES GLOBALES
===================================================== */

let currentSave = null
let selectedCampaign = null
let playerCount = 0
let selectedCharacters = []
let playerNames = {}
let selectedDifficulty = null

const screens = document.querySelectorAll('.screen')

/* =====================================================
   UTILIDADES
===================================================== */

function showScreen(id) {
  screens.forEach(s => s.classList.remove('active'))
  document.getElementById(id).classList.add('active')
}

function toggleMusic() {
  const audio = document.getElementById('intro-music')
  const btn = document.getElementById('btn-mute')

  if (audio.paused) {
    audio.play()
    btn.textContent = '🔊'
  } else {
    audio.pause()
    btn.textContent = '🔇'
  }
}

/* =====================================================
   INICIO
===================================================== */

function enterApp() {
  document.getElementById('enter-container').classList.add('hidden')
  document.getElementById('main-menu').classList.remove('hidden')
  document.getElementById('btn-save-exit').classList.remove('hidden')

  const audio = document.getElementById('intro-music')
  audio.volume = 0.5
  audio.play()
}

/* =====================================================
   NUEVA PARTIDA
===================================================== */

function openNewGame() {
  document.getElementById('main-menu').classList.add('hidden')
  document.getElementById('new-game-container').classList.remove('hidden')
}

function cancelNewGame() {
  document.getElementById('new-game-container').classList.add('hidden')
  document.getElementById('main-menu').classList.remove('hidden')
}

function confirmNewGame() {
  const name = document.getElementById('new-save-name').value.trim()
  if (!name) return

  currentSave = {
    name,
    campaign: null,
    players: {},
    characters: [],
    difficulty: null
  }

  localStorage.setItem(`primal_${name}`, JSON.stringify(currentSave))
  selectedCharacters = []
  playerNames = {}

  showScreen('screen-campaign')
}

/* =====================================================
   CARGAR PARTIDA
===================================================== */

function openLoadGame() {
  document.getElementById('main-menu').classList.add('hidden')
  document.getElementById('save-list-container').classList.remove('hidden')
  loadSaveList()
}

function closeLoadGame() {
  document.getElementById('save-list-container').classList.add('hidden')
  document.getElementById('main-menu').classList.remove('hidden')
}

function loadSaveList() {
  const list = document.getElementById('save-list')
  list.innerHTML = ''

  Object.keys(localStorage)
    .filter(k => k.startsWith('primal_'))
    .forEach(key => {
      const save = JSON.parse(localStorage.getItem(key))

      const row = document.createElement('div')
      row.className = 'save-row'

      const name = document.createElement('span')
      name.textContent = save.name

      const loadBtn = document.createElement('button')
      loadBtn.textContent = '✔'
      loadBtn.onclick = () => loadGame(save.name)

      const deleteBtn = document.createElement('button')
      deleteBtn.textContent = '✖'
      deleteBtn.onclick = () => deleteGame(save.name)

      row.appendChild(name)
      row.appendChild(loadBtn)
      row.appendChild(deleteBtn)

      list.appendChild(row)
    })
}

function loadGame(name) {
  const data = localStorage.getItem(`primal_${name}`)
  if (!data) return

  currentSave = JSON.parse(data)
  selectedCampaign = currentSave.campaign
  selectedCharacters = currentSave.characters || []
  playerNames = currentSave.players || {}
  selectedDifficulty = currentSave.difficulty

  showScreen('screen-prologue')
}

function deleteGame(name) {
  localStorage.removeItem(`primal_${name}`)
  loadSaveList()
}

/* =====================================================
   CAMPAÑA
===================================================== */

function selectCampaign(type) {
  selectedCampaign = type
  currentSave.campaign = type
  saveProgress()
  showScreen('screen-players')
}

function backToStart() {
  showScreen('screen-start')
}

/* =====================================================
   JUGADORES
===================================================== */

function selectPlayers(count) {
  playerCount = count
  selectedCharacters = []
  document.getElementById('selected-count').textContent =
    `Seleccionados: 0 / ${playerCount}`

  showScreen('screen-characters')
}

/* =====================================================
   PERSONAJES
===================================================== */

function toggleCharacter(name) {
  if (selectedCharacters.includes(name)) {
    selectedCharacters = selectedCharacters.filter(c => c !== name)
  } else {
    if (selectedCharacters.length >= playerCount) return
    selectedCharacters.push(name)
  }

  document.getElementById('selected-count').textContent =
    `Seleccionados: ${selectedCharacters.length} / ${playerCount}`

  const btn = document.getElementById('btn-confirm')
  if (selectedCharacters.length === playerCount) {
    btn.disabled = false
    btn.classList.remove('disabled')
  } else {
    btn.disabled = true
    btn.classList.add('disabled')
  }
}

function confirmCharacters() {
  currentSave.characters = selectedCharacters
  saveProgress()
  buildNameInputs()
  showScreen('screen-names')
}

/* =====================================================
   NOMBRES
===================================================== */

function buildNameInputs() {
  const container = document.getElementById('names-container')
  container.innerHTML = ''

  selectedCharacters.forEach(char => {
    const input = document.createElement('input')
    input.placeholder = `Jugador (${char})`
    input.oninput = () => {
      playerNames[char] = input.value
      checkNames()
    }
    container.appendChild(input)
  })
}

function checkNames() {
  const filled = Object.values(playerNames).filter(v => v).length
  const btn = document.getElementById('btn-start-campaign')

  if (filled === selectedCharacters.length) {
    btn.disabled = false
    btn.classList.remove('disabled')
  } else {
    btn.disabled = true
    btn.classList.add('disabled')
  }
}

function goToDifficulty() {
  currentSave.players = playerNames
  saveProgress()
  showScreen('screen-difficulty')
}

/* =====================================================
   DIFICULTAD
===================================================== */

function selectDifficulty(level) {
  selectedDifficulty = level
  currentSave.difficulty = level
  saveProgress()
}

function goToPrologue() {
  showScreen('screen-prologue')
}

/* =====================================================
   GUARDADO
===================================================== */

function saveProgress() {
  if (!currentSave) return
  localStorage.setItem(
    `primal_${currentSave.name}`,
    JSON.stringify(currentSave)
  )
}

function saveAndExit() {
  saveProgress()
  location.reload()
}
