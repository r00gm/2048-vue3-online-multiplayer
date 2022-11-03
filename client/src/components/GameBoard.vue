<template>
  <div class="game-board flex relative" v-touch:swipe="swipeHandler">
    <div class="overlay" v-if="overlay">
      <slot name="overlay"> </slot>
    </div>
    <div class="grid" :style="gridRows">
      <template v-for="row in grid">
        <div v-for="col in row" class="grid__item">
          <div :class="{ tile: true }" :style="setTileColor(col)" v-if="col">
            {{ col }}
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs, onMounted, onUnmounted, computed, watch } from 'vue';
import {
  getRandomCoordinates,
  getEmptyTilesCoordinates,
  getRandomEmptyCoordinate,
  handleMoveRight,
  handleMoveLeft,
  handleMoveUp,
  handleMoveDown,
  equalGrids,
} from '@/helpers/gameBoard';

import type { Grid } from '@/helpers/gameBoard';
import { OBSTACLE, GAME_COLORS } from '@/constants';

const prop = defineProps({
  size: {
    type: Number,
    default: 4,
  },
  obstacles: {
    type: Number,
    default: 0,
    validator: (prop: number) => prop >= 0 || prop <= 4,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  overlay: {
    type: Boolean,
    default: false,
  },
});

const { size, obstacles, disabled, overlay } = toRefs(prop);

const rows = computed(() => size.value);
const cols = computed(() => size.value);
const grid = ref<number[][]>([]);

const emptyTiles = computed(() => getEmptyTilesCoordinates(grid.value));
const gameOver = computed(() => !Boolean(Object.keys(emptyTiles.value).length));

const gridRows = computed(() => ({
  '--grid-items': rows.value,
}));

const emit = defineEmits(['update:score', 'update:overlay', 'game-over', 'move']);

/**
 * Creates a Grid with obstacles
 */
const createGrid = () => {
  const gridRows = new Array(rows.value).fill(0);
  const gridCols = new Array(cols.value).fill(0);

  const obstaclesCoordinates = getRandomCoordinates({
    amount: obstacles.value,
    min: 0,
    max: rows.value - 1,
  });

  const grid = gridRows.map((_row, rowIndex) =>
    gridCols.map((col, colIndex) => {
      // Feat Add obstacles to grid
      const hasObstacle = obstaclesCoordinates.find(({ x, y }) => x === colIndex && y === rowIndex);

      return hasObstacle ? OBSTACLE : col;
    })
  );

  return grid;
};

/**
 * Fill a random empty tile with the given value
 * @param value {number}
 */
const addRandomTile = (value: number) => {
  const { x, y } = getRandomEmptyCoordinate(emptyTiles.value);

  grid.value[y][x] = value;
};

// add suport to mobile devices
const swipeHandler = (vector: string) => {
  const types: {
    [key: string]: string;
  } = {
    left: 'ArrowLeft',
    right: 'ArrowRight',
    top: 'ArrowUp',
    bottom: 'ArrowDown',
  };

  const event = { key: types[vector] } as KeyboardEvent;

  keyDownHandler(event);
};

/**
 * Handle user interaction with arros keys
 * @param param0 {KeyboardEvent}
 */
const keyDownHandler = ({ key }: KeyboardEvent) => {
  if (disabled.value || overlay.value) return;

  const callback = {
    ArrowLeft: handleMoveLeft,
    ArrowRight: handleMoveRight,
    ArrowUp: handleMoveUp,
    ArrowDown: handleMoveDown,
  } as { [key: string]: Function };

  const handler = callback[key];

  if (!handler) return;

  const { grid: newBoard, score } = handler(grid.value);

  const addTile = !equalGrids(grid.value, newBoard);
  const highestTile = Math.max(...newBoard.flat().filter(Number));

  grid.value = newBoard;

  // only add a new tile if the grid has changed
  if (addTile) addRandomTile(1);

  emit('move', { score, highestTile });
  if (gameOver.value) emit('game-over');
};

/**
 * Gives each Tile a background color according to it´s value
 * @param value
 */
const setTileColor = (value: number) => ({
  '--tile-bg': GAME_COLORS[value] ?? '#ffffff',
});

/**
 * Game on!
 * @param game
 */
const startGame = (game: Grid | null = null) => {
  // provide a starting board
  if (game) {
    grid.value = game as number[][];
  } else {
    grid.value = createGrid();

    addRandomTile(2);
  }
};

if (!disabled.value) startGame();

defineExpose({ startGame });

watch([rows, cols, obstacles], () => {
  startGame();
});

onMounted(() => {
  window.addEventListener('keydown', keyDownHandler);
});

onUnmounted(() => {
  window.removeEventListener('keydown', keyDownHandler);
});
</script>

<style scoped>
.grid {
  @apply inline-grid gap-1.5 bg-slate-200 p-1.5 rounded mx-auto;
  grid-template-columns: repeat(var(--grid-items), minmax(0, 70px));
}
.grid__item {
  @apply aspect-square bg-slate-900 bg-opacity-10 rounded;
}

.tile {
  @apply aspect-square rounded flex justify-center items-center;
  background-color: var(--tile-bg);
}

.overlay {
  @apply absolute inset-0 bg-white bg-opacity-60 flex justify-center items-center flex-col;
}
</style>
