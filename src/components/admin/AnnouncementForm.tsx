import { AppButton } from "@/components/AppButton";
import { Colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface AnnouncementFormProps {
  announcementContent: string;
  setAnnouncementContent: (text: string) => void;
  isPinned: boolean;
  setIsPinned: (pinned: boolean) => void;
  images: string[];
  isCreatingAnnouncement: boolean;
  handlePickImage: () => Promise<void>;
  handleRemoveImage: (index: number) => void;
  handlePublishAnnouncement: () => Promise<void>;
}

export function AnnouncementForm({
  announcementContent,
  setAnnouncementContent,
  isPinned,
  setIsPinned,
  images,
  isCreatingAnnouncement,
  handlePickImage,
  handleRemoveImage,
  handlePublishAnnouncement,
}: AnnouncementFormProps) {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 60 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm mb-5">
          <Text className="text-slate-800 font-bold text-[16px] mb-3">Nội dung thông báo</Text>
          <TextInput
            multiline
            numberOfLines={6}
            value={announcementContent}
            onChangeText={setAnnouncementContent}
            placeholder="Nhập nội dung thông báo hành chính gửi đến toàn bộ sinh viên trong ký túc xá..."
            placeholderTextColor="#94A3B8"
            style={{
              minHeight: 140,
              textAlignVertical: "top",
              fontSize: 15,
              color: Colors.textPrimary,
              backgroundColor: "#F8FAFC",
              borderRadius: 16,
              padding: 14,
              borderWidth: 1,
              borderColor: Colors.border,
            }}
          />
        </View>

        <View className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm mb-5 flex-row items-center justify-between">
          <View className="flex-row items-center flex-1 mr-4">
            <View className="w-10 h-10 rounded-full bg-amber-50 justify-center items-center mr-3">
              <Ionicons name="pin-outline" size={20} color="#F59E0B" />
            </View>
            <View className="flex-1">
              <Text className="text-slate-800 font-bold text-[15px]">Ghim thông báo</Text>
              <Text className="text-slate-400 text-[12px] mt-0.5" numberOfLines={1}>
                Đánh dấu nổi bật/ghim trên đầu trang cộng đồng
              </Text>
            </View>
          </View>
          <Switch
            value={isPinned}
            onValueChange={setIsPinned}
            trackColor={{ false: "#E2E8F0", true: "#93C5FD" }}
            thumbColor={isPinned ? Colors.primaryLight : "#F4F3F4"}
          />
        </View>

        <View className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm mb-6">
          <View className="flex-row items-baseline justify-between mb-4">
            <Text className="text-[15px] font-bold text-slate-800">Đính kèm hình ảnh</Text>
            <Text className="text-[12px] font-medium text-slate-400">{images.length}/5 ảnh</Text>
          </View>

          <View className="flex-row flex-wrap gap-3">
            {images.map((uri, index) => (
              <View key={index} className="relative" style={{ width: "30%", aspectRatio: 1 }}>
                <Image source={{ uri }} style={{ width: "100%", height: "100%", borderRadius: 16 }} />
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
              <View style={{ width: "30%", aspectRatio: 1 }}>
                <TouchableOpacity
                  onPress={handlePickImage}
                  activeOpacity={0.7}
                  className="w-full h-full items-center justify-center bg-slate-50 border border-dashed border-slate-300 rounded-2xl"
                >
                  <Ionicons name="camera-outline" size={24} color="#64748B" style={{ marginBottom: 4 }} />
                  <Text className="text-[11px] text-slate-500 font-bold">Thêm ảnh</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        <AppButton
          title="Đăng thông báo"
          onPress={handlePublishAnnouncement}
          loading={isCreatingAnnouncement}
          disabled={!announcementContent.trim()}
          style={{ width: "100%" }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
