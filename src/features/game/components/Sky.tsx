import { Image, useImage } from '@shopify/react-native-skia';

type Props = {
  screenSize: {
    width: number;
    height: number;
  };
};
export default function Sky({ screenSize }: Props) {
  const sky = useImage(require('@/assets/game/background-day.png'));

  return (
    <Image
      image={sky}
      fit="cover"
      width={screenSize.width}
      height={screenSize.height}
    />
  );
}
