const canvas = document.querySelector('canvas');

canvas.width = 1000;
canvas.height = 700;

const context = canvas.getContext('2d');

const mouse = {
  x: undefined,
  y: undefined
};

canvas.addEventListener('mousemove', (event) => {
  let x = event.x;
  let y = event.y;

  x -= canvas.offsetLeft;
  y -= canvas.offsetTop;
  mouse.x = x;
  mouse.y = y;

});
//
// window.addEventListener('resize', () => {
//   canvas.width = canvas.width;
//   canvas.height = canvas.height;
// });



// context.fillStyle = 'rgba(0, 255, 0, 1)';
// context.fillRect(100, 100, 100, 100);
// context.fillStyle = 'blue';
// context.fillRect(300, 100, 100, 100);
// context.fillRect(300, 300, 100, 100);
// context.fillRect(100, 300, 100, 100);
// context.fillStyle = 'purple';
// context.fillRect(200, 200, 100, 100);

//line
// context.beginPath();
// context.moveTo(50, 500);
// context.lineTo(300, 600);
// context.lineTo(400, 700);
// context.strokeStyle = 'pink';
// context.stroke();

//arc
// context.strokeStyle = 'green';
// context.beginPath();
// context.arc(500, 500, 100, 0, Math.PI * 2, false);
// context.stroke();

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};
//
// for (let i = 0; i < 10; i++) {
//   let x = Math.random() * window.innerWidth;
//   let y = Math.random() * window.innerHeight;
//   context.strokeStyle = getRandomColor();
//   context.beginPath();
//   context.arc(x, y, 100, 0, Math.PI * 2, false);
//   context.stroke();
// }




class Circle {

  constructor(x, y, dx, dy, radius, color) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.color = color;
  }

  draw() {
    context.fillStyle = this.color;
    context.fill();
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    context.stroke();
  }

  update() {
    if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
      this.dx = -this.dx;
    }

    if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
      this.dy = -this.dy;
    }

    this.x += this.dx;
    this.y += this.dy;

    this.draw();
  }

}

let circle1;
let circle3;

const init = () => {
  circle1 = new Circle(300, 300, 5, 5, 100, 'black');
  circle3 = new Circle(undefined, undefined, 0, 0, 100, 'red');
};


let circleArr = [];

// for (let i = 0; i < 40; i++) {
//   let color = getRandomColor();
//   let radius = 10;
//   let x = Math.random() * (canvas.width - radius * 2) + radius;
//   let y = Math.random() * (canvas.height - radius * 2) + radius;
//   let dx = (Math.random() - 0.5) * 2;
//   let dy = (Math.random() - 0.5) * 2;
//   circleArr.push(new Circle(x, y, dx, dy, radius, color));
// }



const animate = () => {
    requestAnimationFrame(animate);
    context.clearRect(0, 0, innerWidth, innerHeight);
    circle1.update();
    circle3.x = mouse.x;
    circle3.y = mouse.y;
    circle3.update();

    // for (let i = 0; i < circleArr.length; i++) {
    //   circleArr[i].update();
    // }
  };

  init();
  animate();
