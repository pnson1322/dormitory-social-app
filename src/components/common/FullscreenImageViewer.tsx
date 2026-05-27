import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Modal,
  Pressable,
  SafeAreaView,
  StatusBar,
  Text,
  View
} from "react-native";

interface FullscreenImageViewerProps {
  visible: boolean;
  images: string[];
  initialIndex: number;
  onClose: () => void;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export function FullscreenImageViewer({
  visible,
  images,
  initialIndex,
  onClose,
}: FullscreenImageViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (visible) {
      setCurrentIndex(initialIndex);
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({
          index: initialIndex,
          animated: false,
        });
      }, 50);
    }
  }, [visible, initialIndex]);

  if (!visible || images.length === 0) return null;

  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SCREEN_WIDTH);
    if (index >= 0 && index < images.length) {
      setCurrentIndex(index);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black">
        <StatusBar barStyle="light-content" backgroundColor="#000000" />
        
        <SafeAreaView className="absolute top-0 left-0 right-0 z-50 bg-black/40">
          <View className="flex-row items-center justify-between px-4 py-3">
            <Pressable
              onPress={onClose}
              className="w-10 h-10 items-center justify-center rounded-full bg-white/10 active:bg-white/20"
            >
              <Ionicons name="close" size={24} color="#FFFFFF" />
            </Pressable>
            
            {images.length > 1 && (
              <Text className="text-white font-bold text-[16px]">
                {currentIndex + 1} / {images.length}
              </Text>
            )}

            <View className="w-10" />
          </View>
        </SafeAreaView>
        <FlatList
          ref={flatListRef}
          data={images}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          getItemLayout={(_, index) => ({
            length: SCREEN_WIDTH,
            offset: SCREEN_WIDTH * index,
            index,
          })}
          onScrollToIndexFailed={(info) => {
            flatListRef.current?.scrollToOffset({
              offset: info.highestMeasuredFrameIndex * SCREEN_WIDTH,
              animated: false,
            });
          }}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <View
              style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}
              className="justify-center items-center"
            >
              <Image
                source={{ uri: item }}
                style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT - 100 }}
                contentFit="contain"
                transition={200}
              />
            </View>
          )}
        />
      </View>
    </Modal>
  );
}
