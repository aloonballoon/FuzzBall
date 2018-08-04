

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
canvas.style.cursor = "ns-resize";


const mouse = {
  x: undefined,
  y: undefined,
  direction: 'vertical'
};

let soundOn = true;
let lightsaberSound;
let clashLightsaberSound;
let humLightsaberSound;
let duelOfTheFates;

let particles;

let gridHeight = 30;
let gridColCount = 30;
let gridRowCount = 20;

let lineId = 0;
let pairId = 0;

canvas.height = gridHeight * gridRowCount;
canvas.width = gridHeight * gridColCount;

let gridId = 0;
let grid = [];


canvas.addEventListener('mousemove', (event) => {
  let x = event.x;
  let y = event.y;

  x -= canvas.offsetLeft;
  y -= canvas.offsetTop;
  mouse.x = x;
  mouse.y = y;
});

canvas.addEventListener('contextmenu', (event) => {
    event.preventDefault();
    switch (mouse.direction) {
      case 'vertical':
        mouse.direction = 'horizontal';
        canvas.style.cursor = "ew-resize";
        break;
      case 'horizontal':
        mouse.direction = 'vertical';
        canvas.style.cursor = "ns-resize";
        break;
      default:
        return null;
    }
    return false;
}, false);

class Sound {
  constructor(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
  }
  stop() {
    if (soundOn) {
      this.sound.pause();
      this.currentTime = 0;
    }
  }
  play() {
    if (soundOn) {
      this.sound.play();
    }
  }
}

lightsaberSound = new Sound("mp3/coolsaber.mp3");
clashLightsaberSound = new Sound("mp3/clash.mp3");
humLightsaberSound = new Sound("mp3/humsaber.mp3");
duelOfTheFates = new Sound("mp3/duel.mp3");



const createLines = () => {
  let box;
  for (let c = 0; c < gridColCount ; c++) {
    for (let r = 0; r < gridRowCount; r++) {
      box = grid[c][r];
      if (mouse.direction === 'vertical' && box.gridStatus === 0) {
        if (mouse.x > box.gridX && mouse.x < box.gridHeight + box.gridX && mouse.y > box.gridY && mouse.y < box.gridY + box.gridHeight) {
          const line1 = new Line(box.gridX, box.gridY, mouse.direction, box.gridHeight, "bottom", pairId, "moving", lineId);
          lines.push(line1);
          lineId += 1;
          const line2 = new Line(box.gridX, box.gridY, mouse.direction, box.gridHeight, "top", pairId, "moving", lineId);
          lines.push(line2);
          lineId += 1;
          pairId += 1;
          lightsaberSound.play();

        }
      } else if (mouse.direction === 'horizontal') {
          if (mouse.x > box.gridX && mouse.x < box.gridHeight + box.gridX && mouse.y > box.gridY && mouse.y < box.gridY + box.gridHeight) {
            const line1 = new Line(box.gridX, box.gridY, mouse.direction, box.gridHeight, "right", pairId, "moving", lineId);
            lines.push(line1);
            lineId += 1;
            const line2 = new Line(box.gridX, box.gridY, mouse.direction, box.gridHeight, "left", pairId, "moving", lineId);
            lines.push(line2);
            pairId += 1;
            lineId += 1;
            lightsaberSound.play();
          }
        }
      }
    }
};

let lines = [];

const handleClick = (event) => {
  let clickX = event.x;
  let clickY = event.y;

  clickX -= canvas.offsetLeft;
  clickY -= canvas.offsetTop;
  mouse.x = clickX;
  mouse.y = clickY;
  if (checkLineMoving()) {
    createLines();
  }
};

const checkLineMoving = () => {
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].status === "moving") {
      return false;
    }
  }
  return true;
};


const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const circleBlackOut = () => {
  gridArrForBlackOut = [];
  let box;
  for (let i = 0; i < particles.length; i++) {
    gridArrForBlackOut.push(particles[i].getGridLocation());
    box = gridArrForBlackOut[i];
    box.bfs();
  }
  for (let c = 0; c < gridColCount; c++) {
    for (let r = 0; r < gridRowCount; r++) {
      if (grid[c][r].gridStatus === 0) {
        grid[c][r].gridStatus = 1;
      } else if (grid[c][r].gridStatus === 2) {
        grid[c][r].gridStatus = 0;
        grid[c][r].visited = false;
      }
    }
  }

};


