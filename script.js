
const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

const speedBtn = document.getElementById("speed-btn");
const newGameBtn = document.getElementById("new-game-btn");
const score =  document.getElementById("score");

const backgroundImg = document.createElement("img");
backgroundImg.src = "https://images.unsplash.com/photo-1579546929662-711aa81148cf?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxleHBsb3JlLWZlZWR8MXx8fGVufDB8fHw%3D&w=1000&q=80";
const audio = document.createElement("audio");
audio.src = "http://www.slspencer.com/Sounds/Local/Local.mp3";
const gameOverBgImg = document.createElement("img");
gameOverBgImg.src = "https://i.pinimg.com/originals/a1/0e/35/a10e3580c6f8271f5e9b85994573a19b.png";

let data = {};

class Game {
  constructor(x, y, width, height, speed, xDelta, yDelta) {
      this._x = x;
      this._y = y;
      this._width = width;
      this._height = height;
      this._speed = speed;
      this._xDelta = xDelta; 
      this._yDelta = yDelta;
  }

  draw() {
      context.fillRect(this._x, this._y, this._width, this._height);
      context.fillStyle = this._color;
  } 
}

class Square extends Game {
  constructor(x, y, width, height, speed) {
    super(x, y, width, height, speed, 0, random(1, 3));

      this._color = `rgb(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)})`;
  }

  changeColor() {
    data = data.quadrates.map(function(box) {
      return {
        ...box,
        color: "rgb(" + random(0, 255) + ", " + random(0, 255) + ", " + random(0, 255) + ")",
      }
    })
  };
  
  update() {
    this._y += this._yDelta;
    this._y += (this._yDelta * data.speedGame); 

    if (this._y + this._height >= canvas.height) {
      data.scoreRect -= 1;
    }
    if (this._y + this._height > canvas.height || this._y < 0) {
      this._yDelta *= -1;
    }     
  }
}

class Rectangle extends Game {
  update() {    
    this._x += this._xDelta;

    if (this._x >= 0 && (this._x + this._width <= canvas.width)) {
        this._x += this._xDelta;
    } else {
        if (this._x < 0) {
          this._x = 0;
        } else if (this._x + this._width > canvas.width) {
          this._x = canvas.width - this._width;
          }
      }
  } 
  goRight() {
    this._xDelta = this._speed;
  }
  goLeft() {
    this._xDelta = this._speed * -1;
  }
  stop() {
    this._xDelta = 0;
  }  
}

function getSquaresList(count) {
  return new Array(count).fill(1).map((value, index) => new Square(20 + 60 * index, 0, 25, 25, 1));
}

function getStartGameData() {
  setTimeout(() => {
    data.quadrates.push(...getSquaresList(3));
  }, 10000);
  return {
    quadrates: getSquaresList(5),
    rectangle: new Rectangle(190, canvas.height - 20, 200, 60, 6, 1),
    gameOver: false,
    scoreRect: 10,
    speedGame: 1
  }
}

function intersect(rect1, rect2) {
  const x = Math.max(rect1._x, rect2._x),
  num1 = Math.min(rect1._x + rect1._width - 1, rect2._x + rect2._width - 1),
  y = Math.max(rect1._y, rect2._y),
  num2 = Math.min(rect1._y + rect1._height - 1, rect2._y + rect2._height - 1);
  return (num1 >= x && num2 >= y);
}

function update() {
  data.quadrates.forEach((quadrate) => {
    quadrate.update();

    if (intersect(quadrate, data.rectangle)) {
      quadrate._yDelta = -1 * Math.abs(quadrate._yDelta); 
    }
  }); 

  data.rectangle.update();

  if(data.scoreRect <= 0) {
    data.scoreRect = 0;
    audio.play();
    data.gameOver = true;
  }  
}

function draw() {
  if(!data.gameOver) {
  	context.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
    data.quadrates.forEach((quadrate) => quadrate.draw());
  	data.rectangle.draw();
  } else {
      context.drawImage(gameOverBgImg, 0, 0, canvas.width, canvas.height);
    }    

  score.innerHTML = data.scoreRect;
}

function loop() {
  if(!data.gameOver) {
    requestAnimationFrame(loop);
  }
  update();
  draw();
}

document.addEventListener("keydown", function(evt) {
  if (evt.code === "ArrowRight") {
    data.rectangle.goRight();
  } else if (evt.code === "ArrowLeft") {
    data.rectangle.goLeft();
  }
});

document.addEventListener("keyup", function(evt) {
  data.rectangle.stop();
});

newGameBtn.addEventListener("click", function() {
	data = getStartGameData();
  loop();
});

speedBtn.addEventListener("click", function() {
	 data.speedGame += 0.2;
});

data = getStartGameData();
loop();

function random(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}