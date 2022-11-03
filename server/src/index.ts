import { createApp } from '@/app';
import { createSocket } from '@/socket';
import {
  deleteGame,
  getJoinableGames,
  joinGame,
  createGame,
  getGameById,
  getGamesByPlayer,
} from '@/services/game';
import { createPlayer, deletePlayer, getPlayerById } from '@/services/player';
import { GameStatus } from '@/services/game.types';

/**
 * Simple websocket implementation
 *
 * There is no Auth, DataBase, ReConnection , etc
 * Once the player leaves the room it can NOT reconnect
 */

const PORT = process.env.PORT || 8080;

const app = createApp();
const { server, io } = createSocket(app);

// remove empty games from cache
io.of('/').adapter.on('delete-room', room => deleteGame(room));

io.on('connect', socket => {
  //ad user to our "DB"
  createPlayer(socket.id);

  // broadcast to all user when a new user arrives
  io.emit('players:count', io.engine.clientsCount);

  // broadcast to all user when a user leaves
  socket.on('disconnect', _reason => {
    io.emit('players:count', io.engine.clientsCount);
    deletePlayer(socket.id);
  });

  // inform user rooms that the user has loggedout/timedout/left
  socket.on('disconnecting', () => {
    const player = getPlayerById(socket.id);
    socket.rooms.forEach(room => io.in(room).emit('player:disconnected', player));
  });

  // join/create a game
  socket.on('join:game', async () => {
    const player = getPlayerById(socket.id);
    if (!player) return;

    // log player off any previous games
    const playerGames = getGamesByPlayer(player);
    playerGames.forEach(game => socket.leave(game.id));

    const [gameId] = getJoinableGames();

    const game = gameId ? joinGame(gameId, player) : createGame(player);

    await socket.join(game.id);
    socket.emit('game:joined', game);
    socket.to(game.id).emit('player:connected', player);
  });

  socket.on('leave:game', gameID => {
    const player = getPlayerById(socket.id);
    socket.to(gameID).emit('player:disconnected', player);
    socket.leave(gameID);
  });

  // start the game when all players are ready
  socket.on('player:ready', gameID => {
    const game = getGameById(gameID);
    game?.playersReady.push(socket.id);

    if (game?.playersReady.length === game?.requiredPlayers) {
      //start the game
      io.sockets.in(gameID).emit('game:updated', { status: GameStatus.STARTED });
    }
  });

  socket.on('game:lost', gameID => {
    const game = getGameById(gameID);
    const winner = game?.players.find(({ id }) => id !== socket.id);
    const payload = { winner: winner, status: GameStatus.FINISHED };

    // game over
    io.sockets.in(gameID).emit('game:updated', payload);
  });

  // broadcast player score to all room members
  socket.on('update:score', ({ gameID, score, highestTile }) => {
    socket.to(gameID).emit('score:updated', { score, playerId: socket.id });
    console.log('update:score', { gameID, score, highestTile });
    if (highestTile !== 2048) return;

    // game over
    io.sockets.in(gameID).emit('game:updated', {
      winner: getPlayerById(socket.id),
      status: GameStatus.FINISHED,
    });
  });

  console.log(`connect ${socket.id}`);
});

// set port, listen for requests
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
