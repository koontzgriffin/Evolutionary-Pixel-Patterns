////////////////////
// Classes /////////
////////////////////

class Grid {
    constructor(rows, columns){
        this.rows = rows;
        this.columns = columns;

        // Initialize the grid with Cell objects
        this.grid = [];
        for (let i = 0; i < rows; i++) {
            const row = [];
            for (let j = 0; j < columns; j++) {
            row.push(new Cell(i, j));
            }
            this.grid.push(row);
        }
    }

    getCell(x, y) {
        // Get a specific cell from the grid
        if (x < columns && x >= 0 && y < rows && y >= 0){
            // if cordnates are valid
            return this.grid[x][y];
        }
        return null;
    }

    activateCell(x, y) {
        // Activate a specific cell
        this.getCell(x, y).activate();
    }

    deactivateCell(x, y) {
        // Deactivate a specific cell
        this.getCell(x, y).deactivate();
    }

    getNextDoorNeighbors(){
        const neighbors = [];

        // Check left neighbor
        if (x > 0) {
        neighbors.push(this.getCell(x - 1, y));
        }

        // Check right neighbor
        if (x < this.rows - 1) {
        neighbors.push(this.getCell(x + 1, y));
        }

        // Check up neighbor
        if (y > 0) {
        neighbors.push(this.getCell(x, y - 1));
        }

        // Check down neighbor
        if (y < this.columns - 1) {
        neighbors.push(this.getCell(x, y + 1));
        }

        return neighbors;
    }

    getAdjacentCells(x, y){
        const adjacents = [];

        // Check left neighbor
        if (x > 0) {
            const left = this.getCell(x - 1, y);
            if(left.active){
                adjacents.push(left);
            }
        }

        // Check right neighbor
        if (x < this.rows - 1) {
            const right = this.getCell(x + 1, y);
            if(right.active){
                adjacents.push(right);
            }
        }

        // Check up neighbor
        if (y > 0) {
            const up = this.getCell(x, y - 1);
            if(up.active){
                adjacents.push(up);
            }
        }

        // Check down neighbor
        if (y < this.columns - 1) {
            const down = this.getCell(x, y + 1);
            if(down.active){
                adjacents.push(down);
            }
        }

        return adjacents;
    }

    getNeighborhoodSeed(x, y){
        return;
    }

    clear() {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++){
            this.deactivateCell(i, j);
          }
        }
    }

    randomPattern(){
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                if(getRandomInt(0, 1) == 1){
                    this.activateCell(i, j);
                }
                else{
                    this.deactivateCell(i, j);
                }
            }
        }
    }

    fillFromArray(data){
        // fills the grid from an array of size = rows * columns
        if (data.length !== this.rows * this.columns) {
            console.error('Invalid array size. Expected size:', this.rows * this.columns);
            return;
        }

        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                const index = i * this.columns + j;
                const value = data[index];
                
                if (value === 1) {
                    this.activateCell(i, j);
                } else {
                    this.deactivateCell(i, j);
                }
            }
        }
    }
}

class Cell {
    constructor(x, y, filled){
        this.x = x;
        this.y = y;
        this.active = false;
    }

    activate() {
        this.active = true;
    }
    
    deactivate() {
        this.active = false;
    }
    
    toggle() {
        this.active ? this.deactivate() : this.activate();
    }
}

class Individual extends Grid {
    constructor(rows, columns, constraints = []) {
        // Call the constructor of the parent class (Grid)
        super(rows, columns);
        // add constraints
        this.constraints = constraints;
        // fill randomly
        this.randomPattern();
        // update fitness
        this.fitness = this.updateFitness();
    }

    updateFitness(){
        // updates the fitness score of an individual
        this.fitness = 0; // set fitness to zero and subtract for conflicts
        let visited_global = Array.from({ length: grid.columns }, () => Array(grid.rows).fill(false));

        // iterate through all cells
        for(let y = 0; y < rows; y++){
            for(let x = 0; x < columns; x++){
                // run each constraint on each cell
                for(let constraint of this.constraints){
                    const result = constraint.run(this.grid);
                }
            }
        }
    }

    reproduce(mate){
        // produces a child from the current individual and another
        const child = new Individual(this.rows, this.columns);
        child.constraints = this.constraints;
        // random split
        const split = getRandomInt(0, this.rows * this.columns);
        // set the childs grid based on a combination of the mates
        child.fillFromArray(this.grid.flat().slice(0, split).concat(mate.grid.flat().slice(split)));
        // mutate the child
        child.mutate();
        // update fitness
        child.updateFitness();

        return child;
    }

    mutate(percentage){
        // mutates the individual randomly (randomly alters a percentage of the individuals grid cells)
        // Calculate the total number of cells in the grid
        const totalCells = this.rows * this.columns;

        // Calculate the number of cells to mutate based on the specified percentage
        const numCellsToMutate = Math.floor(percentage * totalCells / 100);

        // Create an array of all cell indices
        const allCellIndices = Array.from({ length: totalCells }, (_, index) => index);

        // Shuffle the array to get random indices
        const shuffledIndices = shuffleArray(allCellIndices);

        // Mutate the selected number of cells
        for (let i = 0; i < numCellsToMutate; i++) {
            const index = shuffledIndices[i];
            const row = Math.floor(index / this.columns);
            const col = index % this.columns;

            // Perform the mutation (you can modify this based on your requirements)
            this.grid[row][col] = getRandomInt(0, 4); // Assuming the grid values are integers from 0 to 3
        }
    }

    isGoal(){
        // goal is reached if fitness = 0
        return this.fitness == 0;
    }

