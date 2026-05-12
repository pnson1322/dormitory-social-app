import { RoomSummaryTabs } from "@/components/room/RoomSummaryTabs";
import { Colors } from "@/constants/colors";
import { RoomCountData, RoomStatus } from "@/services/room/room.types";
import React from "react";
import { ActivityIndicator, Text, View } from "react-native";

type Props = {
  counts: RoomCountData;
  status: RoomStatus | "";
  onStatusChange: (status: RoomStatus | "") => void;
  resultText: string;
  filtering: boolean;
};

export function RoomListFilters({ counts, status, onStatusChange, resultText, filtering }: Props) {
  return (
    <View className="px-5 pt-5 mb-3">
      <RoomSummaryTabs
        summary={{
          all: counts.Total,
          available: counts.AVAILABLE,
          full: counts.FULL,
          maintenance: counts.MAINTENANCE,
        }}
        selected={status}
        onChange={onStatusChange}
      />

      <View className="mt-5 flex-row items-center">
        <Text
          className="flex-1 text-[16px] font-semibold"
          style={{ color: Colors.textSecondary }}
        >
          {resultText}
        </Text>

        {filtering ? (
          <ActivityIndicator size="small" color={Colors.primary} />
        ) : null}
      </View>
    </View>
  );
}
