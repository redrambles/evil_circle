// setup canvas - canvas up the WHOLE browser window, yo.
var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

var width = canvas.width = window.innerWidth;
var height = canvas.height = window.innerHeight;

// function to generate random number
function random(min,max) {
  var num = Math.floor(Math.random()*(max-min)) + min;
  return num;
}

// Constructor function
function Ball(x, y, velX, velY, color, size) {
  this.x = x;
  this.y = y;
  this.velX = velX;
  this.velY = velY;
  this.color = color;
  this.size = size;
}

// First method - draw our ball
Ball.prototype.draw = function() {
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.fill();
};

// Update our ball
Ball.prototype.update = function() {
  // Is the ball going off the right side of the screen?
  if ((this.x + this.size) >= width) {
    this.velX = -(this.velX);
  }

  // Is the ball going off the left side of the screen?
  if ((this.x - this.size) <= 0) {
    this.velX = -(this.velX);
  }

  // Is the ball going off the bottom of the screen?
  if ((this.y + this.size) >= height) {
    this.velY = -(this.velY);
  }

  // Is the ball going off the top of the screen?
  if ((this.y - this.size) <= 0) {
    this.velY = -(this.velY);
  }

  this.x += this.velX;
  this.y += this.velY;
};

// Detect collisions and change colors of both balls when they collide
Ball.prototype.collisionDetect = function() {
  for (var j = 0; j < balls.length; j++) {
    if (!(this === balls[j])) {
      var dx = this.x - balls[j].x;
      var dy = this.y - balls[j].y;
      var distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + balls[j].size) {
        balls[j].color = this.color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) +')';
      }
    }
  }
};

// Let's create an array for all our balls
var balls = [];

function letThereBeBalls() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.fillRect(0, 0, width, height);

  while (balls.length < 25) {
    // create a new ball
    var ball = new Ball(
      random(0,width),
      random(0,height),
      random(-7,7),
      random(-7,7),
      'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) +')',
      random(10,20)
    );
    // add it to the array
    balls.push(ball);
  }

  // Now that we have our array of balls, let's draw them and update them, and change their colors when they collide
  for (var i = 0; i < balls.length; i++) {
    balls[i].draw();
    balls[i].update();
    balls[i].collisionDetect();
  }

  requestAnimationFrame(letThereBeBalls);
}



letThereBeBalls();

