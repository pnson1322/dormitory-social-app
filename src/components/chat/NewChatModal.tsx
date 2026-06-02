import { Colors } from "@/constants/colors";
import { UserItem } from "@/services/user/user.types";
import { getFullImageUrl } from "@/utils/incident";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface NewChatModalProps {
  visible: boolean;
  onClose: () => void;
  users: UserItem[];
  isLoadingUsers: boolean;
  onStartDirectChat: (user: UserItem) => void;
  onCreateGroupChat: (name: string, members: string[]) => Promise<void>;
  isCreatingChat: boolean;
  allowGroupCreation?: boolean;
}

export function NewChatModal({
  visible,
  onClose,
  users,
  isLoadingUsers,
  onStartDirectChat,
  onCreateGroupChat,
  isCreatingChat,
  allowGroupCreation = true,
}: NewChatModalProps) {
  const [modalTab, setModalTab] = useState<"direct" | "group">("direct");
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [groupName, setGroupName] = useState("");
  const [isUserSearchFocused, setIsUserSearchFocused] = useState(false);

  useEffect(() => {
    if (!visible) {
      setSelectedUserIds([]);
      setGroupName("");
      setUserSearchQuery("");
      setModalTab("direct");
    }
  }, [visible]);

  const filteredUsers = users.filter(
    (u) =>
      u.fullName.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearchQuery.toLowerCase())
  );

  const toggleSelectUser = (id: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  const handleCreateGroup = () => {
    if (!groupName.trim()) {
      alert("Vui lòng nhập tên nhóm");
      return;
    }
    if (selectedUserIds.length === 0) {
      alert("Vui lòng chọn ít nhất 1 thành viên");
      return;
    }
    onCreateGroupChat(groupName, selectedUserIds);
  };

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
          style={{ height: "85%" }}
        >
          <View className="flex-row justify-between items-center px-6 py-5 border-b border-slate-100">
            <Text className="text-slate-900 font-black text-[20px]">
              Cuộc trò chuyện mới
            </Text>
            <TouchableOpacity
              onPress={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 items-center justify-center"
            >
              <Ionicons name="close" size={20} color="#475569" />
            </TouchableOpacity>
          </View>

          {allowGroupCreation && (
            <View className="flex-row px-6 mt-3 gap-2">
              <TouchableOpacity
                onPress={() => setModalTab("direct")}
                className={`flex-1 py-3 rounded-xl items-center border ${
                  modalTab === "direct"
                    ? "bg-slate-900 border-slate-900"
                    : "bg-white border-slate-200"
                }`}
              >
                <Text
                  className={`font-bold text-[14px] ${
                    modalTab === "direct" ? "text-white" : "text-slate-600"
                  }`}
                >
                  Chat cá nhân
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setModalTab("group")}
                className={`flex-1 py-3 rounded-xl items-center border ${
                  modalTab === "group"
                    ? "bg-slate-900 border-slate-900"
                    : "bg-white border-slate-200"
                }`}
              >
                <Text
                  className={`font-bold text-[14px] ${
                    modalTab === "group" ? "text-white" : "text-slate-600"
                  }`}
                >
                  Tạo nhóm chat
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <View className="flex-1 px-6 mt-4">
            {modalTab === "group" && (
              <View className="mb-4">
                <Text className="text-slate-800 font-bold text-[14px] mb-2">
                  Tên nhóm chat *
                </Text>
                <TextInput
                  placeholder="Nhập tên nhóm..."
                  placeholderTextColor="#94A3B8"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-[15px]"
                  value={groupName}
                  onChangeText={setGroupName}
                />
              </View>
            )}

            <Text className="text-slate-800 font-bold text-[14px] mb-2">
              {modalTab === "group" ? "Chọn thành viên" : "Tìm kiếm người dùng"}
            </Text>
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
                renderItem={({ item }) => {
                  const isSelected = selectedUserIds.includes(item.id);
                  return (
                    <Pressable
                      onPress={() => {
                        if (modalTab === "group") {
                          toggleSelectUser(item.id);
                        } else {
                          onStartDirectChat(item);
                        }
                      }}
                      className="flex-row items-center py-3 border-b border-slate-100"
                    >
                      {item.avatarUrl ? (
                        <Image
                          source={{
                            uri: getFullImageUrl(item.avatarUrl),
                            headers: {
                              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                            },
                          }}
                          style={{ width: 44, height: 44, borderRadius: 22 }}
                        />
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

                      {modalTab === "group" && (
                        <View
                          className={`w-6 h-6 rounded-full items-center justify-center border ${
                            isSelected ? "bg-slate-900 border-slate-900" : "border-slate-300"
                          }`}
                        >
                          {isSelected && <Ionicons name="checkmark" size={14} color="white" />}
                        </View>
                      )}
                    </Pressable>
                  );
                }}
              />
            )}
          </View>

          {modalTab === "group" && (
            <View className="px-6 py-4 border-t border-slate-100 mb-6">
              <TouchableOpacity
                onPress={handleCreateGroup}
                disabled={isCreatingChat}
                className="w-full py-4 rounded-full items-center justify-center"
                style={{ backgroundColor: Colors.primary }}
              >
                {isCreatingChat ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-extrabold text-[15px]">
                    Tạo nhóm ({selectedUserIds.length} thành viên)
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          )}
          {isCreatingChat && modalTab === "direct" && (
            <View className="absolute inset-0 bg-white/60 items-center justify-center">
              <ActivityIndicator size="large" color={Colors.primary} />
            </View>
          )}
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
