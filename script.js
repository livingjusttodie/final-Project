const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let player = {
  x: canvas.width / 2,
  y: canvas.height - 50,
  width: 30,
  height: 30,
  dx: 0, // Horizontal speed
  dy: 0, // Vertical speed
  speed: 5
};

let spikes = [];
let arrows = [];
let gameOver = false;
let score = 0;
let arrowCountdown = 3; // Countdown for arrows
let gameTime = 6000; // Initial game time in seconds
let countdown = 3; // Countdown before game starts work in progress
let gameStarted = false; // Flag to check if the game has started
let gamePaused = false; // Flag to check if the game is paused
//code to make the spikes 
function generateSpike() {
  const x = Math.random() * (canvas.width - 50) + 25;
  const y = -50;
  spikes.push({ x: x, y: y, width: 30, height: 30 });
}
//code to make the arrows
function generateArrow() {
  const x = Math.random() * (canvas.width - 50) + 25;
  const y = canvas.height;
  arrows.push({ x: x, y: y, width: 10, height: 20, countdown: 3 }); 
}
//the code to make the player colors included 
function drawPlayer() {
  ctx.fillStyle = 'blue';
  ctx.fillRect(player.x, player.y, player.width, player.height);
}
//the height and width for the spikes 
function drawSpikes() {
  ctx.fillStyle = 'red';
  spikes.forEach(spike => {
    ctx.beginPath();
    ctx.moveTo(spike.x, spike.y);
    ctx.lineTo(spike.x + spike.width / 2, spike.y + spike.height);
    ctx.lineTo(spike.x + spike.width, spike.y);
    ctx.closePath();
    ctx.fill();
  });
}

function drawArrows() {
  ctx.fillStyle = 'red';
  arrows.forEach(arrow => {
    ctx.beginPath();
    ctx.moveTo(arrow.x, arrow.y);
    ctx.lineTo(arrow.x + arrow.width / 2, arrow.y - arrow.height);
    ctx.lineTo(arrow.x + arrow.width, arrow.y);
    ctx.closePath();
    ctx.fill();
  });
}

function updateSpikes() {
  spikes.forEach((spike, index) => {
    spike.y += 15;
    if (spike.y > canvas.height) {
      spikes.splice(index, 1);
      generateSpike();
      score++;
    }
  });
}

function updateArrows() {
  arrows.forEach((arrow, index) => {
    // Countdown for arrow
    arrow.countdown--;
    if (arrow.countdown <= 0) {
      arrow.y -= 15;
      if (arrow.y < 0) {
        arrows.splice(index, 1);
        generateArrow();
      }
    }
  });
}
//code to check collision
function checkCollision() {
  spikes.forEach(spike => {
    if (
      player.x < spike.x + spike.width &&
      player.x + player.width > spike.x &&
      player.y < spike.y + spike.height &&
      player.y + player.height > spike.y
    ) {
      gameOver = true;
    }
  });

  arrows.forEach(arrow => {
    if (
      player.x < arrow.x + arrow.width &&
      player.x + player.width > arrow.x &&
      player.y < arrow.y + arrow.height &&
      player.y + player.height > arrow.y
    ) {
      gameOver = true;
    }
  });
}
//the code for the game over screens 
function update() {
  if (gameOver) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = '30px Arial';
    ctx.fillStyle = 'red';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over! Score: ' + score, canvas.width / 2, canvas.height / 2);
    return;
  }
//the countdown dont work 
  if (!gameStarted) {
    // Countdown before game starts
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = '50px Arial';
    ctx.fillStyle = 'blue';
    ctx.textAlign = 'center';
    ctx.fillText(countdown, canvas.width / 2, canvas.height / 2);

    countdown--;
    if (countdown < 0) {
      gameStarted = true;
      countdown = 3; // Reset countdown for next time
      generateSpike(); // Generate the first spike when the game starts
      generateArrow(); // Generate the first arrow when the game starts
    }
    requestAnimationFrame(update);
    return;
  }
//pause working dont got a unpause tho 
  if (gamePaused) {
    ctx.font = '30px Arial';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.fillText('Paused', canvas.width / 2, canvas.height / 2);
    return; // Don't update the game if paused
  }

  // Update game timer
  gameTime--;
  if (gameTime <= 0) {
    gameOver = true;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Update player position
  player.x += player.dx;
  player.y += player.dy;

  // Keep player within canvas boundaries
  if (player.x < 0) {
    player.x = 0;
  } else if (player.x > canvas.width - player.width) {
    player.x = canvas.width - player.width;
  }

  if (player.y < 0) {
    player.y = 0;
  } else if (player.y > canvas.height - player.height) {
    player.y = canvas.height - player.height;
  }

  // Draw game time in the middle of the canvas
  ctx.font = '30px Arial';
  ctx.fillStyle = 'black';
  ctx.textAlign = 'center';
  ctx.fillText('Time: ' + gameTime, canvas.width / 2, canvas.height / 2);

  drawPlayer();
  drawSpikes();
  drawArrows();
  updateSpikes();
  updateArrows();
  checkCollision();

  requestAnimationFrame(update);
}

function handleKeyPress(e) {
  if (e.key === 'ArrowUp') {
    player.dy = -player.speed;
  } else if (e.key === 'ArrowDown') {
    player.dy = player.speed;
  } else if (e.key === 'ArrowLeft') {
    player.dx = -player.speed;
  } else if (e.key === 'ArrowRight') {
    player.dx = player.speed;
  }
}

function handleKeyUp(e) {
  if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
    player.dy = 0;
  } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
    player.dx = 0;
  }
}

function togglePause() {
  gamePaused = !gamePaused;
}

// Initialize the game
generateSpike();
generateArrow();

// Event listeners for key presses
document.addEventListener('keydown', handleKeyPress);
document.addEventListener('keyup', handleKeyUp);

// Pause button event listener
document.addEventListener('click', function(event) {
  if (event.target.id === 'pauseButton') {
    togglePause();
  }
});

// Start the game loop
update();

// Inside update() function
arrows.forEach(arrow => {
  if (arrow.countdown > 4) {
    ctx.font = '20px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText(arrow.countdown, arrow.x, arrow.y - 20); // Draw countdown near arrow
  }
});

// Add a pause button to the HTML
let pauseButton = document.createElement('button');
pauseButton.id = 'pauseButton';
pauseButton.textContent = 'Pause';
document.body.appendChild(pauseButton);