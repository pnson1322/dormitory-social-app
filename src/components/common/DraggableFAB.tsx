import { Colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useRef } from "react";
import {
  Animated,
  Dimensions,
  PanResponder,
  TouchableOpacity
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const BUTTON_SIZE = 64;

type Props = {
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  iconSize?: number;
};

export function DraggableFAB({ onPress, icon = "add", iconSize = 32 }: Props) {
  const insets = useSafeAreaInsets();
  
  const pan = useRef(new Animated.ValueXY({ 
    x: SCREEN_WIDTH - BUTTON_SIZE - 20, 
    y: SCREEN_HEIGHT - BUTTON_SIZE - 100 - insets.bottom 
  })).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({
          x: (pan.x as any)._value,
          y: (pan.y as any)._value,
        });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (e, gestureState) => {
        pan.flattenOffset();
        
        const finalX = (pan.x as any)._value;
        const finalY = (pan.y as any)._value;
        
        let snapX = 20; 
        if (finalX + BUTTON_SIZE / 2 > SCREEN_WIDTH / 2) {
          snapX = SCREEN_WIDTH - BUTTON_SIZE - 20; 
        }

        const minY = insets.top + 20;
        const maxY = SCREEN_HEIGHT - BUTTON_SIZE - insets.bottom - 80;
        const snapY = Math.min(Math.max(finalY, minY), maxY);

        Animated.spring(pan, {
          toValue: { x: snapX, y: snapY },
          useNativeDriver: false,
          friction: 7,
          tension: 40,
        }).start();
      },
    })
  ).current;

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        pan.getLayout(),
        {
          position: "absolute",
          zIndex: 999,
        },
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        className="h-16 w-16 items-center justify-center rounded-full shadow-2xl shadow-blue-500/60"
        style={{ backgroundColor: Colors.primary }}
      >
        <Ionicons name={icon} size={iconSize} color="#FFFFFF" />
      </TouchableOpacity>
    </Animated.View>
  );
}
