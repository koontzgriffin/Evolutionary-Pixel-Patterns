//////////////////////
// Helper Functions //
//////////////////////

function getRandomInt(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function drawGrid(grid, show_borders) {
    let cellSize = MAIN_CANVAS.clientWidth/COLUMNS;

    // Set canvas width and height explicitly
    MAIN_CANVAS.width = MAIN_CANVAS.clientWidth;
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

function refreshConstraints(constraints) {
    console.log('refreshing constraints...')
    for(let constraint of constraints){
        if(constraint.name == "Inactive Neighborhoods Constraint"){
            let vaildInactiveNeighborhoods = getAllowedNeighborhoodsCookie();
            constraint.setAllowedNeighborhoods(vaildInactiveNeighborhoods);
        }
        else if(constraint.name == "Active Region Constraint"){
            const restrictSize = document.getElementById('restrict-active-region-size')

            if(restrictSize.checked){
                const minInput = document.getElementById('active-region-min');
                const maxInput = document.getElementById('active-region-max');

                // Convert the input values to integers
                const min = parseInt(minInput.value);
                const max = parseInt(maxInput.value);

                constraint.min_size = min;
                constraint.max_size = max;
            }
            else{
                constraint.min_size = -1;
                constraint.max_size = -1;
            }
        }
    }
}