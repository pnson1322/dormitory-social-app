import React, { useEffect, useRef } from "react";
import { View, Animated } from "react-native";

export function ActiveRoomSkeleton() {
  const pulseAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.7,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  const pulseStyle = {
    opacity: pulseAnim,
    backgroundColor: "#E2E8F0",
  };

  return (
    <View 
      className="rounded-[32px] overflow-hidden bg-white mb-6"
      style={{ 
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.05,
        shadowRadius: 20,
        elevation: 4
      }}
    >
      <View className="px-6 py-5 border-b border-slate-50">
        <View className="flex-row justify-between items-start">
          <View className="flex-1 mr-4">
            <View className="w-20 h-5 rounded-full overflow-hidden mb-2">
              <Animated.View style={[{ flex: 1 }, pulseStyle]} />
            </View>
            <View className="w-32 h-8 rounded-lg overflow-hidden mb-2">
              <Animated.View style={[{ flex: 1 }, pulseStyle]} />
            </View>
            <View className="w-24 h-4 rounded-md overflow-hidden">
              <Animated.View style={[{ flex: 1 }, pulseStyle]} />
            </View>
          </View>
          <View className="h-12 w-12 rounded-2xl overflow-hidden">
            <Animated.View style={[{ flex: 1 }, pulseStyle]} />
          </View>
        </View>
      </View>

      <View className="p-6">
        <View className="flex-row items-center mb-6">
          <View className="h-12 w-12 rounded-2xl overflow-hidden mr-4">
            <Animated.View style={[{ flex: 1 }, pulseStyle]} />
          </View>
          <View className="flex-1">
            <View className="w-16 h-3 rounded-md overflow-hidden mb-2">
              <Animated.View style={[{ flex: 1 }, pulseStyle]} />
            </View>
            <View className="w-40 h-5 rounded-lg overflow-hidden">
              <Animated.View style={[{ flex: 1 }, pulseStyle]} />
            </View>
          </View>
        </View>

        <View className="mb-6">
          <View className="flex-row justify-between items-end mb-2">
            <View className="w-16 h-5 rounded-md overflow-hidden">
              <Animated.View style={[{ flex: 1 }, pulseStyle]} />
            </View>
            <View className="w-20 h-5 rounded-md overflow-hidden">
              <Animated.View style={[{ flex: 1 }, pulseStyle]} />
            </View>
          </View>
          <View className="h-3 w-full rounded-full overflow-hidden">
            <Animated.View style={[{ flex: 1 }, pulseStyle]} />
          </View>
        </View>

        <View className="h-[1px] bg-slate-100 mb-6" />

        <View className="w-32 h-5 rounded-md overflow-hidden mb-4">
          <Animated.View style={[{ flex: 1 }, pulseStyle]} />
        </View>
        
        <View className="gap-4">
          {[1, 2, 3].map((key) => (
            <View key={key} className="flex-row items-center">
              <View className="h-10 w-10 rounded-full overflow-hidden">
                <Animated.View style={[{ flex: 1 }, pulseStyle]} />
              </View>
              <View className="ml-3 flex-1">
                <View className="w-24 h-4 rounded-md overflow-hidden mb-1.5">
                  <Animated.View style={[{ flex: 1 }, pulseStyle]} />
                </View>
                <View className="w-16 h-3 rounded-md overflow-hidden">
                  <Animated.View style={[{ flex: 1 }, pulseStyle]} />
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
