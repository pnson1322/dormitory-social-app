import { Colors } from "@/constants/colors";
import { getFullImageUrl } from "@/utils/incident";
import { chatMetadataCache } from "@/utils/chatMetadataCache";
import { Ionicons } from "@expo/vector-icons";
import { formatDistanceToNow, parseISO } from "date-fns";
import { vi } from "date-fns/locale";
import { Image } from "expo-image";
import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface ConversationItemProps {
  item: {
    id: string;
    name?: string | null;
    avatarUrl?: string | null;
    type: string;
    lastMessage?: string | null;
    lastMessageAt?: string | null;
    memberCount: number;
  };
  onPress: () => void;
}

export function ConversationItem({ item, onPress }: ConversationItemProps) {
  const [avatarError, setAvatarError] = useState(false);
  const isGroup = item.type === "Group";

  const cached = chatMetadataCache.get(item.id);
  const displayName = item.name || cached?.name || (isGroup ? "Hội nhóm" : "Người dùng");
  const avatarSource = item.avatarUrl || cached?.avatarUrl;

  useEffect(() => {
    setAvatarError(false);
  }, [avatarSource]);

  const formatMessageTime = (timeStr?: string | null) => {
    if (!timeStr) return "";
    try {
      const date = parseISO(timeStr);
      return formatDistanceToNow(date, { addSuffix: false, locale: vi })
        .replace("khoảng ", "")
        .replace("dưới ", "")
        .replace("khoảng", "")
        .replace("trước", "")
        .trim();
    } catch (e) {
      return "";
    }
  };

  const formattedTime = formatMessageTime(item.lastMessageAt);

  return (
    <TouchableOpacity
      className="flex-row items-center px-5 py-4 border-b border-slate-100 bg-white"
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View className="relative">
        {avatarSource && !avatarError ? (
          <Image
            source={{
              uri: getFullImageUrl(avatarSource),
              headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
              },
            }}
            style={{ width: 56, height: 56, borderRadius: 28 }}
            contentFit="cover"
            onError={() => setAvatarError(true)}
          />
        ) : (
          <View
            className="w-14 h-14 rounded-full items-center justify-center"
            style={{
              backgroundColor: isGroup ? "#E0F2FE" : "#F1F5F9",
            }}
          >
            <Ionicons
              name={isGroup ? "people" : "person"}
              size={24}
              color={isGroup ? "#0284C7" : "#475569"}
            />
          </View>
        )}
        {isGroup && (
          <View
            className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full items-center justify-center border border-white"
            style={{ backgroundColor: Colors.accent }}
          >
            <Ionicons name="people" size={10} color="white" />
          </View>
        )}
      </View>

      <View className="flex-1 ml-4 justify-center">
        <View className="flex-row justify-between items-center">
          <Text className="text-slate-900 font-bold text-[16px] flex-1 mr-2" numberOfLines={1}>
            {displayName}
          </Text>
          {formattedTime ? (
            <Text className="text-slate-400 text-[12px] font-medium">
              {formattedTime}
            </Text>
          ) : null}
        </View>

        <View className="flex-row justify-between items-center mt-1.5">
          <Text className="text-slate-500 text-[14px] flex-1 mr-2" numberOfLines={1}>
            {item.lastMessage || "Chưa có tin nhắn nào"}
          </Text>
          {isGroup && item.memberCount > 0 && (
            <View className="bg-slate-100 rounded-full px-2 py-0.5">
              <Text className="text-slate-600 text-[10px] font-bold">
                {item.memberCount} thành viên
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}
