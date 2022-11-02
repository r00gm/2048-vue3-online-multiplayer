import type { Player } from "./player.types";

export enum GameStatus {
  READY = "READY",
  WAITING = "WAITING",
  FINISHED = "FINISHED",
}

export type Game = {
  id: string;
  requiredPlayers: number;
  readyPlayers: Player["id"][];
  players: Player[];
  status: GameStatus;
  grid: number[][];
};
