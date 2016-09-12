window.onload = function() {
    var canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    var gravity = 9.81;
    var balls = [];
    var ballCollision = false;
    var sideCollision = true;
    var roofCollision = true;
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;

    // Bind o click on the canvas to create a new ball
    canvas.onclick = function(e) {
      var px = e.pageX,
          py = e.pageY,
          xv = randomSpeed(0.75),
          yv = -randomSpeed(5),
          size = 4,
          elasticity = 0.75,
          colour = randomColour()
      balls.push(new createBall(px, py, xv, yv, size, elasticity, colour));
    }

    function randomSpeed(x) {
      // Fire balls with force greater than gravity
      // passing in a param so it fires at a reasonable angle
      return (x * 9.81) + (Math.random() * 50);
    }

    function randomSize() {
      // Generates a random ball size
      return (Math.random() * 10);
    }

    function resize() {
      /*
        This method is fired when the window is resized
        Repositions balls relative to new dimensions of the window
      */
      var heightRatio = window.innerHeight/canvas.height;
      var widthRatio = window.innerWidth/canvas.width;
      canvas.height = window.innerHeight;
      canvas.width = window.innerWidth;
      for (var i = 0; i < balls.length; i++){
        balls[i].y *= heightRatio;
        balls[i].x *= widthRatio;
      }

    }
    window.addEventListener('resize', resize, false);

    function circle(x, y, r, c) {
      // draw a circle
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI*2, true);
      ctx.closePath();
      // fill the path
      ctx.fillStyle = c;
      ctx.fill();
      // add a stroke to the circle
      ctx.lineWidth = r * 0.1;
      ctx.strokeStyle = "#000000";
      ctx.stroke();
    }

    function randomColour() {
      // Generate a random color based on HEX values
      var letters = "0123456789ABCDEF".split("");
      var colour = "#";
      for(var i = 0; i < 6; i++) {
        colour += letters[Math.round(Math.random() * 15)];
      }
      return colour;
    }

    // Draws a ball on the canvas. Called each frame.
    function drawBall() {
      // apply gravity to the ball.
      // Applying more than 9.81/60 each tick as it was too slow otherwise
      this.vy += gravity * 0.1; //v = a * t
      // move the ball along x and y axis
      this.x += this.vx * 0.1; // s = v * t
      this.y += this.vy * 0.1;
      circle(this.x, this.y, this.r, this.c);
    }

    function edgeCollision() {
      /*
        block of if statements to check if the ball has hit the sides, roof or floor
        bounce it away (invert velocity) and reduce speed by elasticity factor
      */
      if (sideCollision) {
        if (this.x + this.r > canvas.width) {
          this.x = canvas.width - this.r;
          this.vx *=  -1 * this.b;
          this.vy *= this.b;
        }
        if (this.x - this.r < 0 ) {
          this.x = this.r;
          this.vx *= -1 * this.b;
          this.vy *= this.b;
        }
      }
      if (roofCollision) {
        if (this.y - this.r < 0) {
          this.y = this.r;
          this.vy *= -1 * this.b;
          this.xy *= this.b;
        }
      }
      // This is bouncing off the floor so will always be on.
      if (this.y + this.r > canvas.height) {
        this.y = canvas.height - this.r;
        this.vy *= -1 * this.b;
        this.vx *= this.b;
      }

    }

    // This function handles collison between balls. Currently turned off.
    function collision() {
      for (var i = 0; i < balls.length; i++) {
        for (var j = i+1; j < balls.length; j++) {
          var dx = balls[i].x - balls[j].x;
          var dy = balls[i].y - balls[j].y;
          var minDistance = balls[i].r + balls[j].r;
          var distance = Math.sqrt((dx * dx) + (dy * dy));
          if (distance < minDistance) {
            // get the angle of collision
            var angle = Math.atan2(dy, dx),
            spread = minDistance - distance,
            ax = spread * Math.cos(angle),
            ay = spread * Math.sin(angle);

            // seperate balls after collision
            balls[i].x -= ax;
            balls[i].y -= ay;

            // handle change to speed on impact
            var change = 2;
            balls[i].vx -= change*Math.cos(angle);
            balls[i].vy -= change*Math.sin(angle);
            balls[j].vx += change*Math.cos(angle);
            balls[j].vy  += change*Math.sin(angle);
          }
        }
      }
    }

    // Creates a ball object
    function createBall(posX, posY, velX, velY, rad, bounce, colour) {
      this.x = posX;
      this.y = posY;
      this.vx = velX;
      this.vy = velY;
      this.r = rad;
      this.b = bounce;
      this.c = colour;
      this.draw = drawBall;
      this.edgeCollision = edgeCollision;
    }

    // Game loop, runs 60 times per second
    function gameLoop() {
      // Clear the whole canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // For every ball, draw them, check collions with wall/balls
      for (var i = 0; i < balls.length; i++) {
        balls[i].draw();
        balls[i].edgeCollision();
        if (ballCollision) collision();
      }
      // Add indicator for # of balls fired
      ctx.fillStyle = "#000000";
      ctx.font = "15px Arial";
      ctx.fillText("Balls: " + balls.length, 10, 20);
    }

    // Lets go!
    function init() {
      // 60fps
      return setInterval(gameLoop, 1000/60);
    }
    init();
}
