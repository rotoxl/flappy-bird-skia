import Bird from '@/features/game/components/Bird';
import { GameScore } from '@/features/game/components/GameScore';
import Ground from '@/features/game/components/Ground';
import Pipes from '@/features/game/components/Pipes';
import Sky from '@/features/game/components/Sky';
import { useGame } from '@/features/game/useGame';
import { Canvas } from '@shopify/react-native-skia';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

export default function Game() {
  const {
    screenSize,
    screenMotion,
    birdPosition,

    gameStatus,
    gameScore,

    onTouchStart,
    startScreenMotion,
  } = useGame();

  useEffect(() => {
    startScreenMotion();
  }, []);

  const gesture = Gesture.Tap().onStart(onTouchStart);

  return (
    <GestureDetector gesture={gesture}>
      <Canvas style={styles.container}>
        <Sky screenSize={screenSize} />
        <Pipes deltaY={150} gameSpeed={screenMotion} />
        <Ground screenSize={screenSize} />
        <GameScore score={gameScore} screenSize={screenSize} />

        <Bird
          screenSize={screenSize}
          birdPosition={birdPosition}
          gameStatus={gameStatus}
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
