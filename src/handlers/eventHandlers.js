//////////////////////////
// Event Handlers ////////
//////////////////////////

// color pickers
const colorPickerActive = document.getElementById('colorPickerActive');
colorPickerActive.addEventListener('input', function() {
    ACTIVE_COLOR = colorPickerActive.value;
    drawGrid(MAIN_GRID, SHOW_BORDERS);
});

const colorPickerInactive = document.getElementById('colorPickerInactive');
colorPickerInactive.addEventListener('input', function() {
    INACTIVE_COLOR = colorPickerInactive.value;
    drawGrid(MAIN_GRID, SHOW_BORDERS);
});

// constraints
const acyclicToggle = document.getElementById('acyclic-constraint');

acyclicToggle.addEventListener('change', function() {
    const index = CONSTRAINTS.findIndex(existingItem => existingItem.name === "Active Region Constraint");

    if(acyclicToggle.checked && index !== -1){
        // Enabled and in the Constraints Array, update the constraints
        refreshConstraints(CONSTRAINTS);
    }
    else if(!acyclicToggle.checked && index !== -1){
        // Disabled and in the Constraints Array
        // check if other field is checked, if not remove the constraint
        const restrictActiveRegionSizeToggle = document.getElementById('restrict-active-region-size');
        if(!restrictActiveRegionSizeToggle.checked){
            CONSTRAINTS.splice(index, 1);
        }
    }
    else {
        // add the new constraint with the correct params
        CONSTRAINTS.push(new ActiveRegionConstraint(restrict_acyclic = true));
    }
    console.log(CONSTRAINTS);
});

const restrictActiveRegionSizeToggle = document.getElementById('restrict-active-region-size');

restrictActiveRegionSizeToggle.addEventListener('change', function() {
    const index = CONSTRAINTS.findIndex(existingItem => existingItem.name === "Active Region Constraint");

    if(restrictActiveRegionSizeToggle.checked && index !== -1){
        // Enabled and in the Constraints Array, update the constraints
        refreshConstraints(CONSTRAINTS);
    }
    else if(!restrictActiveRegionSizeToggle.checked && index !== -1){
        // Disabled and in the Constraints Array
        // check if other field is checked, if not remove the constraint
        const acyclicToggle = document.getElementById('acyclic-constraint');
        if(!acyclicToggle.checked){
            CONSTRAINTS.splice(index, 1);
        }
        refreshConstraints(CONSTRAINTS);
    }
    else {
        // add the new constraint with the correct params
        CONSTRAINTS.push(new ActiveRegionConstraint(restrict_acyclic = false));
    }
    console.log(CONSTRAINTS);
})


const inactiveToggle = document.getElementById('inactive-regions-constraint');

inactiveToggle.addEventListener('change', function() {
    const index = CONSTRAINTS.findIndex(existingItem => existingItem.name === "Inactive Neighborhoods Constraint");

    if (index !== -1) {
        // Item is in the array, remove it
        CONSTRAINTS.splice(index, 1);
    } else {
        // Item is not in the array, add it
        let vaildInactiveNeighborhoods = getAllowedNeighborhoodsCookie();
        CONSTRAINTS.push(new InactiveNeighborhoodsConstraint(vaildInactiveNeighborhoods));
    }
    console.log(CONSTRAINTS);
});

// border toggle
const borderToggle = document.getElementById('borderToggle');

borderToggle.addEventListener('change', function() {
    this.checked ? SHOW_BORDERS = true : SHOW_BORDERS = false;
    drawGrid(MAIN_GRID, SHOW_BORDERS);
});

// fields

const columnsInput = document.getElementById('columns');
columnsInput.addEventListener('input', function() {
    COLUMNS = parseInt(this.value, 10); // Parse the value as an integer
    ROWS = COLUMNS;
    MAIN_GRID = new Individual(ROWS, COLUMNS);
    drawGrid(MAIN_GRID, SHOW_BORDERS);
});

const maxIterationsInput = document.getElementById('maxIterations');
maxIterationsInput.addEventListener('input', function() {
    MAX_ITERATIONS = parseInt(this.value, 10); // Parse the value as an integer
});

const populationSizeInput = document.getElementById('populationSize');
populationSizeInput.addEventListener('input', function() {
    POPULATION_SIZE = parseInt(this.value, 10); // Parse the value as an integer
});

const mutationRateInput = document.getElementById('mutationRate');
mutationRateInput.addEventListener('input', function() {
    MUTATION_RATE = parseFloat(this.value, 10); // Parse the value as a float
});

const crossoverRateInput = document.getElementById('crossoverRate');
crossoverRateInput.addEventListener('input', function() {
    CROSSOVER_RATE = parseFloat(this.value, 10); // Parse the value as a float
});