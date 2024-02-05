// Grid Constants
const windowWidth = 600; //window.innerWidth;
const windowHeight = 600; //window.innerHeight;
const cellSize = 20; // You can adjust this size as needed
const columns = Math.floor(windowWidth / cellSize);
const rows = Math.floor(windowHeight / cellSize);

// Canvas Constants
const canvas = document.getElementById('gridCanvas');
const ctx = canvas.getContext('2d');
canvas.width = windowWidth;
canvas.height = windowHeight;

// Cells Array
var cells = emptyMatrix(rows, columns);

// Functions
function getRandomInt(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function emptyMatrix(rows, columns) {
  const matrix = [];

  for (let i = 0; i < rows; i++) {
    const row = Array(columns).fill(0);
    matrix.push(row);
  }

  return matrix;
}

function randomPattern(rows, columns){
  const matrix = [];

  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < columns; j++) {
      row.push(getRandomInt(0, 1));
    }
    matrix.push(row);
  }

  return matrix;
}

function drawGrid() {
  ctx.fillStyle = '#000000'
  ctx.strokeStyle = '#ddd';

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      const x = col * cellSize;
      const y = row * cellSize;

      if(cells[row][col] == 1){
        ctx.fillRect(x, y, cellSize, cellSize);
      } else{
        ctx.strokeRect(x, y, cellSize, cellSize);
      }
    }
  }
}

function generateRandom(){
  cells = randomPattern(rows, columns);
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Redraw the grid with the new pattern
  drawGrid();
}

function clearGrid(){
  cells = emptyMatrix(rows, columns);
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Redraw the grid with the new pattern
  drawGrid();
}

// click to fill a cell
let prev_cell = [];
let isMouseDown = false;

// Add mouse down event listener to start tracking dragging
canvas.addEventListener('mousedown', function(event) {
  isMouseDown = true;
  handleMouseClick(event);
});

// Add mouse up event listener to stop tracking dragging
canvas.addEventListener('mouseup', function() {
  isMouseDown = false;
  prev_cell = [];
});

// Add mouse move event listener to fill or clear cells while dragging
canvas.addEventListener('mousemove', function(event) {
  if (isMouseDown) {
    handleMouseClick(event);
  }
});

function handleMouseClick(event) {
  // Get the position of the canvas
  const canvasRect = canvas.getBoundingClientRect();

  // Calculate the clicked coordinates relative to the canvas
  const x = event.clientX - canvasRect.left;
  const y = event.clientY - canvasRect.top;

  // Calculate the row and column based on the click coordinates
  const col = Math.floor(x / cellSize);
  const row = Math.floor(y / cellSize);

  if(prev_cell[0] == col && prev_cell[1] == row){
    return;
  }

  prev_cell = [col, row];

  // Toggle the cell value (0 to 1 or 1 to 0)
  cells[row][col] = 1 - cells[row][col];

  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Redraw the grid with the updated pattern
  drawGrid();
}

////////////////////////
// CSP STUFF ///////////
////////////////////////

function isCyclic(cur, visited, parent){
  // Recursive function to check if a filled region is cyclic
  const cur_x = cur[0];
  const cur_y = cur[1];

  visited[cur_x][cur_y] = true;

  const left = cur_x == 0 ? null : [cur_x - 1, cur_y];
  const right = cur_x == columns - 1 ? null: [cur_x + 1, cur_y];
  const top = cur_y == 0 ? null : [cur_x, cur_y - 1];
  const bottom = cur_y == rows - 1 ? null : [cur_x, cur_y + 1];

  const neighbors = [left, right, top, bottom]

  for(const neighbor of neighbors){
    if(neighbor == null){
      console.log("null neighbor...")
      continue;
    }
    if(cells[neighbor[0]][neighbor[1]] == 1){
      // filled neighbor
      if(!visited[neighbor[0]][neighbor[1]]){
        // if neighbor is filled and not visited, then recurse
        if(isCyclic(neighbor, visited, cur)){
          return true;
        }
      }
      else if(parent == null || (parent[0] != neighbor[0] && parent[1] != neighbor[1])){
        // if neighbor is filled, visited, and not a parent, then there is a cycle
        console.log("hit a visited cell that is not the parent.")
        return true;
      }
    }
  }
  return false;
}

function acyclicConstraint(){
  // checks if all black regions are acyclic
  // returns true if the constraint is satisfied, false if conflicted

  for(let y = 0; y < rows; y++){
    for(let x = 0; x < columns; x++){
      if(cells[x][y] == 1){
        // if position is filled, then check if the region is cyclic
        if(isCyclic([x, y], Array.from({ length: columns }, () => Array(rows).fill(false)), null)){
          return false;
        }
      }
    }
  }
  return true;
}

function checkConstraintsHandler(){
  const isConflicted = !acyclicConstraint();

  if(isConflicted){
    // Create a new paragraph element
    const paragraph = document.createElement('p');

    // Add text content to the paragraph
    paragraph.textContent = 'There is a conflict with the constraints.';

    // Append the paragraph to the body
    document.body.appendChild(paragraph);
  }
}


////////////////////////
// RUN TIME ////////////
////////////////////////
// Initial grid drawing
drawGrid();