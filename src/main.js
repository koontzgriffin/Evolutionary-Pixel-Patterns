/*
import Individual from './individual';
import Population from './population';
import { ActiveRegionConstraint, InactiveNeighborhoodsConstraint } from './constraint';
*/
/////////////////////
// Grid Params //////
/////////////////////

let canvasWidth = 600;
let columns = 16;
let rows = 16;

//////////////////////
// Canvas Params /////
//////////////////////

let cellSize = canvasWidth/columns; // You can adjust this size as needed
const canvas = document.getElementById('gridCanvas');
const ctx = canvas.getContext('2d');
canvas.width = canvasWidth;
canvas.height = canvasWidth;

let activeColor = '#000000'
let inactiveColor = '#ffffff'
let showBorders = true;

////////////////////////////
// Constraint Params ///////
////////////////////////////
let vaildInactiveNeighborhoods = ['000101000', '000101001', '000101100', '000101101', '000101111', '001100001', '001100101', '001100110', '001100111', '001101000', '001101001', '001101100', '001101101', '001101111', '010000010', '010000011', '010000101', '010000110', '010000111', '011000010', '011000011', '011000101', '011000110', '011000111', '011001101', '100001111', '100001101', '100001100', '100001011', '100101000', '100101001', '100101101', '100101100', '100101111', '101000010', '101000011', '101000101', '101000110', '101000111', '101001011', '101001100', '101001101', '101001111', '101100001', '101100101', '101100110', '101100111', '101101000', '101101001', '101101100', '101101101', '101101111', '110000010', '110000011', '110000101', '110000110', '110000111', '110100001', '110100101', '110100110', '110100111', '111000010', '111000011', '111000101', '111000110', '111000111', '111001011', '111001100', '111001101', '111001111', '111100001', '111100101', '111101000', '111100111', '111100110', '111101001', '111101101', '111101100', '011001111', '011001011', '011001100'];

////////////////////////////
// Genetic Algo Params  ////
////////////////////////////

let populationSize = 500;
let maxIterations = 200;
let mutationRate = 0.1;
let crossoverRate = 0.75;
let constraints = [];

/////////////
// Objects //
/////////////

let mainGrid = new Individual(rows, columns, constraints);

//////////////////////
// Helper Functions //
//////////////////////

function getRandomInt(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function drawGrid(grid, show_borders) {
    ctx.fillStyle = activeColor;
    ctx.strokeStyle = '#dddd';

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  
    for (let row = 0; row < grid.rows; row++) {
        for (let col = 0; col < grid.columns; col++) {
            const x = col * cellSize;
            const y = row * cellSize;
  
            if(grid.getCell(col, row).active){
                ctx.fillStyle = activeColor;
            } else{
                ctx.fillStyle = inactiveColor;
            }
            ctx.fillRect(x, y, cellSize, cellSize);
            if(show_borders){
                ctx.strokeRect(x, y, cellSize, cellSize);
            }
        }
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
////////////////////////////
// click to fill a cell  ///
////////////////////////////
/*
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

  // Toggle the cell value (active or deactive)
  mainGrid.getCell(col, row).toggle();

  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Redraw the grid with the updated pattern
  drawGrid(mainGrid, showBorders);
}
*/
///////////////////////
// Genetic Algo ///////
///////////////////////

function geneticAlgorithm(rows, columns, populationSize, maxIterations, constraints){
    toggleNoSolutionError(false);
    // runs the genetic algorithm for at most maxIterations with a given population size and constraints
    let population = new Population(rows, columns, populationSize, constraints);
    let current_iteration = 0;
    let goal_found = false;
    let bestIndividual = population.getBestIndividual();
    console.log(`original best fitness = ${bestIndividual.fitness}`);

    while(current_iteration < maxIterations && !goal_found){
        bestIndividual = population.getBestIndividual();
        const new_population = new Population(rows, columns, 0, constraints);
        new_population.addIndividual(bestIndividual);
        console.log(`gen ${current_iteration} best individual fitness = ${bestIndividual.fitness}`);
        for(let i = 0; i < populationSize - 1; i++){
            let x = population.bestSelection(); // population.randomSelection();
            let y = population.bestSelection(); // population.randomSelection();
            let offspring = x.reproduce(y, crossoverRate);
            //console.log(`ofspring fitness = ${offspring.fitness}`);
            if(offspring.isGoal()){
                console.log(`goal reached after ${current_iteration} iterations.`)
                goal_found = true;
                bestIndividual = offspring;
                changeCount(current_iteration);
                return bestIndividual;
            }
            new_population.addIndividual(offspring);
            population = new_population;

        }
        current_iteration += 1;
    }
    toggleNoSolutionError(true);
    changeCount(current_iteration);
    console.log(bestIndividual);
    return bestIndividual;
}

/////////////////////////////////////////////////
// Handlers /////////////////////////////////////
/////////////////////////////////////////////////
function toggleNoSolutionError(show) {
    const errorContainer = document.getElementById('errorNoSolution');
    // Set the display property based on the boolean parameter
    errorContainer.style.display = show ? 'block' : 'none';
}

function toggleConstraintsCheck(show, num = 0) {
    const errorContainer = document.getElementById('constraintsCheck');
    // Set the display property based on the boolean parameter
    errorContainer.style.display = show ? 'block' : 'none';
    const message = document.getElementById('constraintsMessage');
    message.textContent = `! - Constraint Check: there was ${num} conflicts`;
}

function changeCount(newCount) {
    const iterationElement = document.getElementById('iterationCount');
    // Update the iteration count
    iterationElement.innerText = `Iteration: ${newCount}`;
}

function randomHandler(){
    // generate random patern in grid
    mainGrid.randomPattern();

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the grid
    drawGrid(mainGrid, showBorders);
}

function clearHandler(){
    toggleNoSolutionError(false);
    toggleConstraintsCheck(false);
    // clear the grid
    mainGrid.clear();
    
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // draw the grid
    drawGrid(mainGrid, showBorders);
}

function checkConstraintsHandler(){
    let num_conflicts = 0;
    console.log("checking constraints...")
    for(let constraint of constraints){
        constraint.reset();
    }

    for(let y = 0; y < rows; y++){
        for(let x = 0; x < columns; x++){
            // run each constraint on each cell
            for(let constraint of constraints){
                num_conflicts += constraint.evaluate(mainGrid.getCell(x, y), mainGrid);
            }
        }
    }
    toggleConstraintsCheck(true, num_conflicts);
}

function generateHandler(){
    console.log("generating with genetic algorithm...");
    const result = geneticAlgorithm(rows, columns, populationSize, maxIterations, constraints);
    mainGrid = result;
    drawGrid(mainGrid, showBorders);
    console.log("Generate Complete.")
}

function mutateHandler(){
    console.log("mutating...");
    mainGrid.mutate(mutationRate);
    drawGrid(mainGrid, showBorders);
    console.log("Mutate Complete.");
}

//////////////////////////
// Event Handlers ////////
//////////////////////////
/*
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
*/

////////////////////////
// RUN TIME ////////////
////////////////////////

// Initial grid drawing
drawGrid(mainGrid, showBorders);