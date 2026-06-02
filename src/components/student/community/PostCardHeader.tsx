import { Colors } from "@/constants/colors";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React, { useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { PostRenderingStrategy } from "./PostRenderingStrategy";
import { isValidAvatarUrl } from "@/utils/communityUtils";

interface PostCardHeaderProps {
  authorId: string;
  createdAt: string;
  strategy: PostRenderingStrategy;
  canHide?: boolean;
  onHide?: (id: string) => void;
  isHiding: boolean;
  handleHide: () => Promise<void>;
  formatDate: (dateString: string) => string;
  getInitials: (nameOrId: string) => string;
  onPress?: () => void;
  avatarUrl?: string;
  authorName?: string;
  canPin?: boolean;
  isPinned?: boolean;
  isPinning?: boolean;
  onPin?: () => Promise<void>;
  isHidden?: boolean;
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
  isHidden = false,
}: PostCardHeaderProps) {
  return (
    <View className="flex-row items-center justify-between mb-3">
      <Pressable onPress={onPress} className="flex-row items-center flex-1">
        <View 
          style={{ width: 40, height: 40, borderRadius: 20, marginRight: 12, position: "relative", overflow: "hidden" }}
        >
          <View
            style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, justifyContent: "center", alignItems: "center", backgroundColor: Colors.primary + "15" }}
          >
            <Text className="font-bold text-[15px]" style={{ color: Colors.primary }}>
              {getInitials(authorName || authorId)}
            </Text>
          </View>

          {isValidAvatarUrl(avatarUrl) && (
            <Image
              source={{ uri: avatarUrl }}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: "100%",
                height: "100%",
                borderRadius: 20,
              }}
              contentFit="cover"
              transition={150}
            />
          )}
        </View>
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

        {isHidden && (
          <View
            className="flex-row items-center px-2.5 py-1 rounded-full bg-slate-100 mr-2"
          >
            <Ionicons
              name="eye-off"
              size={11}
              color="#64748B"
              style={{ marginRight: 3 }}
            />
            <Text className="text-[11px] font-bold text-slate-500">
              Đã ẩn
            </Text>
          </View>
        )}

        {canPin && onPin && (
          <Pressable
            onPress={onPin}
            disabled={isPinning}
            className="p-1 rounded-full bg-slate-100 active:bg-slate-200 mr-2"
          >
            {isPinning ? (
              <ActivityIndicator size="small" color={Colors.textSecondary} />
            ) : (
              <AntDesign
                name="pushpin"
                size={14}
                color={isPinned ? "#EF4444" : Colors.textSecondary}
                style={{ opacity: isPinned ? 1 : 0.5 }}
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
              <Ionicons
                name={isHidden ? "eye-outline" : "eye-off-outline"}
                size={16}
                color={isHidden ? "#10B981" : Colors.textSecondary}
              />
            )}
          </Pressable>
        )}
      </View>
    </View>
  );
}
