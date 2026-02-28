import { Animated } from "react-native";

export function shake(anim: Animated.Value) {
  anim.setValue(0);
  Animated.sequence([
    Animated.timing(anim, { toValue: 10, duration: 50, useNativeDriver: true }),
    Animated.timing(anim, {
      toValue: -10,
      duration: 50,
      useNativeDriver: true,
    }),
    Animated.timing(anim, { toValue: 8, duration: 50, useNativeDriver: true }),
    Animated.timing(anim, { toValue: -8, duration: 50, useNativeDriver: true }),
    Animated.timing(anim, { toValue: 0, duration: 50, useNativeDriver: true }),
  ]).start();
}
