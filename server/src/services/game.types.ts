import type { Player } from './player.types';

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
