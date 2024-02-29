function randomHandler(){
    // generate random patern in grid
    MAIN_GRID.randomPattern();

    // Clear the canvas
    MAIN_CTX.clearRect(0, 0, MAIN_CANVAS.width, MAIN_CANVAS.height);

    // Draw the grid
    drawGrid(MAIN_GRID, SHOW_BORDERS, MAIN_CTX);
}

function clearHandler(){
    toggleNoSolutionError(false);
    toggleConstraintsCheck(false);
    toggleGenerationComplete(false);
    // clear the grid
    MAIN_GRID.clear();
    
    // Clear the canvas
    MAIN_CTX.clearRect(0, 0, MAIN_CANVAS.width, MAIN_CANVAS.height);

    // draw the grid
    drawGrid(MAIN_GRID, SHOW_BORDERS, MAIN_CTX);
}

function checkConstraintsHandler(){
    let cellSize = MAIN_CANVAS.width/COLUMNS;
    let num_conflicts = 0;
    console.log("checking constraints...")
    refreshConstraints(CONSTRAINTS);
    for(let constraint of CONSTRAINTS){
        constraint.reset();
    }

    for(let y = 0; y < ROWS; y++){
        for(let x = 0; x < COLUMNS; x++){
            // run each constraint on each cell
            for(let constraint of CONSTRAINTS){
                let deduction = constraint.evaluate(MAIN_GRID.getCell(x, y), MAIN_GRID);
                num_conflicts += deduction;
                if(deduction > 0){
                    MAIN_CTX.strokeStyle = "#FF0000";
                    const x_canvas = x * cellSize;
                    const y_canvas = y * cellSize;
                    MAIN_CTX.strokeRect(x_canvas, y_canvas, cellSize, cellSize);
                }
            }
        }
    }
    toggleConstraintsCheck(true, num_conflicts);
}

function generateHandler(){
    console.log("generating with genetic algorithm...");
    //vaildInactiveNeighborhoods = getAllowedNeighborhoodsCookie();
    const result = geneticAlgorithm(ROWS, COLUMNS, POPULATION_SIZE, MAX_ITERATIONS, CONSTRAINTS, drawGrid);
    //mainGrid = result;
    //drawGrid(mainGrid, showBorders);
    //console.log("Generate Complete.")
}

function mutateHandler(){
    console.log("mutating...");
    MAIN_GRID.mutate(MUTATION_RATE);
    drawGrid(MAIN_GRID, SHOW_BORDERS);
    console.log("Mutate Complete.");
}

async function addToGalleryHandler(){
    console.log('adding to gallery...')
    const artistName = document.getElementById('artistName').value;
    const timestamp = new Date().getTime().toString(16);
    const newItem = {
        patternId: `${artistName}-${timestamp}`,
        timestamp: timestamp,
        artistName: artistName, // Add the artistName to the newItem object
        settings: {
            activeColor: ACTIVE_COLOR,
            inactiveColor: INACTIVE_COLOR,
            columns: COLUMNS,
            maxIterations: MAX_ITERATIONS,
            populationSize: POPULATION_SIZE,
            mutationRate: MUTATION_RATE.toString(),
            crossoverRate: CROSSOVER_RATE.toString(),
            constraints: CONSTRAINTS.map(constraint => constraint.name),
            inactiveNeighborhoods: [],
            activeNeighborhoods: []
        },
        grid: MAIN_GRID.toArray(),
    };
    
    try {
        const response = await addGalleryItem(newItem);
        console.log('Item added successfully:', response);
        // Do something with the response, like showing a success message
        toggleAddToGallery(false);
        fetchAndPopulateGallery();
    } catch (error) {
        console.error('Error adding item:', error);
    }
}
