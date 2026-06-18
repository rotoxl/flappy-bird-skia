import { PIPE_SIZE } from '@/features/game/consts';
import { Group, Image, useImage } from '@shopify/react-native-skia';
import { SharedValue } from 'react-native-reanimated';

type Props = {
  deltaY: number;
  gameSpeed: SharedValue<number>;
};

const HALF_GAP = 80;

export default function Pipes({ deltaY, gameSpeed }: Props) {
  const topPipe = useImage(require('@/assets/game/pipe-green-inv.png'));
  const bottomPipe = useImage(require('@/assets/game/pipe-green.png'));

  return (
    <Group>
      <Image
        image={topPipe}
        fit="contain"
        x={gameSpeed}
        y={-PIPE_SIZE.height - HALF_GAP + deltaY}
        width={PIPE_SIZE.width}
        height={PIPE_SIZE.height}
      />

      <Image
        image={bottomPipe}
        fit="contain"
        x={gameSpeed}
        y={HALF_GAP + deltaY}
        width={PIPE_SIZE.width}
        height={PIPE_SIZE.height}
      />
    </Group>
  );
}
