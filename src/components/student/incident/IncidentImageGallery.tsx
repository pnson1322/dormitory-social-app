import React from "react";
import { ScrollView, Pressable, Image, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getFullImageUrl } from "@/utils/incident";

interface Props {
  imageUrls?: string[];
  onPreviewImage: (url: string) => void;
}

export function IncidentImageGallery({ imageUrls, onPreviewImage }: Props) {
  const hasImages = imageUrls && imageUrls.length > 0;

  if (!hasImages) {
    return (
      <View className="bg-slate-50 rounded-2xl py-6 items-center justify-center border border-dashed border-slate-200">
        <Ionicons name="images-outline" size={24} color="#94A3B8" className="mb-1" />
        <Text className="text-xs text-slate-400 font-medium">Không có hình ảnh đính kèm</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 10 }}
    >
      {imageUrls.map((imgUrl, idx) => {
        const fullUrl = getFullImageUrl(imgUrl);
        return (
          <Pressable 
            key={idx} 
            onPress={() => onPreviewImage(fullUrl)}
            className="active:opacity-90"
          >
            <Image 
              source={{ uri: fullUrl }} 
              className="w-24 h-24 rounded-2xl bg-slate-100 border border-slate-100"
              resizeMode="cover"
            />
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
