import { randomUUID } from 'crypto';
import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';
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
    name: uniqueNamesGenerator({
      dictionaries: [adjectives, colors, animals],
    }),
    requiredPlayers: 2,
    playersReady: [],
    players: [player],
    status: GameStatus.WAITING_FOR_PLAYERS,
    board: createGrid({ rows: 4, cols: 4 }),
  };
  games.set(gameId, game);
  joinableGames.add(gameId);
  return game;
};

export const joinGame = (gameId: string, player: Player) => {
  const game = getGameById(gameId);

  if (!game) throw new Error(`the game you are triyng to join no longer exist`);

  game.players.push(player);

  if (game.players.length === game.requiredPlayers) {
    joinableGames.delete(gameId);
  }
  return game;
};

export const deleteGame = (gameId: string) => {
  games.delete(gameId);
  joinableGames.delete(gameId);
};

export const getJoinableGames = () => joinableGames;
