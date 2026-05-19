import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { Colors } from "@/constants/colors";

const filterTabs = [
  { label: "Tất cả", value: undefined },
  { label: "Chờ xử lý", value: "Pending" },
  { label: "Đang xử lý", value: "InProgress" },
  { label: "Đã hoàn thành", value: "Resolved" },
  { label: "Từ chối", value: "Rejected" },
];

interface Props {
  currentStatus: string | undefined;
  onStatusChange: (status: string | undefined) => void;
}

export function IncidentFilterTabs({ currentStatus, onStatusChange }: Props) {
  return (
    <View className="py-3 bg-white border-b border-slate-100">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
      >
        {filterTabs.map((tab) => {
          const isSelected = currentStatus === tab.value;
          return (
            <Pressable
              key={tab.label}
              onPress={() => onStatusChange(tab.value)}
              className="h-[36px] items-center justify-center rounded-full px-5"
              style={{
                backgroundColor: isSelected ? Colors.primary : Colors.surface,
                borderWidth: 1,
                borderColor: isSelected ? Colors.primary : Colors.border,
              }}
            >
              <Text
                className="text-[14px] font-bold"
                style={{ color: isSelected ? "#FFFFFF" : Colors.textSecondary }}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
