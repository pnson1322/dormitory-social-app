import { LinearGradient } from "expo-linear-gradient";
import { ReactNode, useMemo } from "react";
import { Text, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  children: ReactNode;
};

export function ScreenGradient({ children }: Props) {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();

  const isTablet = width >= 768;
  const isLandscape = width > height;

  const headerHeight = useMemo(() => {
    if (isTablet) return 320;
    return 260;
  }, [isTablet]);

  const headerTop = useMemo(() => {
    const base = isTablet ? 20 : 100;
    return insets.top + base;
  }, [insets.top, isTablet]);

  const overlap = useMemo(() => {
    if (isLandscape && width >= 900) return 72;
    return isTablet ? 90 : 86;
  }, [isLandscape, isTablet, width]);

  const cardMaxWidth = useMemo(() => {
    if (!isTablet) return undefined;
    return width >= 1024 ? 560 : 520;
  }, [isTablet, width]);

  return (
    <View className="flex-1 bg-slate-100">
      <LinearGradient
        colors={["#1E3A8A", "#2563EB"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          height: headerHeight,
          borderBottomLeftRadius: 44,
          borderBottomRightRadius: 44,
        }}
      >
        <View
          className="flex-row items-center px-6"
          style={{ paddingTop: headerTop }}
        >
          <View className="h-3 w-3 rounded-full bg-emerald-400" />
          <Text className="ml-3 text-white text-[20px] font-extrabold">
            Dormitory Social
          </Text>
        </View>
      </LinearGradient>

      <View
        className="flex-1 px-5"
        style={{
          marginTop: -overlap,
        }}
      >
        <View className="w-full self-center" style={{ maxWidth: cardMaxWidth }}>
          {children}
        </View>
      </View>
    </View>
  );
}