    addConstraint(constraint){
        // adds a constraint to the individual
        this.constraints.push(constraint);
    }
}

class Population {
    constructor(rows, columns, size, constraints){
        this.size = size;
        this.constraints = constraints;
        this.individuals = [];

        for(let i = 0; i < size; i++){
            this.individuals.push(new Individual(rows, columns, constraints))
        }
    }

    randomSelection(){
        // select an individual from this.individuals with a probability proportional to its fitness
        // Calculate total fitness
        const totalFitness = this.individuals.reduce((sum, individual) => sum + individual.fitness, 0);

        // Generate a random value between 0 and totalFitness
        const randomValue = Math.random() * totalFitness;

        // Perform roulette wheel selection
        let accumulatedFitness = 0;

        for (let i = 0; i < this.size; i++) {
            accumulatedFitness += this.individuals[i].fitness;

            if (accumulatedFitness >= randomValue) {
                return this.individuals[i];
            }
        }

        // Should not reach here, but return null if it does
        return null;
    }

    getBestIndividual(){
        // returns the individual with the highest fitness
        let bestIndividual = null;
        let highestFitness = Number.NEGATIVE_INFINITY;

        for (let i = 0; i < this.size; i++) {
            const currentFitness = this.individuals[i].fitness;
            if (currentFitness > highestFitness) {
                highestFitness = currentFitness;
                bestIndividual = this.individuals[i];
            }
        }

        return bestIndividual;
    }

    addIndividual(individual){
        // adds an individual to the population and updates the size
        this.individuals.push(individual);
        this.size += 1;
    }
}

/////////////////////
// Grid Constants ///
/////////////////////

let canvasWidth = 600;
let columns = 30;
let rows = 30;

//////////////////////
// Canvas Constants //
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
// Genetic Algo Constants //
////////////////////////////

let populationSize = 1000;
let maxIterations = 1000;
let constraints = [];

/////////////
// Objects //
/////////////

let mainGrid = new Grid(rows, columns);

//////////////////////
// Helper Functions //
//////////////////////
function getRandomInt(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function drawGrid(grid, show_borders) {
    ctx.fillStyle = activeColor;
    ctx.strokeStyle = '#dddd';
  
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

////////////////////////
// CSP STUFF ///////////
////////////////////////

function isCyclic(grid, cur, visited, parent, visited_global){
    // Recursive function to check if an active region is cyclic. returns true if cyclic
    visited[cur.x][cur.y] = true;
    visited_global[cur.x][cur.y] = true;
    
    for(const adjacent of grid.getAdjacentCells(cur.x, cur.y)){
        if(!visited[adjacent.x][adjacent.y]){
          // if adjacent not visited, then recurse
          if(isCyclic(grid, adjacent, visited, cur, visited_global)){
            return true;
          }
        }
        else if(parent == null || (parent.x != adjacent.x && parent.y != adjacent.y)){
          // if adjacent is visited and not a parent, then there is a cycle
          return true;
        }
    }
    return false;
}
  
function acyclicConstraint(grid){
    // checks if all active regions are acyclic
    // returns true if the constraint is satisfied, false if conflicted
    let visited_global = Array.from({ length: grid.columns }, () => Array(grid.rows).fill(false));

    for(let y = 0; y < rows; y++){
      for(let x = 0; x < columns; x++){
        if(grid.getCell(x, y).active){
            console.log("checking a region...")
          // if position is active, then check if the region is cyclic
          if(isCyclic(grid, grid.getCell(x, y), Array.from({ length: grid.columns }, () => Array(grid.rows).fill(false)), null, visited_global)){
            return false;
          }
        }
      }
    }
    return true;
}

///////////////////////
// Genetic Algo ///////
///////////////////////

function geneticAlgorithm(rows, columns, populationSize, maxIterations, constraints){
    // runs the genetic algorithm for at most maxIterations with a given population size and constraints
    let population = new Population(rows, columns, populationSize, constraints);
    let current_iteration = 0;
    let goal_found = false;
    let bestIndividual = population.getBestIndividual();
    
    while(current_iteration < maxIterations && !goal_found){
        bestIndividual = population.getBestIndividual();
        const new_population = new Population(rows, columns, 0, constraints);
        
        for(let i = 0; i < populationSize; i++){
            let x = new_population.randomSelection();
            let y = new_population.randomSelection();
            let offspring = x.reproduce(y);
            if(offspring.isGoal()){
                goal_found = true;
                bestIndividual = offspring;
            }
            new_population.addIndividual(offspring);
            current_iteration += 1;
            population = new_population;
        }
    }

    return bestIndividual;
}

///////////////////////
// Handlers ///////////
///////////////////////

function randomHandler(){
    // generate random patern in grid
    mainGrid.randomPattern();

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the grid
    drawGrid(mainGrid, showBorders);
}

function clearHandler(){
    // clear the grid
    mainGrid.clear();
    
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // draw the grid
    drawGrid(mainGrid, showBorders);
}

function checkConstraintsHandler(){
    const isConflicted = !acyclicConstraint(mainGrid);

    if(isConflicted){
        console.log("Conflict!!")
        // Create a new paragraph element
        const paragraph = document.createElement('p');

        // Add text content to the paragraph
        paragraph.textContent = 'There is a conflict with the constraints.';

        // Append the paragraph to the body
        document.body.appendChild(paragraph);
    }
}

function generateHandler(){
    const result = geneticAlgorithm(rows, columns, populationSize, maxIterations, constraints);

}

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
    mainGrid = new Grid(rows, columns);
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

////////////////////////
// RUN TIME ////////////
////////////////////////

// Initial grid drawing
drawGrid(mainGrid, true);