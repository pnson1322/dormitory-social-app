import { IncidentResponse } from "@/services/incident/incident.types";
import { formatDateTime } from "@/utils/date";
import { getCategoryStyle } from "@/utils/incident";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Dimensions, Modal, Pressable, ScrollView, Text, View } from "react-native";
import { ImagePreviewModal } from "./ImagePreviewModal";
import { IncidentImageGallery } from "./IncidentImageGallery";

interface Props {
  visible: boolean;
  incident: IncidentResponse | null;
  onClose: () => void;
}

export function IncidentDetailModal({ visible, incident, onClose }: Props) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  if (!incident) return null;

  const style = getCategoryStyle(incident.categoryName);
  const categoryName = incident.categoryName || "Khác";

  const getStatusDetails = () => {
    switch (incident.status) {
      case "InProgress":
      case "IN_PROGRESS":
      case "Processing":
        return { label: "Đang xử lý", color: "#3B82F6" };
      case "Resolved":
      case "DONE":
        return { label: "Đã hoàn thành", color: "#10B981" };
      case "Rejected":
        return { label: "Từ chối", color: "#EF4444" };
      default:
        return { label: "Chờ xử lý", color: "#F59E0B" };
    }
  };

  const status = getStatusDetails();

  return (
    <>
      <Modal
        animationType="slide"
        transparent
        visible={visible}
        onRequestClose={onClose}
      >
        <View className="flex-1 bg-black/60 justify-end">
          <Pressable className="flex-1" onPress={onClose} />

          <View 
            className="bg-white rounded-t-[32px] px-6 pb-8" 
            style={{
              maxHeight: Dimensions.get("window").height * 0.85,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: 0.1,
              shadowRadius: 16,
              elevation: 20,
            }}
          >
            <View className="w-12 h-1.5 bg-slate-200 rounded-full self-center my-4" />

            <View className="flex-row justify-between items-center mb-6">
              <View className="flex-row items-center">
                <View 
                  className="w-12 h-12 rounded-full items-center justify-center mr-3"
                  style={{ backgroundColor: `${style.color}15` }}
                >
                  <Ionicons name={style.icon} size={24} color={style.color} />
                </View>
                <View>
                  <Text className="text-xl font-extrabold text-slate-900">{categoryName}</Text>
                  <Text className="text-xs text-slate-400 font-medium mt-0.5">
                    Mã sự cố: #{incident.id.substring(0, 8).toUpperCase()}
                  </Text>
                </View>
              </View>
              <Pressable 
                onPress={onClose} 
                className="w-10 h-10 rounded-full bg-slate-50 items-center justify-center active:opacity-75"
              >
                <Ionicons name="close" size={20} color="#64748B" />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
              <View className="flex-row gap-3 mb-6">
                <View className="flex-1 bg-slate-50 rounded-2xl p-4 border border-slate-100">
                  <Text className="text-xs font-semibold text-slate-400 mb-1">TRẠNG THÁI</Text>
                  <View className="flex-row items-center mt-1">
                    <View className="w-2.5 h-2.5 rounded-full mr-2" style={{ backgroundColor: status.color }} />
                    <Text className="text-base font-bold text-slate-800">{status.label}</Text>
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
                  <Text className="text-sm font-bold text-slate-800">Tôi (Sinh viên)</Text>
                </View>
                
                <View className="h-[1px] bg-slate-100" />

                <View className="flex-row justify-between items-center">
                  <View className="flex-row items-center">
                    <Ionicons name="home-outline" size={18} color="#64748B" className="mr-2" />
                    <Text className="text-sm font-semibold text-slate-500">Phòng xảy ra</Text>
                  </View>
                  <Text className="text-sm font-bold text-slate-800">Phòng của tôi</Text>
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
                <IncidentImageGallery imageUrls={incident.imageUrls} onPreviewImage={setPreviewImage} />
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <ImagePreviewModal 
        visible={previewImage !== null} 
        imageUrl={previewImage} 
        onClose={() => setPreviewImage(null)} 
      />
    </>
  );
}
