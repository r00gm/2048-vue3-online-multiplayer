import { games, joinableGames } from '@/db';
import * as db from '@/db';
import { getGames, createGame, getGameById, joinGame, deleteGame } from '@/services/game';
import type { Game } from '../game.types';
import type { Player } from '@/services/player.types';

const dummyPlayer: Player = {
  id: '1',
  username: 'dummy',
};
const dummyPlayer2: Player = {
  id: '2',
  username: 'dummy 2',
};

const mockGames = jest.fn();
const mockJoinables = jest.fn();

jest.mock('@/db', () => ({
  get games() {
    return mockGames();
  },
  get joinableGames() {
    return mockJoinables();
  },
}));

describe('game service', () => {
  beforeEach(() => {
    jest.resetModules();
    mockGames.mockReturnValue(new Map<string, Game>());
    mockJoinables.mockReturnValue(new Set<string>());
  });

  it('games should be empty', () => {
    expect(games.size).toBe(0);
  });

  it('should create a game', () => {
    createGame(dummyPlayer);
    expect(games.size).toBe(1);
    expect(joinableGames.size).toBe(1);
  });

  it('should return a game bye id', () => {
    const game = createGame(dummyPlayer);
    expect(getGameById(game.id)).toBe(game);
  });

  it('should return all games', () => {
    createGame(dummyPlayer);
    createGame(dummyPlayer);
    expect(getGames().length).toBe(2);
  });

  it('should join a game', () => {
    const game = createGame(dummyPlayer);
    expect(joinGame(game.id, dummyPlayer2)).toBe(game);
    expect(joinableGames.size).toBe(0);
  });

  it('should throw when the game does´t exist', () => {
    expect(() => joinGame('12', dummyPlayer2)).toThrow(
      'the game you are triyng to join no longer exist'
    );
  });

  it('should delete a game', () => {
    const game = createGame(dummyPlayer);
    deleteGame(game.id);
    expect(games.size).toBe(0);
    expect(joinableGames.size).toBe(0);
  });
});
