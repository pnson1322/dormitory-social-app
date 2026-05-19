import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface Props {
  images: string[];
  onPickImage: () => void;
  onRemoveImage: (index: number) => void;
}

export function IncidentImagePicker({ images, onPickImage, onRemoveImage }: Props) {
  return (
    <View className="mb-4">
      <View className="flex-row items-baseline justify-between mb-3">
        <Text className="text-[16px] font-bold text-slate-900">Hình ảnh đính kèm</Text>
        <Text className="text-xs font-medium text-slate-500">{images.length}/5 ảnh</Text>
      </View>

      <View className="flex-row flex-wrap gap-3">
        {images.map((uri, index) => (
          <View 
            key={index} 
            className="relative"
            style={{
              width: "31%",
              aspectRatio: 1,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            <Image
              source={{ uri }}
              style={{ width: "100%", height: "100%", borderRadius: 16 }}
            />
            <TouchableOpacity
              onPress={() => onRemoveImage(index)}
              className="absolute -top-2 -right-2 bg-red-500 rounded-full w-7 h-7 items-center justify-center border-2 border-white shadow-sm"
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={16} color="white" />
            </TouchableOpacity>
          </View>
        ))}

        {images.length < 5 && (
          <View style={{ width: "31%", aspectRatio: 1 }}>
            <TouchableOpacity
              onPress={onPickImage}
              activeOpacity={0.7}
              className="items-center justify-center bg-slate-50 border-2 border-dashed w-full h-full"
              style={{
                borderRadius: 16,
                borderColor: "#CBD5E1",
              }}
            >
              <View className="w-10 h-10 rounded-full bg-slate-100 items-center justify-center mb-1">
                <Ionicons name="camera" size={20} color="#64748B" />
              </View>
              <Text className="text-[10px] text-slate-500 font-semibold">Tải ảnh lên</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}
