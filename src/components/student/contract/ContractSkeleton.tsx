import { Colors } from "@/constants/colors";
import React from "react";
import { View } from "react-native";

export function ContractSkeleton() {
  return (
    <View className="flex-1 bg-white p-5">
      <View className="h-12 w-3/4 bg-slate-100 rounded-xl mb-8" />

      <View 
        className="bg-white rounded-[24px] p-6 mb-6 opacity-50"
        style={{ borderWidth: 1, borderColor: Colors.border }}
      >
        <View className="items-center mb-6 border-b border-slate-100 pb-6 gap-4">
          <View className="h-16 w-16 rounded-full bg-slate-100" />
          <View className="h-6 w-1/2 bg-slate-100 rounded-md" />
          <View className="h-4 w-1/4 bg-slate-50 rounded-full" />
        </View>

        <View className="gap-6">
          <View className="gap-2">
            <View className="h-3 w-20 bg-slate-50 rounded-md" />
            <View className="h-5 w-32 bg-slate-100 rounded-md" />
          </View>
          <View className="flex-row gap-4">
            <View className="flex-1 gap-2">
              <View className="h-3 w-20 bg-slate-50 rounded-md" />
              <View className="h-5 w-full bg-slate-100 rounded-md" />
            </View>
            <View className="flex-1 gap-2">
              <View className="h-3 w-20 bg-slate-50 rounded-md" />
              <View className="h-5 w-full bg-slate-100 rounded-md" />
            </View>
          </View>
        </View>
      </View>

      <View 
        className="bg-white rounded-[24px] p-6 opacity-50"
        style={{ borderWidth: 1, borderColor: Colors.border }}
      >
        <View className="h-5 w-40 bg-slate-100 rounded-md mb-6" />
        <View className="gap-4">
          <View className="flex-row justify-between">
            <View className="h-4 w-32 bg-slate-50 rounded-md" />
            <View className="h-4 w-24 bg-slate-100 rounded-md" />
          </View>
          <View className="flex-row justify-between">
            <View className="h-4 w-32 bg-slate-50 rounded-md" />
            <View className="h-4 w-24 bg-slate-100 rounded-md" />
          </View>
        </View>
      </View>
    </View>
  );
}
