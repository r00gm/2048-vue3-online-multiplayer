export enum PlayerStatus {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
}

export type Player = {
  id: string;
  username: string;
};
