import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Animated, StyleSheet, Text } from "react-native";

interface Props {
  color: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  scale: Animated.AnimatedInterpolation<number>;
  opacity: Animated.AnimatedInterpolation<number>;
  align: "left" | "right";
}

export function SwipeActionView({
  color,
  label,
  icon,
  scale,
  opacity,
  align,
}: Props) {
  const isLeft = align === "left";
  return (
    <Animated.View
      className={`justify-center px-6 ${isLeft ? "" : "items-end"}`}
      style={[
        StyleSheet.absoluteFillObject,
        {
          backgroundColor: color,
          opacity,
        }
      ]}
    >
      <Animated.View
        className="flex-row items-center"
        style={{ transform: [{ scale }] }}
      >
        {isLeft && <Ionicons name={icon} size={24} color="#FFFFFF" />}
        <Text className={`text-white font-extrabold text-sm ${isLeft ? "ml-2" : "mr-2"}`}>
          {label}
        </Text>
        {!isLeft && <Ionicons name={icon} size={24} color="#FFFFFF" />}
      </Animated.View>
    </Animated.View>
  );
}
