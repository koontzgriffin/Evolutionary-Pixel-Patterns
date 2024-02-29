//////////////////////
// Helper Functions //
//////////////////////

function getRandomInt(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function drawGrid(grid, show_borders) {
    let cellSize = Math.floor(MAIN_CANVAS.clientWidth/COLUMNS);
    const actualCanvasWidth = grid.columns * cellSize; // Calculate the actual width needed for the grid

    // Set canvas width and height explicitly
    MAIN_CANVAS.width = actualCanvasWidth;
    MAIN_CANVAS.height = grid.rows * cellSize;

    MAIN_CTX.clearRect(0, 0, MAIN_CTX.canvas.width, MAIN_CTX.canvas.height);

    for (let row = 0; row < grid.rows; row++) {
        for (let col = 0; col < grid.columns; col++) {
            const x = col * cellSize;
            const y = row * cellSize;
  
            if(grid.getCell(col, row).active){
                MAIN_CTX.fillStyle = ACTIVE_COLOR;
            } else{
                MAIN_CTX.fillStyle = INACTIVE_COLOR;
            }
            MAIN_CTX.fillRect(x, y, cellSize, cellSize);
            if(show_borders){
                MAIN_CTX.strokeStyle = '#ddd';
                MAIN_CTX.strokeRect(x, y, cellSize, cellSize);
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

function getConstraints(){
    let constraints = []
    if(RESTRICT_ACTIVE_NEIGHBORHOODS){
        let neighborhoods = getAllowedActiveNeighborhoodsCookie();
        constraints.push(ActiveNeighborhoodsConstraint(neighborhoods));
    }
    if(RESTRICT_INACTIVE_NEIGHBORHOODS){
        let neighborhoods = getAllowedInactiveNeighborhoodsCookie();
        constraints.push(ActiveNeighborhoodsConstraint(neighborhoods));
    }
    if(RESTRICT_ACYCLIC || RESTRICT_SIZE){
        let constraint = new ActiveRegionConstraint(restrict_acyclic=RESTRICT_ACYCLIC);
        if(RESTRICT_SIZE){
            constraint.min_size = MIN_SIZE;
            constraint.max_size = MAX_SIZE;
        }
        constraints.push(constraint);
    }
    return constraints;
}

function syncUI(){
    document.getElementById('columns').value = COLUMNS;

    // Sync colors
    document.getElementById('colorPickerActive').value = ACTIVE_COLOR;
    document.getElementById('colorPickerInactive').value = INACTIVE_COLOR;

    // Sync show borders checkbox
    document.getElementById('borderToggle').checked = SHOW_BORDERS;

    // Sync genetic algorithm parameters
    document.getElementById('populationSize').value = POPULATION_SIZE;
    document.getElementById('maxIterations').value = MAX_ITERATIONS;
    document.getElementById('mutationRate').value = MUTATION_RATE;
    document.getElementById('crossoverRate').value = CROSSOVER_RATE;

    document.getElementById('inactive-regions-constraint').checked = RESTRICT_INACTIVE_NEIGHBORHOODS;
    document.getElementById('active-neighborhoods-constraint').checked = RESTRICT_ACTIVE_NEIGHBORHOODS;

    document.getElementById('acyclic-constraint').checked = RESTRICT_ACYCLIC;
    document.getElementById('restrict-active-region-size').checked = RESTRICT_SIZE;

    document.getElementById('active-region-min').value = MIN_SIZE;
    document.getElementById('active-region-max').value = MAX_SIZE;
}