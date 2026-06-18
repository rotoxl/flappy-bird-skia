import { GAME_BOUNDS, GROUND_SIZE } from '@/features/game/consts';

import { Group, Image, useImage } from '@shopify/react-native-skia';

type Props = {
  screenSize: {
    width: number;
    height: number;
  };
};

export default function Ground({ screenSize }: Props) {
  return (
    <Group>
      <GroundSlice screenSize={screenSize} />
    </Group>
  );
}

const GroundSlice = ({ screenSize }: Props) => {
  const ground = useImage(require('@/assets/game/base.png'));

  return (
    <Image
      image={ground}
      fit="cover"
      x={0}
      y={screenSize.height - GAME_BOUNDS.bottom}
      width={GROUND_SIZE.width}
      height={GROUND_SIZE.height}
    />
  );
};
