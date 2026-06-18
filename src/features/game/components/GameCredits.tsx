import { GAME_BOUNDS, GAME_STATUS, GameStatus } from '@/features/game/consts';
import { Image, useImage } from '@shopify/react-native-skia';

type Props = {
  gameStatus: GameStatus;
  screenSize: {
    width: number;
    height: number;
  };
};

export const GameCredits = ({ gameStatus, screenSize }: Props) => {
  const gameOver = useImage(require('@/assets/game/gameover.png'));
  const gameStart = useImage(require('@/assets/game/gamestart.png'));

  if (!gameOver || !gameStart) {
    return null;
  }

  if (gameStatus === GAME_STATUS.READY) {
    return (
      <Image
        image={gameStart}
        x={(screenSize.width - gameStart.width()) / 2}
        y={GAME_BOUNDS.padding * 3}
        fit="contain"
        width={gameStart.width()}
        height={screenSize.height - gameStart.height()}
      />
    );
  }

  if (gameStatus === GAME_STATUS.GAME_OVER) {
    return (
      <Image
        image={gameOver}
        x={(screenSize.width - gameStart.width()) / 2}
        y={GAME_BOUNDS.padding}
        fit="contain"
        width={gameOver.width()}
        height={screenSize.height - GAME_BOUNDS.padding * 2}
      />
    );
  }

  return null;
};
