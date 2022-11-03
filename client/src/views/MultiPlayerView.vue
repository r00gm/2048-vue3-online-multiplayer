<script setup lang="ts">
import { ref, onMounted, computed, reactive } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useGameStore, GameStatus } from '@/stores/game';
import FixedHeaderAndFooterLayout from '@/layouts/FixedHeaderAndFooterLayout.vue';
import GameBoard from '@/components/GameBoard.vue';
import UiBUtton from '@/ui/UiButton.vue';

const store = useGameStore();

const {
  userCount,
  user,
  opponent,
  gameId,
  gameName,
  players,
  playersReady,
  gameStatus,
  gameWinner,
  board,
} = storeToRefs(store);
const { joinGame, leaveGame, ready, updateScore, gameIsLost } = store;

const overlay = computed(() => gameStatus.value !== GameStatus.STARTED);

const game = ref<InstanceType<typeof GameBoard>>();

const handleMove = ({ score: value, highestTile }: { score: number; highestTile: number }) => {
  updateScore({ score: value, highestTile });
};

const handleLost = () => {
  gameIsLost();
};

const newGame = async () => {
  await joinGame();
  game.value?.startGame(board.value);
  ready();
};

await joinGame();

onMounted(() => {
  game.value?.startGame(board.value);
  // there was a user already waiting for us
  ready();
});

onMounted(() => {});

onBeforeRouteLeave((to, from) => {
  // const answer = window.confirm('Do you really want to leave an ongoing game?');
  // // cancel the navigation and stay on the same page
  // if (!answer) return false;
  console.log('leaving');
  leaveGame();
});
</script>

<template>
  <div class="mx-auto h-full">
    <FixedHeaderAndFooterLayout class="h-full">
      <template v-slot:header>
        <div class="flex justify-between border-y p-4">
          <div>online players: {{ userCount }}</div>
          <div class="font-bold">game name: {{ gameName }}</div>
          <div>game players: {{ players.size }}</div>
        </div>
      </template>
      <div class="flex flex-col h-full justify-center items-center">
        <div class="flex justify-between w-96 max-w-full my-5 items-end">
          <div class="w-40">
            <div class="truncate text-center font-semibold">Your score</div>
            <div class="score">
              {{ user?.score }}
            </div>
          </div>
          <div class="w-40">
            <div class="truncate text-center font-semibold">{{ opponent?.username }}</div>
            <div class="score">
              {{ opponent?.score }}
            </div>
          </div>
        </div>
        <GameBoard
          :size="4"
          :overlay="overlay"
          :disabled="overlay"
          ref="game"
          @move="handleMove"
          @game-over="handleLost"
          class="w-full"
        >
          <template v-slot:overlay>
            <h1 class="heading">
              <template v-if="gameStatus === GameStatus.WAITING_FOR_PLAYERS">
                Waiting for players to join...
              </template>
              <template v-else-if="gameStatus === GameStatus.WAITING_FOR_PLAYERS_TO_BE_READY">
                Waiting for players to be ready
              </template>
              <template v-else-if="gameStatus === GameStatus.FINISHED">
                <template v-if="gameWinner">
                  <template v-if="gameWinner.id === user?.id"> You have won!!! </template>
                  <template v-else>
                    You have lost!!! <br />{{ gameWinner.username }} is the winner!
                  </template>
                </template>
                <template v-else> Your opponent has left the game :( </template>
              </template>
            </h1>
            <UiBUtton label="New Game" @click="newGame" />
          </template>
        </GameBoard>
      </div>
    </FixedHeaderAndFooterLayout>
  </div>
</template>

<style scoped>
.heading {
  @apply mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl text-center;
}

.score {
  @apply aspect-video bg-slate-900 bg-opacity-10 rounded flex justify-center items-center font-bold text-lg;
}
</style>
