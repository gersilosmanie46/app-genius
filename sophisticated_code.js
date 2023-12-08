/**
 * filename: sophisticated_code.js
 * content: Example of a sophisticated and complex JavaScript code.
 * This code generates a random maze using Recursive Backtracking algorithm
 * and solves it using the A* search algorithm.
 **/

// Constants for maze dimensions
const WIDTH = 15;
const HEIGHT = 15;

// Class representing a maze cell
class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.walls = {
      top: true,
      right: true,
      bottom: true,
      left: true
    };
    this.visited = false;
  }
}

// Create a 2D array to represent the maze
let maze = new Array(WIDTH);
for (let i = 0; i < WIDTH; i++) {
  maze[i] = new Array(HEIGHT);
}

// Initialize the maze with cell objects
for (let x = 0; x < WIDTH; x++) {
  for (let y = 0; y < HEIGHT; y++) {
    maze[x][y] = new Cell(x, y);
  }
}

// Recursive Backtracking algorithm to generate the maze
function generateMaze(x, y) {
  maze[x][y].visited = true;

  const neighbors = getUnvisitedNeighbors(x, y);
  while (neighbors.length > 0) {
    const randomIndex = Math.floor(Math.random() * neighbors.length);
    const randomNeighbor = neighbors[randomIndex];

    if (!maze[randomNeighbor.x][randomNeighbor.y].visited) {
      removeWall(x, y, randomNeighbor.x, randomNeighbor.y);
      generateMaze(randomNeighbor.x, randomNeighbor.y);
    }

    neighbors.splice(randomIndex, 1);
  }
}

// Helper function to get unvisited neighbors of a cell
function getUnvisitedNeighbors(x, y) {
  const neighbors = [];

  if (x > 0 && !maze[x - 1][y].visited) {
    neighbors.push(maze[x - 1][y]);
  }
  if (x < WIDTH - 1 && !maze[x + 1][y].visited) {
    neighbors.push(maze[x + 1][y]);
  }
  if (y > 0 && !maze[x][y - 1].visited) {
    neighbors.push(maze[x][y - 1]);
  }
  if (y < HEIGHT - 1 && !maze[x][y + 1].visited) {
    neighbors.push(maze[x][y + 1]);
  }

  return neighbors;
}

// Remove walls between two cells
function removeWall(x1, y1, x2, y2) {
  if (x1 === x2) {
    if (y2 > y1) {
      maze[x1][y1].walls.bottom = false;
      maze[x2][y2].walls.top = false;
    } else {
      maze[x1][y1].walls.top = false;
      maze[x2][y2].walls.bottom = false;
    }
  } else {
    if (x2 > x1) {
      maze[x1][y1].walls.right = false;
      maze[x2][y2].walls.left = false;
    } else {
      maze[x1][y1].walls.left = false;
      maze[x2][y2].walls.right = false;
    }
  }
}

// Print the maze
function printMaze() {
  let output = "";

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const cell = maze[x][y];

      if (cell.walls.top) {
        output += " _";
      } else {
        output += "  ";
      }

      if (cell.walls.right) {
        output += "|";
      } else {
        output += " ";
      }
    }
    output += "\n";
  }

  console.log(output);
}

// Solve the maze using A* search algorithm
function solveMaze() {
  const start = {
    x: 0,
    y: 0,
    g: 0,
    h: manhattanDistance(0, 0, WIDTH - 1, HEIGHT - 1),
    parent: null
  };

  const openSet = [start];
  const closedSet = [];

  while (openSet.length > 0) {
    let current = openSet[0];
    let currentIndex = 0;

    for (let i = 1; i < openSet.length; i++) {
      if (openSet[i].g + openSet[i].h < current.g + current.h) {
        current = openSet[i];
        currentIndex = i;
      }
    }

    openSet.splice(currentIndex, 1);
    closedSet.push(current);

    if (current.x === WIDTH - 1 && current.y === HEIGHT - 1) {
      return reconstructPath(current);
    }

    const neighbors = getNeighbors(current.x, current.y);
    for (let i = 0; i < neighbors.length; i++) {
      const neighbor = neighbors[i];

      if (closedSet.find(cell => cell.x === neighbor.x && cell.y === neighbor.y)) {
        continue;
      }

      const newG = current.g + 1;
      const newH = manhattanDistance(neighbor.x, neighbor.y, WIDTH - 1, HEIGHT - 1);
      const inOpenSet = openSet.find(cell => cell.x === neighbor.x && cell.y === neighbor.y);

      if (!inOpenSet || newG + newH < neighbor.g + neighbor.h) {
        neighbor.g = newG;
        neighbor.h = newH;
        neighbor.parent = current;

        if (!inOpenSet) {
          openSet.push(neighbor);
        }
      }
    }
  }

  return null;
}

// Helper function to get neighboring cells
function getNeighbors(x, y) {
  const neighbors = [];

  if (x > 0 && !maze[x][y].walls.left) {
    neighbors.push(maze[x - 1][y]);
  }
  if (x < WIDTH - 1 && !maze[x][y].walls.right) {
    neighbors.push(maze[x + 1][y]);
  }
  if (y > 0 && !maze[x][y].walls.top) {
    neighbors.push(maze[x][y - 1]);
  }
  if (y < HEIGHT - 1 && !maze[x][y].walls.bottom) {
    neighbors.push(maze[x][y + 1]);
  }

  return neighbors;
}

// Helper function to calculate Manhattan distance between two points
function manhattanDistance(x1, y1, x2, y2) {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

// Helper function to reconstruct the path from start to end
function reconstructPath(cell) {
  const path = [cell];

  while (cell.parent) {
    cell = cell.parent;
    path.unshift(cell);
  }

  return path;
}

// Generate the maze
generateMaze(0, 0);

// Print the maze
printMaze();

// Solve the maze
const path = solveMaze();

if (path === null) {
  console.log("No solution found!");
} else {
  console.log("Solution found:");
  path.forEach((cell, index) => {
    console.log(`Step ${index + 1}: (${cell.x},${cell.y})`);
  });
}
