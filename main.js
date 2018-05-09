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

// Shape Constructor function
function Shape(x, y, velX, velY, exists) {
  this.x = x;
  this.y = y;
  this.velX = velX;
  this.velY = velY;
  this.exists = exists;
}

// Ball Constructor function - we are inheriting x, y, velX, velY from Shape
function Ball(x, y, velX, velY, exists, color, size) {
  Shape.call(this, x, y, velX, velY, exists);
  this.color = color;
  this.size = size;
}

// Making sure to set our prototype chain
Ball.prototype = Object.create(Shape.prototype);
// Making usre to map the Ball contructor to the Ball object
Ball.prototype.constructor = Ball;

// First method - draw our ball
Ball.prototype.draw = function() {
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.fill();
};

// Update our ball
Ball.prototype.update = function() {
  // Is the ball going off the right side of the screen? If so, change direction.
  if ((this.x + this.size) >= width) {
    this.velX = -(this.velX);
  }

  // Is the ball going off the left side of the screen? If so, change direction.
  if ((this.x - this.size) <= 0) {
    this.velX = -(this.velX);
  }

  // Is the ball going off the bottom of the screen? If so, change direction.
  if ((this.y + this.size) >= height) {
    this.velY = -(this.velY);
  }

  // Is the ball going off the top of the screen? If so, change direction.
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

// Evil Circle Constructor function - we are inheriting x, y, velX, velY from Shape
function EvilCircle(x, y, velX, velY, exists, color, size) {
  Shape.call(this, x, y, 20, 20, exists);
  this.color = color;
  this.size = size;
}

// Making sure to set our prototype chain
EvilCircle.prototype = Object.create(Shape.prototype);

// Making sure to map the EvilCircle contructor to the EvilCircle object
EvilCircle.prototype.constructor = EvilCircle;

// Draw the Evil Circle
EvilCircle.prototype.draw = function() {
  ctx.beginPath();
  ctx.lineWidth = 3;
  ctx.strokeStyle = this.color; // Just a line, not a full circle
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.stroke(); // just a line, not a full circle
};

EvilCircle.prototype.checkBounds = function() {
  // Is the ball going off the right side of the screen?
  if ((this.x + this.size) >= width) {
    this.x -= (this.size);
  }

  // Is the ball going off the left side of the screen?
  if ((this.x - this.size) <= 0) {
    this.x += (this.size);
  }

  // Is the ball going off the bottom of the screen?
  if ((this.y + this.size) >= height) {
    this.y -= (this.size);
  }

  // Is the ball going off the top of the screen?
  if ((this.y - this.size) <= 0) {
    this.y += (this.size);
  }

};

EvilCircle.prototype.setControls = function() {
  var _this = this;
  window.onkeydown = function(e) {
    if (e.keyCode === 65) {
      _this.x -= _this.velX;
    } else if (e.keyCode === 68) {
      _this.x += _this.velX;
    } else if (e.keyCode === 87) {
      _this.y -= _this.velY;
    } else if (e.keyCode === 83) {
      _this.y += _this.velY;
    }
  };
};

EvilCircle.prototype.collisionDetect = function() {
  for (var j = 0; j < balls.length; j++) {
    if (balls[j].exists) {
      var dx = this.x - balls[j].x;
      var dy = this.y - balls[j].y;
      var distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + balls[j].size) {
        balls[j].exists = false;
      }
    }
  }
};

// Create the Evil circle
var evilCircle = new EvilCircle(
  random(0, width),
  random(0, height),
  random(-7, 7),
  random(-7, 7),
  true,
  'white',
  10
);

// Let us control it with A, S, D, F
evilCircle.setControls();


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
      true,
      'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) +')',
      random(10,20)
    );
    // Add 25 balls of random widths/heights/speed/colors to the array
    balls.push(ball);
  }

  // Now that we have our array of balls, let's draw them and update them, and change their colors when they collide
  for (var i = 0; i < balls.length; i++) {
    if (balls[i].exists) {
      balls[i].draw();
      balls[i].update();
      balls[i].collisionDetect();
    }
  }

  requestAnimationFrame(letThereBeBalls);
  evilCircle.draw();
  evilCircle.checkBounds();
  evilCircle.collisionDetect();

}

letThereBeBalls();