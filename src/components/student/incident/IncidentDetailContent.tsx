import { IncidentResponse } from "@/services/incident/incident.types";
import { formatDateTime } from "@/utils/date";
import { getRoomLabel } from "@/utils/incident";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View, ScrollView } from "react-native";
import { IncidentImageGallery } from "./IncidentImageGallery";

interface Props {
  incident: IncidentResponse;
  isAdminOrManager?: boolean;
  onPreviewImage: (url: string) => void;
  statusLabel: string;
  statusColor: string;
}

export function IncidentDetailContent({
  incident,
  isAdminOrManager,
  onPreviewImage,
  statusLabel,
  statusColor,
}: Props) {
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
      <View className="flex-row gap-3 mb-6">
        <View className="flex-1 bg-slate-50 rounded-2xl p-4 border border-slate-100">
          <Text className="text-xs font-semibold text-slate-400 mb-1">TRẠNG THÁI</Text>
          <View className="flex-row items-center mt-1">
            <View className="w-2.5 h-2.5 rounded-full mr-2" style={{ backgroundColor: statusColor }} />
            <Text className="text-base font-bold text-slate-800">{statusLabel}</Text>
          </View>
        </View>

        <View className="flex-1 bg-slate-50 rounded-2xl p-4 border border-slate-100">
          <Text className="text-xs font-semibold text-slate-400 mb-1">THỜI GIAN GỬI</Text>
          <Text className="text-[15px] font-bold text-slate-800 mt-1" numberOfLines={1}>
            {formatDateTime(incident.createdAt)}
          </Text>
        </View>
      </View>

      <View className="bg-slate-50 rounded-2xl p-5 mb-6 border border-slate-100 gap-4">
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <Ionicons name="person-outline" size={18} color="#64748B" className="mr-2" />
            <Text className="text-sm font-semibold text-slate-500">Người báo cáo</Text>
          </View>
          <Text className="text-sm font-bold text-slate-800">
            {isAdminOrManager
              ? (incident.reporterId ? `Sinh viên (${incident.reporterId.substring(0, 5).toUpperCase()})` : "Sinh viên")
              : "Tôi (Sinh viên)"}
          </Text>
        </View>
        
        <View className="h-[1px] bg-slate-100" />

        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <Ionicons name="home-outline" size={18} color="#64748B" className="mr-2" />
            <Text className="text-sm font-semibold text-slate-500">Phòng xảy ra</Text>
          </View>
          <Text className="text-sm font-bold text-slate-800">
            {isAdminOrManager ? getRoomLabel(incident.roomId) : "Phòng của tôi"}
          </Text>
        </View>
      </View>

      <View className="mb-6">
        <Text className="text-sm font-bold text-slate-400 mb-2 uppercase tracking-wide">Chi tiết sự cố</Text>
        <View className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
          <Text className="text-slate-700 text-[15px] leading-relaxed">{incident.description}</Text>
        </View>
      </View>

      <View className="mb-2">
        <Text className="text-sm font-bold text-slate-400 mb-3 uppercase tracking-wide">
          Hình ảnh đính kèm ({incident.imageUrls?.length || 0})
        </Text>
        <IncidentImageGallery imageUrls={incident.imageUrls} onPreviewImage={onPreviewImage} />
      </View>
    </ScrollView>
  );
}
