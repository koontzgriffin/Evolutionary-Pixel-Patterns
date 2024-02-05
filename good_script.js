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
                const cell = data[index];
                
                if (cell.active) {
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
        // instantiate and update fitness
        this.fitness;
        this.updateFitness();
    }

    updateFitness(){
        // updates the fitness score of an individual
        this.fitness = 0; // set fitness to zero and subtract for conflicts

        // reset all constraints
        for(let constraint of constraints){
            constraint.reset();
        }

        // iterate through all cells
        for(let y = 0; y < rows; y++){
            for(let x = 0; x < columns; x++){
                // run each constraint on each cell
                for(let constraint of this.constraints){
                    const satisfied = constraint.evaluate(this.getCell(x, y), this);
                    if(!satisfied){
                        this.fitness -= 5;
                    }
                }
            }
        }
    }

    reproduce(mate){
        // produces a child from the current individual and another
        const child = new Individual(this.rows, this.columns, constraints);
        // random split
        const split = getRandomInt(0, this.rows * this.columns);
        // set the childs grid based on a combination of the mates
        const genomeA = this.grid.flat();
        const genomeB = mate.grid.flat();
        const genome_child = genomeA.slice(0, split).concat(genomeB.slice(split))
        child.fillFromArray(genome_child);
        // mutate the child
        child.mutate(mutationRate);
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

            // Perform the mutation
            this.getCell(col, row).active ?  this.deactivateCell(col, row) : this.activateCell(col, row);
        }
    }

    isGoal(){
        // goal is reached if fitness = 0
        return this.fitness === 0;
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
        // select an individual from this.individuals with a probability proportional to its fitness. optimal fitness is 0 worse fitness < 0
        let min = this.individuals.reduce(
            (min, current) => Math.min(min, current.fitness),
            Infinity
        );
        // Calculate total fitness
        let totalFitness = 0;
        for (let i = 0; i < this.individuals.length; i++) {
            totalFitness += (this.individuals[i].fitness - min);
        }

        // Generate a random value between 0 and totalFitness
        const randomValue = Math.random() * totalFitness;

        // Linear search to find the selected individual
        let currentFitnessSum = 0;

        for (let i = 0; i < this.individuals.length; i++) {
            currentFitnessSum += (this.individuals[i].fitness - min);

            if (currentFitnessSum >= randomValue) {
                return this.individuals[i];
            }
        }

        // Should not reach here, but return null if it does
        console.log("FuCKEDDDD")
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

class Constraint {
    // Common implementation for all constraints.
    constructor() {
    }

    evaluate(cell, individual) {
        // an empty evaluate function that is always satisfied. takes a cell and an individual.
        return true;
    }

    reset(){
    }
}

class AcyclicConstraint extends Constraint {
    constructor(){
        super();
        this.name = "Acyclic Constraint";
        this.visited_global = Array.from({ length: columns }, () => Array(rows).fill(false));
    }

    evaluate(cell, individual){
        // checks if an active region starting from "cell" is acyclic
        // returns true if the constraint is satisfied, false if conflicted
        if(!cell.active || this.visited_global[cell.x][cell.y]){
            // constraint only relevant on active cells and cells that havent been a part of a previous region.
            return true;
        }
        let visited = Array.from({ length: individual.columns }, () => Array(individual.rows).fill(false));
        // if position is active, then check if the region is cyclic
        if(this.isCyclic(individual, cell, visited, null)){
            return false;
        }
        
        return true;
    }

    isCyclic(grid, cur, visited, parent){
        // Recursive function to check if an active region is cyclic. returns true if cyclic
        visited[cur.x][cur.y] = true;
        this.visited_global[cur.x][cur.y] = true;
        
        for(const adjacent of grid.getAdjacentCells(cur.x, cur.y)){
            if(!visited[adjacent.x][adjacent.y]){
              // if adjacent not visited, then recurse
              if(this.isCyclic(grid, adjacent, visited, cur)){
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

    reset(){
        this.visited_global = Array.from({ length: columns }, () => Array(rows).fill(false));
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
let mutationRate = 2;
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

/*
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
        const new_population = new Population(rows, columns, 0, constraints);
        for(let i = 0; i < populationSize; i++){
            let x = population.randomSelection();
            let y = population.randomSelection();
            let offspring = x.reproduce(y);
            console.log(`ofspring fitness = ${offspring.fitness}`);
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
    let isConflicted = false;
    let num_conflicts = 0;
    console.log("checking constraints...")
    for(let constraint of constraints){
        constraint.reset();
    }

    for(let y = 0; y < rows; y++){
        for(let x = 0; x < columns; x++){
            // run each constraint on each cell
            for(let constraint of constraints){
                const satisfied = constraint.evaluate(mainGrid.getCell(x, y), mainGrid);
                if(!satisfied){
                    isConflicted = true;
                    num_conflicts += 1;
                    console.log("Conflict!!")
                }
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
    const index = constraints.findIndex(existingItem => existingItem.name === "Acyclic Constraint");

    if (index !== -1) {
        // Item is in the array, remove it
        constraints.splice(index, 1);
    } else {
        // Item is not in the array, add it
        constraints.push(new AcyclicConstraint());
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

////////////////////////
// RUN TIME ////////////
////////////////////////

function testSelection(){
    let individuals = [{fitness: -1}, {fitness: -4}, {fitness: -6},{fitness:0}, {fitness: -2}, {fitness: -3}]
    let min = individuals.reduce(
        (min, current) => Math.min(min, current.fitness),
        Infinity
      );
    console.log(individuals);
    // Calculate total fitness
    let totalFitness = 0;
    for (let i = 0; i < individuals.length; i++) {
        totalFitness += (individuals[i].fitness - min);
    }

    // Generate a random value between 0 and totalFitness
    const randomValue = Math.random() * totalFitness;
    console.log(`rand = ${randomValue}`);

    // Linear search to find the selected individual
    let currentFitnessSum = 0;

    for (let i = 0; i < individuals.length; i++) {
        currentFitnessSum += (individuals[i].fitness - min);
        console.log(`curSum = ${currentFitnessSum}`);

        if (currentFitnessSum >= randomValue) {
            console.log(individuals[i]);
            return;
        }
    }

    // Should not reach here, but return null if it does
    console.log("FuCKEDDDD")
}


// Initial grid drawing
drawGrid(mainGrid, showBorders);