import { ref } from 'vue';
import { io } from 'socket.io-client';
import type { Socket } from 'socket.io-client';

export const useSocket = () => {
  const connected = ref(false);
  const userCount = ref(0);
  const socket: Socket = io();

  socket.on('connect', () => (connected.value = true));
  socket.on('disconnect', () => (connected.value = true));

  socket.on('players:count', users => (userCount.value = users));

  return { connected, userCount, socket };
};
