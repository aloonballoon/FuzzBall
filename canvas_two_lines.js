const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');


const mouse = {
  x: undefined,
  y: undefined,
  direction: 'vertical'
};

let circle1;
let circle2;
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
        break;
      case 'horizontal':
        mouse.direction = 'vertical';
        break;
      default:
        return null;
    }
    return false;
}, false);

const drawLines = () => {
  let box;
  for (let c = 0; c < gridColCount ; c++) {
    for (let r = 0; r < gridRowCount; r++) {
      box = grid[c][r];
      if (mouse.direction === 'vertical') {
        if (mouse.x > box.gridX && mouse.x < box.gridHeight + box.gridX && mouse.y > box.gridY && mouse.y < box.gridY + box.gridHeight) {
          const line1 = new Line(box.gridX, box.gridY, mouse.direction, box.gridHeight, "bottom", pairId, "moving", lineId);
          lines.push(line1);
          lineId += 1;
          const line2 = new Line(box.gridX, box.gridY, mouse.direction, box.gridHeight, "top", pairId, "moving", lineId);
          lines.push(line2);
          lineId += 1;
          pairId += 1;

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
    drawLines();
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


class Grid {
  constructor(gridHeight, gridX, gridY, gridId, gridStatus) {
    this.gridHeight = gridHeight;
    this.gridX = gridX;
    this.gridY = gridY;
    this.gridId = gridId;
    this.gridStatus = gridStatus;
    this.mass = null;
    this.velocity = {
      x: null,
      y: null
    };
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

}

for (let c = 0; c < gridColCount; c++) {
  grid[c] = [];
  for (let r = 0; r < gridRowCount; r++) {
    grid[c][r] = new Grid(0, 0, 0, gridId, 0);
    gridId += 1;
  }
}

const drawGrid = () => {
  for (let c = 0; c < gridColCount; c++) {
    for (let r = 0; r < gridRowCount; r++) {

        let gridX = (c * gridHeight);
        let gridY = (r * gridHeight);

        grid[c][r].gridHeight = gridHeight;
        grid[c][r].gridX = gridX;
        grid[c][r].gridY = gridY;

      if (grid[c][r].gridStatus === 0) {
        grid[c][r].drawEmpty();
      } else if (grid[c][r].gridStatus === 1) {
        grid[c][r].drawFull();
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
    this.black = 'rgb(0, 255, 0, 0.8)';
    this.pairId = pairId;
    this.status = status;
    this.lineId = lineId;
  }

  checkIfSquare() {

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

    xTouching = this.lineX + this.width === otherLine.lineX;
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
    if (this.status === "stopped") {
      let line = this;
      let box;

      for (let c = 0; c < gridColCount; c++) {
        for (let r = 0; r < gridRowCount; r++) {
          box = grid[c][r];
          if (box.gridX === line.lineX && box.gridY < line.lineY && box.gridY >= line.lineY + line.height) {
            box.gridStatus = 1;
          } else if (box.gridX === line.lineX && box.gridY > line.lineY && box.gridY < line.lineY + line.height) {
            box.gridStatus = 1;
          } else if (box.gridY === line.lineY && box.gridX < line.lineX && box.gridX > line.lineX + line.width) {
            box.gridStatus = 1;
          } else if (box.gridY === line.lineY && box.gridX > line.lineX && box.gridX < line.lineX + line.width) {
            box.gridStatus = 1;
          }
        }
      }
    }
  }


  update(){
    this.checkWallCollision();
    this.checkLineCollision();
    this.updateGrid();
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
      line = lines[i];


      if (line.direction === "vertical") {
        if (this.x + this.radius > line.lineX && this.x - this.radius < line.lineX + line.width && this.y + this.radius > line.lineY && this.y + this.radius < line.lineY + line.height) {
          if (line.status === "stopped") {
            this.velocity.x = -this.velocity.x;
          } else if (line.status === "moving") {
            delete lines[i];
            lines = lines.filter(Boolean);
            i = i - 1;
          }
        } else if (this.x + this.radius > line.lineX && this.x - this.radius < line.lineX + line.width && this.y + this.radius < line.lineY && this.y + this.radius > line.lineY + line.height) {
          if (line.status === "stopped") {
            this.velocity.x = -this.velocity.x;
          }  else if (line.status === "moving") {
            delete lines[i];
            lines = lines.filter(Boolean);
            i = i - 1;
          }
        }
      } else if (line.direction === "horizontal") {
          if (this.y + this.radius > line.lineY && this.y - this.radius < line.lineY + line.height && this.x + this.radius > line.lineX && this.x + this.radius < line.lineX + line.width) {
            if (line.status === "stopped") {
              this.velocity.y = -this.velocity.y;
            }  else if (line.status === "moving") {
              delete lines[i];
              delete lines[i];
              lines = lines.filter(Boolean);
              i = i - 1;
            }
          } else if (this.y + this.radius > line.lineY && this.y - this.radius < line.lineY + line.height && this.x + this.radius < line.lineX && this.x + this.radius > line.lineX + line.width) {
            if (line.status === "stopped") {
              this.velocity.y = -this.velocity.y;
            }  else if (line.status === "moving") {
              delete lines[i];
              lines = lines.filter(Boolean);
              i = i - 1;
            }
          }
      }
    }
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

const init = () => {
  particles = [];

  for (let i = 0; i < 1; i++) {
    let color = getRandomColor();
    let radius = 10;
    let x = Math.random() * (canvas.width - radius * 2) + radius;
    let y = Math.random() * (canvas.height - radius * 2) + radius;
    let dx = (Math.random() - 0.5) * 20;
    let dy = (Math.random() - 0.5) * 20;

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

canvas.addEventListener('click', handleClick);


const animate = () => {
    requestAnimationFrame(animate);
    context.clearRect(0, 0, innerWidth, innerHeight);

    drawGrid();

    for (let i = 0; i < particles.length; i++) {
      particles[i].update(particles);
    }

    for (let i = 0; i < lines.length; i++) {
      lines[i].update();
    }



  };

  init();
  animate();
