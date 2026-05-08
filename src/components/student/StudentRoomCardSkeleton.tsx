import { Colors } from "@/constants/colors";
import { memo } from "react";
import { View } from "react-native";

export const StudentRoomCardSkeleton = memo(function StudentRoomCardSkeleton() {
  return (
    <View
      className="rounded-[24px] px-5 py-5"
      style={{
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.border,
      }}
    >
      <View className="flex-row items-start justify-between">
        <View className="flex-1 pr-3">
          <View className="h-6 w-32 rounded-md bg-slate-200 animate-pulse" />
          <View className="mt-2 h-4 w-40 rounded-md bg-slate-200 animate-pulse" />
        </View>

        <View className="h-8 w-24 rounded-xl bg-slate-200 animate-pulse" />
      </View>

      <View className="mt-4 flex-row items-center justify-between">
        <View className="h-6 w-28 rounded-md bg-slate-200 animate-pulse" />
        <View className="h-5 w-20 rounded-md bg-slate-200 animate-pulse" />
      </View>

      <View
        className="my-4 h-[1px]"
        style={{ backgroundColor: Colors.border }}
      />

      <View className="flex-row items-center justify-between mb-2">
        <View className="h-4 w-28 rounded-md bg-slate-200 animate-pulse" />
        <View className="h-4 w-12 rounded-md bg-slate-200 animate-pulse" />
      </View>

      <View className="h-2 w-full rounded-full bg-slate-200 animate-pulse" />
    </View>
  );
});
