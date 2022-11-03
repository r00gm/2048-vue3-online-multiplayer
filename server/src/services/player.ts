import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';
import { players } from '@/db';
import type { Player } from './player.types';

export const getPlayers = () => [...players].map(([_id, player]) => player);

export const getPlayerById = (playerId: string) => players.get(playerId);

export const createPlayer = (playerId: string) => {
  const player: Player = {
    id: playerId,
    username: uniqueNamesGenerator({
      dictionaries: [adjectives, colors, animals],
    }),
  };
  players.set(playerId, player);
  return player;
};

export const deletePlayer = (playerId: string) => players.delete(playerId);
