galleryItems = [];

// Function to fetch gallery items and then populate the gallery
async function fetchAndPopulateGallery() {
    try {
        const newGalleryItems = await getGalleryItems(); // Fetch latest items
        galleryItems = newGalleryItems;
        clearGallery(); // Clear existing gallery
        console.log(newGalleryItems);
        populateGallery(newGalleryItems); // Populate gallery with new items
    } catch (error) {
        console.error('Error:', error);
    }
}

// Function to clear the existing gallery
function clearGallery() {
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = ''; // Clear gallery content
}

// Function to create a gallery item
function createGalleryItem(galleryItem) {
    const item = document.createElement('div');
    item.classList.add('gallery-item');

    const canvas = document.createElement('canvas');
    canvas.id = galleryItem.patternId; // Set a unique identifier for the canvas
    canvas.width = 200;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');
    drawGalleryCanvas(canvas, galleryItem);

    const heading = document.createElement('h3');
    heading.textContent = 'By';

    const paragraph = document.createElement('p');
    paragraph.textContent = galleryItem.artistName;

    const button = document.createElement('button');
    button.textContent = 'Copy Settings';
    button.addEventListener('click', () => {
        const clickedGalleryId = canvas.id;
        const clickedItem = galleryItems.find(item => item.patternId === clickedGalleryId);
        console.log(clickedItem.settings);
        copySettings(clickedItem.settings);
    });

    item.appendChild(canvas);
    item.appendChild(heading);
    item.appendChild(paragraph);
    item.appendChild(button);

    return item;
  }

// Function to populate the gallery with items
function populateGallery(itemsData) {
    const gallery = document.getElementById('gallery');

    itemsData.forEach(data => {
        const item = createGalleryItem(data);
        gallery.appendChild(item);

    });
}

function drawGalleryCanvas(canvas, galleryItem) {
    const ctx = canvas.getContext('2d');
    const cellSize = Math.min(canvas.width / galleryItem.settings.columns, canvas.height / galleryItem.settings.columns);

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the grid
    ctx.strokeStyle = '#000';
    for (let i = 0; i < galleryItem.settings.columns; i++) {
        for (let j = 0; j < galleryItem.settings.columns; j++) {
            const x = j * cellSize;
            const y = i * cellSize;
            if(galleryItem.grid[j][i] == '1'){
                ctx.fillStyle = galleryItem.settings.activeColor;
            } else{
                ctx.fillStyle = galleryItem.settings.inactiveColor;
            }
            ctx.fillRect(x, y, cellSize, cellSize);
        }
    }
}

function copySettings(settings){
    console.log('copying settings...')
    // Set grid size
    COLUMNS = settings.columns;
    ROWS = settings.rows;

    // Set colors
    ACTIVE_COLOR = settings.activeColor;
    INACTIVE_COLOR = settings.inactiveColor;

    // Set genetic algorithm parameters
    POPULATION_SIZE = settings.populationSize;
    MAX_ITERATIONS = settings.maxIterations;
    MUTATION_RATE = parseFloat(settings.mutationRate);
    CROSSOVER_RATE = parseFloat(settings.crossoverRate);

    // Set constraints
    RESTRICT_ACYCLIC = settings.restrictAcyclic;
    RESTRICT_SIZE = settings.restrictSize;
    MIN_SIZE = settings.minSize;
    MAX_SIZE = settings.maxSize;
    RESTRICT_ACTIVE_NEIGHBORHOODS = settings.restrictActiveNeighborhoods;
    RESTRICT_INACTIVE_NEIGHBORHOODS = settings.restrictInactiveNeighborhoods;

    // Set allowed neighborhoods
    setAllowedActiveNeighborhoodsCookie(settings.activeNeighborhoods);
    setAllowedInactiveNeighborhoodsCookie(settings.inactiveNeighborhoods);

    //sync UI
    syncUI();
    drawGrid(MAIN_GRID, SHOW_BORDERS);
    MAIN_CANVAS.scrollIntoView({ behavior: 'smooth' });
}

// Populate the gallery when the page loads
window.addEventListener('DOMContentLoaded', fetchAndPopulateGallery);
