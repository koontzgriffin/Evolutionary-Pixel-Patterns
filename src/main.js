/*
import Individual from './individual';
import Population from './population';
import { ActiveRegionConstraint, InactiveNeighborhoodsConstraint } from './constraint';
*/
/////////////////////
// Grid Params //////
/////////////////////

let canvasWidth = 600;
let columns = 10;
let rows = 10;

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

let vaildInactiveNeighborhoods = getAllowedNeighborhoodsCookie();

////////////////////////////
// Genetic Algo Params  ////
////////////////////////////

let populationSize = 800;
let maxIterations = 50;
let mutationRate = 0.01;
let crossoverRate = 0.80;
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

///////////////////////
// Genetic Algo ///////
///////////////////////
/*
function geneticAlgorithm(rows, columns, populationSize, maxIterations, constraints, drawGridCallback){
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
        drawGridCallback(bestIndividual);
        changeCount(current_iteration);
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
*/
function geneticAlgorithm(rows, columns, populationSize, maxIterations, constraints, drawGridCallback) {
    toggleNoSolutionError(false);
    toggleGenerationComplete(false);

    let population = new Population(rows, columns, populationSize, constraints);
    let currentIteration = 0;
    let goalFound = false;

    function runNextIteration() {
        if (currentIteration < maxIterations && !goalFound) {
            const bestIndividual = population.getBestIndividual();
            const newPopulation = new Population(rows, columns, 0, constraints);
            newPopulation.addIndividual(bestIndividual);
            drawGridCallback(bestIndividual, showBorders);
            changeCount(currentIteration);

            setTimeout(() => {
                for (let i = 0; i < populationSize - 1; i++) {
                    let x = population.bestSelection();
                    let y = population.bestSelection();
                    let offspring = x.reproduce(y, crossoverRate);

                    if (offspring.isGoal()) {
                        console.log(`Goal reached after ${currentIteration} iterations.`);
                        drawGridCallback(offspring, showBorders);
                        mainGrid = offspring;
                        goalFound = true;
                        changeCount(currentIteration);
                        toggleGenerationComplete(true);
                        return;
                    }

                    newPopulation.addIndividual(offspring);
                }
                population = newPopulation;
                currentIteration++;
                runNextIteration(); // Run the next iteration recursively
            }, 0);
        } else {
            const bestIndividual = population.getBestIndividual();
            toggleNoSolutionError(true);
            changeCount(currentIteration);
            drawGridCallback(bestIndividual, showBorders);
            mainGrid = bestIndividual;
            console.log(bestIndividual);
        }
    }

    // Start the first iteration
    runNextIteration();
}
/////////////////////////////////////////////////
// Handlers /////////////////////////////////////
/////////////////////////////////////////////////
function toggleNoSolutionError(show) {
    const errorContainer = document.getElementById('errorNoSolution');
    // Set the display property based on the boolean parameter
    errorContainer.style.display = show ? 'block' : 'none';
}

function toggleAddToGallery(show){
    const addToGalleryContainer = document.getElementById('addToGallery');
    // Set the display property based on the boolean parameter
    addToGalleryContainer.style.display = show ? 'block' : 'none';
}

function toggleGenerationComplete(show) {
    const errorContainer = document.getElementById('generationComplete');
    // Set the display property based on the boolean parameter
    errorContainer.style.display = show ? 'block' : 'none';

    toggleAddToGallery(show);
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
    toggleGenerationComplete(false);
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
                let deduction = constraint.evaluate(mainGrid.getCell(x, y), mainGrid);
                num_conflicts += deduction;
                if(deduction > 0){
                    ctx.fillStyle = "#D10000";
                    const x_canvas = x * cellSize;
                    const y_canvas = y * cellSize;
                    ctx.strokeRect(x_canvas, y_canvas, cellSize, cellSize);
                }
            }
        }
    }
    toggleConstraintsCheck(true, num_conflicts);
}

function generateHandler(){
    console.log("generating with genetic algorithm...");
    vaildInactiveNeighborhoods = getAllowedNeighborhoodsCookie();
    const result = geneticAlgorithm(rows, columns, populationSize, maxIterations, constraints, drawGrid);
    //mainGrid = result;
    //drawGrid(mainGrid, showBorders);
    //console.log("Generate Complete.")
}

function mutateHandler(){
    console.log("mutating...");
    mainGrid.mutate(mutationRate);
    drawGrid(mainGrid, showBorders);
    console.log("Mutate Complete.");
}

async function addToGalleryHandler(){
    console.log('adding to gallery...')
    const artistName = document.getElementById('artistName').value;
    const newItem = {
        patternId: 'testId',
        artistName: artistName, // Add the artistName to the newItem object
        settings: {
            activeColor: activeColor,
            inactiveColor: inactiveColor,
            columns: columns,
            maxIterations: maxIterations,
            populationSize: populationSize,
            mutationRate: toString(mutationRate),
            crossoverRate: toString(crossoverRate),
            constraints: constraints.map(constraint => constraint.name),
            inactiveNeighborhoods: vaildInactiveNeighborhoods,
            activeNeighborhoods: []
        },
        grid: mainGrid.grid,
    };
    
    try {
        const response = await addGalleryItem(newItem);
        console.log('Item added successfully:', response);
        // Do something with the response, like showing a success message
        toggleAddToGallery(false);
    } catch (error) {
        console.error('Error adding item:', error);
    }
}

////////////////////////
// RUN TIME ////////////
////////////////////////

// Initial grid drawing
drawGrid(mainGrid, showBorders);