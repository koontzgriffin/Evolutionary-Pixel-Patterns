class Constraint {
    // Common implementation for all constraints.
    constructor() {
    }

    evaluate(cell, individual) {
        // an empty evaluate function that is always satisfied. takes a cell and an individual.
        return 0;
    }

    reset(){
    }
}

class AcyclicConstraint extends Constraint {
    constructor(){
        super();
        this.name = "Acyclic Constraint";
        this.visited_global = Array.from({ length: columns }, () => Array(rows).fill(false));
    }

    evaluate(cell, individual){
        // checks if an active region starting from "cell" is acyclic
        // returns true if the constraint is satisfied, false if conflicted
        if(!cell.active || this.visited_global[cell.x][cell.y]){
            // constraint only relevant on active cells and cells that havent been a part of a previous region.
            return true;
        }
        let visited = Array.from({ length: individual.columns }, () => Array(individual.rows).fill(false));
        // if position is active, then check if the region is cyclic
        if(this.isCyclic(individual, cell, visited, null)){
            return false;
        }
        
        return true;
    }

    isCyclic(grid, cur, visited, parent){
        // Recursive function to check if an active region is cyclic. returns true if cyclic
        visited[cur.x][cur.y] = true;
        this.visited_global[cur.x][cur.y] = true;
        
        for(const adjacent of grid.getAdjacentCells(cur.x, cur.y)){
            if(!visited[adjacent.x][adjacent.y]){
              // if adjacent not visited, then recurse
              if(this.isCyclic(grid, adjacent, visited, cur)){
                return true;
              }
            }
            else if(parent == null || (parent.x != adjacent.x && parent.y != adjacent.y)){
              // if adjacent is visited and not a parent, then there is a cycle
              return true;
            }
        }
        return false;
    }

    reset(){
        this.visited_global = Array.from({ length: columns }, () => Array(rows).fill(false));
    }
}

class InactiveNeighborhoodsConstraint extends Constraint {
    constructor(allowedNeighborhoods){
        super();
        this.allowedNeighborhoods = allowedNeighborhoods;
        this.name = "Inactive Neighborhoods Constraint";
    }

    evaluate(cell, individual) {
        if(cell.active){
            // constraint only relevant for inactive cells
            return 0;
        }

        let neighborhood = individual.getNeighborhoodSeed(cell.x, cell.y);

        for(let allowed of this.allowedNeighborhoods){
            // compare and if matches any return true
            //console.log(`comparing ${neighborhood} and ${allowed}`);
            let valid = true;
            for(let i = 0; i < allowed.length; i++){
                if(neighborhood[i] != allowed[i] && neighborhood[i] != 'X'){
                    valid = false;
                }
            }
            if(valid){
                // neighborhood is valid
                return 0;
            }
        }

        // neighborhood did not match any allowed neighborhoods
        return 1;
    }

    setAllowedNeighborhoods(allowedNeighborhoods){
        this.allowedNeighborhoods = allowedNeighborhoods;
    }
}

class ActiveRegionConstraint extends Constraint {
    constructor(){
        super();
        this.name = "Active Region Constraint";
        this.visited_global = Array.from({ length: COLUMNS }, () => Array(ROWS).fill(false));
    }

    evaluate(cell, individual){
        // checks if a region starting from "cell" is has cycles
        // returns a fitness deduction based on num_cycles
        if(!cell.active || this.visited_global[cell.x][cell.y]){
            // constraint only relevant on active cells and cells that havent been a part of a previous region.
            return 0;
        }
        // if position is active, then get the region
        let region = this.getRegion(individual, cell, null);

        return region.num_cycles;
    }

    getRegionRecursive(individual, cur, visited, parent, region){
        // Recursive function to check a region for number of cycles.
        //console.log(`getRegionRecursive: cur=(${cur.x}, ${cur.y}), parrent=${parent}`);

        visited[cur.x][cur.y] = true;
        this.visited_global[cur.x][cur.y] = true;
        region.size++;
        for(const adjacent of individual.getAdjacentCells(cur.x, cur.y)){
            //console.log(`at (${cur.x}, ${cur.y}) checking adjacent (${adjacent.x}, ${adjacent.y})`);
            if(!visited[adjacent.x][adjacent.y]){
                //console.log('adjacent is not visited');
                // if adjacent is not visited, then recurse
                this.getRegionRecursive(individual, adjacent, visited, cur, region)
            }
            else if(parent != null && !(parent.x == adjacent.x && parent.y == adjacent.y)){
                //console.log('adjacent is visited');
                // if adjacent is visited and not a parent, then there is a cycle
                region.num_cycles++;
            }
        }

    }

    getRegion(individual, cur, parent){
        let visited = Array.from({ length: individual.columns }, () => Array(individual.rows).fill(false));
        let region = {
            size: 0,
            num_cycles: 0
        }
        //console.log(`getting region starting at (${cur.x}, ${cur.y})`);

        this.getRegionRecursive(individual, cur, visited, parent, region);

        return region;
    }

    reset(){
        this.visited_global = Array.from({ length: COLUMNS }, () => Array(ROWS).fill(false));
    }
}

//export {Constraint, AcyclicConstraint, ActiveRegionConstraint, InactiveNeighborhoodsConstraint}