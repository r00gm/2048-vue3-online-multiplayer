import { createApp } from "@/app";
import { createSocket } from "@/socket";
import {
  deleteGame,
  getJoinableGames,
  joinGame,
  createGame,
  getGameById,
} from "@/services/game";
import { createPlayer, deletePlayer, getPlayerById } from "@/services/player";
import { GameStatus } from "@/services/game.types";

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
io.of("/").adapter.on("delete-room", (room) => deleteGame(room));

io.on("connect", (socket) => {
  //ad user to our "DB"
  createPlayer(socket.id);

  // broadcast to all user when a new user arrives
  io.emit("players:count", io.engine.clientsCount);

  // broadcast to all user when a user leaves
  socket.on("disconnect", (_reason) => {
    io.emit("players:count", io.engine.clientsCount);
    deletePlayer(socket.id);
  });

  // inform user rooms that the user has loggedout/timedout/left
  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) => io.in(room).emit("player:left", socket.id));
  });

  // join/create a game
  socket.on("join:game", async () => {
    const [gameId] = getJoinableGames();
    const player = getPlayerById(socket.id);

    if (!player) return;

    const game = gameId ? joinGame(gameId, player) : createGame(player);

    await socket.join(game.id);
    socket.emit("game:joined", game);
    socket.to(game.id).emit("game:player:joined", player);
  });

  // start the game when all players are ready
  socket.on("player:ready", (gameID) => {
    const game = getGameById(gameID);
    game?.readyPlayers.push(socket.id);

    if (game?.readyPlayers.length === game?.requiredPlayers) {
      //start the game
      socket.to(gameID).emit("game:updated", { status: GameStatus.READY });
    }
  });

  socket.on("game:lost", (gameID) => {
    const game = getGameById(gameID);
    const winner = game?.players.find(({ id }) => id !== socket.id);
    const payload = { winner: winner, status: GameStatus.FINISHED };

    // game over
    socket.to(gameID).emit("game:updated", payload);
  });

  // broadcast player score to all room members
  socket.on("update:score", ({ gameID, score }) => {
    socket.to(gameID).emit("score:updated", { score, playerId: socket.id });
    if (score != 2048) return;

    // game over
    socket.to(gameID).emit("game:updated", {
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
