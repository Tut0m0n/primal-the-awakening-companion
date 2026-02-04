// Manejo de personajes
let character = {
  name: "Héroe",
  hp: 20
};

function takeDamage(amount) {
  character.hp -= amount;
  localStorage.setItem("hp", character.hp);
  updateUI();
}

function loadCharacter() {
  const savedHP = localStorage.getItem("hp");
  if (savedHP !== null) {
    character.hp = parseInt(savedHP);
  }
}
