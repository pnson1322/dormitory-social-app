import { Colors } from "@/constants/colors";
import { IncidentResponse } from "@/services/incident/incident.types";
import { formatDateTime } from "@/utils/date";
import { getCategoryStyle, getRoomLabel } from "@/utils/incident";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

interface Props {
  item: IncidentResponse;
  pressed?: boolean;
}

export function ManagerIncidentItem({ item, pressed }: Props) {
  const style = getCategoryStyle(item.categoryName);
  const categoryName = item.categoryName || "Khác";

  let statusText = "Mới";
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
      className="p-5 rounded-[24px] flex-row items-center justify-between"
      style={{
        backgroundColor: pressed ? "#F1F5F9" : "#FFFFFF",
        borderWidth: 1,
        borderColor: Colors.border,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.02,
        shadowRadius: 10,
        elevation: 2,
      }}
    >
      <View className="flex-1 mr-2">
        <View className="flex-row justify-between items-center mb-3">
          <View className="flex-row items-center">
            <View
              className="w-10 h-10 rounded-full items-center justify-center mr-2.5"
              style={{ backgroundColor: `${style.color}15` }}
            >
              <Ionicons name={style.icon} size={20} color={style.color} />
            </View>
            <View>
              <Text className="text-[17px] font-extrabold text-slate-900">{categoryName}</Text>
              <Text className="text-[12px] text-slate-400 font-semibold mt-0.5">
                {formatDateTime(item.createdAt)}
              </Text>
            </View>
          </View>
          
          <View className="bg-slate-100 px-3 py-1 rounded-full">
            <Text className="text-[12px] font-extrabold text-slate-600">
              {getRoomLabel(item.roomId)}
            </Text>
          </View>
        </View>

        <Text className="text-slate-600 text-[14.5px] leading-relaxed mb-3" numberOfLines={2}>
          {item.description}
        </Text>

        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View
              className="px-2.5 py-0.5 rounded-full"
              style={{ backgroundColor: `${statusColor}15` }}
            >
              <Text className="text-[11.5px] font-bold" style={{ color: statusColor }}>
                {statusText}
              </Text>
            </View>

            {item.imageUrls && item.imageUrls.length > 0 && (
              <View className="flex-row items-center ml-2 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
                <Ionicons name="images-outline" size={11} color="#64748B" />
                <Text className="text-[11.5px] font-bold text-slate-500 ml-1">
                  {item.imageUrls.length}
                </Text>
              </View>
            )}
          </View>

          {item.status !== "Resolved" && item.status !== "Rejected" && (
            <View className="flex-row items-center">
              <Text className="text-[11px] font-bold text-slate-350 mr-1.5 uppercase tracking-wider">Vuốt xử lý</Text>
              <Ionicons name="swap-horizontal" size={12} color="#CBD5E1" />
            </View>
          )}
        </View>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
    </View>
  );
}
