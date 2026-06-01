import { IncidentCategorySelector } from "@/components/student/incident/IncidentCategorySelector";
import { IncidentImagePicker } from "@/components/student/incident/IncidentImagePicker";
import { Colors } from "@/constants/colors";
import { useIncidentForm } from "@/hooks/student/useIncidentForm";
import { useMyRoom } from "@/hooks/student/useMyRoom";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  ActivityIndicator
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppButton } from "@/components/AppButton";

type FormProps = {
  roomId: string;
};

function ReportIncidentForm({ roomId }: FormProps) {
  const router = useRouter();
  const [descriptionFocused, setDescriptionFocused] = React.useState(false);
  const {
    categories,
    isCategoriesLoading,
    selectedCategory,
    setSelectedCategory,
    description,
    setDescription,
    images,
    handlePickImage,
    removeImage,
    handleSubmit,
    isLoading,
    resetForm,
  } = useIncidentForm(roomId);

  const trimmedLength = description.trim().length;
  const isSubmitDisabled = trimmedLength < 10 || trimmedLength > 1000 || isLoading;

  const handleFormSubmit = async () => {
    const success = await handleSubmit();
    if (success) {
      router.navigate("/(student)/incidents");
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
      <View 
        className="bg-white rounded-[24px] p-5 mb-6"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.03,
          shadowRadius: 15,
          elevation: 2,
        }}
      >
        <IncidentCategorySelector 
          categories={categories}
          isLoading={isCategoriesLoading}
          selectedCategory={selectedCategory} 
          onSelect={setSelectedCategory} 
        />

        <View className="h-[1px] bg-slate-100 my-6" />

        <View className="mb-2">
          <Text className="text-[16px] font-bold text-slate-900 mb-3">Mô tả chi tiết</Text>
          <View 
            className="bg-slate-50 rounded-2xl p-4 border"
            style={{
              borderColor: descriptionFocused ? Colors.primaryLight || "#3B82F6" : Colors.border,
            }}
          >
            <TextInput
              multiline
              numberOfLines={6}
              placeholder="Mô tả chi tiết tình trạng hư hỏng..."
              placeholderTextColor="#94A3B8"
              value={description}
              onChangeText={setDescription}
              onFocus={() => setDescriptionFocused(true)}
              onBlur={() => setDescriptionFocused(false)}
              style={{ minHeight: 120, textAlignVertical: "top", fontSize: 15, color: "#1E293B" }}
            />
          </View>
          <View className="flex-row justify-between items-center mt-2 px-1">
            {trimmedLength > 0 && trimmedLength < 10 ? (
              <Text className="text-xs text-amber-600 font-semibold">
                Cần nhập tối thiểu 10 ký tự (Hiện tại: {trimmedLength})
              </Text>
            ) : trimmedLength > 1000 ? (
              <Text className="text-xs text-red-500 font-semibold">
                Vượt quá giới hạn 1000 ký tự (Hiện tại: {trimmedLength})
              </Text>
            ) : (
              <View />
            )}
            <Text className="text-[11px] font-medium text-slate-400">
              {trimmedLength}/1000 ký tự
            </Text>
          </View>
        </View>
      </View>

      <View 
        className="bg-white rounded-[24px] p-5 mb-8"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.03,
          shadowRadius: 15,
          elevation: 2,
        }}
      >
        <IncidentImagePicker 
          images={images} 
          onPickImage={handlePickImage} 
          onRemoveImage={removeImage} 
        />
      </View>

      <View className="mb-4">
        <AppButton 
          title="Gửi Báo Cáo" 
          onPress={handleFormSubmit} 
          loading={isLoading}
          disabled={isSubmitDisabled} 
        />
      </View>
    </ScrollView>
  );
}

export function ReportIncidentScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { roomInfo, loading } = useMyRoom();
  const roomId = roomInfo?.roomId;

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <View
        className="px-5 pb-4 z-10"
        style={{
          paddingTop: Math.max(insets.top, 20) + 10,
          backgroundColor: Colors.primary,
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 5,
        }}
      >
        <View className="flex-row items-center">
          <Pressable
            onPress={() => {
              router.navigate("/(student)/incidents");
            }}
            className="mr-4 h-11 w-11 items-center justify-center rounded-full bg-white/15"
          >
            <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
          </Pressable>
          <Text className="text-[22px] font-extrabold text-white">
            Báo cáo sự cố
          </Text>
        </View>
      </View>

      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : !roomId ? (
          <View className="flex-1 items-center justify-center p-8 bg-white m-5 rounded-[32px] border border-slate-100 shadow-sm">
            <View className="h-16 w-16 bg-red-50 rounded-2xl items-center justify-center mb-6">
              <Ionicons name="warning-outline" size={32} color="#EF4444" />
            </View>
            <Text className="text-slate-800 font-black text-[18px] text-center">Chưa có thông tin phòng</Text>
            <Text className="text-slate-500 text-[14px] mt-2 text-center leading-6 px-4">
              Bạn cần phải có phòng ký túc xá hoạt động để có thể gửi báo cáo sự cố cơ sở vật chất.
            </Text>
          </View>
        ) : (
          <ReportIncidentForm roomId={roomId} />
        )}
      </KeyboardAvoidingView>
    </View>
  );
}
