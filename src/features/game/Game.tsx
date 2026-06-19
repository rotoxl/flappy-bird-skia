import Bird from '@/features/game/components/Bird';
import { GameCredits } from '@/features/game/components/GameCredits';
import { GameScore } from '@/features/game/components/GameScore';
import Ground from '@/features/game/components/Ground';
import Pipes from '@/features/game/components/Pipes';
import Sky from '@/features/game/components/Sky';
import { useGame } from '@/features/game/useGame';
import { Canvas } from '@shopify/react-native-skia';
import { StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

export default function Game() {
  const {
    screenSize,
    screenMotion,
    birdPosition,
    birdSpeed,
    gameStatusStateValue,
    gameScore,
    pipePosition,
    onTouchStart,
  } = useGame();

  const gesture = Gesture.Tap().onStart(onTouchStart);

  return (
    <GestureDetector gesture={gesture}>
      <Canvas style={styles.container}>
        <Sky screenSize={screenSize} />
        <Pipes deltaY={pipePosition} gameSpeed={screenMotion} />
        <Ground screenSize={screenSize} />
        <GameScore
          score={gameScore}
          screenSize={screenSize}
          gameStatus={gameStatusStateValue}
        />
        <GameCredits
          gameStatus={gameStatusStateValue}
          screenSize={screenSize}
        />

        <Bird
          screenSize={screenSize}
          birdPosition={birdPosition}
          birdSpeed={birdSpeed}
          gameStatus={gameStatusStateValue}
        />
      </Canvas>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
