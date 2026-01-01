// Prevent scrolling inside arcade
document.addEventListener('wheel', e => {
  if (e.target.closest('#arcade-container')) e.preventDefault();
}, { passive: false });

// ---------------- Arcade Tabs ----------------
function showArcadeTab(game) {
  const container = document.getElementById('arcade-container');
  container.innerHTML = '';

  if (game === 'snake') {
    container.innerHTML = `<div class="game-box"><canvas id="snakeCanvas" width="300" height="300"></canvas></div>`;
    initSnake();
  }
  if (game === 'tictactoe') {
    container.innerHTML = `<div class="game-box"><div id="tttBoard"></div></div>`;
    initTicTacToe();
  }
  if (game === '2048') {
    container.innerHTML = `<div class="game-box"><div id="game2048"></div></div>`;
    init2048();
  }
  if (game === 'reaction') {
    container.innerHTML = `<div class="game-box"><div id="reactionBox">Wait for green...</div><p id="reactionTime">Your time: --</p></div>`;
    initReactionTime();
  }
}

// ---------------- Snake ----------------
let snakeDir = { x: 0, y: 0 };
let snakeNext = { x: 0, y: 0 };

document.addEventListener('keydown', e => {
  if (!document.getElementById('snakeCanvas')) return;
  if (e.key === 'ArrowUp' && snakeDir.y !== 1) snakeNext = { x: 0, y: -1 };
  if (e.key === 'ArrowDown' && snakeDir.y !== -1) snakeNext = { x: 0, y: 1 };
  if (e.key === 'ArrowLeft' && snakeDir.x !== 1) snakeNext = { x: -1, y: 0 };
  if (e.key === 'ArrowRight' && snakeDir.x !== -1) snakeNext = { x: 1, y: 0 };
});

function initSnake() {
  const canvas = document.getElementById('snakeCanvas');
  const ctx = canvas.getContext('2d');
  const scale = 20;
  const cols = canvas.width / scale;
  const rows = canvas.height / scale;

  let snake = [{ x: 10, y: 10 }];
  snakeDir = { x: 0, y: 0 };
  snakeNext = { x: 0, y: 0 };
  let apple = randomApple();

  function randomApple() {
    return { x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) };
  }

  function draw() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#0f0';
    snake.forEach(s => ctx.fillRect(s.x * scale, s.y * scale, scale, scale));
    ctx.fillStyle = '#f00';
    ctx.fillRect(apple.x * scale, apple.y * scale, scale, scale);
  }

  function update() {
    snakeDir = snakeNext;
    if (!snakeDir.x && !snakeDir.y) return;

    const head = { x: snake[0].x + snakeDir.x, y: snake[0].y + snakeDir.y };
    if (head.x < 0 || head.y < 0 || head.x >= cols || head.y >= rows) return alert('Game Over');

    snake.unshift(head);
    if (head.x === apple.x && head.y === apple.y) apple = randomApple();
    else snake.pop();

    draw();
  }

  setInterval(update, 150);
  draw();
}

// ---------------- Tic Tac Toe ----------------
function initTicTacToe() {
  const board = document.getElementById('tttBoard');
  let cells = Array(9).fill(null);
  let player = 'X';

  function render() {
    board.innerHTML = '';
    cells.forEach((c, i) => {
      const btn = document.createElement('button');
      btn.className = 'tttCell';
      btn.textContent = c || '';
      btn.onclick = () => {
        if (!cells[i]) {
          cells[i] = player;
          player = player === 'X' ? 'O' : 'X';
          render();
        }
      };
      board.appendChild(btn);
    });
  }
  render();
}

// ---------------- 2048 ----------------
function init2048() {
  const game = document.getElementById('game2048');
  let grid = Array(16).fill(0);

  function draw() {
    game.innerHTML = '';
    grid.forEach(n => {
      const d = document.createElement('div');
      d.className = 'gridCell';
      d.textContent = n || '';
      game.appendChild(d);
    });
  }

  grid[Math.floor(Math.random() * 16)] = 2;
  grid[Math.floor(Math.random() * 16)] = 2;
  draw();
}

// ---------------- Reaction Time ----------------
function initReactionTime() {
  const box = document.getElementById('reactionBox');
  const out = document.getElementById('reactionTime');
  let start;

  function go() {
    box.style.background = '#000';
    setTimeout(() => {
      box.style.background = '#0f0';
      start = Date.now();
    }, Math.random() * 3000 + 1000);
  }

  box.onclick = () => {
    out.textContent = `Your time: ${Date.now() - start} ms`;
    go();
  };

  go();
}
