import { Colors } from "@/constants/colors";
import React from "react";
import { View } from "react-native";

export function RoomCardSkeleton() {
  return (
    <View 
      className="bg-white rounded-[24px] p-4 mb-4 border border-slate-100 shadow-sm"
      style={{ height: 160 }}
    >
      <View className="flex-row items-center justify-between mb-4">
        <View className="h-6 w-32 bg-slate-100 rounded-lg" />
        <View className="h-6 w-20 bg-slate-50 rounded-full" />
      </View>
      
      <View className="h-4 w-48 bg-slate-50 rounded-md mb-2" />
      <View className="h-4 w-32 bg-slate-50 rounded-md mb-6" />
      
      <View className="flex-row gap-3">
        <View className="h-10 flex-1 bg-slate-100 rounded-xl" />
        <View className="h-10 flex-1 bg-slate-100 rounded-xl" />
      </View>
    </View>
  );
}
