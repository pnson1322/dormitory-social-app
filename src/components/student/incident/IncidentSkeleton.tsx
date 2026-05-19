import React from "react";
import { View } from "react-native";

export function IncidentSkeleton() {
  return (
    <View className="bg-white p-4 rounded-2xl mb-4 border border-slate-100 shadow-sm animate-pulse">
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-row items-center">
          <View className="w-10 h-10 rounded-full bg-slate-100 mr-3" />
          <View>
            <View className="w-24 h-4 bg-slate-100 rounded mb-1" />
            <View className="w-16 h-3 bg-slate-100 rounded" />
          </View>
        </View>
        <View className="w-20 h-6 bg-slate-100 rounded-full" />
      </View>
      <View className="w-full h-4 bg-slate-100 rounded mb-1" />
      <View className="w-2/3 h-4 bg-slate-100 rounded" />
    </View>
  );
}
