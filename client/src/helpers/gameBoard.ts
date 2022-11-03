import { OBSTACLE } from '@/constants';

interface EmptyTiles {
  [key: string]: number[];
}

export type Obstacle = typeof OBSTACLE;
export type Tile = Obstacle | number;
export type Grid = Tile[][];
export type Board = {
  grid: Grid;
  score: number;
};

/**
 * Creates array of the provided lenght filled with 0
 * @param {number} length
 * @returns {0[]}
 */
export const arrayWithZeros = (length: number) => new Array(length).fill(0);

/**
 * Object deep comparison
 * @param {Grid} oldGrid
 * @param {Grid} newGrid
 * @returns {boolean}
 */
export const equalGrids = (oldGrid: Grid, newGrid: Grid) => {
  return JSON.stringify(oldGrid) === JSON.stringify(newGrid);
};

/**
 * returns a random integer between min (inclusive) and max (inclusive).
 * @param min
 * @param max
 * @returns
 */
export const getRandomIntegerInRange = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

/**
 * Given a 2 dimensions array obtain all empty tiles
 * @param grid
 */
export const getEmptyTilesCoordinates = (grid: Grid) => {
  return grid.reduce((acc, columns, index) => {
    const emptyColsIndexes = columns.reduce((acc, col, index) => {
      if (col === 0) acc.push(index);
      return acc;
    }, <number[]>[]);

    if (Boolean(emptyColsIndexes.length)) acc[index] = emptyColsIndexes;

    return acc;
  }, <EmptyTiles>{});
};

/**
 * Given a set of coordinates pick one at random
 * @see getEmptyTilesCoordinates
 *
 * NOTE: This might seem as an overkill, we could achive almost the same by simply generating two random numbers between a range
 * and then checking if the tile has a value BUT if we were to create a 1000 x 1000 grid it migth take us up to 1000000 tries to find
 * an empty tile when, for example, there are only 2 or 3 empty tiles or even more given how random numbers generation works (AKA: performance bottleneck)
 * with this approach, no matter how big our grid is we will always find a random empty tile in the first try.
 * @param tiles
 * @returns
 */
export const getRandomEmptyCoordinate = (tiles: EmptyTiles) => {
  const row = getRandomIntegerInRange(0, Object.keys(tiles).length - 1);
  const y = Number(Object.keys(tiles)[row]);

  const col = getRandomIntegerInRange(0, tiles[y].length - 1);
  const x = tiles[y][col];

  return { x, y };
};

/**
 * Further logic is needed if we want to prevent the coordinates from beeing to close to each other
 * @param param0
 * @returns
 */
export const getRandomCoordinates = ({
  amount,
  min,
  max,
}: {
  amount: number;
  min: number;
  max: number;
}) => {
  if (amount <= 0) return [];

  const coordinates: { x: number; y: number }[] = [];

  do {
    const position = {
      x: getRandomIntegerInRange(min, max),
      y: getRandomIntegerInRange(min, max),
    };

    // Lets make sure we dont have duplicated coordinates
    const exist = coordinates.find(({ x, y }) => x === position.x && y === position.y);
    if (!exist) coordinates.push(position);
  } while (coordinates.length < amount);

  return coordinates;
};

interface Move {
  moveScore: number;
  list: Tile[];
}

/**
 * Slides the numbers inside the array mergin the same values upon colision
 *
 * Feat: Added obstacles that must NOT slide like the rest of the elements
 * @param list
 * @returns
 */
const move = (list: Tile[]) => {
  let score = 0;
  const values = list.reduce((acc, current, index, src) => {
    if (current === 0) return acc;

    if (current === OBSTACLE) {
      // Fill the remaining positions to keep the obstacle in place
      return [...acc, ...arrayWithZeros(index - acc.length), current];
    }

    const previous: Tile = acc[acc.length - 1];

    if (previous !== current) return [...acc, current];

    const result = Number(previous) * 2;
    acc[acc.length - 1] = result;
    score += result;

    /**
     * We need to look at the next element to prevent this scenario
     *  WRONG [0, 2, 2, 4] -> [8,0,0,0]
     *  RIGHT [0, 2, 2, 4] -> [4,4,0,0]
     */
    const lookAhead = src[index + 1];
    if (lookAhead === result) {
      acc.push(lookAhead);
      src[index + 1] = 0;
    }

    return acc;
  }, <Tile[]>[]);

  values.push(...arrayWithZeros(list.length - values.length));

  return { list: values, moveScore: score } as Move;
};

export const moveLeft = (list: Tile[]) => move(list);
export const moveRight = (list: Tile[]) => {
  const slide = move([...list].reverse());
  slide.list.reverse();
  return slide;
};

/**
 * Rotage a SQUARE grid/matrix 90º
 * @param grid
 * @returns
 */
export const rotateGridClockwise = (grid: Grid) => {
  return grid.map((_row, index) => [...grid].reverse().map(item => item[index]));
};

/**
 * Rotage a SQUARE grid/matrix -90º
 * @param grid
 * @returns
 */
export const rotateGridAntiClockwise = (grid: Grid) => {
  return grid.map((_row, index) => grid.map(row => [...row].reverse()[index]));
};

export const handleMoveRight = (matrix: Grid) => {
  return matrix.reduce<Board>(
    (acc, row) => {
      const { list, moveScore } = moveRight(row);

      acc.grid.push(list);
      acc.score += moveScore;

      return acc;
    },
    { grid: [], score: 0 }
  );
};

export const handleMoveLeft = (matrix: Grid) => {
  return matrix.reduce<Board>(
    (acc, row) => {
      const { list, moveScore } = moveLeft(row);

      acc.grid.push(list);
      acc.score += moveScore;

      return acc;
    },
    { grid: [], score: 0 }
  );
};

export const handleMoveUp = (matrix: Grid) => {
  const rotated = rotateGridClockwise(matrix);
  const { grid, score } = handleMoveRight(rotated);
  return { grid: rotateGridAntiClockwise(grid), score };
};

export const handleMoveDown = (matrix: Grid) => {
  const rotated = rotateGridClockwise(matrix);
  const { grid, score } = handleMoveLeft(rotated);
  return { grid: rotateGridAntiClockwise(grid), score };
};
