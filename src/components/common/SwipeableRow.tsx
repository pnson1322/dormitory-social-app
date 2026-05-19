import { Ionicons } from "@expo/vector-icons";
import React, { useRef } from "react";
import { Animated, Dimensions, PanResponder, StyleSheet, View } from "react-native";
import { SwipeActionView } from "./SwipeActionView";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;

interface Props {
  children: React.ReactNode;
  leftAction?: () => void;
  leftLabel?: string;
  leftColor?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightAction?: () => void;
  rightLabel?: string;
  rightColor?: string;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onSwipeStart?: () => void;
  onSwipeEnd?: () => void;
}

export function SwipeableRow({
  children,
  leftAction,
  leftLabel = "Hoàn thành",
  leftColor = "#10B981",
  leftIcon = "checkmark-circle-outline",
  rightAction,
  rightLabel = "Từ chối",
  rightColor = "#EF4444",
  rightIcon = "close-circle-outline",
  onSwipeStart,
  onSwipeEnd,
}: Props) {
  const translateX = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 5 && Math.abs(gestureState.dy) < 5;
      },
      onMoveShouldSetPanResponderCapture: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 5 && Math.abs(gestureState.dy) < 5;
      },
      onPanResponderGrant: () => {
        onSwipeStart?.();
      },
      onPanResponderMove: (_, gestureState) => {
        let dx = gestureState.dx;
        if (dx > 0 && !leftAction) dx = dx * 0.2;
        if (dx < 0 && !rightAction) dx = dx * 0.2;
        translateX.setValue(dx);
      },
      onPanResponderRelease: (_, gestureState) => {
        const dx = gestureState.dx;

        if (dx > SWIPE_THRESHOLD && leftAction) {
          Animated.timing(translateX, {
            toValue: SCREEN_WIDTH,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            leftAction();
            translateX.setValue(0);
            onSwipeEnd?.();
          });
        } else if (dx < -SWIPE_THRESHOLD && rightAction) {
          Animated.timing(translateX, {
            toValue: -SCREEN_WIDTH,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            rightAction();
            translateX.setValue(0);
            onSwipeEnd?.();
          });
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            friction: 5,
            tension: 40,
            useNativeDriver: true,
          }).start(() => {
            onSwipeEnd?.();
          });
        }
      },
      onPanResponderTerminate: () => {
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }).start(() => {
          onSwipeEnd?.();
        });
      },
    })
  ).current;

  const leftActionScale = translateX.interpolate({
    inputRange: [0, SWIPE_THRESHOLD],
    outputRange: [0.6, 1.1],
    extrapolate: "clamp",
  });

  const rightActionScale = translateX.interpolate({
    inputRange: [-SWIPE_THRESHOLD, 0],
    outputRange: [1.1, 0.6],
    extrapolate: "clamp",
  });

  const leftActionOpacity = translateX.interpolate({
    inputRange: [0, SWIPE_THRESHOLD / 2],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const rightActionOpacity = translateX.interpolate({
    inputRange: [-SWIPE_THRESHOLD / 2, 0],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  return (
    <View
      className="relative overflow-hidden mb-4 rounded-[24px]"
      onTouchStart={() => {
        onSwipeStart?.();
      }}
      onTouchEnd={() => {
        onSwipeEnd?.();
      }}
      onTouchCancel={() => {
        onSwipeEnd?.();
      }}
    >
      <View style={StyleSheet.absoluteFillObject} className="flex-row">
        {leftAction && (
          <SwipeActionView
            color={leftColor}
            label={leftLabel}
            icon={leftIcon}
            scale={leftActionScale}
            opacity={leftActionOpacity}
            align="left"
          />
        )}

        {rightAction && (
          <SwipeActionView
            color={rightColor}
            label={rightLabel}
            icon={rightIcon}
            scale={rightActionScale}
            opacity={rightActionOpacity}
            align="right"
          />
        )}
      </View>

      <Animated.View
        style={{ transform: [{ translateX }] }}
        {...panResponder.panHandlers}
      >
        {children}
      </Animated.View>
    </View>
  );
}
