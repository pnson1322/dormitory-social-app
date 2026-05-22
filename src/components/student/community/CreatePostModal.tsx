import { Colors } from "@/constants/colors";
import { useCreatePostForm } from "@/hooks/community/useCreatePostForm";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface CreatePostModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (content: string, postType: string, files: string[]) => Promise<any>;
}

export function CreatePostModal({ visible, onClose, onSubmit }: CreatePostModalProps) {
  const insets = useSafeAreaInsets();
  const {
    content,
    setContent,
    postType,
    setPostType,
    images,
    isSubmitting,
    handlePickImage,
    handleRemoveImage,
    handlePublish,
  } = useCreatePostForm({ onSubmit, onClose });

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={{ flex: 1, backgroundColor: "#F8FAFC" }}>
        <View
          className="px-4 pb-2 flex-row items-center justify-between"
          style={{
            paddingTop: insets.top > 0 ? insets.top + 6 : 10,
            backgroundColor: Colors.primary,
          }}
        >
          <View style={{ width: 85, alignItems: "flex-start" }}>
            <Pressable
              onPress={onClose}
              className="h-10 w-10 items-center justify-center rounded-full bg-white/15"
            >
              <Ionicons name="close" size={24} color="#FFFFFF" />
            </Pressable>
          </View>

          <Text
            className="text-[20px] font-bold text-white text-center flex-1"
            numberOfLines={1}
          >
            Tạo bài viết mới
          </Text>

          <View style={{ width: 85, alignItems: "flex-end" }}>
            <Pressable
              onPress={handlePublish}
              disabled={isSubmitting || !content.trim()}
              className="px-4 py-2 rounded-full bg-white disabled:bg-white/40"
              style={{ minWidth: 80, alignItems: "center" }}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color={Colors.primary} />
              ) : (
                <Text className="font-bold text-[14px]" style={{ color: Colors.primary }}>
                  Đăng bài
                </Text>
              )}
            </Pressable>
          </View>
        </View>

        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={{ padding: 20 }} keyboardShouldPersistTaps="handled">
            <Text className="text-slate-900 font-bold text-[16px] mb-3">Chọn chuyên mục</Text>
            <View className="flex-row gap-3 mb-6">
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setPostType("General")}
                className="flex-1 py-3 px-4 rounded-xl border flex-row items-center justify-center"
                style={{
                  backgroundColor: postType === "General" ? "#EFF6FF" : "#FFFFFF",
                  borderColor: postType === "General" ? "#3B82F6" : "#E2E8F0",
                }}
              >
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={16}
                  color={postType === "General" ? "#3B82F6" : "#64748B"}
                  style={{ marginRight: 6 }}
                />
                <Text
                  className="text-[13px] font-bold"
                  style={{ color: postType === "General" ? "#3B82F6" : "#64748B" }}
                >
                  Thảo luận
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setPostType("LostAndFound")}
                className="flex-1 py-3 px-4 rounded-xl border flex-row items-center justify-center"
                style={{
                  backgroundColor: postType === "LostAndFound" ? "#F0FDFA" : "#FFFFFF",
                  borderColor: postType === "LostAndFound" ? "#0D9488" : "#E2E8F0",
                }}
              >
                <Ionicons
                  name="search-outline"
                  size={16}
                  color={postType === "LostAndFound" ? "#0D9488" : "#64748B"}
                  style={{ marginRight: 6 }}
                />
                <Text
                  className="text-[13px] font-bold"
                  style={{ color: postType === "LostAndFound" ? "#0D9488" : "#64748B" }}
                >
                  Tìm đồ thất lạc
                </Text>
              </TouchableOpacity>
            </View>
            <View
              className="bg-white rounded-2xl p-4 border mb-6"
              style={{ borderColor: Colors.border }}
            >
              <TextInput
                multiline
                numberOfLines={8}
                value={content}
                onChangeText={setContent}
                placeholder={
                  postType === "LostAndFound"
                    ? "Bạn đánh rơi đồ gì? Ở đâu? Thời gian nào? Mô tả chi tiết để mọi người giúp đỡ nhé..."
                    : "Chia sẻ câu hỏi hoặc thông tin thảo luận với các sinh viên khác..."
                }
                placeholderTextColor="#94A3B8"
                style={{
                  minHeight: 160,
                  textAlignVertical: "top",
                  fontSize: 16,
                  color: Colors.textPrimary,
                }}
              />
            </View>

            <View className="mb-4">
              <View className="flex-row items-baseline justify-between mb-3">
                <Text className="text-[16px] font-bold text-slate-900">Đính kèm hình ảnh</Text>
                <Text className="text-[13px] font-medium text-slate-500">{images.length}/5 ảnh</Text>
              </View>

              <View className="flex-row flex-wrap gap-3">
                {images.map((uri, index) => (
                  <View
                    key={index}
                    className="relative"
                    style={{
                      width: "31%",
                      aspectRatio: 1,
                    }}
                  >
                    <Image source={{ uri }} style={{ width: "100%", height: "100%", borderRadius: 12 }} />
                    <TouchableOpacity
                      onPress={() => handleRemoveImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 rounded-full w-6 h-6 items-center justify-center border-2 border-white"
                      activeOpacity={0.7}
                    >
                      <Ionicons name="close" size={14} color="white" />
                    </TouchableOpacity>
                  </View>
                ))}

                {images.length < 5 && (
                  <View style={{ width: "31%", aspectRatio: 1 }}>
                    <TouchableOpacity
                      onPress={handlePickImage}
                      activeOpacity={0.7}
                      className="items-center justify-center bg-white border border-dashed w-full h-full rounded-xl"
                      style={{ borderColor: Colors.border }}
                    >
                      <Ionicons name="camera-outline" size={24} color="#64748B" className="mb-1" />
                      <Text className="text-[11px] text-slate-500 font-semibold">Thêm ảnh</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
