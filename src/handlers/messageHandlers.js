function toggleNoSolutionError(show) {
    const errorContainer = document.getElementById('errorNoSolution');
    // Set the display property based on the boolean parameter
    errorContainer.style.display = show ? 'block' : 'none';
}

function toggleAddToGallery(show){
    const addToGalleryContainer = document.getElementById('addToGallery');
    // Set the display property based on the boolean parameter
    addToGalleryContainer.style.display = show ? 'block' : 'none';
}

function toggleGenerationComplete(show) {
    const errorContainer = document.getElementById('generationComplete');
    // Set the display property based on the boolean parameter
    errorContainer.style.display = show ? 'block' : 'none';

    toggleAddToGallery(show);
}

function toggleConstraintsCheck(show, num = 0) {
    const errorContainer = document.getElementById('constraintsCheck');
    // Set the display property based on the boolean parameter
    errorContainer.style.display = show ? 'block' : 'none';
    const message = document.getElementById('constraintsMessage');
    message.textContent = `! - Constraint Check: there was ${num} conflicts`;
}

function changeCount(newCount) {
    const iterationElement = document.getElementById('iterationCount');
    // Update the iteration count
    iterationElement.innerText = `Iteration: ${newCount}`;
}