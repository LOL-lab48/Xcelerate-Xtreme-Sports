// ------------------ Prevent scrolling inside arcade ------------------
document.addEventListener('wheel', e => {
  if (e.target.closest('#arcade-container')) e.preventDefault();
}, { passive: false });

// ------------------ Arcade Tab Switch ------------------
function showArcadeTab(game) {
  const container = document.getElementById('arcade-container');
  container.innerHTML = '';

  switch(game) {
    case 'snake':
      container.innerHTML = `<div class="game-box"><canvas id="snakeCanvas" width="300" height="300"></canvas></div>`;
      initSnake();
      break;
    case 'tictactoe':
      container.innerHTML = `<div class="game-box"><div id="tttBoard"></div></div>`;
      initTicTacToe();
      break;
    case '2048':
      container.innerHTML = `<div class="game-box"><div id="game2048"></div></div>`;
      init2048();
      break;
    case 'reaction':
      container.innerHTML = `<div class="game-box"><div id="reactionBox">Click when it turns green!</div><p id="reactionTime">Your time: --</p></div>`;
      initReactionTime();
      break;
    case 'weather':
      container.innerHTML = `<div class="game-box"><p id="weather">Loading weather...</p></div>`;
      showWeather();
      break;
  }
}

// ------------------ Snake Game ------------------
function initSnake() {
  const canvas = document.getElementById('snakeCanvas');
  const ctx = canvas.getContext('2d');
  const scale = 20;
  const rows = canvas.height / scale;
  const cols = canvas.width / scale;

  let snake = [{ x: 10, y: 10 }];
  let direction = { x: 0, y: 0 };
  let nextDirection = { x: 0, y: 0 };
  let apple = placeApple();
  let gameOver = false;

  function placeApple() {
    let pos;
    do {
      pos = { x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) };
    } while (snake.some(s => s.x === pos.x && s.y === pos.y));
    return pos;
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
    if (gameOver) return;

    direction = nextDirection;

    if (direction.x === 0 && direction.y === 0) return;

    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    if (
      head.x < 0 || head.y < 0 || head.x >= cols || head.y >= rows ||
      snake.some(s => s.x === head.x && s.y === head.y)
    ) {
      gameOver = true;
      clearInterval(gameLoop);
      alert('Game Over!');
      return;
    }

    snake.unshift(head);

    if (head.x === apple.x && head.y === apple.y) {
      apple = placeApple();
    } else {
      snake.pop();
    }

    draw();
  }

  function keyHandler(e) {
    switch(e.key) {
      case 'ArrowUp': if(direction.y !== 1) nextDirection = { x:0, y:-1 }; break;
      case 'ArrowDown': if(direction.y !== -1) nextDirection = { x:0, y:1 }; break;
      case 'ArrowLeft': if(direction.x !== 1) nextDirection = { x:-1, y:0 }; break;
      case 'ArrowRight': if(direction.x !== -1) nextDirection = { x:1, y:0 }; break;
    }
  }

  document.removeEventListener('keydown', keyHandler);
  document.addEventListener('keydown', keyHandler);

  let gameLoop = setInterval(update, 150);
  draw();
}

// ------------------ Tic Tac Toe ------------------
function initTicTacToe() {
  const board = document.getElementById('tttBoard');
  board.innerHTML = '';
  let cells = Array(9).fill(null);
  let human = 'X', ai = 'O';

  function render() {
    board.innerHTML = '';
    cells.forEach((cell, idx) => {
      const btn = document.createElement('button');
      btn.className = 'tttCell';
      btn.textContent = cell || '';
      btn.onclick = () => humanMove(idx);
      board.appendChild(btn);
    });
  }

  function humanMove(idx) {
    if(cells[idx] || checkWinner()) return;
    cells[idx] = human;
    if(!checkWinner()) aiMove();
    render();
  }

  function aiMove() {
    const empty = cells.map((c,i)=>c===null?i:null).filter(v=>v!==null);
    if(!empty.length) return;
    const choice = empty[Math.floor(Math.random()*empty.length)];
    cells[choice] = ai;
  }

  function checkWinner() {
    const wins = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ];
    for (let combo of wins) {
      if(cells[combo[0]] && cells[combo[0]] === cells[combo[1]] && cells[combo[1]] === cells[combo[2]]) {
        setTimeout(()=>alert(`${cells[combo[0]]} wins!`), 10);
        return true;
      }
    }
    if(cells.every(c=>c)) {
      setTimeout(()=>alert('Draw!'), 10);
      return true;
    }
    return false;
  }

  render();
}

