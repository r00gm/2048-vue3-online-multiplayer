export enum ROUTES {
  HOME = 'home',
  SINGLE_PLAYER = 'single-player',
  MULTI_PLAYER = 'multi-player',
}

export const OBSTACLE = 'X';

export const GAME_COLORS = {
  1: '#d9ed92',
  2: '#b5e48c',
  4: '#99d98c',
  8: '#76c893',
  16: '#52b69a',
  32: '#34a0a4',
  64: '#168aad',
  128: '#1a759f',
  256: '#1e6091',
  512: '#184e77',
  1024: '#D7DF01',
  2048: '#D7DF01',
} as { [key: number]: string };

export enum Status {
  ONLINE = 'online',
  OFFLINE = 'offline',
}
