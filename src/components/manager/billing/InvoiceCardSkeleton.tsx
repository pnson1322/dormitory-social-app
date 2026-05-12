import React from "react";
import { View } from "react-native";

export function InvoiceCardSkeleton() {
  return (
    <View className="bg-white mx-5 p-4 rounded-[30px] mb-4 border border-slate-100 flex-row items-center justify-between shadow-sm">
      <View className="flex-row items-center flex-1">
        <View className="h-14 w-14 rounded-2xl bg-slate-50 mr-4" />
        <View className="flex-1">
          <View className="h-5 w-24 bg-slate-100 rounded-md mb-2" />
          <View className="h-3 w-32 bg-slate-50 rounded-md" />
        </View>
      </View>
      <View className="items-end">
        <View className="h-5 w-20 bg-slate-100 rounded-md mb-2" />
        <View className="h-5 w-16 bg-slate-50 rounded-full" />
      </View>
    </View>
  );
}
