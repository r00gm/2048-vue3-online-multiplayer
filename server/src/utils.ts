export const getRandomIntegerInRange = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const createGrid = ({ rows, cols }: { rows: number; cols: number }) => {
  const gridRows = new Array(rows).fill(0);
  const gridCols = new Array(cols).fill(0);

  const grid = gridRows.map(() => gridCols.map(() => 0));

  const { y, x } = {
    x: getRandomIntegerInRange(0, rows - 1),
    y: getRandomIntegerInRange(0, cols - 1),
  };

  grid[y][x] = 2;

  return grid;
};
