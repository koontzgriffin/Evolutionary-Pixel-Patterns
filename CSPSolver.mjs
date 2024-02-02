function getRandomInt(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function drawPattern(rows, columns){
    const matrix = [];

  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < columns; j++) {
      row.push(getRandomInt(0, 1));
    }
    matrix.push(row);
  }

  return matrix;
}