import { Colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { PostRenderingStrategy } from "./PostRenderingStrategy";

interface PostCardHeaderProps {
  authorId: string;
  createdAt: string;
  strategy: PostRenderingStrategy;
  canHide?: boolean;
  onHide?: (id: string) => void;
  isHiding: boolean;
  handleHide: () => Promise<void>;
  formatDate: (dateString: string) => string;
  getInitials: (authorId: string) => string;
  onPress?: () => void;
  avatarUrl?: string;
  authorName?: string;
  canPin?: boolean;
  isPinned?: boolean;
  isPinning?: boolean;
  onPin?: () => Promise<void>;
}

export function PostCardHeader({
  authorId,
  createdAt,
  strategy,
  canHide = false,
  onHide,
  isHiding,
  handleHide,
  formatDate,
  getInitials,
  onPress,
  avatarUrl,
  authorName,
  canPin = false,
  isPinned = false,
  isPinning = false,
  onPin,
}: PostCardHeaderProps) {
  return (
    <View className="flex-row items-center justify-between mb-3">
      <Pressable onPress={onPress} className="flex-row items-center flex-1">
        {avatarUrl ? (
          <Image
            source={{ uri: avatarUrl }}
            className="w-10 h-10 rounded-full mr-3"
            contentFit="cover"
            transition={150}
          />
        ) : (
          <View
            className="w-10 h-10 rounded-full justify-center items-center mr-3"
            style={{ backgroundColor: Colors.primary + "15" }}
          >
            <Text className="font-bold text-[15px]" style={{ color: Colors.primary }}>
              {getInitials(authorId)}
            </Text>
          </View>
        )}
        <View className="flex-1">
          <Text className="font-semibold text-[16px]" style={{ color: Colors.textPrimary }}>
            {authorName || "Sinh viên KTX"}
          </Text>
          <Text className="text-[13px] mt-0.5" style={{ color: Colors.textSecondary }}>
            {formatDate(createdAt)}
          </Text>
        </View>
      </Pressable>

      <View className="flex-row items-center">
        <View
          className="flex-row items-center px-2.5 py-1 rounded-full mr-2"
          style={{ backgroundColor: strategy.getBadgeBgColor() }}
        >
          <Ionicons
            name={strategy.getBadgeIconName()}
            size={12}
            color={strategy.getBadgeColor()}
            style={{ marginRight: 4 }}
          />
          <Text className="text-[11px] font-bold" style={{ color: strategy.getBadgeColor() }}>
            {strategy.getBadgeLabel()}
          </Text>
        </View>

        {canPin && onPin && (
          <Pressable
            onPress={onPin}
            disabled={isPinning}
            className="p-1 rounded-full bg-slate-100 active:bg-slate-200 mr-2"
          >
            {isPinning ? (
              <ActivityIndicator size="small" color={Colors.textSecondary} />
            ) : (
              <Ionicons
                name={isPinned ? "pin" : "pin-outline"}
                size={16}
                color={isPinned ? "#EF4444" : Colors.textSecondary}
              />
            )}
          </Pressable>
        )}

        {canHide && onHide && (
          <Pressable
            onPress={handleHide}
            disabled={isHiding}
            className="p-1 rounded-full bg-slate-100 active:bg-slate-200"
          >
            {isHiding ? (
              <ActivityIndicator size="small" color={Colors.textSecondary} />
            ) : (
              <Ionicons name="eye-off-outline" size={16} color={Colors.textSecondary} />
            )}
          </Pressable>
        )}
      </View>
    </View>
  );
}
