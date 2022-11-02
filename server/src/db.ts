import { Game } from '@/services/game.types';
import { Player } from '@/services/player.types';

/**
 * Our tiny "DB" just for demo pourposes
 */
export const players = new Map<string, Player>();
export const games = new Map<string, Game>();
export const joinableGames = new Set<string>();
