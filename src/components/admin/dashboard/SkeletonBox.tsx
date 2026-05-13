import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

type Props = {
  w: number | string;
  h: number;
  radius?: number;
};

export function SkeletonBox({ w, h, radius = 12 }: Props) {
  const pulse = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 0.8, duration: 750, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.35, duration: 750, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);

  return (
    <Animated.View
      style={{
        width: w as any,
        height: h,
        borderRadius: radius,
        backgroundColor: '#E2E8F0',
        opacity: pulse,
      }}
    />
  );
}
