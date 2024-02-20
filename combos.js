// include cookies_handler (i.e. setAllowedNeighborhoodsCookie, allowedNeighborhoods)

// script.js
const CANVAS_SIZE = 100;
const clickedDivs = [40,41,44,45,47,97,101,102,103,104,105,108,109,111,130,131,133,134,135,194,195,197,198,199,205,271,269,268,267,296,297,301,300,303,322,323,325,326,327,331,332,333,335,353,357,358,359,360,361,364,365,367,386,387,389,390,391,417,421,422,423,450,451,453,454,455,459,460,461,463,481,485,488,487,486,489,493,492,207,203,204]; // List to store clicked div IDs
const validBin = ['000101000', '000101001', '000101100', '000101101', '000101111', '001100001', '001100101', '001100110', '001100111', '001101000', '001101001', '001101100', '001101101', '001101111', '010000010', '010000011', '010000101', '010000110', '010000111', '011000010', '011000011', '011000101', '011000110', '011000111', '011001101', '100001111', '100001101', '100001100', '100001011', '100101000', '100101001', '100101101', '100101100', '100101111', '101000010', '101000011', '101000101', '101000110', '101000111', '101001011', '101001100', '101001101', '101001111', '101100001', '101100101', '101100110', '101100111', '101101000', '101101001', '101101100', '101101101', '101101111', '110000010', '110000011', '110000101', '110000110', '110000111', '110100001', '110100101', '110100110', '110100111', '111000010', '111000011', '111000101', '111000110', '111000111', '111001011', '111001100', '111001101', '111001111', '111100001', '111100101', '111101000', '111100111', '111100110', '111101001', '111101101', '111101100', '011001111', '011001011', '011001100'];

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

document.addEventListener('DOMContentLoaded', function () {
    const num_canvas = 512; // Change this to the desired number of canvases
  
    for (let i = 0; i < num_canvas; i++) {
        if (intToBinaryString(i)[4] == '0'){
            createCanvas(i);
        }
    }
  
    function createCanvas(seed) {
        const canvas = document.createElement('canvas');
        canvas.width = CANVAS_SIZE; // Adjust canvas width as needed
        canvas.height = CANVAS_SIZE; // Adjust canvas height as needed

        const ctx = canvas.getContext('2d');
        drawGrid(ctx, seed);

        // Create a div for each canvas with id set to the seed
        const canvasDiv = document.createElement('div');
        canvasDiv.id = `${seed}`;
        canvasDiv.appendChild(canvas);

        // Add click event listener to each div
        canvasDiv.addEventListener('click', function () {
            addToClickedDivs(canvasDiv.id);
        });
  
        document.body.appendChild(canvasDiv);
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

    function addToClickedDivs(divId) {
        const index = clickedDivs.indexOf(divId);

        if (index === -1) {
            // Div is not in the list, add it
            clickedDivs.push(intToBinaryString(parseInt(divId)));
            console.log(`Clicked Divs: ${clickedDivs}`);
            changeColor(divId, 'blue')
        } else {
            // Div is already in the list, remove it
            clickedDivs.splice(index, 1);
            console.log(`Clicked Divs after removal: ${clickedDivs}`);
            changeColor(divId, 'black')
        }
    }
  });
  

for(let num of clickedDivs){
    validBin.push(intToBinaryString(num));
}

console.log(validBin);