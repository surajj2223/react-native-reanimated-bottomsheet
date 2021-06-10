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
  hasFixedHeight?: boolean;
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
      hasFixedHeight = false,
      springConfig = defaultSpringConfig,
    }: SheetProps,
    ref
  ) => {
    const maxHeight = snapPoints[snapPoints.length - 1];
    const defaultHeight = initialSnap ? snapPoints[initialSnap] : snapPoints[0];
    const sheetHeight = hasFixedHeight
      ? useSharedValue(0)
      : useSharedValue(defaultHeight);
    const gestureDirection = useSharedValue(GESTURE.DRAGGING_UP);

    useImperativeHandle(ref, () => ({
      close: () => {
        sheetHeight.value = withSpring(0, defaultSpringConfig);
      },
      snapTo: (index: number) => {
        if (index < snapPoints.length - 1) {
          sheetHeight.value = withSpring(
            snapPoints[index],
            defaultSpringConfig
          );
        }
      },
    }));

    useEffect(() => {
      if (hasFixedHeight) {
        sheetHeight.value = withSpring(snapPoints[0], defaultSpringConfig);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getNearestSnap = (): number => {
      'worklet';
      let neearestSnapPoint: number = maxHeight;

      for (let snapIndex in snapPoints) {
        const numberedSnapIndex = Number(snapIndex);
        if (sheetHeight.value - snapPoints[snapIndex] < 0) {
          if (gestureDirection.value === GESTURE.DRAGGING_UP) {
            neearestSnapPoint = snapPoints[snapIndex];
          } else {
            const nearestSnapIndex: number =
              numberedSnapIndex - 1 >= 0
                ? numberedSnapIndex - 1
                : numberedSnapIndex;
            neearestSnapPoint = snapPoints[nearestSnapIndex];
          }
          break;
        }
      }
      return neearestSnapPoint;
    };

    const adjustSnap = (_: any) => {
      'worklet';
      const nearestSnapPoint = getNearestSnap();
      sheetHeight.value = withSpring(nearestSnapPoint, springConfig);
    };

    const gestureHandler = useAnimatedGestureHandler({
      onStart: (_, ctx: any) => {
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
