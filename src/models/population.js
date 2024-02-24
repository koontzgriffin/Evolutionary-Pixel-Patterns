//import Individual from './individual';

class Population {
    constructor(rows, columns, size, constraints){
        this.size = size;
        this.constraints = constraints;
        this.individuals = [];

        for(let i = 0; i < size; i++){
            this.individuals.push(new Individual(rows, columns, constraints))
        }
    }

    randomSelection(){
        // Select an individual from this.individuals with a probability proportional to its fitness. optimal fitness is 0 worse fitness < 0
        let min = this.individuals.reduce(
            (min, current) => Math.min(min, current.fitness),
            Infinity
        );
        // Calculate total fitness
        let totalFitness = 0;
        for (let i = 0; i < this.individuals.length; i++) {
            totalFitness += (this.individuals[i].fitness - min);
        }

        // Generate a random value between 0 and totalFitness
        const randomValue = Math.random() * totalFitness;

        // Linear search to find the selected individual
        let currentFitnessSum = 0;

        for (let i = 0; i < this.individuals.length; i++) {
            currentFitnessSum += (this.individuals[i].fitness - min);

            if (currentFitnessSum >= randomValue) {
                return this.individuals[i];
            }
        }

        // Should not reach here, but return null if it does
        return null;
    }

    bestSelection() {
        let min = this.individuals.reduce(
            (min, current) => Math.min(min, current.fitness),
            Infinity
        );
        // Sort individuals based on fitness (ascending order)
        const sortedIndividuals = this.individuals.slice().sort((a, b) => a.fitness - b.fitness);
    
        // Calculate the index corresponding to the top 10% (adjust as needed)
        const top10PercentIndex = Math.floor(0.7 * this.individuals.length);
    
        // Calculate total fitness for the top 10%
        let totalTopFitness = 0;
        for (let i = top10PercentIndex; i < this.individuals.length; i++) {
            totalTopFitness += sortedIndividuals[i].fitness - min;
        }
    
        // Generate a random value between 0 and totalTopFitness
        const randomValue = Math.random() * totalTopFitness;
    
        // Linear search to find the selected individual within the top 10%
        let currentFitnessSum = 0;
        for (let i = top10PercentIndex; i < this.individuals.length; i++) {
            currentFitnessSum += sortedIndividuals[i].fitness - min;
    
            if (currentFitnessSum >= randomValue) {
                return sortedIndividuals[i];
            }
        }
    
        // Should not reach here, but return null if it does
        return null;
    }
    
    getBestIndividual(){
        // returns the individual with the highest fitness
        let bestIndividual = null;
        let highestFitness = Number.NEGATIVE_INFINITY;

        for (let i = 0; i < this.size; i++) {
            const currentFitness = this.individuals[i].fitness;
            if (currentFitness > highestFitness) {
                highestFitness = currentFitness;
                bestIndividual = this.individuals[i];
            }
        }

        return bestIndividual;
    }

    addIndividual(individual){
        // adds an individual to the population and updates the size
        this.individuals.push(individual);
        this.size += 1;
    }
}

//export default Population;