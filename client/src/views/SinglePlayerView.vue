<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import GameBoard from '@/components/GameBoard.vue';
import UiButtonToggle from '@/ui/UiButtonToggle.vue';
import UiBUtton from '@/ui/UiButton.vue';

const gridSizes = [4, 5, 6, 10, 20].map(option => ({
  label: String(option),
  value: option,
}));
const obstacles = [0, 1, 2, 3, 4].map(option => ({
  label: String(option),
  value: option,
}));

const size = ref(6);
const obstacle = ref(0);
const score = ref(0);
const highestValue = ref(0);
const game = ref<InstanceType<typeof GameBoard>>();
const overlay = ref(false);
const lost = ref(false);

// fast win
const fastWin = [
  [0, 0, 0, 2],
  [0, 0, 4, 0],
  [0, 8, 16, 2],
  [4, 4, 1024, 1024],
];

// fast lose
const fastLose = [
  [1, 2, 3, 4],
  [5, 6, 7, 8],
  [9, 10, 11, 12],
  [13, 14, 15, 0],
];

const showOverlay = computed(() => overlay.value || lost.value || highestValue.value === 2048);

const handleMove = ({ score: value, highestTile }: { score: number; highestTile: number }) => {
  console.log(highestTile);
  score.value += value;
  highestValue.value = highestTile;
};

const restart = () => {
  score.value = 0;
  overlay.value = false;
  lost.value = false;
  game.value?.startGame();
};
</script>

<template>
  <div class="container mx-auto">
    <div class="flex flex-col md:flex-row mb-5 justify-center gap-2.5">
      <div class="flex gap-2.5">
        <span>Size:</span><UiButtonToggle :options="gridSizes" v-model="size" />
      </div>

      <div class="flex gap-2.5">
        <span>Obstacles:</span> <UiButtonToggle :options="obstacles" v-model="obstacle" />
      </div>
      <UiBUtton label="New Game" @click="restart" />
    </div>
    <GameBoard
      :size="size"
      :obstacles="obstacle"
      :overlay="showOverlay"
      ref="game"
      @move="handleMove"
      @game-over="() => (lost = true)"
    >
      <template v-slot:overlay>
        <h1 class="heading" v-text="lost ? 'You have Lost!' : 'You have Won!'" />
        <UiBUtton label="New Game" @click="restart" />
      </template>
    </GameBoard>
  </div>
</template>

<style scoped>
.heading {
  @apply mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white;
}
</style>
