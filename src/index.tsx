/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useImperativeHandle } from 'react';
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
  useAnimatedGestureHandler,
} from 'react-native-reanimated';
import { StyleSheet } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';

enum GESTURE {
  DRAGGING_UP,
  DRAGGING_DOWN,
}

interface SheetProps {
  initialSnap?: number;
  snapPoints: Array<number>;
  enabledGestureInteraction?: boolean;
  renderContent: () => React.ReactNode;
  renderHeader: () => React.ReactNode;
  springConfig?: Animated.WithSpringConfig;
  fixedHeight?: boolean;
}

const defaultSpringConfig: Animated.WithSpringConfig = {
  damping: 50,
  mass: 0.5,
  stiffness: 121.6,
  restSpeedThreshold: 0.3,
};

export default React.forwardRef(
  (
    {
      initialSnap = 0,
      snapPoints,
      renderContent,
      renderHeader,
      enabledGestureInteraction = true,
      fixedHeight = false,
      springConfig = defaultSpringConfig,
    }: SheetProps,
    ref
  ) => {
    const maxHeight = snapPoints[snapPoints.length - 1];
    const defaultHeight = initialSnap ? snapPoints[initialSnap] : snapPoints[0];
    const sheetHeight = fixedHeight
      ? useSharedValue(0)
      : useSharedValue(defaultHeight);
    const gestureDirection = useSharedValue(GESTURE.DRAGGING_UP);

    useImperativeHandle(ref, () => ({
      close: () => {
        sheetHeight.value = withSpring(0, defaultSpringConfig);
      },
      open: () => {
        sheetHeight.value = withSpring(snapPoints[0], defaultSpringConfig);
      },
    }));

    useEffect(() => {
      if (fixedHeight) {
        sheetHeight.value = withSpring(snapPoints[0], defaultSpringConfig);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
      sheetHeight.value = withSpring(nearestSnapPoint, springConfig);
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
      <PanGestureHandler
        enabled={enabledGestureInteraction}
        onGestureEvent={gestureHandler}
      >
        <Animated.View style={[styles.sheetContainer, animatedStyle]}>
          <Animated.View style={styles.sheetInnerContainer}>
            {renderHeader()}
            {renderContent()}
          </Animated.View>
        </Animated.View>
      </PanGestureHandler>
    );
  }
);

const styles = StyleSheet.create({
  sheetContainer: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    height: 20,
    borderRadius: 4,
  },
  sheetInnerContainer: {
    flex: 1,
    shadowOpacity: 0.5,
    shadowOffset: { height: -1, width: 0 },
  },
});
