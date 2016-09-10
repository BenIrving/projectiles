window.onload = function() {
    var canvas = document.getElementById('canvas');
    var ctx;
    var gravity = 9.81;
    var balls = [];
    var ballCollision = true;

    canvas.onclick = function(e) {
      var px = e.pageX,
          py = e.pageY,
          xv = randomSpeed(),
          yv = -randomSpeed(),
          size = 4,
          elasticity = 0.75,
          colour = randomColour()
      balls.push(new createBall(px, py, xv, yv, size, elasticity, colour));
      console.log(e.pageX);
    }

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function randomSpeed() {
      // Fire balls with force greater than gravity
      return 9.81 + (Math.random() * 50);
    }

    function randomSize() {
      return (Math.random() * 10);
    }

    function resizeCanvas(e) {
      canvas
      canvas.height = window.innerHeight;
      canvas.width = window.innerWidth();
    }

    function circle(x, y, r, c) {
      // draw a circle
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI*2, true);
      ctx.closePath();
      // fill path
      ctx.fillStyle = c;
      ctx.fill();
      // stroke
      ctx.lineWidth = r * 0.1;
      ctx.strokeStyle = "#000000";
      ctx.stroke();
    }

    function randomColour() {
      var letters = "0123456789ABCDEF".split("");
      var colour = "#";
      for(var i = 0; i < 6; i++) {
        colour += letters[Math.round(Math.random() * 15)];
      }
      return colour;
    }

    function drawBall() {
      // apply gravity to the ball
      this.vy += gravity * 0.1; //v = a * t
      // move the ball along x and y axis
      this.x += this.vx * 0.1; // s = v * t
      this.y += this.vy * 0.1;
      circle(this.x, this.y, this.r, this.c);
    }

    function edgeCollision() {
      // block of if statements to check if the ball has hit the sides, roof or floor
      // if it has bounce it away and reduce speed by elasticity factor
        if (this.x + this.r > canvas.width) {
          this.x = canvas.width - this.r;
          // invert velocity and reduce speed by elasticity factor
          this.vx *= -0.5 * this.b;
          this.vy *= this.b;
        }
        if (this.x - this.r < 0 ) {
          this.x = this.r;
          this.vx *= -0.5 * this.b;
          this.vy *= this.b;
        }
        if (this.y + this.r > canvas.height) {
          this.y = canvas.height - this.r;
          this.vy *= -1 * this.b;
          this.vx *= this.b;
        }
        if (this.y - this.r < 0) {
          this.y = this.r;
          this.vy *= -1 * this.b;
          this.xy *= this.b;
        }
    }

    function collision() {
      for (var i = 0; i < balls.length; i++) {
        for (var j = balls.length - 1; j > i; j--) {
          var dx = balls[i].x - balls[j].x;
          var dy = balls[i].y - balls[j].y;
          var distance = Math.sqrt((dx * dx) + (dy * dy));
          if (distance < balls[i].r + balls[j].r) {
            // assume the balls mass is equal to its size
            // momentum is conserved
            b1Mom = balls[i].r * Math.sqrt((balls[i].vx * balls[i].vx) + (balls[i].vy * balls[i].vy));
            b2Mom = balls[j].r * Math.sqrt((balls[j].vx * balls[j].vx) + (balls[j].vy * balls[j].vy));
            totalMom = b1Mom + b2Mom;
            console.log(b1Mom);
          }
        }
      }
    }

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

  // Game loop
    function gameLoop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (var i = 0; i < balls.length; i++) {
        balls[i].draw();
        balls[i].edgeCollision();
        collision();
      }
      ctx.fillStyle = "#000000";
      ctx.font = "15px Arial";
      ctx.fillText("Balls: " + balls.length, 10, 20);
    }

  // Lets go!
    function init() {
      ctx = canvas.getContext('2d');
      canvas.height = window.innerHeight;
      canvas.width = window.innerWidth;
      // 60fps
      return setInterval(gameLoop, 1000/60);
      window.addEventListener('resize', resize, false);
      canvas.onmousedown = fireBall;
    }
    init();
}
