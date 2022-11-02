import { createServer } from 'http';

import { Server } from 'socket.io';

import type { Express } from 'express';
export const createSocket = (app: Express) => {
  const server = createServer(app);
  const io = new Server(server);

  return { server, io };
};
