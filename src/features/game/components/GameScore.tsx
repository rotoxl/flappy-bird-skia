import { GAME_BOUNDS } from '@/features/game/consts';
import type { SkImage } from '@shopify/react-native-skia';
import { Group, Image, useImage } from '@shopify/react-native-skia';

type Props = {
  score: number;
  screenSize: {
    width: number;
    height: number;
  };
};

export const GameScore = ({ score, screenSize }: Props) => {
  const num0 = useImage(require('@/assets/game/0.png'));
  const num1 = useImage(require('@/assets/game/1.png'));
  const num2 = useImage(require('@/assets/game/2.png'));
  const num3 = useImage(require('@/assets/game/3.png'));
  const num4 = useImage(require('@/assets/game/4.png'));
  const num5 = useImage(require('@/assets/game/5.png'));
  const num6 = useImage(require('@/assets/game/6.png'));
  const num7 = useImage(require('@/assets/game/7.png'));
  const num8 = useImage(require('@/assets/game/8.png'));
  const num9 = useImage(require('@/assets/game/9.png'));

  const numbers = [num0, num1, num2, num3, num4, num5, num6, num7, num8, num9];

  const digits: (SkImage | null)[] = score
    .toString()
    .split('')
    .map((digit) => numbers[parseInt(digit, 10)] ?? num0);

  const digitWidth = 24;
  const digitHeight = 36;

  return (
    <Group
      transform={[
        {
          translateX: (screenSize.width - digitWidth * digits.length) / 2,
        },
        { translateY: GAME_BOUNDS.top / 2 + GAME_BOUNDS.padding },
      ]}
    >
      {digits.map((digit, index) => (
        <Image
          key={index}
          image={digit}
          x={index * digitWidth}
          y={0}
          width={digitWidth}
          height={digitHeight}
        />
      ))}
    </Group>
  );
};
