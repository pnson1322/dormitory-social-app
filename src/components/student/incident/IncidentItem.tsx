import React from "react";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";
import { IncidentResponse } from "@/services/incident/incident.types";
import { formatDateTime } from "@/utils/date";
import { getCategoryStyle } from "@/utils/incident";

interface Props {
  item: IncidentResponse;
}

export function IncidentItem({ item }: Props) {
  const style = getCategoryStyle(item.categoryName);
  const categoryName = item.categoryName || "Khác";

  let statusText = "Chờ xử lý";
  let statusColor = "#F59E0B";
  if (
    item.status === "InProgress" ||
    item.status === "IN_PROGRESS" ||
    item.status === "Processing"
  ) {
    statusText = "Đang xử lý";
    statusColor = "#3B82F6";
  } else if (
    item.status === "Resolved" ||
    item.status === "DONE" ||
    item.status === "Resolved"
  ) {
    statusText = "Đã hoàn thành";
    statusColor = "#10B981";
  } else if (item.status === "Rejected") {
    statusText = "Từ chối";
    statusColor = "#EF4444";
  }

  return (
    <View
      className="bg-white p-5 rounded-[24px] mb-4 flex-row items-center justify-between"
      style={{
        borderWidth: 1,
        borderColor: Colors.border,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 12,
        elevation: 2,
      }}
    >
      <View className="flex-1 mr-3">
        <View className="flex-row items-center mb-3">
          <View
            className="w-10 h-10 rounded-full items-center justify-center mr-3"
            style={{ backgroundColor: `${style.color}15` }}
          >
            <Ionicons name={style.icon} size={20} color={style.color} />
          </View>
          <View>
            <Text className="text-[16px] font-extrabold text-slate-900">{categoryName}</Text>
            <Text className="text-[11px] text-slate-400 font-semibold mt-0.5">
              {formatDateTime(item.createdAt)}
            </Text>
          </View>
        </View>

        <Text className="text-slate-600 text-[13px] leading-relaxed" numberOfLines={2}>
          {item.description}
        </Text>

        <View className="flex-row mt-3.5 items-center">
          <View
            className="px-3 py-1 rounded-full"
            style={{ backgroundColor: `${statusColor}15` }}
          >
            <Text className="text-[11px] font-bold" style={{ color: statusColor }}>
              {statusText}
            </Text>
          </View>
          {item.imageUrls && item.imageUrls.length > 0 && (
            <View className="flex-row items-center ml-3 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">
              <Ionicons name="images-outline" size={12} color="#64748B" />
              <Text className="text-[11px] font-bold text-slate-500 ml-1">
                {item.imageUrls.length} ảnh
              </Text>
            </View>
          )}
        </View>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
    </View>
  );
}
