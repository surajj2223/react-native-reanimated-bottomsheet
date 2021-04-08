/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
  useAnimatedGestureHandler,
} from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';

enum GESTURE {
  DRAGGING_UP,
  DRAGGING_DOWN,
}

interface SheetProps {
  initialSnap?: number;
  snapPoints: Array<number>;
  renderContent: () => React.ReactNode;
  renderHeader: () => React.ReactNode;
}

export default ({
  initialSnap = 0,
  snapPoints = [40, 300, 450, 600],
  renderContent,
  renderHeader,
}: SheetProps) => {
  const maxHeight = snapPoints[snapPoints.length - 1];

  const defaultHeight = initialSnap ? snapPoints[initialSnap] : snapPoints[0];

  const sheetHeight = useSharedValue(defaultHeight);
  const gestureDirection = useSharedValue(GESTURE.DRAGGING_UP);

  const getNearestSnap = (): number => {
    'worklet';
    let neearestSnapPoint: number = maxHeight;

    for (let snapIndex in snapPoints) {
      if (sheetHeight.value - snapPoints[snapIndex] < 0) {
        if (gestureDirection.value === GESTURE.DRAGGING_UP) {
          neearestSnapPoint = snapPoints[snapIndex];
        } else {
          neearestSnapPoint =
            snapPoints[snapIndex - 1 >= 0 ? snapIndex - 1 : snapIndex];
        }
        break;
      }
    }
    return neearestSnapPoint;
  };

  const adjustSnap = (_) => {
    'worklet';
    const nearestSnapPoint = getNearestSnap();
    sheetHeight.value = withSpring(nearestSnapPoint);
  };

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startY = sheetHeight.value;
    },

    onActive: (event, ctx) => {
      if (event.velocityY > 0) {
        gestureDirection.value = GESTURE.DRAGGING_DOWN;
      } else if (event.velocityY < 0) {
        gestureDirection.value = GESTURE.DRAGGING_UP;
      }

      sheetHeight.value = ctx.startY + event.translationY * -1;
    },
    onEnd: adjustSnap,
  });

  const animatedStyle = useAnimatedStyle(() => ({
    height: sheetHeight.value,
  }));

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View
        style={[
          {
            width: '100%',
            position: 'absolute',
            bottom: 0,
            height: 20,
            borderRadius: 4,
          },
          animatedStyle,
        ]}
      >
        <Animated.View style={{ flex: 1 }}>
          {renderHeader()}
          {renderContent()}
        </Animated.View>
      </Animated.View>
    </PanGestureHandler>
  );
};
