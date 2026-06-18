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
  birdSpeed: SharedValue<number>;
  gameStatus: GameStatus;
};

const FRAME = { width: 34, height: 24, sep: 10, scale: 1.3 };
const SPRITE_COUNT = 1;
const FLAP_DURATION = 80;
const MAX_TILT_ANGLE = Math.PI / 12;
const SPEED_FOR_MAX_TILT = 600;

const scaledSize = {
  width: FRAME.width * FRAME.scale,
  height: FRAME.height * FRAME.scale,
};

export default function Bird({
  screenSize,
  birdPosition,
  birdSpeed,
  gameStatus,
}: Props) {
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

    const angle = Math.max(
      -MAX_TILT_ANGLE,
      Math.min(MAX_TILT_ANGLE, birdSpeed.value / SPEED_FOR_MAX_TILT),
    );
    const scos = FRAME.scale * Math.cos(angle);
    const ssin = FRAME.scale * Math.sin(angle);
    const centerX = FRAME.width / 2;
    const centerY = FRAME.height / 2;
    const x = birdX + scaledSize.width / 2;
    const y = birdPosition.value + scaledSize.height / 2;

    val.set(
      scos,
      ssin,
      x - scos * centerX + ssin * centerY,
      y - ssin * centerX - scos * centerY,
    );
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
