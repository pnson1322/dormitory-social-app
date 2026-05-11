import React from "react";
import { View } from "react-native";
import { Colors } from "@/constants/colors";

export function InvoiceItemSkeleton() {
  return (
    <View
      className="bg-white p-5 rounded-[24px] mb-4 opacity-50"
      style={{
        borderWidth: 1,
        borderColor: Colors.border,
      }}
    >
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-row items-center flex-1">
          <View className="h-10 w-10 rounded-full bg-slate-100 mr-3" />
          <View className="flex-1 gap-2">
            <View className="h-4 w-3/4 bg-slate-100 rounded-md" />
            <View className="h-3 w-1/2 bg-slate-50 rounded-md" />
          </View>
        </View>
        <View className="h-6 w-24 bg-slate-100 rounded-full" />
      </View>

      <View className="h-[1px] bg-slate-100 w-full my-3" />

      <View className="flex-row justify-between items-end">
        <View className="gap-2">
          <View className="h-3 w-20 bg-slate-50 rounded-md" />
          <View className="h-4 w-24 bg-slate-100 rounded-md" />
        </View>
        <View className="items-end gap-2">
          <View className="h-3 w-16 bg-slate-50 rounded-md" />
          <View className="h-6 w-28 bg-slate-100 rounded-md" />
        </View>
      </View>
    </View>
  );
}
