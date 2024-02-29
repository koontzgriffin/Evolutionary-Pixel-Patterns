/////////////
// Globals //
/////////////

let COLUMNS = 10;
let ROWS = 10;

let ACTIVE_COLOR = '#000000'
let INACTIVE_COLOR = '#ffffff'
let SHOW_BORDERS = true;

// references to the main grid canvas
const MAIN_CANVAS = document.getElementById('gridCanvas');
const MAIN_CTX = MAIN_CANVAS.getContext('2d');

// constraint parameters
VALID_INACTIVE_NEIGHBORHOODS = getAllowedNeighborhoodsCookie();

// genetic algo params

let POPULATION_SIZE = 800;
let MAX_ITERATIONS = 50;
let MUTATION_RATE = 0.01;
let CROSSOVER_RATE = 0.80;
let CONSTRAINTS = [];

////////////////////////
// RUN TIME ////////////
////////////////////////

let MAIN_GRID = new Individual(ROWS, COLUMNS, CONSTRAINTS);
console.log(MAIN_GRID);

drawGrid(MAIN_GRID, SHOW_BORDERS);