import { LinearGradient } from "expo-linear-gradient";
import { ReactNode } from "react";
import { Text, View } from "react-native";

type Props = {
  children: ReactNode;
};

export function ScreenGradient({ children }: Props) {
  return (
    <View className="flex-1 bg-slate-100">
      <LinearGradient
        colors={["#1E3A8A", "#2563EB"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          height: 260,
          borderBottomLeftRadius: 40,
          borderBottomRightRadius: 40,
        }}
      >
        <View className="flex-row items-center px-6 pt-[96px]">
          <View className="h-3 w-3 rounded-full bg-emerald-400" />
          <Text className="ml-3 text-white text-[20px] font-extrabold">
            Dormitory Social
          </Text>
        </View>
      </LinearGradient>

      <View className="-mt-36 flex-1 px-5">{children}</View>
    </View>
  );
}
