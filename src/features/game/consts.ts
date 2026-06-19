export const GAME_BOUNDS = { top: 100, bottom: 100, padding: 20 };

const BASE_PIPE_SIZE = { width: 52, height: 520, scale: 1.2 };

export const PIPE_SIZE = {
  width: BASE_PIPE_SIZE.width * BASE_PIPE_SIZE.scale,
  height: BASE_PIPE_SIZE.height * BASE_PIPE_SIZE.scale,
};

export const PIPE_GAP = 90; //will be multiplied by 2

export const PIPE_SPEED_MS = 2000;

export const GROUND_SIZE = { width: 528, height: 112 };
export const GROUND_SPEED_MS = 3900;

export const GRAVITY = 900;
export const FLAP_FORCE = 500;

export const GAME_STATUS = {
  READY: 'READY',
  PLAYING: 'PLAYING',
  GAME_OVER: 'GAME_OVER',
} as const;

export type GameStatus = (typeof GAME_STATUS)[keyof typeof GAME_STATUS];
