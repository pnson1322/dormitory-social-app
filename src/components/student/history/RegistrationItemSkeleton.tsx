import { Colors } from "@/constants/colors";
import React from "react";
import { View } from "react-native";

export function RegistrationItemSkeleton() {
  return (
    <View 
      className="bg-white p-5 rounded-[24px] mb-4 opacity-50"
      style={{
        borderWidth: 1,
        borderColor: Colors.border,
      }}
    >
      <View className="flex-row justify-between items-start mb-4">
        <View className="flex-row items-center flex-1">
          <View className="h-10 w-10 rounded-full bg-slate-100 mr-3" />
          <View className="flex-1">
            <View className="h-5 w-32 bg-slate-100 rounded-lg mb-2" />
            <View className="h-4 w-24 bg-slate-50 rounded-lg" />
          </View>
        </View>
        <View className="h-6 w-20 bg-slate-100 rounded-full" />
      </View>
      <View className="h-[1px] bg-slate-100 w-full mb-4" />
      <View className="flex-row justify-between">
        <View className="h-4 w-24 bg-slate-100 rounded-lg" />
        <View className="h-4 w-16 bg-slate-100 rounded-lg" />
      </View>
    </View>
  );
}
