import { useWindowDimensions } from 'react-native';
import {
  Easing,
  cancelAnimation,
  useAnimatedReaction,
  useFrameCallback,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import {
  FLAP_FORCE,
  GAME_BOUNDS,
  GAME_STATUS,
  GRAVITY,
  GameStatus,
  PIPE_GAP,
  PIPE_SIZE,
  PIPE_SPEED_MS,
} from '@/features/game/consts';
import { useState } from 'react';
import { scheduleOnRN } from 'react-native-worklets';

export const useGame = () => {
  'worklet';

  const screenSize = useWindowDimensions();
  const screenMotion = useSharedValue(screenSize.width);

  const birdPosition = useSharedValue(screenSize.height / 2);
  const birdSpeed = useSharedValue(0);
  const gameStatus = useSharedValue<GameStatus>(GAME_STATUS.READY);

  const [pipePosition, setPipePosition] = useState(screenSize.height / 2);

  const [gameStatusStateValue, setGameStatusStateValue] = useState<GameStatus>(
    gameStatus.value,
  );

  const forceRerender = () => {
    setGameStatusStateValue(gameStatus.value);
  };

  useAnimatedReaction(
    () => gameStatus.value,
    () => scheduleOnRN(forceRerender),
  );

  const [gameScore, setGameScore] = useState(0);

  const startScreenMotion = () => {
    'worklet';

    screenMotion.value = withSequence(
      withTiming(screenSize.width, { duration: 0 }),
      withTiming(-PIPE_SIZE.width, {
        duration: PIPE_SPEED_MS,
        easing: Easing.linear,
      }),
    );
  };

  const increaseScore = () => {
    setGameScore((current) => current + 1);
  };

  useFrameCallback(({ timeSincePreviousFrame: dt }) => {
    if (!dt) return;
    if (gameStatus.value !== GAME_STATUS.PLAYING) return;

    birdPosition.value = birdPosition.value + (birdSpeed.value * dt) / 1000;
    birdSpeed.value = birdSpeed.value + (GRAVITY * dt) / 1000;
  });

  const randomizePipePosition = () => {
    const borderBottom = screenSize.height - GAME_BOUNDS.bottom - 2 * PIPE_GAP;
    const borderTop = GAME_BOUNDS.bottom + PIPE_GAP;

    const randomY = borderTop + Math.random() * (borderBottom - borderTop);
    setPipePosition(randomY);
  };

  useAnimatedReaction(
    () => screenMotion.value,
    (currentValue, previousValue) => {
      if (!previousValue) return;

      if (
        currentValue <= -PIPE_SIZE.width &&
        previousValue > -PIPE_SIZE.width
      ) {
        startScreenMotion();
        scheduleOnRN(randomizePipePosition);
      }

      const birdPositionX = screenSize.width / 4;
      if (currentValue <= birdPositionX && previousValue > birdPositionX) {
        scheduleOnRN(increaseScore);
      }
    },
  );

  useAnimatedReaction(
    () => birdPosition.value,
    (currentValue, previousValue) => {
      const bottomBound = screenSize.height - GAME_BOUNDS.bottom - 10;
      if (
        currentValue >= bottomBound &&
        previousValue &&
        previousValue <= bottomBound
      ) {
        gameStatus.value = GAME_STATUS.GAME_OVER;
      }
    },
  );

  useAnimatedReaction(
    () => gameStatus.value,
    (currentValue) => {
      if (currentValue === GAME_STATUS.GAME_OVER) {
        cancelAnimation(birdSpeed);
        cancelAnimation(screenMotion);
      }
    },
  );

  const resetGame = () => {
    setGameScore(0);
    gameStatus.value = GAME_STATUS.PLAYING;
    birdPosition.value = screenSize.height / 2;
    birdSpeed.value = 0;
    startScreenMotion();
  };

  const onTouchStart = () => {
    'worklet';
    if (gameStatus.value === GAME_STATUS.PLAYING) {
      birdSpeed.value = -FLAP_FORCE;
    } else if (gameStatus.value === GAME_STATUS.READY) {
      scheduleOnRN(resetGame);
    } else if (gameStatus.value === GAME_STATUS.GAME_OVER) {
      scheduleOnRN(resetGame);
    }
  };

  return {
    screenSize,

    screenMotion,
    startScreenMotion,

    birdPosition,
    birdSpeed,
    pipePosition,

    gameStatusStateValue,
    gameScore,
    onTouchStart,
  };
};