// ------------------ 2048 ------------------
function init2048() {
  const game = document.getElementById('game2048');
  game.innerHTML = '';
  let grid = Array(16).fill(0);

  function render() {
    game.innerHTML = '';
    grid.forEach(num=>{
      const cell = document.createElement('div');
      cell.className = 'gridCell';
      cell.textContent = num||'';
      game.appendChild(cell);
    });
  }

  function addRandom() {
    const empty = grid.map((v,i)=>v===0?i:null).filter(v=>v!==null);
    if(!empty.length) return;
    grid[empty[Math.floor(Math.random()*empty.length)]] = 2;
  }

  function moveLeft(grid){
    for(let r=0;r<4;r++){
      let row=grid.slice(r*4,r*4+4).filter(n=>n);
      for(let i=0;i<row.length-1;i++){
        if(row[i]===row[i+1]) { row[i]*=2; row[i+1]=0; }
      }
      row=row.filter(n=>n);
      while(row.length<4) row.push(0);
      for(let c=0;c<4;c++) grid[r*4+c]=row[c];
    }
  }

  function transpose(arr){
    let t=Array(16).fill(0);
    for(let r=0;r<4;r++) for(let c=0;c<4;c++) t[c*4+r]=arr[r*4+c];
    return t;
  }

  function move(dir){
    switch(dir){
      case 'ArrowLeft': moveLeft(grid); break;
      case 'ArrowRight': grid.reverse(); moveLeft(grid); grid.reverse(); break;
      case 'ArrowUp': grid=transpose(grid); moveLeft(grid); grid=transpose(grid); break;
      case 'ArrowDown': grid=transpose(grid).reverse(); moveLeft(grid); grid.reverse(); grid=transpose(grid); break;
    }
    addRandom(); render();
  }

  addRandom(); addRandom(); render();

  document.onkeydown = (e)=>{
    if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){
      move(e.key);
      e.preventDefault();
    }
  };
}

// ------------------ Reaction Time ------------------
function initReactionTime() {
  const box = document.getElementById('reactionBox');
  const output = document.getElementById('reactionTime');
  let timeout, startTime;

  function start() {
    box.style.background = '#000';
    box.style.color = '#0f0';
    box.textContent = 'Wait for green...';
    timeout = setTimeout(() => {
      box.style.background = '#0f0';
      box.style.color = '#000';
      box.textContent = 'CLICK!';
      startTime = Date.now();
    }, Math.random() * 3000 + 1000);
  }

  box.onclick = () => {
    if(box.textContent==='CLICK!'){
      let reaction = Date.now() - startTime;
      output.textContent = `Your time: ${reaction} ms`;
      start();
    } else {
      clearTimeout(timeout);
      output.textContent = 'Too soon!';
      start();
    }
  }

  start();
}

// ------------------ Weather ------------------
function showWeather() {
  const weatherElement = document.getElementById('weather');
  const messages = [
    "Today's forecast: 100% chance of fun!",
    "It’s raining laughter!",
    "Weather in your area is 99% random.",
    "Hot like your gaming skills!",
    "Sunny days and cool nights!",
    "Good vibes all around!"
  ];
  weatherElement.textContent = messages[Math.floor(Math.random()*messages.length)];
}
