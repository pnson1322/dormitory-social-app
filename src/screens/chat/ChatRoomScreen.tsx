import { AppModal } from "@/components/AppModal";
import { AddMemberModal } from "@/components/chat/AddMemberModal";
import { GroupSettingsModal } from "@/components/chat/GroupSettingsModal";
import { MessageListSkeleton } from "@/components/chat/ChatSkeleton";
import { MessageInput } from "@/components/chat/MessageInput";
import { MessageItem } from "@/components/chat/MessageItem";
import { FullscreenImageViewer } from "@/components/common/FullscreenImageViewer";
import { Colors } from "@/constants/colors";
import { useChatRoom } from "@/hooks/chat/useChatRoom";
import { getFullImageUrl } from "@/utils/incident";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  conversationId: string;
};

export function ChatRoomScreen({ conversationId }: Props) {
  const insets = useSafeAreaInsets();
  const [avatarError, setAvatarError] = useState(false);

  const {
    router,
    currentUserId,
    isAdminOrManager,
    conversation,
    messages,
    isLoading,
    isLoadingMore,
    typingUsers,
    loadMore,
    triggerTyping,
    inputMessage,
    setInputMessage,
    selectedImages,
    isSending,
    isAddMemberModalOpen,
    setIsAddMemberModalOpen,
    users,
    isLoadingUsers,
    isAddingMember,
    revokeModalVisible,
    setRevokeModalVisible,
    selectedMessageIdToRevoke,
    setSelectedMessageIdToRevoke,
    keyboardVisible,
    viewerVisible,
    setViewerVisible,
    viewerImages,
    viewerIndex,
    flatListRef,
    isGroup,
    chatName,
    avatarUrl,
    handlePickImages,
    handleRemoveImage,
    handleSend,
    handleLongPressMessage,
    confirmRevokeMessage,
    openAddMemberModal,
    handleAddUserToGroup,
    handleZoomImage,
    getTypingText,
    retry,
    deleteFailed,
    showScrollToBottom,
    handleScroll,
    scrollToBottom,
    isGroupSettingsOpen,
    setIsGroupSettingsOpen,
    handleGroupUpdated,
  } = useChatRoom(conversationId);

  return (
    <View className="flex-1" style={{ backgroundColor: Colors.background }}>
      <View
        className="px-4 pb-3.5 pt-3 shadow-sm"
        style={{
          paddingTop: insets.top + 6,
          backgroundColor: Colors.primary,
          elevation: 4,
          shadowColor: "#0F172A",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          zIndex: 50,
        }}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 rounded-full items-center justify-center bg-white/10 border border-white/15 mr-3 active:bg-white/20"
            >
              <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
            </TouchableOpacity>

            <View style={{ width: 44, height: 44 }}>
              {avatarUrl && !avatarError ? (
                <Image
                  source={{ uri: getFullImageUrl(avatarUrl) }}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    borderWidth: 1.5,
                    borderColor: "rgba(255,255,255,0.3)",
                  }}
                  onError={() => setAvatarError(true)}
                />
              ) : (
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: "rgba(255,255,255,0.15)",
                    alignItems: "center",
                    justifyContent: "center",
                    borderWidth: 1.5,
                    borderColor: "rgba(255,255,255,0.3)",
                  }}
                >
                  <Ionicons name={isGroup ? "people" : "person"} size={20} color="#FFFFFF" />
                </View>
              )}
            </View>

            <View className="ml-3 flex-1">
              <Text className="text-white font-extrabold text-[16px] tracking-tight" numberOfLines={1}>
                {chatName}
              </Text>
              {typingUsers.length > 0 ? (
                <Text className="text-emerald-300 font-bold text-[12px] italic">
                  {getTypingText()}
                </Text>
              ) : (
                isGroup && (
                  <Text className="text-blue-200 text-[11px] font-semibold mt-0.5">
                    {conversation?.memberCount || 0} thành viên
                  </Text>
                )
              )}
            </View>
          </View>

          {isGroup && (
            <TouchableOpacity
              onPress={() => setIsGroupSettingsOpen(true)}
              className="w-10 h-10 rounded-full bg-white/10 border border-white/15 items-center justify-center active:bg-white/20"
            >
              <Ionicons name="ellipsis-horizontal" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : keyboardVisible ? "height" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 1}
      >
        <View className="flex-1">
          {isLoading && messages.length === 0 ? (
            <MessageListSkeleton />
          ) : (
            <FlatList
              ref={flatListRef}
              data={messages}
              renderItem={({ item, index }) => (
                <MessageItem
                  item={item}
                  index={index}
                  messages={messages}
                  currentUserId={currentUserId || ""}
                  isGroup={isGroup}
                  onLongPress={handleLongPressMessage}
                  onImagePress={handleZoomImage}
                  onRetry={retry}
                  onDeleteFailed={deleteFailed}
                />
              )}
              keyExtractor={(item) => item.id}
              inverted={true}
              onEndReached={loadMore}
              onEndReachedThreshold={0.2}
              onScroll={handleScroll}
              ListFooterComponent={() =>
                isLoadingMore ? (
                  <View className="py-4 items-center">
                    <ActivityIndicator color={Colors.primary} />
                  </View>
                ) : null
              }
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingVertical: 16 }}
            />
          )}

          {showScrollToBottom && (
            <TouchableOpacity
              onPress={scrollToBottom}
              className="absolute bottom-5 right-5 w-12 h-12 rounded-full justify-center items-center z-50 active:opacity-90"
              style={{
                backgroundColor: Colors.primary,
                elevation: 6,
                shadowColor: Colors.primary,
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.3,
                shadowRadius: 5,
              }}
            >
              <Ionicons name="arrow-down" size={24} color="white" />
            </TouchableOpacity>
          )}
        </View>

        <MessageInput
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          selectedImages={selectedImages}
          handlePickImages={handlePickImages}
          handleRemoveImage={handleRemoveImage}
          handleSend={handleSend}
          isSending={isSending}
          triggerTyping={triggerTyping}
          bottomInset={Math.max(insets.bottom, 12)}
        />
      </KeyboardAvoidingView>

      <AppModal
        visible={revokeModalVisible}
        type="confirm"
        title="Thu hồi tin nhắn"
        message="Bạn có chắc chắn muốn thu hồi tin nhắn này? Thao tác này không thể hoàn tác."
        primaryText="Thu hồi"
        secondaryText="Hủy"
        onPrimary={() => {
          if (selectedMessageIdToRevoke) {
            confirmRevokeMessage(selectedMessageIdToRevoke);
          }
          setRevokeModalVisible(false);
          setSelectedMessageIdToRevoke(null);
        }}
        onSecondary={() => {
          setRevokeModalVisible(false);
          setSelectedMessageIdToRevoke(null);
        }}
        onBackdropPress={() => {
          setRevokeModalVisible(false);
          setSelectedMessageIdToRevoke(null);
        }}
      />

      <AddMemberModal
        visible={isAddMemberModalOpen}
        onClose={() => setIsAddMemberModalOpen(false)}
        users={users}
        isLoadingUsers={isLoadingUsers}
        onAddMember={handleAddUserToGroup}
        isAddingMember={isAddingMember}
      />

      <GroupSettingsModal
        visible={isGroupSettingsOpen}
        onClose={() => setIsGroupSettingsOpen(false)}
        conversationId={conversationId}
        currentUserId={currentUserId || ""}
        conversationName={chatName}
        onGroupUpdated={handleGroupUpdated}
        openAddMember={() => {
          setIsGroupSettingsOpen(false);
          openAddMemberModal();
        }}
      />

      <FullscreenImageViewer
        visible={viewerVisible}
        images={viewerImages}
        initialIndex={viewerIndex}
        onClose={() => setViewerVisible(false)}
      />
    </View>
  );
}
