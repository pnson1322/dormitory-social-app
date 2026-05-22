import { Colors } from "@/constants/colors";
import { useReportPost } from "@/hooks/community/useReportPost";
import { ReportReason } from "@/services/community/community.types";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

interface ReportPostModalProps {
  visible: boolean;
  postId: string;
  onClose: () => void;
}

const REASONS: { label: string; value: ReportReason; description: string }[] = [
  {
    label: "Spam",
    value: "Spam",
    description: "Tin rác, quảng cáo trái phép hoặc lặp đi lặp lại",
  },
  {
    label: "Nội dung không phù hợp",
    value: "Inappropriate",
    description: "Ngôn từ thô tục, hình ảnh hoặc chủ đề không lành mạnh",
  },
  {
    label: "Quấy rối / Công kích",
    value: "Harassment",
    description: "Đe dọa, xúc phạm hoặc bêu rếu cá nhân",
  },
  {
    label: "Tin giả / Sai sự thật",
    value: "FakeNews",
    description: "Thông tin thất thiệt gây hoang mang dư luận",
  },
  {
    label: "Lý do khác",
    value: "Other",
    description: "Các vi phạm tiêu chuẩn cộng đồng khác",
  },
];

export function ReportPostModal({ visible, postId, onClose }: ReportPostModalProps) {
  const {
    selectedReason,
    setSelectedReason,
    note,
    setNote,
    isSubmitting,
    scale,
    opacity,
    handleSubmit,
  } = useReportPost({ visible, postId, onClose });

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 justify-center items-center bg-black/40 px-5"
      >
        <Pressable className="absolute inset-0" onPress={onClose} />

        <Animated.View
          style={{
            opacity,
            transform: [{ scale }],
            maxHeight: "85%",
          }}
          className="w-full max-w-[390px] rounded-3xl bg-white shadow-2xl overflow-hidden"
        >
          <View className="flex-row items-center justify-between px-5 py-4 border-b border-slate-100">
            <Text className="text-[17px] font-bold text-slate-900">Báo cáo bài viết</Text>
            <Pressable
              onPress={onClose}
              className="h-7 w-7 items-center justify-center rounded-full bg-slate-100 active:bg-slate-200"
            >
              <Ionicons name="close" size={16} color={Colors.textSecondary} />
            </Pressable>
          </View>

          <ScrollView
            className="p-5"
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Text className="text-[14px] font-bold text-slate-800 mb-3">
              Lý do báo cáo bài viết này là gì? <Text className="text-red-500">*</Text>
            </Text>

            <View className="gap-2.5 mb-5">
              {REASONS.map((item) => {
                const isSelected = selectedReason === item.value;
                return (
                  <Pressable
                    key={item.value}
                    onPress={() => setSelectedReason(item.value)}
                    style={{
                      borderWidth: 1,
                      borderColor: isSelected ? Colors.primaryLight : Colors.border,
                      backgroundColor: isSelected ? "#F3F7FF" : Colors.surface,
                    }}
                    className="flex-row items-center rounded-xl p-3"
                  >
                    <View className="flex-1 pr-3">
                      <Text
                        className="text-[14px] font-bold"
                        style={{ color: isSelected ? Colors.primary : Colors.textPrimary }}
                      >
                        {item.label}
                      </Text>
                      <Text className="text-[11px] text-slate-400 mt-0.5">
                        {item.description}
                      </Text>
                    </View>
                    <Ionicons
                      name={isSelected ? "radio-button-on" : "radio-button-off-outline"}
                      size={18}
                      color={isSelected ? Colors.primary : Colors.textSecondary}
                    />
                  </Pressable>
                );
              })}
            </View>

            <View className="mb-5">
              <View className="flex-row justify-between mb-2">
                <Text className="text-[14px] font-bold text-slate-800">
                  Ghi chú thêm <Text className="text-slate-400 font-medium">(Tùy chọn)</Text>
                </Text>
                <Text className="text-[11px] text-slate-400 font-medium mt-0.5">
                  {note.length}/500 ký tự
                </Text>
              </View>

              <TextInput
                multiline
                numberOfLines={4}
                value={note}
                onChangeText={setNote}
                placeholder="Mô tả chi tiết hơn về vi phạm..."
                placeholderTextColor={Colors.textSecondary}
                maxLength={500}
                style={{
                  minHeight: 80,
                  textAlignVertical: "top",
                  borderColor: Colors.border,
                  borderWidth: 1,
                  fontSize: 13,
                  color: Colors.textPrimary,
                }}
                className="bg-slate-50 rounded-xl px-3 py-2.5"
              />
            </View>
          </ScrollView>

          <View className="flex-row gap-3 px-5 py-4 border-t border-slate-100 bg-slate-50">
            <Pressable
              onPress={onClose}
              className="flex-1 h-11 rounded-xl items-center justify-center bg-white border border-slate-200 active:bg-slate-100"
            >
              <Text className="text-slate-700 font-bold text-[14px]">Hủy</Text>
            </Pressable>

            <Pressable
              onPress={handleSubmit}
              disabled={isSubmitting || !selectedReason}
              style={{
                backgroundColor: !selectedReason ? Colors.border : Colors.primary,
              }}
              className="flex-1 h-11 rounded-xl items-center justify-center active:opacity-90"
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text className="text-white font-bold text-[14px]">Gửi báo cáo</Text>
              )}
            </Pressable>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
