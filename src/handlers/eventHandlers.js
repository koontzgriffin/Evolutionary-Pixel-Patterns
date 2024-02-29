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
    if(acyclicToggle.checked){
        RESTRICT_ACYCLIC = true;
    } else {
        RESTRICT_ACYCLIC = false;
    }
});

const restrictActiveRegionSizeToggle = document.getElementById('restrict-active-region-size');

restrictActiveRegionSizeToggle.addEventListener('change', function() {
    if(restrictActiveRegionSizeToggle.checked){
        RESTRICT_SIZE = true;
    } else {
        RESTRICT_SIZE = false;
    }
})

const ActiveNeighborhoodsConstraintToggle = document.getElementById('active-neighborhoods-constraint');

ActiveNeighborhoodsConstraintToggle.addEventListener('change', function() {
    if(ActiveNeighborhoodsConstraintToggle.checked){
        RESTRICT_ACTIVE_NEIGHBORHOODS = true;
    } else {
        RESTRICT_ACTIVE_NEIGHBORHOODS = false;
    }
});

const inactiveToggle = document.getElementById('inactive-regions-constraint');

inactiveToggle.addEventListener('change', function() {
    if(inactiveToggle.checked){
        RESTRICT_INACTIVE_NEIGHBORHOODS = true;
    } else {
        RESTRICT_INACTIVE_NEIGHBORHOODS = false;
    }
});

const maxSize = document.getElementById('active-region-max');

maxSize.addEventListener('input', function(){
    MAX_SIZE = parseInt(this.value, 10);
});

const minSize = document.getElementById('active-region-min');

minSize.addEventListener('input', function(){
    MIN_SIZE = parseInt(this.value, 10);
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