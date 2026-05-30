import { ConversationMemberItem } from "@/services/chat/chat.types";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface GroupMemberRowProps {
  item: ConversationMemberItem;
  currentUserId: string;
  isCurrentUserAdmin: boolean;
  onTransferAdmin: () => void;
  onKick: () => void;
}

export function GroupMemberRow({
  item,
  currentUserId,
  isCurrentUserAdmin,
  onTransferAdmin,
  onKick,
}: GroupMemberRowProps) {
  const isMe = item.userId === currentUserId;
  const isItemAdmin = item.role === "Admin";

  return (
    <View className="flex-row items-center py-3 border-b border-slate-100">
      {item.avatarUrl ? (
        <Image source={{ uri: item.avatarUrl }} className="w-10 h-10 rounded-full" />
      ) : (
        <View className="w-10 h-10 rounded-full bg-slate-100 items-center justify-center">
          <Ionicons name="person" size={16} color="#64748B" />
        </View>
      )}
      <View className="flex-1 ml-3 mr-2">
        <View className="flex-row items-center gap-1.5">
          <Text className="text-slate-800 font-bold text-[14px]" numberOfLines={1}>
            {item.fullName} {isMe && "(Bạn)"}
          </Text>
          {isItemAdmin && (
            <View className="bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
              <Text className="text-amber-700 text-[10px] font-black uppercase">Trưởng nhóm</Text>
            </View>
          )}
        </View>
        <Text className="text-slate-400 text-[12px]" numberOfLines={1}>
          Tham gia: {new Date(item.joinedAt).toLocaleDateString("vi-VN")}
        </Text>
      </View>
      {isCurrentUserAdmin && !isMe && (
        <View className="flex-row gap-1">
          <TouchableOpacity onPress={onTransferAdmin} className="w-8 h-8 rounded-full bg-amber-50 border border-amber-100 items-center justify-center active:bg-amber-100">
            <Ionicons name="shield-half" size={14} color="#D97706" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onKick} className="w-8 h-8 rounded-full bg-red-50 border border-red-100 items-center justify-center active:bg-red-100">
            <Ionicons name="trash-outline" size={14} color="#DC2626" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
