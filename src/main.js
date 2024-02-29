/////////////
// Globals //
/////////////

// main grid/canvas params
let COLUMNS = 10;
let ROWS = 10;

let ACTIVE_COLOR = '#000000'
let INACTIVE_COLOR = '#ffffff'
let SHOW_BORDERS = true;

// references to the main grid canvas
const MAIN_CANVAS = document.getElementById('gridCanvas');
const MAIN_CTX = MAIN_CANVAS.getContext('2d');

// genetic algo parameters
let POPULATION_SIZE = 800;
let MAX_ITERATIONS = 50;
let MUTATION_RATE = 0.01;
let CROSSOVER_RATE = 0.80;

// constraint parameters
let RESTRICT_ACYCLIC = false;
let RESTRICT_SIZE = false;
let MIN_SIZE = 1;
let MAX_SIZE = 10;
let RESTRICT_ACTIVE_NEIGHBORHOODS = false;
let RESTRICT_INACTIVE_NEIGHBORHOODS = false;


////////////////////////
// RUN TIME ////////////
////////////////////////

let MAIN_GRID = new Individual(ROWS, COLUMNS);
console.log(MAIN_GRID);
syncUI();

drawGrid(MAIN_GRID, SHOW_BORDERS);