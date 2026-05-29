import React from "react";
import { View } from "react-native";

import { Skeleton } from "@/components/common/Skeleton";

export function PostCardSkeleton() {
  return (
    <View
      className="bg-white p-4 rounded-2xl mb-4 border border-slate-100"
      style={{
        shadowColor: "#000",
        shadowOpacity: 0.04,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
      }}
    >
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-row items-center">
          <Skeleton width={40} height={40} borderRadius={20} />
          <View style={{ marginLeft: 12 }}>
            <Skeleton width={100} height={14} borderRadius={6} />
            <Skeleton
              width={64}
              height={11}
              borderRadius={5}
              style={{ marginTop: 6 }}
            />
          </View>
        </View>
        <Skeleton width={80} height={24} borderRadius={12} />
      </View>

      <Skeleton
        width="100%"
        height={14}
        borderRadius={6}
        style={{ marginBottom: 8 }}
      />
      <Skeleton
        width="85%"
        height={14}
        borderRadius={6}
        style={{ marginBottom: 8 }}
      />
      <Skeleton
        width="65%"
        height={14}
        borderRadius={6}
        style={{ marginBottom: 14 }}
      />

      <Skeleton width="100%" height={160} borderRadius={16} />

      <View className="flex-row mt-3" style={{ gap: 24 }}>
        <Skeleton width={56} height={12} borderRadius={6} />
        <Skeleton width={56} height={12} borderRadius={6} />
        <Skeleton width={56} height={12} borderRadius={6} />
      </View>
    </View>
  );
}
