import { Colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import NetInfo from "@react-native-community/netinfo";
import React, { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function NetworkBanner() {
  const insets = useSafeAreaInsets();
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [showStatus, setShowStatus] = useState<"offline" | "restored" | null>(null);
  
  const animatedValue = useRef(new Animated.Value(-100)).current;
  const prevConnectedRef = useRef<boolean | null>(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const currentStatus = state.isConnected ?? false;
      setIsConnected(currentStatus);

      if (prevConnectedRef.current === null) {
        prevConnectedRef.current = currentStatus;
        if (!currentStatus) {
          setShowStatus("offline");
          animateBanner(1);
        }
        return;
      }

      if (!currentStatus && prevConnectedRef.current) {
        setShowStatus("offline");
        animateBanner(1);
      } else if (currentStatus && !prevConnectedRef.current) {
        setShowStatus("restored");
        animateBanner(1);

        setTimeout(() => {
          animateBanner(0, () => {
            setShowStatus(null);
          });
        }, 2500);
      }

      prevConnectedRef.current = currentStatus;
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const animateBanner = (toValue: number, callback?: () => void) => {
    const targetValue = toValue === 1 ? (insets.top > 0 ? insets.top + 10 : 20) : -100;
    Animated.spring(animatedValue, {
      toValue: targetValue,
      useNativeDriver: true,
      tension: 50,
      friction: 8,
    }).start(() => {
      if (callback) callback();
    });
  };

  if (!showStatus) return null;

  const isOffline = showStatus === "offline";

  return (
    <Animated.View
      style={[
        styles.banner,
        {
          transform: [{ translateY: animatedValue }],
          backgroundColor: isOffline ? "#EF4444" : "#10B981",
        },
      ]}
    >
      <View className="flex-row items-center justify-center px-4 py-2.5 rounded-full shadow-lg shadow-black/10">
        <Ionicons
          name={isOffline ? "wifi-outline" : "checkmark-circle-outline"}
          size={16}
          color="white"
          style={{ marginRight: 8 }}
        />
        <Text className="text-white text-[13px] font-bold text-center">
          {isOffline ? "Không có kết nối Internet" : "Đã khôi phục kết nối"}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: "absolute",
    left: 20,
    right: 20,
    borderRadius: 24,
    zIndex: 9999,
    alignSelf: "center",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
});
