var scoreHTML = document.getElementById('score');
var introEl = document.getElementById("intro-screen");
var statsEl = document.getElementById("stats");
var winningScreenEl = document.getElementById("winning-screen");
var losingScreenEl = document.getElementById("losing-screen");

// Enemies our player must avoid
var Enemy = function(x, speed) {
  // The image/sprite for our enemies, this uses
  // a helper we've provided to easily load images
  this.sprite = 'images/enemy-bug.png';
  this.x = this.createX();
  this.y = this.createY();
  this.speed = this.createSpeed();
};

// Check for collisions. In this case you input the one player object directly
Enemy.prototype.collidedWithPlayer = function() {
  return checkCollision(player, this);
};

// Randomly place the bug in one of three 'tracks', spread across the X axys with random speeds
Enemy.prototype.createY = function() {
  return (85 * (Math.floor(Math.random() * 3)) + 45);
};

Enemy.prototype.createX = function() {
  return Math.floor((Math.random() * 400) - 100);
};

Enemy.prototype.createSpeed = function() {
  return Math.floor((Math.random() * 150) + 100);
};

// Update the enemy's position
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
  // You should multiply any movement by the dt parameter
  // which will ensure the game runs at the same speed for
  // all computers.

  this.x = this.x + this.speed * dt;
  if (this.x > 500) {
    this.x = Math.floor((Math.random() * 100) - 200);
    this.speed = this.createSpeed();
    this.y = this.createY();
  }
  //check for collisions
  if (this.hasCollidedWithPlayer()) {
    updateAfterCollision();
    createEnemies();
  }
};

Enemy.prototype.hasCollidedWithPlayer = function() {
  return player.x < this.x + 70 &&
    player.x + 70 > this.x &&
    player.y < this.y + 30 &&
    player.y + 40 > this.y;
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


// Player object
var Player = function() {
  // Variables applied to each of our instances go here,
  // we've provided one for you to get started

  // The image/sprite for our enemies, this uses
  // a helper we've provided to easily load images
  this.sprite = 'images/char-boy.png';
  this.startingX = 200;
  this.startingY = 400;
  this.x = this.startingX;
  this.y = this.startingY;
  this.startingLives = 3;
  this.lives = this.startingLives;
  this.score = 0;
  this.livesSprite = 'images/heart.png';
};
// Every time the player respawns
Player.prototype.restartPosition = function() {
  this.x = this.startingX;
  this.y = this.startingY;
};

// What happens when player loses a life.
Player.prototype.loseLife = function() {
  player.lives -= 1;
  renderHearts(player);
  player.restartPosition();
};

Player.prototype.update = function(dt) {};

// Render player
Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Everytime the players reaches the water
Player.prototype.reachedGoal = function() {
    if (this.score === 9) {
      showWinningScreen();
      restartGame();
    } else {
      nextLevel();
    }
};

// Handle the keys taking into accound the 'walls' and water. This way works given the simplicity of the game
Player.prototype.handleInput = function(key) {
  if (key === "right" && this.x < 350) {
    this.x = this.x + 101;
  } else if (key === "left" && this.x > 50) {
    this.x = this.x - 101;
  } else if (key === "down" && this.y < 350) {
    this.y = this.y + 85;
  } else if (key === "up" && this.y > 100) {
    this.y = this.y - 85;
  } else if (key === "up" && this.y < 100) {

    this.reachedGoal();
  }
};

// What happens when the player touches a bug
var updateAfterCollision = function() {
  if (player.lives === 1) {
    showLosingScreen();
    restartGame();
  } else {
    player.loseLife();
  }
};

// Show winning screen
var showWinningScreen = function() {
  winningScreenEl.style.display = 'block';
  statsEl.style.display = 'none';
  canvas.style.display = 'none';
};

//Show losing screen
var showLosingScreen = function() {
  losingScreenEl.style.display = 'block';
  statsEl.style.display = 'none';
  canvas.style.display = 'none';
};


// What happens when player passes to next level
var nextLevel = function() {
  enemiesQty += 1;
  player.score = player.score + 1;
  scoreHTML.innerHTML = player.score;
  player.restartPosition();
  createEnemies();
};

// Restart game
var restartGame = function() {
  enemiesQty = startingEnemies;
  player.score = 0;
  player.lives = player.startingLives;
  player.restartPosition();
  renderHearts(player);
  createEnemies();
  scoreHTML.innerHTML = player.score;
};

// Now instantiate objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var player = new Player();

var allEnemies = [];
var startingEnemies = 2;
// The enemiesQty var increases over time
var enemiesQty = startingEnemies;
var createEnemies = function() {
  allEnemies.length = 0;
  for (var n = 0; n < enemiesQty; n++) {
    var enemy = new Enemy();
    allEnemies.push(enemy);
  }
};

createEnemies();

// Deals with the rendering of the hearts (lives)
var renderHearts = function(obj) {
  var livesHTML = document.getElementById('lives');
  livesHTML.innerHTML = "";
  for (var n = 0; n < obj.lives; n++) {
    var heartSprite = document.createElement('img');
    heartSprite.width = 30;
    heartSprite.src = "images/Heart.png";

    livesHTML.appendChild(heartSprite);
  }
};

renderHearts(player);


// This listens for key presses and sends the keys to
// Player.handleInput() method.
document.addEventListener('keyup', function(e) {
  var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };

  player.handleInput(allowedKeys[e.keyCode]);
});

//Add listeners to the buttons to start/restart the game
var buttons = document.getElementsByClassName("start-button");
for (var n = 0; n < buttons.length; n++) {
  buttons[n].addEventListener('click', function(e) {
    e.preventDefault();
    winningScreenEl.style.display = 'none';
    losingScreenEl.style.display = 'none';
    introEl.style.display = 'none';
    statsEl.style.display = 'block';
    canvas.style.display = 'inline';
  });
}
