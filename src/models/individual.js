//import { Grid } from './grid';

class Individual extends Grid {
    constructor(rows, columns, constraints = []) {
        // Call the constructor of the parent class (Grid)
        super(rows, columns);
        // add constraints
        this.constraints = constraints;
        // fill randomly
        this.randomPattern();
        // instantiate and update fitness
        this.fitness;
        this.updateFitness();
    }

    updateFitness(){
        // updates the fitness score of an individual
        this.fitness = 0; // set fitness to zero and subtract for conflicts

        // reset all constraints
        for(let constraint of constraints){
            constraint.reset();
        }

        // iterate through all cells
        for(let y = 0; y < rows; y++){
            for(let x = 0; x < columns; x++){
                // run each constraint on each cell
                for(let constraint of this.constraints){
                    // subtract the constraint return
                    this.fitness -= constraint.evaluate(this.getCell(x, y), this);
                }
            }
        }
    }

    reproduce(mate, rate){
        // return early based on mutation rate
        if(Math.random() > rate){ 
            const child = new Individual(this.rows, this.columns, constraints);
            
            child.fillFromArray(this.grid.flat());
            // mutate the child
            child.mutate(mutationRate);
            // update fitness
            child.updateFitness();
            return child;
        }
        let child = this.boxCrossover(mate); // this.splitCrossover(mate);

        // mutate the child
        child.mutate(mutationRate);
        // update fitness
        child.updateFitness();

        return child;
    }

    splitCrossover(mate){
        // produces a child from the current individual and another.
        const child = new Individual(this.rows, this.columns, constraints);

        // random split
        const split = getRandomInt(0, this.rows * this.columns);
        // set the childs grid based on a combination of the mates
        const genomeA = this.grid.flat();
        const genomeB = mate.grid.flat();
        const genome_child = genomeA.slice(0, split).concat(genomeB.slice(split))
        child.fillFromArray(genome_child);

        return child;
    }

    boxCrossover(mate){
        // Create a child individual
        const child = new Individual(this.rows, this.columns, this.constraints);

        // Randomly select crossover points
        const startX = getRandomInt(0, this.columns);
        const startY = getRandomInt(0, this.rows);

        // Square size
        const squareSizeX = getRandomInt(0, this.columns - startX);
        const squareSizeY = getRandomInt(0, this.rows - startY);
        //console.log(`boxCrossover start = (${startX}, ${startY}), size = ${squareSizeX}, ${squareSizeY}`);

        // Perform crossover
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.columns; col++) {
                if (col >= startX && col < startX + squareSizeX && row >= startY && row < startY + squareSizeY) {
                    //console.log(`replacing (${col}, ${row})`);
                    mate.getCell(col, row).active ? child.activateCell(col, row) : child.deactivateCell(col, row); // Replace region with mate's genome
                } else {
                    this.getCell(col, row).active ? child.activateCell(col, row) : child.deactivateCell(col, row); // Keep the rest from current individual
                }
            }
        }
        return child;
    }

    mutate(rate){
        for (let i = 0; i < this.rows * this.columns; i++) {
            if (Math.random() < rate) {
                // Apply mutation to the gene at index i
                const row = Math.floor(i/ this.columns);
                const col = i % this.columns;
                this.getCell(col, row).active ?  this.deactivateCell(col, row) : this.activateCell(col, row);
            }
        }
    }

    isGoal(){
        // goal is reached if fitness = 0
        return this.fitness === 0;
    }

    addConstraint(constraint){
        // adds a constraint to the individual
        this.constraints.push(constraint);
    }
}

//export default Individual;

