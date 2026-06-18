import { GAME_STATUS, GameStatus } from '@/features/game/consts';
import {
  Atlas,
  Group,
  Image,
  useImage,
  useRSXformBuffer,
  useRectBuffer,
} from '@shopify/react-native-skia';
import { useEffect } from 'react';
import {
  SharedValue,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

type Props = {
  screenSize: {
    width: number;
    height: number;
  };
  birdPosition: SharedValue<number>;
  gameStatus: SharedValue<GameStatus>;
};

const FRAME = { width: 34, height: 24, sep: 10, scale: 1.3 };
const SPRITE_COUNT = 1;
const FLAP_DURATION = 80;

const scaledSize = {
  width: FRAME.width * FRAME.scale,
  height: FRAME.height * FRAME.scale,
};

export default function Bird({ screenSize, birdPosition, gameStatus }: Props) {
  const spriteSheet = useImage(require('@/assets/game/yellowbird-sprite.png'));
  const deadBird = useImage(require('@/assets/game/yellowbird-dead.png'));
  const frameIndex = useSharedValue(0);

  const birdX = screenSize.width / 4 - scaledSize.width / 2;

  useEffect(() => {
    frameIndex.value = withRepeat(
      withSequence(
        withTiming(0, { duration: FLAP_DURATION }),
        withTiming(1, { duration: FLAP_DURATION }),
        withTiming(2, { duration: FLAP_DURATION }),
        withTiming(1, { duration: FLAP_DURATION }),
      ),
      -1,
    );
  }, [frameIndex]);

  const sprites = useRectBuffer(SPRITE_COUNT, (rect) => {
    'worklet';
    const frame = Math.round(frameIndex.value);
    rect.setXYWH(
      frame * (FRAME.width + FRAME.sep),
      0,
      FRAME.width,
      FRAME.height,
    );
  });

  const transforms = useRSXformBuffer(SPRITE_COUNT, (val) => {
    'worklet';
    val.set(FRAME.scale, 0, birdX, birdPosition.value);
  });

  if (!spriteSheet) {
    return null;
  }

  if (gameStatus === GAME_STATUS.READY) {
    return null;
  }

  if (gameStatus === GAME_STATUS.PLAYING) {
    return (
      <Group>
        <Atlas image={spriteSheet} sprites={sprites} transforms={transforms} />
      </Group>
    );
  }

  return (
    <Image
      image={deadBird}
      x={birdX}
      y={birdPosition.value}
      width={scaledSize.width}
      height={scaledSize.height}
    />
  );
}
