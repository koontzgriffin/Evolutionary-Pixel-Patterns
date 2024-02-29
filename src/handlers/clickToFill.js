////////////////////////////
// click to fill a cell  ///
////////////////////////////

let prev_cell = [];
let isMouseDown = false;

// Add mouse down event listener to start tracking dragging
MAIN_CANVAS.addEventListener('mousedown', function(event) {
  isMouseDown = true;
  handleMouseClick(event);
});

// Add mouse up event listener to stop tracking dragging
MAIN_CANVAS.addEventListener('mouseup', function() {
  isMouseDown = false;
  prev_cell = [];
});

// Add mouse move event listener to fill or clear cells while dragging
MAIN_CANVAS.addEventListener('mousemove', function(event) {
  if (isMouseDown) {
    handleMouseClick(event);
  }
});

function handleMouseClick(event) {
  let cellSize = MAIN_CANVAS.clientWidth/COLUMNS;
  // Get the position of the canvas
  const canvasRect = MAIN_CANVAS.getBoundingClientRect();

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

  // Toggle the cell value (active or deactive)
  MAIN_GRID.getCell(col, row).toggle();

  // Clear the canvas
  MAIN_CTX.clearRect(0, 0, MAIN_CANVAS.width, MAIN_CANVAS.height);

  // Redraw the grid with the updated pattern
  drawGrid(MAIN_GRID, SHOW_BORDERS);
}