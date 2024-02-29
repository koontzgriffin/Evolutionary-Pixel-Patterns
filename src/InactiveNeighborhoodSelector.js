const CANVAS_SIZE = 100;

let vaildNeighborhoods = getAllowedInactiveNeighborhoodsCookie();

function intToBinaryString(number) {
    // Ensure the number is within the 9-bit range
    if (number < 0 || number > 0b111111111) {
        throw new Error("Number is outside the 9-bit range (0 to 511).");
    }

    // Use toString(2) to convert the number to binary string
    let binaryString = number.toString(2);

    // Pad with leading zeros to ensure a 9-bit representation
    binaryString = binaryString.padStart(9, '0');

    return binaryString;
}

function drawGrid(ctx, seed, color = 'black') {
    const cellSize = CANVAS_SIZE/3; // Adjust cell size as needed

    binary = intToBinaryString(seed);

    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
          const x = col * cellSize;
          const y = row * cellSize;

          filled = binary[row*3 + col] == '1'

          ctx.fillStyle = color;
          
          if(filled){
              ctx.fillRect(x, y, cellSize, cellSize);
          } else {
              ctx.strokeRect(x, y, cellSize, cellSize);
          }
      }
    }
}

function changeColor(divId, color){
    // redraw with new color
    const clickedDiv = document.getElementById(divId);
    const canvas = clickedDiv.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    drawGrid(ctx, parseInt(divId), color);
}

function addNeighborhood(divId) {
    const index = vaildNeighborhoods.indexOf(intToBinaryString(parseInt(divId)));

    if (index === -1) {
        // Div is not in the list, add it
        vaildNeighborhoods.push(intToBinaryString(parseInt(divId)));
        console.log(`validNeighborhoods: ${vaildNeighborhoods}`);
        changeColor(divId, 'blue')
    } else {
        // Div is already in the list, remove it
        vaildNeighborhoods.splice(index, 1);
        console.log(`validNeighborhoods after removal: ${vaildNeighborhoods}`);
        changeColor(divId, 'black')
    }
}

function createCanvas(seed) {
    const canvas = document.createElement('canvas');
    canvas.width = CANVAS_SIZE; // Adjust canvas width as needed
    canvas.height = CANVAS_SIZE; // Adjust canvas height as needed

    const ctx = canvas.getContext('2d');
    if(vaildNeighborhoods.includes(intToBinaryString(seed))){
        drawGrid(ctx, seed, 'blue');
    } else {
        drawGrid(ctx, seed);
    }

    // Create a div for each canvas with id set to the seed
    const canvasDiv = document.createElement('div');
    canvasDiv.id = `${seed}`;
    canvasDiv.appendChild(canvas);

    // Append the canvas to the "neighborhoods" container
    const neighborhoodsContainer = document.getElementById('neighborhoods');
    neighborhoodsContainer.appendChild(canvasDiv);

    // Add click event listener to each div
    canvasDiv.addEventListener('click', function () {
        addNeighborhood(canvasDiv.id);
        setAllowedInactiveNeighborhoodsCookie(vaildNeighborhoods);
    });

}

function drawNeighborhoods(){
    const num_canvas = 512; // Set to the number of possible combos of a neighborhood. (i.e. for 3x3 neighborhood num_canvas = 2^(3x3) = 2^9 = 512)
  
    for (let i = 0; i < num_canvas; i++) {
        if (intToBinaryString(i)[4] == '0'){
            createCanvas(i);
        }
    }
}

function clearHandler(){
    vaildNeighborhoods = [];
    setAllowedInactiveNeighborhoodsCookie(vaildNeighborhoods);
    location.reload(true);
}

function resetHandler(){
    vaildNeighborhoods = defaultValidInactiveNeighborhoods;
    setAllowedInactiveNeighborhoodsCookie(vaildNeighborhoods);
    location.reload(true);
}

drawNeighborhoods();