class Grid {
  constructor(gridHeight, gridX, gridY, gridId, gridStatus) {
    this.gridHeight = gridHeight;
    this.gridX = gridX;
    this.gridY = gridY;
    this.gridId = gridId;
    this.gridStatus = gridStatus;
    this.neighbors = {
      top: null,
      bottom: null,
      right: null,
      left: null
    };
    this.visited = false;
    this.ballPresent = undefined;
  }

  drawEmpty() {
    context.beginPath();
    context.rect(this.gridX, this.gridY, this.gridHeight, this.gridHeight);
    context.strokeStyle = "black";
    context.stroke();
    context.closePath();
  }

  drawFull() {
    context.beginPath();
    context.rect(this.gridX, this.gridY, this.gridHeight, this.gridHeight);
    context.strokeStyle = "black";
    context.fillStyle = "black";
    context.fill();
    context.stroke();
    context.closePath();
  }

  bfs() {

    let currentGrid = this;
    let neighbors = [];
    let queue = [];

    queue.push(currentGrid);

    while (queue.length !== 0) {
      currentGrid = queue.shift();
      currentGrid.visited = true;
      currentGrid.gridStatus = 2;

      neighbors = Object.values(currentGrid.neighbors).filter(Boolean);

      for (let i = 0; i < neighbors.length; i++) {
        if (neighbors[i].visited === false && neighbors[i].gridStatus !== 1 && !queue.includes(neighbors[i])) {
          queue.push(neighbors[i]);

        }
      }
    }
  }
}

const initiateGrid = () => {
  for (let c = 0; c < gridColCount; c++) {
    grid[c] = [];
    for (let r = 0; r < gridRowCount; r++) {
      grid[c][r] = new Grid(0, 0, 0, gridId, 0);
      gridId += 1;
    }
  }
};



const drawGrid = () => {
  claimedArea = 0;
  for (let c = 0; c < gridColCount; c++) {
    for (let r = 0; r < gridRowCount; r++) {
        let box = grid[c][r];
        let gridX = (c * gridHeight);
        let gridY = (r * gridHeight);

        box.gridHeight = gridHeight;
        box.gridX = gridX;
        box.gridY = gridY;

        // handle "edge" cases for checking properties of undefined
        if (typeof grid[c + 1] === "undefined") {
          grid[c + 1] = {};
        } else if (typeof grid[c - 1] === "undefined") {
          grid[c - 1] = {};
        }

        box.neighbors.right = grid[c + 1][r];
        box.neighbors.left = grid[c - 1][r];
        box.neighbors.bottom = grid[c][r + 1];
        box.neighbors.top = grid[c][r - 1];

        if (box.gridStatus === 0) {
          box.drawEmpty();
        } else if (grid[c][r].gridStatus === 1) {
          box.drawFull();
          claimedArea += 1;
        }

    }
  }
};

class Line {
  constructor(lineX, lineY, direction, gridHeight, side, pairId, status, lineId) {
    this.direction = direction;
    this.lineX = lineX;
    this.lineY = lineY;
    this.gridHeight = gridHeight;
    this.width = this.gridHeight;
    this.height = this.gridHeight;
    this.dW = 5;
    this.dH = 5;
    this.side = side;
    this.blue = 'rgb(0,0,255, 0.8)';
    this.red = 'rgb(255,0,0, 0.8)';
    this.black = 'rgb(0, 0, 0, 0.8)';
    this.pairId = pairId;
    this.status = status;
    this.lineId = lineId;
    this.searchInitiate = "incomplete";
    this.complete = "incomplete";
  }


  bottomLineToLineDistance(otherLine) {
    let xTouching;
    let yTouching;

    yTouching = this.lineY + this.height === otherLine.lineY;
    xTouching = ((this.lineX > otherLine.lineX) && (this.lineX < (otherLine.lineX + otherLine.width))) || ((this.lineX < otherLine.lineX) && (this.lineX >= (otherLine.lineX + otherLine.width))) || this.lineX === otherLine.lineX;

    if (xTouching && yTouching) {
      return true;
    }
  }

