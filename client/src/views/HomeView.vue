<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import ArrowsComponent from '@/components/ArrowsComponent.vue';
import GameBoard from '@/components/GameBoard.vue';
import UiButton from '@/ui/UiButton.vue';

import type { Grid } from '@/helpers/gameBoard';

import { ROUTES } from '@/constants';

const router = useRouter();

const board = ref<InstanceType<typeof GameBoard>>();

const sample: Grid = [
  [0, 0, 0, 2],
  [0, 0, 4, 0],
  [0, 8, 16, 2],
  [4, 4, 4, 2048],
];

onMounted(() => {
  board.value?.startGame(sample);
});
</script>

<template>
  <ArrowsComponent />
  <h1 class="text-center mt-5">
    Join the numbers using your arrow keys and get to the <u>2048 tile!</u>
  </h1>
  <GameBoard :size="4" disabled ref="board" class="mt-5" overlay>
    <template v-slot:overlay>
      <UiButton
        label="play"
        color="primary"
        @click="() => router.push({ name: ROUTES.SINGLE_PLAYER })"
      />
    </template>
  </GameBoard>
</template>

<style scoped></style>
