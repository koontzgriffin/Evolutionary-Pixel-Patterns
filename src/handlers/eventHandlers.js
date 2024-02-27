//////////////////////////
// Event Handlers ////////
//////////////////////////

// color pickers
const colorPickerActive = document.getElementById('colorPickerActive');
colorPickerActive.addEventListener('input', function() {
    activeColor = colorPickerActive.value;
    drawGrid(mainGrid, showBorders);
});

const colorPickerInactive = document.getElementById('colorPickerInactive');
colorPickerInactive.addEventListener('input', function() {
    inactiveColor = colorPickerInactive.value;
    drawGrid(mainGrid, showBorders);
});

// constraints
const acyclicToggle = document.getElementById('acyclic-constraint');

acyclicToggle.addEventListener('change', function() {
    const index = constraints.findIndex(existingItem => existingItem.name === "Active Region Constraint");

    if (index !== -1) {
        // Item is in the array, remove it
        constraints.splice(index, 1);
    } else {
        // Item is not in the array, add it
        constraints.push(new ActiveRegionConstraint());
    }
    console.log(constraints);
});

const inactiveToggle = document.getElementById('inactive-regions-constraint');

inactiveToggle.addEventListener('change', function() {
    const index = constraints.findIndex(existingItem => existingItem.name === "Inactive Neighborhoods Constraint");

    if (index !== -1) {
        // Item is in the array, remove it
        constraints.splice(index, 1);
    } else {
        // Item is not in the array, add it
        constraints.push(new InactiveNeighborhoodsConstraint(vaildInactiveNeighborhoods));
    }
    console.log(constraints);
});

// border toggle
const borderToggle = document.getElementById('borderToggle');

borderToggle.addEventListener('change', function() {
    this.checked ? showBorders = true : showBorders = false;
    drawGrid(mainGrid, showBorders);
});

// fields

const columnsInput = document.getElementById('columns');
columnsInput.addEventListener('input', function() {
    columns = parseInt(this.value, 10); // Parse the value as an integer
    rows = columns;
    cellSize = canvasWidth/columns;
    mainGrid = new Individual(rows, columns);
    drawGrid(mainGrid, showBorders);
});

const maxIterationsInput = document.getElementById('maxIterations');
maxIterationsInput.addEventListener('input', function() {
    maxIterations = parseInt(this.value, 10); // Parse the value as an integer
});

const populationSizeInput = document.getElementById('populationSize');
populationSizeInput.addEventListener('input', function() {
    populationSize = parseInt(this.value, 10); // Parse the value as an integer
});

const mutationRateInput = document.getElementById('mutationRate');
mutationRateInput.addEventListener('input', function() {
    mutationRate = parseFloat(this.value, 10); // Parse the value as a float
});

const crossoverRateInput = document.getElementById('crossoverRate');
crossoverRateInput.addEventListener('input', function() {
    crossoverRate = parseFloat(this.value, 10); // Parse the value as a float
});



////////////////////////////
// click to fill a cell  ///
////////////////////////////

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
    let cellSize = canvasWidth/columns;
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

    // Toggle the cell value (active or deactive)
    mainGrid.getCell(col, row).toggle();

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Redraw the grid with the updated pattern
    drawGrid(mainGrid, showBorders);
}
