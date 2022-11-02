import { randomUUID } from 'crypto';
import type { Game } from './game.types';
import { GameStatus } from './game.types';
import type { Player } from './player.types';
import { createGrid } from '@/utils';

import { games, joinableGames } from '@/db';

export const getGames = () => [...games].map(([_id, game]) => game);

export const getGameById = (gameId: string) => games.get(gameId);

export const createGame = (player: Player) => {
  const gameId = randomUUID();
  const game: Game = {
    id: gameId,
    requiredPlayers: 2,
    readyPlayers: [],
    players: [player],
    status: GameStatus.WAITING,
    grid: createGrid({ rows: 4, cols: 4 }),
  };
  games.set(gameId, game);
  joinableGames.add(gameId);
  return game;
};

export const joinGame = (gameId: string, player: Player) => {
  const game = getGameById(gameId);

  if (!game) throw new Error(`the game you are triyng to join no longer exist`);

  game.players.push(player);

  if (game.players.length === game.requiredPlayers - 1) {
    joinableGames.delete(gameId);
  }
  return game;
};

export const deleteGame = (gameId: string) => {
  games.delete(gameId);
  joinableGames.delete(gameId);
};

export const getJoinableGames = () => joinableGames;
