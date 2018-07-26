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
let gridColCount = 40;
let gridRowCount = 25;
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
    console.log(mouse.direction);
    return false;
}, false);

const blackoutSq = () => {
  let box;
  for (let c = 0; c < gridColCount ; c++) {
    for (let r = 0; r < gridRowCount; r++) {
      box = grid[c][r];
      if (mouse.x >= box.gridX && mouse.x <= box.gridHeight + box.gridX && mouse.y >= box.gridY && mouse.y <= box.gridY + box.gridHeight) {
        box.gridStatus = 1;
      }
    }
      }
};

const handleClick = (event) => {
  let clickX = event.x;
  let clickY = event.y;

  clickX -= canvas.offsetLeft;
  clickY -= canvas.offsetTop;
  mouse.x = clickX;
  mouse.y = clickY;
  blackoutSq();
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
  constructor(direction) {
    this.direction = direction;
  }

  draw() {
    context.beginPath();
    context.strokeStyle = 'red';
    context.moveTo(mouse.x, mouse.y);
    context.lineTo(mouse.x, 0);
    context.stroke();
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
    context.strokeStyle = this.color;
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    context.fillStyle = this.color;
    context.fill();
    context.stroke();
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

  for (let i = 0; i < 20; i++) {
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

    for (let i = 0; i < particles.length; i++) {
      particles[i].update(particles);
    }
    drawGrid();


  };

  init();
  animate();
