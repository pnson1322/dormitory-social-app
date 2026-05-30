import { ConversationListSkeleton } from "@/components/chat/ChatSkeleton";
import { ConversationItem } from "@/components/chat/ConversationItem";
import { NewChatModal } from "@/components/chat/NewChatModal";
import { Colors } from "@/constants/colors";
import { useChatList } from "@/hooks/chat/useChatList";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type FilterType = "all" | "direct" | "group";

export function ChatListScreen() {
  const insets = useSafeAreaInsets();
  
  const {
    router,
    isAdminOrManager,
    isLoading,
    isRefreshing,
    refresh,
    searchQuery,
    setSearchQuery,
    activeFilter,
    setActiveFilter,
    isSearchFocused,
    setIsSearchFocused,
    isModalOpen,
    setIsModalOpen,
    users,
    isLoadingUsers,
    isCreatingChat,
    handleStartDirectChat,
    handleCreateGroupChat,
    filteredConversations,
  } = useChatList();

  return (
    <View className="flex-1" style={{ backgroundColor: Colors.background }}>
      <View
        className="px-6 pb-6 pt-4 rounded-b-[36px]"
        style={{
          backgroundColor: Colors.primary,
          paddingTop: insets.top + 10,
        }}
      >
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-white/60 text-[13px] font-bold uppercase tracking-[2px]">
              Trò chuyện
            </Text>
            <Text className="text-white text-[28px] font-black mt-0.5">
              Hộp thư
            </Text>
          </View>
          <TouchableOpacity
            className="w-12 h-12 rounded-full items-center justify-center active:bg-white/20"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.15)" }}
            onPress={() => setIsModalOpen(true)}
          >
            <Ionicons name="chatbubbles" size={22} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <View className="px-5 mt-4">
        <View
          className={`flex-row items-center bg-white rounded-2xl px-4 py-3 border transition-all duration-200 ${
            isSearchFocused
              ? "border-blue-500 shadow-md shadow-blue-500/10"
              : "border-slate-100 shadow-sm shadow-slate-100"
          }`}
        >
          <Ionicons
            name="search-outline"
            size={20}
            color={isSearchFocused ? Colors.primaryLight : "#94A3B8"}
          />
          <TextInput
            placeholder="Tìm kiếm cuộc trò chuyện..."
            placeholderTextColor="#94A3B8"
            className="flex-1 ml-3 text-slate-800 text-[15px] p-0"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={18} color="#94A3B8" />
            </TouchableOpacity>
          ) : null}
        </View>

        <View className="flex-row mt-4 gap-2">
          {(["all", "direct", "group"] as FilterType[]).map((filter) => {
            const isActive = activeFilter === filter;
            const label = filter === "all" ? "Tất cả" : filter === "direct" ? "Cá nhân" : "Nhóm";
            return (
              <TouchableOpacity
                key={filter}
                onPress={() => setActiveFilter(filter)}
                className={`px-5 py-2.5 rounded-full border ${
                  isActive ? "bg-slate-900 border-slate-900" : "bg-white border-slate-200"
                }`}
              >
                <Text
                  className={`text-[13px] font-extrabold ${
                    isActive ? "text-white" : "text-slate-600"
                  }`}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View className="flex-1 mt-4">
        {isLoading || isRefreshing ? (
          <ConversationListSkeleton />
        ) : filteredConversations.length === 0 ? (
          <View className="flex-1 items-center justify-center px-10">
            <View className="w-24 h-24 rounded-full bg-slate-100 items-center justify-center mb-4">
              <Ionicons name="chatbox-ellipses-outline" size={48} color="#94A3B8" />
            </View>
            <Text className="text-slate-800 font-extrabold text-[18px] text-center">
              Chưa có trò chuyện nào
            </Text>
            <Text className="text-slate-500 text-[14px] text-center mt-1.5 leading-5">
              Bắt đầu kết nối với cư dân, quản lý và ban quản trị ký túc xá ngay bây giờ.
            </Text>
            <TouchableOpacity
              onPress={() => setIsModalOpen(true)}
              className="mt-6 px-6 py-3.5 rounded-full active:opacity-90"
              style={{ backgroundColor: Colors.primary }}
            >
              <Text className="text-white font-extrabold text-[14px]">
                Tạo cuộc hội thoại mới
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={filteredConversations}
            renderItem={({ item }) => (
              <ConversationItem item={item} onPress={() => router.push(`/chat/${item.id}`)} />
            )}
            keyExtractor={(item) => item.id}
            refreshing={isRefreshing}
            onRefresh={refresh}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
          />
        )}
      </View>

      <NewChatModal
        visible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        users={users}
        isLoadingUsers={isLoadingUsers}
        onStartDirectChat={handleStartDirectChat}
        onCreateGroupChat={handleCreateGroupChat}
        isCreatingChat={isCreatingChat}
        allowGroupCreation={isAdminOrManager}
      />
    </View>
  );
}
