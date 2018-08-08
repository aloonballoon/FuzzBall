FuzzBall is a divide and conquer game mimicing the Windows 95 game, JezzBall, that begins with two balls bouncing in a rectangular space. The purpose of the game is to draw lines and divide the balls apart, claiming as much of the negative space as possible within the line boundaries where no balls are present (reaching the target percentage of claimed area).

**How it Works**

Clicking the cursor emits two lines from its point. If the lines touch a the game boundary or another line, it solidifies and ball can no longer pass through. If a ball touches the line before it solidifies, the line is lost and the user loses a life. If a space becomes enclosed on all 4 sides without a ball inside, the space completely solidifies, there by creating a drop in total available space on the board. Once the amount of claimed space overtakes the target space, the user moves on to the next level, where they regain one life, and the amount of balls increases by one.

![FuzzBall Screenshot](/images/fuzzball_screenshot.jpg)

**Functionality & MVP**

* Autocalculate the amount of space left, in order to determine when to move on to the next level
* Breadth-First Search (BFS) in order to identify grid nodes that should be "claimed" (a.k.a. no ball within bounds). More robust of a method than determing based on line polygonal shape permutations
* Ball, wall, and line collision detection
* Realistic ball-to-ball collision detection mimics two-dimensional, two-body elastic collisions, with correct rebound angles and velocity transfer
* Each level up increases the ball count by one, increases player lives by one
* Change line orientation (vertical and horizontal) with right mouse-click, emit line with left mouse-click

JavaScript code snippet for Breadth-First Search algorithm to flag grid nodes isolated from bouncing balls
```JavaScript
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

```

**Future Ideas**

* Half-lines. Entire line is not eliminated if a ball only hits one side of it. Will create better strategizing for harder levels
* Leader table
* Color themes to improve use aesthetic and customization
* Varying game modes: Classic, Arcade (Choose difficulty level, speed, number of balls)
* Testing suite so any new changes can verify correct working fundamentals of the game

**Technologies**

* JavaScript for the runtime code
* HTML Canvas for gameplay simulations