  topLineToLineDistance(otherLine) {
    let xTouching;
    let yTouching;

    yTouching = this.lineY + this.height === otherLine.lineY + otherLine.gridHeight;
    xTouching = ((this.lineX > otherLine.lineX) && (this.lineX < (otherLine.lineX + otherLine.width))) || ((this.lineX < otherLine.lineX) && (this.lineX >= (otherLine.lineX + otherLine.width))) || this.lineX === otherLine.lineX;

    if (xTouching && yTouching) {
      return true;
    }
  }

  rightLineToLineDistance(otherLine) {
    let xTouching;
    let yTouching;

    xTouching = this.lineX + this.width === otherLine.lineX;
    yTouching = ((this.lineY > otherLine.lineY) && (this.lineY < (otherLine.lineY + otherLine.height))) || ((this.lineY < otherLine.lineY) && (this.lineY >= (otherLine.lineY + otherLine.height))) || this.lineY === otherLine.lineY;

    if (xTouching && yTouching) {
      return true;
    }
  }

  leftLineToLineDistance(otherLine) {
    let xTouching;
    let yTouching;

    xTouching = this.lineX + this.width === otherLine.lineX + otherLine.gridHeight;
    yTouching = ((this.lineY > otherLine.lineY) && (this.lineY < (otherLine.lineY + otherLine.height))) || ((this.lineY < otherLine.lineY) && (this.lineY >= (otherLine.lineY + otherLine.height))) || this.lineY === otherLine.lineY;

    if (xTouching && yTouching) {
      return true;
    }
  }


  checkLineCollision() {
    for (let i = 0; i < lines.length; i++) {
      if (this.pairId === lines[i].pairId) {
        continue;
      }
      if (this.side === "right") {
        if (this.rightLineToLineDistance(lines[i])) {
          this.status = "stopped";
        }
      } else if (this.side === "left") {
        if (this.leftLineToLineDistance(lines[i])) {
          this.status = "stopped";
        }
      } else if (this.side === "top") {
        if (this.topLineToLineDistance(lines[i])) {
          this.status = "stopped";
        }
      } else if (this.side === "bottom") {
        if (this.bottomLineToLineDistance(lines[i])) {
          this.status = "stopped";
        }
      }
    }
  }

  checkWallCollision() {
    if (this.side === "right") {
      if (this.lineX + this.width === canvas.width) {
        this.status = "stopped";
      }
    } else if (this.side === "left") {
        if (this.lineX + this.width < 0) {
          this.status = "stopped";
        }
    } else if (this.side === "top") {
        if (this.lineY + this.height < 0) {
          this.status = "stopped";
        }
    }
      else if (this.side === "bottom") {
        if (this.lineY + this.height === canvas.height) {
          this.status = "stopped";
        }
      }
  }



  updateGrid() {
    for (let i = 0; i < lines.length; i++) {

      if (this.status === "stopped" && lines[i].pairId === this.pairId && lines[i].status === "stopped" && lines[i].lineId !== this.lineId) {
        let line = this;
        let box;

        for (let c = 0; c < gridColCount; c++) {
          for (let r = 0; r < gridRowCount; r++) {
            box = grid[c][r];
            //bottom
            if (box.gridX === line.lineX && box.gridY === line.lineY) {
              box.gridStatus = 1;
            }
            if (box.gridX === line.lineX && box.gridY < line.lineY && box.gridY >= line.lineY + line.height) {
              box.gridStatus = 1;
              line.complete = "complete";
            } else if (box.gridX === line.lineX && box.gridY > line.lineY && box.gridY < line.lineY + line.height) {
              box.gridStatus = 1;
              line.complete = "complete";
            } else if (box.gridY === line.lineY && box.gridX < line.lineX && box.gridX > line.lineX + line.width - line.gridHeight) {
              box.gridStatus = 1;
              line.complete = "complete";
            } else if (box.gridY === line.lineY && box.gridX > line.lineX && box.gridX < line.lineX + line.width) {
              box.gridStatus = 1;
              line.complete = "complete";
            }
          }
        }
        this.complete = "complete";
        if (this.searchInitiate === "incomplete") {
          if (lines[i].complete === "complete") {
            circleBlackOut();
            this.searchInitiate = "complete";
            lines[i].searchInitiate = "complete";
          }
        }
      }
    }
  }


