import { Colors } from "@/constants/colors";
import { UserItem } from "@/services/user/user.types";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

interface AddMemberModalProps {
  visible: boolean;
  onClose: () => void;
  users: UserItem[];
  isLoadingUsers: boolean;
  onAddMember: (user: UserItem) => Promise<void>;
  isAddingMember: boolean;
}

export function AddMemberModal({
  visible,
  onClose,
  users,
  isLoadingUsers,
  onAddMember,
  isAddingMember,
}: AddMemberModalProps) {
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [isUserSearchFocused, setIsUserSearchFocused] = useState(false);

  useEffect(() => {
    if (!visible) {
      setUserSearchQuery("");
    }
  }, [visible]);

  const filteredUsers = users.filter(
    (u) =>
      u.fullName.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearchQuery.toLowerCase())
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="bg-white rounded-t-[32px] w-full"
          style={{ height: "75%" }}
        >
          <View className="flex-row justify-between items-center px-6 py-5 border-b border-slate-100">
            <Text className="text-slate-900 font-black text-[20px]">Thêm thành viên</Text>
            <TouchableOpacity
              onPress={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 items-center justify-center"
            >
              <Ionicons name="close" size={20} color="#475569" />
            </TouchableOpacity>
          </View>

          <View className="flex-1 px-6 mt-4">
            <Text className="text-slate-800 font-bold text-[14px] mb-2">Tìm kiếm người dùng</Text>
            <View
              className={`flex-row items-center rounded-xl px-4 py-3 border mb-4 transition-all duration-200 ${
                isUserSearchFocused ? "border-blue-500 bg-white" : "border-slate-200 bg-slate-50"
              }`}
            >
              <Ionicons
                name="search-outline"
                size={18}
                color={isUserSearchFocused ? Colors.primaryLight : "#94A3B8"}
              />
              <TextInput
                placeholder="Nhập tên hoặc email..."
                placeholderTextColor="#94A3B8"
                className="flex-1 ml-3 text-slate-800 text-[15px] p-0"
                value={userSearchQuery}
                onChangeText={setUserSearchQuery}
                onFocus={() => setIsUserSearchFocused(true)}
                onBlur={() => setIsUserSearchFocused(false)}
              />
            </View>

            {isLoadingUsers ? (
              <View className="flex-1 items-center justify-center">
                <ActivityIndicator color={Colors.primary} />
              </View>
            ) : filteredUsers.length === 0 ? (
              <View className="flex-1 items-center justify-center py-10">
                <Text className="text-slate-400 font-bold text-[14px]">
                  Không tìm thấy người dùng phù hợp
                </Text>
              </View>
            ) : (
              <FlatList
                data={filteredUsers}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => onAddMember(item)}
                    className="flex-row items-center py-3 border-b border-slate-100"
                  >
                    {item.avatarUrl ? (
                      <Image source={{ uri: item.avatarUrl }} className="w-11 h-11 rounded-full" />
                    ) : (
                      <View className="w-11 h-11 rounded-full bg-slate-100 items-center justify-center">
                        <Ionicons name="person" size={18} color="#64748B" />
                      </View>
                    )}

                    <View className="flex-1 ml-3">
                      <Text className="text-slate-800 font-bold text-[15px]">{item.fullName}</Text>
                      <View className="flex-row items-center gap-1.5 mt-0.5">
                        <Text className="text-slate-500 text-[12px]">{item.email}</Text>
                        <View className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                        <Text className="text-slate-500 text-[12px] font-bold uppercase">
                          {item.role === "admin"
                            ? "BQT"
                            : item.role === "manager"
                            ? "Quản lý"
                            : "Sinh viên"}
                        </Text>
                      </View>
                    </View>

                    <View className="w-8 h-8 rounded-full bg-blue-50 items-center justify-center">
                      <Ionicons name="add" size={18} color={Colors.primary} />
                    </View>
                  </TouchableOpacity>
                )}
              />
            )}
          </View>

          {isAddingMember && (
            <View className="absolute inset-0 bg-white/60 items-center justify-center z-50">
              <ActivityIndicator size="large" color={Colors.primary} />
            </View>
          )}
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
