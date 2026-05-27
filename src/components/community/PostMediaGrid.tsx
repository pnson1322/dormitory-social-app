import { Image } from "expo-image";
import React from "react";
import { Pressable, Text, View } from "react-native";

interface PostMediaGridProps {
  mediaUrls: string[];
  onImagePress: (index: number) => void;
}

export function PostMediaGrid({ mediaUrls, onImagePress }: PostMediaGridProps) {
  if (!mediaUrls || mediaUrls.length === 0) return null;

  if (mediaUrls.length === 1) {
    return (
      <Pressable
        onPress={() => onImagePress(0)}
        className="mt-3 rounded-xl overflow-hidden active:opacity-95"
      >
        <Image
          source={{ uri: mediaUrls[0] }}
          style={{ width: "100%", height: 180 }}
          className="rounded-xl"
          contentFit="cover"
          transition={200}
        />
      </Pressable>
    );
  }

  if (mediaUrls.length === 2) {
    return (
      <View className="mt-3 flex-row justify-between">
        <Pressable
          onPress={() => onImagePress(0)}
          style={{ width: "49%", aspectRatio: 1 }}
          className="rounded-xl active:opacity-95"
        >
          <Image
            source={{ uri: mediaUrls[0] }}
            style={{ width: "100%", height: "100%" }}
            className="rounded-xl"
            contentFit="cover"
            transition={200}
          />
        </Pressable>
        <Pressable
          onPress={() => onImagePress(1)}
          style={{ width: "49%", aspectRatio: 1 }}
          className="rounded-xl active:opacity-95"
        >
          <Image
            source={{ uri: mediaUrls[1] }}
            style={{ width: "100%", height: "100%" }}
            className="rounded-xl"
            contentFit="cover"
            transition={200}
          />
        </Pressable>
      </View>
    );
  }

  const remainingCount = mediaUrls.length - 3;
  return (
    <View className="mt-3 flex-row justify-between h-48">
      <Pressable
        onPress={() => onImagePress(0)}
        style={{ width: "63%", height: "100%" }}
        className="rounded-l-xl active:opacity-95"
      >
        <Image
          source={{ uri: mediaUrls[0] }}
          style={{ width: "100%", height: "100%" }}
          className="rounded-l-xl"
          contentFit="cover"
          transition={200}
        />
      </Pressable>
      <View
        className="justify-between"
        style={{ width: "35%", height: "100%" }}
      >
        <Pressable
          onPress={() => onImagePress(1)}
          style={{ width: "100%", height: "48%" }}
          className="rounded-tr-xl active:opacity-95"
        >
          <Image
            source={{ uri: mediaUrls[1] }}
            style={{ width: "100%", height: "100%" }}
            className="rounded-tr-xl"
            contentFit="cover"
            transition={200}
          />
        </Pressable>
        <View style={{ width: "100%", height: "48%" }} className="relative">
          <Pressable
            onPress={() => onImagePress(2)}
            style={{ width: "100%", height: "100%" }}
            className="rounded-br-xl active:opacity-95"
          >
            <Image
              source={{ uri: mediaUrls[2] }}
              style={{ width: "100%", height: "100%" }}
              className="rounded-br-xl"
              contentFit="cover"
              transition={200}
            />
            {remainingCount > 0 && (
              <View
                className="absolute inset-0 bg-black/45 rounded-br-xl justify-center items-center"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                }}
              >
                <Text className="text-white font-extrabold text-[17px]">
                  +{remainingCount}
                </Text>
              </View>
            )}
          </Pressable>
        </View>
      </View>
    </View>
  );
}
