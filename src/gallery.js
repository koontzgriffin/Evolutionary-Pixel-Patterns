const itemsData = [
    { title: 'Item 1', description: 'Description for Item 1', canvasId: 'canvas1', settings: {
        activeColor: '#000000',
        inactiveColor: '#00000',
        columns: 10,
        maxIterations: 50,
        populationSize: 1000,
        mutationRate: 0.5,
        crossoverRate: 0.5,
        constraints: [],
        inactiveNeighborhoods: [],
        activeNeighborhoods: []
        },
        grid: [[]],
    },
    { title: 'Item 2', description: 'Description for Item 2', canvasId: 'canvas2', settings: {
        activeColor: '#000000',
        inactiveColor: '#00000',
        columns: 10,
        maxIterations: 50,
        populationSize: 1000,
        mutationRate: 0.5,
        crossoverRate: 0.5,
        constraints: [],
        inactiveNeighborhoods: [],
        activeNeighborhoods: []
        },
        grid: [[]],
    },
    { title: 'Item 3', description: 'Description for Item 3', canvasId: 'canvas3', settings: {
        activeColor: '#000000',
        inactiveColor: '#00000',
        columns: 10,
        maxIterations: 50,
        populationSize: 1000,
        mutationRate: 0.5,
        crossoverRate: 0.5,
        constraints: [],
        inactiveNeighborhoods: [],
        activeNeighborhoods: []
        },
        grid: [[]],
    },
    // Add more items as needed
];

// Function to create a gallery item
function createGalleryItem(galleryItem) {
    const item = document.createElement('div');
    item.classList.add('gallery-item');

    const canvas = document.createElement('canvas');
    canvas.id = galleryItem.canvasId; // Set a unique identifier for the canvas
    canvas.width = 200;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');
    drawGalleryCanvas(canvas, galleryItem.settings.columns, galleryItem.settings.columns, galleryItem.settings.activeColor, galleryItem.settings.inactiveColor);

    const heading = document.createElement('h3');
    heading.textContent = galleryItem.title;

    const paragraph = document.createElement('p');
    paragraph.textContent = galleryItem.description;

    const button = document.createElement('button');
    button.textContent = 'Copy Settings';
    button.addEventListener('click', () => {
        const clickedCanvasId = canvas.id;
        const clickedItem = itemsData.find(item => item.canvasId === clickedCanvasId);
        console.log(clickedItem);
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

function drawGalleryCanvas(canvas, rows, cols, activeColor, inactiveColor) {
    const ctx = canvas.getContext('2d');
    const cellSize = Math.min(canvas.width / cols, canvas.height / rows);

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the grid
    ctx.strokeStyle = '#000';
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const x = j * cellSize;
            const y = i * cellSize;
            ctx.strokeRect(x, y, cellSize, cellSize);
        }
    }
}

  // Populate the gallery when the page loads
  window.addEventListener('DOMContentLoaded', populateGallery(itemsData));