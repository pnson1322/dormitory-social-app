import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

interface GroupNameEditSectionProps {
  isEditingName: boolean;
  setIsEditingName: (editing: boolean) => void;
  groupName: string;
  setGroupName: (name: string) => void;
  conversationName: string;
  handleRename: () => void;
  isSubmitting: boolean;
}

export function GroupNameEditSection({
  isEditingName,
  setIsEditingName,
  groupName,
  setGroupName,
  conversationName,
  handleRename,
  isSubmitting,
}: GroupNameEditSectionProps) {
  if (isEditingName) {
    return (
      <View className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 mb-5">
        <Text className="text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-1.5">Tên nhóm chat</Text>
        <View className="flex-row items-center gap-2">
          <TextInput
            value={groupName}
            onChangeText={setGroupName}
            maxLength={100}
            className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 text-[15px] font-bold"
            autoFocus
          />
          <TouchableOpacity
            onPress={handleRename}
            disabled={isSubmitting}
            className="w-10 h-10 rounded-xl bg-blue-600 items-center justify-center active:bg-blue-700"
          >
            <Ionicons name="checkmark" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setIsEditingName(false)}
            className="w-10 h-10 rounded-xl bg-slate-200 items-center justify-center active:bg-slate-300"
          >
            <Ionicons name="close" size={20} color="#475569" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 mb-5">
      <Text className="text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-1.5">Tên nhóm chat</Text>
      <View className="flex-row items-center justify-between">
        <Text className="text-slate-800 font-extrabold text-[17px] flex-1 mr-4">{conversationName}</Text>
        <TouchableOpacity onPress={() => setIsEditingName(true)} className="w-8 h-8 rounded-full bg-slate-200/60 items-center justify-center active:bg-slate-200">
          <Ionicons name="pencil" size={14} color="#475569" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
