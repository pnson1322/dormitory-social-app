import React from "react";
import { Modal, View, Pressable, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  visible: boolean;
  imageUrl: string | null;
  onClose: () => void;
}

export function ImagePreviewModal({ visible, imageUrl, onClose }: Props) {
  if (!imageUrl) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black justify-center items-center">
        <Pressable 
          onPress={onClose} 
          className="absolute top-12 right-6 z-10 w-12 h-12 bg-white/10 rounded-full items-center justify-center active:opacity-75"
        >
          <Ionicons name="close" size={28} color="#FFFFFF" />
        </Pressable>
        <Image 
          source={{ uri: imageUrl }}
          className="w-full h-4/5"
          resizeMode="contain"
        />
      </View>
    </Modal>
  );
}
