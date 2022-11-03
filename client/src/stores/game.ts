import { ref, reactive, computed } from 'vue';
import { defineStore } from 'pinia';
import { useSocket } from '@/composables/socket';

export type Player = {
  id: string;
  username: string;
  score: number;
};

export enum GameStatus {
  WAITING_FOR_PLAYERS = 'WAITING_FOR_PLAYERS',
  WAITING_FOR_PLAYERS_TO_BE_READY = 'WAITING_FOR_PLAYERS_TO_BE_READY',
  STARTED = 'STARTED',
  FINISHED = 'FINISHED',
}

export type Game = {
  id: string;
  name: string;
  requiredPlayers: number;
  playersReady: Player['id'][];
  players: Player[];
  status: GameStatus;
  board: number[][];
};

export type GameUpdate = {
  winner: Player;
  status: GameStatus;
};

export const useGameStore = defineStore('game', () => {
  const { userCount, socket } = useSocket();

  const gameId = ref('');
  const gameName = ref('');
  const requiredPlayers = ref<number>();
  const playersReady = ref<Player['id'][]>([]);
  const players = reactive<Map<string, Player>>(new Map());
  const gameStatus = ref();
  const gameWinner = ref<Player>();
  const board = ref<number[][]>();
  const user = computed(() => players.get(socket.id));
  const opponent = computed(() => {
    const ids = [...players.keys()];
    const oponnentId = ids.find(key => key !== socket.id);
    return oponnentId ? players.get(oponnentId) : undefined;
  });

  // Reset state to it´s initial values
  const resetState = () => {
    gameId.value = '';
    gameName.value = '';
    requiredPlayers.value = undefined;
    playersReady.value = [];
    players.clear();
    gameStatus.value = undefined;
    board.value = undefined;
  };

  // the player has joine the game
  const gameJoined = (game: Game) => {
    gameId.value = game.id;
    gameName.value = game.name;
    requiredPlayers.value = game.requiredPlayers;
    playersReady.value = game.playersReady;
    players.clear();

    game.players.forEach(player => {
      player.score = 0;
      players.set(player.id, player);
    });

    gameStatus.value = game.status;
    gameWinner.value = undefined;
    board.value = game.board;
  };

  /**
   * game has been updated
   *  - a player has won
   *  - a player has lost
   *  - all players are ready to play
   */
  const updateGame = ({ winner, status }: GameUpdate) => {
    gameWinner.value = winner;
    gameStatus.value = status;
  };

  // new player has joined the game
  const playerHasJoined = (player: Player) => {
    player.score = 0;
    players.set(player.id, player);
  };

  // player disconnected/quit
  const playerLeftTheGame = (player: Player) => {
    players.delete(player.id);
    gameStatus.value = GameStatus.FINISHED;
  };

  const updateScore = ({ score, highestTile }: { score: number; highestTile: number }) => {
    // update state
    const player = players.get(socket.id);
    player!.score += score;

    // send it over
    socket.emit('update:score', { gameID: gameId.value, score, highestTile });
  };

  socket.on('game:updated', updateGame);
  socket.on('game:joined', gameJoined);

  socket.on('player:connected', playerHasJoined);
  socket.on('player:disconnected', playerLeftTheGame);

  socket.on('score:updated', ({ score, playerId }) => {
    const player = players.get(playerId);
    player!.score += score;
  });

  socket.onAny((eventName, ...args) => {
    console.log(eventName, ...args);
  });

  const joinGame = () => {
    return new Promise(resolve => {
      socket.once('game:joined', (game: Game) => {
        gameJoined(game);
        resolve(game);
      });
      resetState();
      socket.emit('join:game');
    });
  };

  const leaveGame = () => {
    socket.emit('leave:game', gameId.value);
    resetState();
  };

  const ready = () => {
    playersReady.value.push(socket.id);
    socket.emit('player:ready', gameId.value);
  };

  const gameIsLost = () => socket.emit('game:lost', gameId.value);

  return {
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
    joinGame,
    leaveGame,
    ready,
    updateScore,
    gameIsLost,
  };
});
