class Grid {
    constructor(rows, columns){
        this.rows = rows;
        this.columns = columns;

        // Initialize the grid with Cell objects
        this.grid = [];
        for (let i = 0; i < rows; i++) {
            const row = [];
            for (let j = 0; j < columns; j++) {
            row.push(new Cell(i, j));
            }
            this.grid.push(row);
        }
    }

    getCell(x, y) {
        // Get a specific cell from the grid
        if (x < columns && x >= 0 && y < rows && y >= 0){
            // if cordnates are valid
            return this.grid[x][y];
        }
        return null;
    }

    activateCell(x, y) {
        // Activate a specific cell
        this.getCell(x, y).activate();
    }

    deactivateCell(x, y) {
        // Deactivate a specific cell
        this.getCell(x, y).deactivate();
    }

    getNextDoorNeighbors(){
        const neighbors = [];

        // Check left neighbor
        if (x > 0) {
        neighbors.push(this.getCell(x - 1, y));
        }

        // Check right neighbor
        if (x < this.rows - 1) {
        neighbors.push(this.getCell(x + 1, y));
        }

        // Check up neighbor
        if (y > 0) {
        neighbors.push(this.getCell(x, y - 1));
        }

        // Check down neighbor
        if (y < this.columns - 1) {
        neighbors.push(this.getCell(x, y + 1));
        }

        return neighbors;
    }

    getAdjacentCells(x, y){
        const adjacents = [];

        // Check left neighbor
        if (x > 0) {
            const left = this.getCell(x - 1, y);
            if(left.active){
                adjacents.push(left);
            }
        }

        // Check right neighbor
        if (x < this.rows - 1) {
            const right = this.getCell(x + 1, y);
            if(right.active){
                adjacents.push(right);
            }
        }

        // Check up neighbor
        if (y > 0) {
            const up = this.getCell(x, y - 1);
            if(up.active){
                adjacents.push(up);
            }
        }

        // Check down neighbor
        if (y < this.columns - 1) {
            const down = this.getCell(x, y + 1);
            if(down.active){
                adjacents.push(down);
            }
        }

        return adjacents;
    }

    getNeighborhoodSeed(x, y){
        return;
    }

    clear() {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.columns; j++){
            this.deactivateCell(i, j);
          }
        }
    }
}

class Cell {
    constructor(x, y, filled){
        this.x = x;
        this.y = y;
        this.active = false;
    }

    activate() {
        this.active = true;
    }
    
    deactivate() {
        this.active = false;
    }
}