let words = [];
let drawnWords = [];
let spinning = false;

function loadFromFile() {
  const fileInput = document.getElementById("file-input");
  const file = fileInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const lines = e.target.result.split(/\r?\n/).map(line => line.trim()).filter(line => line);
    const wordListDiv = document.getElementById("word-list");
    wordListDiv.innerHTML = ""; // 既存の入力欄をクリア
    lines.forEach(word => {
      const input = document.createElement("input");
      input.type = "text";
      input.value = word;
      wordListDiv.appendChild(input);
    });
  };
  reader.readAsText(file);
}

function addWord() {
  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "単語を入力";
  document.getElementById("word-list").appendChild(input);
}

function startDraw() {
  const inputs = document.querySelectorAll("#word-list input");
  words = Array.from(inputs)
    .map(input => input.value.trim())
    .filter(word => word !== "");
  if (words.length === 0) {
    alert("単語を1つ以上入力してください。");
    return;
  }
  updateRemainingList();
  updateDrawnList();
  document.getElementById("setup-screen").style.display = "none";
  document.getElementById("draw-screen").style.display = "block";
}

function drawWord() {
  if (spinning || words.length === 0) return;
  spinning = true;
  const slot = document.getElementById("slot-display");
  const spinSound = document.getElementById("spin-sound");
  const dingSound = document.getElementById("ding-sound");

  spinSound.play();
  let count = 0;
  const interval = setInterval(() => {
    slot.textContent = words[Math.floor(Math.random() * words.length)];
    count++;
    if (count > 30) {
      clearInterval(interval);
      const index = Math.floor(Math.random() * words.length);
      const selected = words.splice(index, 1)[0];
      drawnWords.push(selected);
      slot.textContent = selected;
      spinSound.pause();
      spinSound.currentTime = 0; // 再生位置を先頭に戻す
      dingSound.play();
      updateRemainingList();
      updateDrawnList();
      spinning = false;
    }
  }, 100);
}

function updateRemainingList() {
  const ul = document.getElementById("remaining-list");
  ul.innerHTML = words.map(word => `<li>${word}</li>`).join("");
}

function updateDrawnList() {
  const ul = document.getElementById("drawn-list");
  ul.innerHTML = drawnWords.map(word => `<li>${word}</li>`).join("");
}