  update(){
    this.checkWallCollision();
    this.checkLineCollision();
    this.updateGrid();
    this.growLine();
  }

  growLine() {
    if (this.direction === 'horizontal') {

      if (this.side === 'right' && this.status === "moving") {
          context.beginPath();
          context.fillStyle = this.red;
          context.fillRect(this.lineX, this.lineY, this.width, this.height);
          this.width += this.dW;

      } else if (this.side === 'left' && this.status === "moving") {
          context.beginPath();
          context.fillStyle = this.blue;
          context.fillRect(this.lineX, this.lineY, this.width, this.height);
          this.width -= this.dW;

      } else if (this.status === "stopped") {
        context.beginPath();
        context.fillStyle = this.black;
        context.fillRect(this.lineX, this.lineY, this.width, this.height);
      }
    } else if (this.direction === 'vertical') {

      if (this.side === 'bottom' && this.status === "moving") {
        context.beginPath();
        context.fillStyle = this.red;
        context.fillRect(this.lineX, this.lineY, this.width, this.height);
        this.height += this.dH;

      } else if (this.side === 'top' && this.status === "moving") {
        context.beginPath();
        context.fillStyle = this.blue;
        context.fillRect(this.lineX, this.lineY, this.width, this.height);
        this.height -= this.dH;

      } else if (this.status === "stopped") {
        context.beginPath();
        context.fillStyle = this.black;
        context.fillRect(this.lineX, this.lineY, this.width, this.height);
      }
    }
  }



}

const resolveCollision = (particle1, particle2) => {
    const deltaVelocityX = particle1.velocity.x - particle2.velocity.x;
    const deltaVelocityY = particle1.velocity.y - particle2.velocity.y;

    const xDist = particle2.x - particle1.x;
    const yDist = particle2.y - particle1.y;


    if (deltaVelocityX * xDist + deltaVelocityY * yDist >= 0) {


        const angle = -Math.atan2(particle2.y - particle1.y, particle2.x - particle1.x);

        const m1 = particle1.mass;
        const m2 = particle2.mass;

        const u1 = rotate(particle1.velocity, angle);
        const u2 = rotate(particle2.velocity, angle);

        const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
        const v2 = { x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), y: u2.y };

        const vFinal1 = rotate(v1, -angle);
        const vFinal2 = rotate(v2, -angle);

        particle1.velocity.x = vFinal1.x;
        particle1.velocity.y = vFinal1.y;

        particle2.velocity.x = vFinal2.x;
        particle2.velocity.y = vFinal2.y;
    }
};

const rotate = (velocity, angle) => {
    const rotatedVelocities = {
        x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
        y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
    };

    return rotatedVelocities;
};

class Circle {

  constructor(x, y, dx, dy, radius, color) {
    this.x = x;
    this.y = y;
    this.velocity = {
      x: dx,
      y: dy
    };
    this.dy = dy;
    this.radius = radius;
    this.color = color;
    this.mass = 1;
  }

  draw() {
    context.strokeStyle = "black";
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    context.fillStyle = this.color;
    context.fill();
    context.stroke();
  }


