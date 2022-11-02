import { players } from '@/db';
import type { Player } from './player.types';
import { PlayerStatus } from './player.types';

export const getPlayers = () => [...players].map(([_id, player]) => player);

export const getPlayerById = (playerId: string) => players.get(playerId);

export const createPlayer = (playerId: string) => {
  const player: Player = {
    id: playerId,
    username: 'aaa',
    status: PlayerStatus.ONLINE,
  };
  players.set(playerId, player);
  return player;
};

export const deletePlayer = (playerId: string) => players.delete(playerId);
