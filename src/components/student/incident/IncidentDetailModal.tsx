import { IncidentResponse } from "@/services/incident/incident.types";
import { getCategoryStyle } from "@/utils/incident";
import { useModalAnimation } from "@/hooks/useModalAnimation";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Animated, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { ImagePreviewModal } from "./ImagePreviewModal";
import { IncidentDetailContent } from "./IncidentDetailContent";

interface Props {
  visible: boolean;
  incident: IncidentResponse | null;
  onClose: () => void;
  isAdminOrManager?: boolean;
}

export function IncidentDetailModal({ visible, incident, onClose, isAdminOrManager }: Props) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const { shouldRender, fadeAnim, slideAnim, SCREEN_HEIGHT } = useModalAnimation(visible);

  if (!shouldRender || !incident) return null;

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
        transparent
        visible={shouldRender}
        onRequestClose={onClose}
        animationType="none"
      >
        <View style={styles.container}>
          <Animated.View
            style={[
              StyleSheet.absoluteFillObject,
              {
                backgroundColor: "rgba(0, 0, 0, 0.55)",
                opacity: fadeAnim,
              },
            ]}
          >
            <Pressable style={styles.backdropPressable} onPress={onClose} />
          </Animated.View>

          <Animated.View 
            className="bg-white rounded-t-[32px] px-6 pb-8" 
            style={{
              maxHeight: SCREEN_HEIGHT * 0.85,
              transform: [{ translateY: slideAnim }],
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

            <IncidentDetailContent
              incident={incident}
              isAdminOrManager={isAdminOrManager}
              onPreviewImage={setPreviewImage}
              statusLabel={status.label}
              statusColor={status.color}
            />
          </Animated.View>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdropPressable: {
    flex: 1,
  },
});
