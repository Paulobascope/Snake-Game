(() => {
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');
  const scoreEl = document.getElementById('score');
  const gameOverEl = document.getElementById('game-over');
  const restartBtn = document.getElementById('restart-btn');

  const width = canvas.width;
  const height = canvas.height;
  const cellSize = 20;
  const cols = Math.floor(width / cellSize);
  const rows = Math.floor(height / cellSize);

  let snake;
  let food;
  let score;
  let direction;
  let nextDirection;
  let gameInterval;
  const speed = 120; // ms per move

  function init() {
    const midX = Math.floor(cols / 2);
    const midY = Math.floor(rows / 2);

    snake = [
      { x: midX, y: midY },
      { x: midX - 1, y: midY },
      { x: midX - 2, y: midY },
    ];
    direction = 'RIGHT';
    nextDirection = 'RIGHT';
    score = 0;
    placeFood();
    updateScore();
    gameOverEl.style.display = 'none';

    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, speed);
  }

  function placeFood() {
    let valid = false;
    while (!valid) {
      food = {
        x: Math.floor(Math.random() * cols),
        y: Math.floor(Math.random() * rows),
      };
      valid = !snake.some(seg => seg.x === food.x && seg.y === food.y);
    }
  }

  function updateScore() {
    scoreEl.textContent = 'Score ' + score;
  }

  function draw() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);

    // Snake
    for (let i = 0; i < snake.length; i++) {
      const seg = snake[i];
      ctx.fillStyle = i === 0 ? '#00d4ff' : '#0077b6';
      ctx.shadowColor = '#00d4ff';
      ctx.shadowBlur = 8;
      ctx.fillRect(seg.x * cellSize, seg.y * cellSize, cellSize, cellSize);
      ctx.shadowBlur = 0;
    }

    // Food
    ctx.fillStyle = '#ff4b5c';
    ctx.shadowColor = '#ff4b5c';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    const centerX = food.x * cellSize + cellSize / 2;
    const centerY = food.y * cellSize + cellSize / 2;
    const radius = cellSize / 2.5;
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  function checkCollision(head) {
    // Wall
    if (head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows) {
      return true;
    }
    // Self
    for (let i = 1; i < snake.length; i++) {
      if (head.x === snake[i].x && head.y === snake[i].y) {
        return true;
      }
    }
    return false;
  }

  function gameOver() {
    clearInterval(gameInterval);
    gameOverEl.style.display = 'block';
  }

  function gameLoop() {
    // Change direction if valid
    if (
      (direction === 'UP' && nextDirection !== 'DOWN') ||
      (direction === 'DOWN' && nextDirection !== 'UP') ||
      (direction === 'LEFT' && nextDirection !== 'RIGHT') ||
      (direction === 'RIGHT' && nextDirection !== 'LEFT')
    ) {
      direction = nextDirection;
    }

    const head = { ...snake[0] };
    switch (direction) {
      case 'UP': head.y -= 1; break;
      case 'DOWN': head.y += 1; break;
      case 'LEFT': head.x -= 1; break;
      case 'RIGHT': head.x += 1; break;
    }

    if (checkCollision(head)) {
      gameOver();
      return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      score++;
      updateScore();
      placeFood();
    } else {
      snake.pop();
    }

    draw();
  }

  function setDirection(dir) {
    nextDirection = dir;
  }

  // Keyboard
  window.addEventListener('keydown', e => {
    if (e.repeat) return;
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        setDirection('UP');
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        setDirection('DOWN');
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        setDirection('LEFT');
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        setDirection('RIGHT');
        break;
    }
  });

  // Touch + Click
  ['up', 'down', 'left', 'right'].forEach(dir => {
    document.getElementById(dir).addEventListener('touchstart', e => {
      e.preventDefault();
      setDirection(dir.toUpperCase());
    });
    document.getElementById(dir).addEventListener('click', () => {
      setDirection(dir.toUpperCase());
    });
  });

  restartBtn.addEventListener('click', init);

  // Focus canvas for keyboard use
  canvas.focus();

  // Start game
  init();
})();
