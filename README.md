See http://www.freewebarcade.com/game/jezzball/ for a quick demo (will delete after proposal)

FuzzBall is a divide and conquer game that begins with two balls bouncing in a rectangular space. The purpse of the game is to divide the balls apart and reduce the nagative space to below 25% of the original starting space.

How it Works

Clicking the cursor emits two lines from its point. If the lines touch a wall, it solidifies and ball can no longer pass through it. If a ball touches the line before it solidifies, the line is lost and the user loses a life. If a space becomes enclosed on all 4 sides without a ball inside, the space completely solidifies, there by creating a large drop in total available space on the board. Once the amount of available space drops below 25% of the original, the user moves on to the next level, where they regain one life, and the amount of balls increases by one.

Functionality & MVP

Start and pause
Change line orientation( vertical and horizontal), emit with mouse click
Each level up increases the ball count by one, increases player lives by one
Autocalculate the amount of space left, in order to determine when to move on to the next level
Ball, wall, and line collision detection
WireFrame

The display will include the main board where the balls will bounce within the confines of the wall. The use can click their mouse anywhere inside the board and it will emit two opposing lines in order to block off the balls. There will be a pause button. Also there will be a leaderboard in order to increase competitiveness. A pop up modal will brief users on how to briefly play then disappear with a click outside of it



Technologies

JavaScript for the runtime code Canvas for the rendering and collision detection

Implementation Timeline

Day 1: Render a board and two balls, generated in random places. Get the balls to move. Get the balls to detect collisions with the wall

Day 2: Emit potential lines with the cursor. Detect if the ball touches the line before it touches a wall. Detect if the line touches a wall. Solidify the line

Day 3: Black out space that has four walls inside and no balls. Calculate space remaining. Render new level after win

Day 4: Beautifying the page

Bonus features

Change color of board, balls, and lines. Choose number of starting balls or change increase speed
