import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface GroupActionButtonsProps {
  isCurrentUserAdmin: boolean;
  openAddMember: () => void;
  onLeaveGroup: () => void;
}

export function GroupActionButtons({ isCurrentUserAdmin, openAddMember, onLeaveGroup }: GroupActionButtonsProps) {
  return (
    <View className="flex-row gap-3 mb-5">
      {isCurrentUserAdmin && (
        <TouchableOpacity onPress={openAddMember} className="flex-1 bg-slate-900 py-3.5 rounded-xl flex-row items-center justify-center gap-2 active:bg-slate-800">
          <Ionicons name="person-add" size={16} color="white" />
          <Text className="text-white font-bold text-[14px]">Thêm thành viên</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity onPress={onLeaveGroup} className={`bg-red-50 border border-red-200/60 rounded-xl flex-row items-center justify-center gap-1.5 active:bg-red-100/55 ${isCurrentUserAdmin ? "px-5" : "flex-1 py-3.5"}`}>
        <Ionicons name="exit-outline" size={16} color="#DC2626" />
        <Text className="text-red-600 font-bold text-[14px]">Rời nhóm</Text>
      </TouchableOpacity>
    </View>
  );
}
