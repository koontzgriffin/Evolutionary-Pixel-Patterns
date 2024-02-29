function geneticAlgorithm(rows, columns, populationSize, maxIterations, constraints, drawGridCallback) {
    toggleNoSolutionError(false);
    toggleGenerationComplete(false);

    let population = new Population(rows, columns, populationSize, constraints);
    let currentIteration = 0;
    let goalFound = false;

    function runNextIteration() {
        if (currentIteration < maxIterations && !goalFound) {
            const bestIndividual = population.getBestIndividual();
            const newPopulation = new Population(rows, columns, 0, constraints);
            newPopulation.addIndividual(bestIndividual);
            drawGridCallback(bestIndividual, SHOW_BORDERS);
            changeCount(currentIteration);

            setTimeout(() => {
                for (let i = 0; i < populationSize - 1; i++) {
                    let x = population.bestSelection();
                    let y = population.bestSelection();
                    let offspring = x.reproduce(y, CROSSOVER_RATE);

                    if (offspring.isGoal()) {
                        console.log(`Goal reached after ${currentIteration} iterations.`);
                        drawGridCallback(offspring, SHOW_BORDERS);
                        MAIN_GRID = offspring;
                        goalFound = true;
                        changeCount(currentIteration);
                        toggleGenerationComplete(true);
                        return;
                    }

                    newPopulation.addIndividual(offspring);
                }
                population = newPopulation;
                currentIteration++;
                runNextIteration(); // Run the next iteration recursively
            }, 0);
        } else {
            const bestIndividual = population.getBestIndividual();
            toggleNoSolutionError(true);
            changeCount(currentIteration);
            drawGridCallback(bestIndividual, SHOW_BORDERS);
            MAIN_GRID = bestIndividual;
            console.log(bestIndividual);
        }
    }

    // Start the first iteration
    runNextIteration();
}