  circleToLineCollision() {

    let line;

    for (let i = 0; i < lines.length; i++) {
      if (lines.length === 0) {
        break;
      }
      line = lines[i];
      if (line.direction === "vertical") {
        if (this.x + this.radius > line.lineX && this.x - this.radius < line.lineX + line.width && this.y + this.radius > line.lineY && this.y + this.radius < line.lineY + line.height) {
          if (line.status === "stopped") {
            this.velocity.x = -this.velocity.x;
          } else if (line.status === "moving") {
            for (let j = 0; j < lines.length; j++) {
              if (lines[j].pairId === lines[i].pairId && lines[j].lineId !== lines[i].lineId) {
                delete lines[i];
                delete lines[j];
                lives -= 1;
                lightsaberSound.stop();
                clashLightsaberSound.play();
                lines = lines.filter(Boolean);
              }
            }
            i = 0;
          }
        } else if (this.x + this.radius > line.lineX && this.x - this.radius < line.lineX + line.width && this.y + this.radius < line.lineY && this.y + this.radius > line.lineY + line.height) {
          if (line.status === "stopped") {
            this.velocity.x = -this.velocity.x;
          }  else if (line.status === "moving") {
            for (let j = 0; j < lines.length; j++) {
              if (lines[j].pairId === lines[i].pairId && lines[j].lineId !== lines[i].lineId) {
                delete lines[i];
                delete lines[j];
                lives -= 1;
                lightsaberSound.stop();
                clashLightsaberSound.play();
                lines = lines.filter(Boolean);
              }
            }
            i = 0;
          }
        }
      } else if (line.direction === "horizontal") {
          if (this.y + this.radius > line.lineY && this.y - this.radius < line.lineY + line.height && this.x + this.radius > line.lineX && this.x + this.radius < line.lineX + line.width) {
            if (line.status === "stopped") {
              this.velocity.y = -this.velocity.y;
            }  else if (line.status === "moving") {
              for (let j = 0; j < lines.length; j++) {
                if (lines[j].pairId === lines[i].pairId && lines[j].lineId !== lines[i].lineId) {
                  delete lines[i];
                  delete lines[j];
                  lives -= 1;
                  lightsaberSound.stop();
                  clashLightsaberSound.play();
                  lines = lines.filter(Boolean);
                }
              }
              i = 0;
            }
          } else if (this.y + this.radius > line.lineY && this.y - this.radius < line.lineY + line.height && this.x + this.radius < line.lineX && this.x + this.radius > line.lineX + line.width) {
            if (line.status === "stopped") {
              this.velocity.y = -this.velocity.y;
            }  else if (line.status === "moving") {
              for (let j = 0; j < lines.length; j++) {
                if (lines[j].pairId === lines[i].pairId && lines[j].lineId !== lines[i].lineId) {
                  delete lines[i];
                  delete lines[j];
                  lives -= 1;
                  lightsaberSound.stop();
                  clashLightsaberSound.play();
                  lines = lines.filter(Boolean);
                }
              }
              i = 0;
            }
          }
      }
    }
  }

  getGridLocation() {
    let gridCol = Math.floor(this.x / gridHeight);
    let gridRow = Math.floor(this.y / gridHeight);
    return grid[gridCol][gridRow];

  }

  update(particles) {

    for (let j = 0; j < particles.length; j++) {
      if (this === particles[j]){
       continue;
      }
      if (getDistance(this.x, this.y, particles[j].x, particles[j].y) - particles[j].radius * 2 < 0) {
          resolveCollision(this, particles[j]);
      }
    }

    if (lines.length !== 0) {
      this.circleToLineCollision();
    }

    if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
      this.velocity.x = -this.velocity.x;
    }

    if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
      this.velocity.y = -this.velocity.y;
    }

    this.x += this.velocity.x;
    this.y += this.velocity.y;

    this.draw();
  }

 }



const initiateParticles = () => {
  particles = [];

  for (let i = 0; i < ballCount; i++) {
    let color = getRandomColor();
    let radius = 10;
    let x = Math.random() * (canvas.width - radius * 2) + radius;
    let y = Math.random() * (canvas.height - radius * 2) + radius;
    let dx = (Math.random() - 0.5) * 12;
    let dy = (Math.random() - 0.5) * 12;

    if (i !== 0) {
      for (let j = 0; j < particles.length; j++) {
        if (getDistance(x, y, particles[j].x, particles[j].y) -radius * 2 < 0) {
          x = Math.random() * (canvas.width - radius * 2) + radius;
          y = Math.random() * (canvas.height - radius * 2) + radius;
          j = -1;
        }
      }
    }
  particles.push(new Circle(x, y, dx, dy, radius, color));

  }
};


const getDistance = (x1,y1, x2, y2) => {
  let xDistance = x2 - x1;
  let yDistance = y2 - y1;

  return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
};

let startingBallCount = 1;
let level = 1;
let ballCount;
ballCount = startingBallCount;
let claimedArea = 0;
let totalArea = gridColCount * gridRowCount;
let lives = 5;
let targetArea = 76;
let percentArea;
let advancedLevel = false;
let nextLevelWaiting = true;
let nextLevelFrame;
let animateFrame;
let nextLevelScreenOn = true;
let nextLevelTimeout;
let restartListener;
let restartable = false;
let playEndOfGameMusic = true;

const newGameResetValues = () => {
  level = 1;
  startingBallCount = 3;
  ballCount = startingBallCount;
  claimedArea = 0;
  lives = 5;
  targetArea = 76;
  advancedLevel = false;
  nextLevelWaiting = true;
  nextLevelScreenOn = true;
  restartable = false;
  lines = [];
  particles = [];
  grid = [];
  duelOfTheFates = new Sound("mp3/duel.mp3");
  playEndOfGameMusic = true;
};

const game = () => {
  if (advancedLevel === false) {
    if (targetArea > 60) {
      targetArea = targetArea - 1;
      advancedLevel = true;
    }
  }
  if (percentArea >= targetArea) {
    nextLevelScreenOn = false;
    endLevel();
    drawNextLevelScreen();
  }
  if (lives <= 0) {
    gameOver();
  }
};

const stopGameOverMusic = () => {
  duelOfTheFates = false;
};

const gameOver = () => {
  if (playEndOfGameMusic === true) {
    duelOfTheFates.play();
  }
  playEndOfGameMusic = false;
  blackScreen();
  gameOverText();
  restartText();
  restartable = true;
  restartListener = window.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      if (restartable === true) {
        duelOfTheFates.stop();
        restartGame();
      }
    }
  });
};

const restartGame = () => {
  cancelAnimationFrame(animateFrame);
  newGameResetValues();
  initiateGame();
};

const gameOverText = () => {
  context.font="75px alien";
  context.fillStyle = "white";
  context.fillText(`GAME OVER`, 225, 200);
};

const restartText = () => {
  context.font="50px alien";
  context.fillStyle = "white";
  context.fillText(`PRESS ENTER TO RESTART`, 115, 400);
};

const endLevel = () => {
  cancelAnimationFrame(animateFrame);
};

const drawNextLevelScreen = () => {
  let nextLevelFrame = requestAnimationFrame(drawNextLevelScreen);
  blackScreen();
  levelCompleteText();
  nextLevelText();
  if (nextLevelScreenOn === false) {
    nextLevelTimeout = setTimeout(nextLevel, 2000);
    nextLevelScreenOn = true;
  }
};

const levelCompleteText = () => {
  context.font="75px alien";
  context.fillStyle = "white";
  context.fillText(`LEVEL COMPLETE`, 125, 200);
};

const nextLevelText = () => {
  context.font="75px alien";
  context.fillStyle = "white";
  context.fillText(`NEXT LEVEL: ${level + 1}`, 150, 400);
};


const blackScreen = () => {
  context.beginPath();
  context.rect(0, 0, canvas.width, canvas.width);
  context.strokeStyle = "black";
  context.fillStyle = "black";
  context.fill();
  context.stroke();
  context.closePath();
};

const calculateArea = () => {
  percentArea =  Math.floor(claimedArea / totalArea * 100);
};

const nextLevel = () => {
  level += 1;
  ballCount += 1;
  claimedArea = 0;
  lives += 1;
  advancedLevel = false;
  lines = [];
  particles = [];
  grid = [];
  cancelAnimationFrame(nextLevelFrame);
  initiateGame();
};

const initiateGame = () => {
  initiateGrid();
  initiateParticles();
  animate();
};


const drawParticles = () => {
  for (let i = 0; i < particles.length; i++) {
    particles[i].update(particles);
  }
};

const drawLines = () => {
  for (let i = 0; i < lines.length; i++) {
    lines[i].update();
  }
};

canvas.addEventListener('click', handleClick);

const drawStats = () => {
  drawClaimedArea();
  drawTargetArea();
  drawLives();
  drawLevels();
};

const updateStats = () => {
  $("#lives-div").text(`LIVES: ${lives}`);
  $("#claimed-percent-div").text(`CLAIMED PERCENT: ${percentArea}`);
  $("#target-percent-div").text(`TARGET PERCENT: ${targetArea}`);
  $("#level-div").text(`LEVEL: ${level}`);
};

const animate = () => {
    animateFrame = requestAnimationFrame(animate);
    context.clearRect(0, 0, innerWidth, innerHeight);
    drawGrid();
    drawParticles();
    calculateArea();
    drawLines();
    updateStats();
    game();
  };

  initiateGame();
