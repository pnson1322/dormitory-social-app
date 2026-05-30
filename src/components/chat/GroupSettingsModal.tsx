import { AppModal } from "@/components/AppModal";
import { Colors } from "@/constants/colors";
import { useGroupSettings } from "@/hooks/chat/useGroupSettings";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GroupActionButtons } from "./GroupActionButtons";
import { GroupMemberRow } from "./GroupMemberRow";
import { GroupNameEditSection } from "./GroupNameEditSection";

interface GroupSettingsModalProps {
  visible: boolean;
  onClose: () => void;
  conversationId: string;
  currentUserId: string;
  conversationName: string;
  onGroupUpdated: (newName?: string) => void;
  openAddMember: () => void;
}

export function GroupSettingsModal({
  visible,
  onClose,
  conversationId,
  currentUserId,
  conversationName,
  onGroupUpdated,
  openAddMember,
}: GroupSettingsModalProps) {
  const {
    members,
    isLoading,
    isSubmitting,
    groupName,
    setGroupName,
    isEditingName,
    setIsEditingName,
    confirmKickUser,
    setConfirmKickUser,
    confirmTransferAdmin,
    setConfirmTransferAdmin,
    confirmLeaveGroup,
    setConfirmLeaveGroup,
    isCurrentUserAdmin,
    handleRename,
    handleKickMember,
    handleTransferAdmin,
    handleLeaveGroup,
  } = useGroupSettings({
    visible,
    conversationId,
    currentUserId,
    conversationName,
    onGroupUpdated,
    onClose,
  });

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View className="flex-1 bg-black/50 justify-end">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="bg-white rounded-t-[32px] w-full"
          style={{ height: "85%" }}
        >
          <View className="flex-row justify-between items-center px-6 py-5 border-b border-slate-100">
            <Text className="text-slate-900 font-black text-[20px]">Thông tin nhóm</Text>
            <TouchableOpacity onPress={onClose} className="w-8 h-8 rounded-full bg-slate-100 items-center justify-center">
              <Ionicons name="close" size={20} color="#475569" />
            </TouchableOpacity>
          </View>

          <View className="flex-1 px-6 mt-4">
            <GroupNameEditSection
              isEditingName={isEditingName}
              setIsEditingName={setIsEditingName}
              groupName={groupName}
              setGroupName={setGroupName}
              conversationName={conversationName}
              handleRename={handleRename}
              isSubmitting={isSubmitting}
            />

            <GroupActionButtons
              openAddMember={openAddMember}
              onLeaveGroup={() => setConfirmLeaveGroup(true)}
            />

            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-slate-800 font-extrabold text-[15px]">Thành viên ({members.length})</Text>
              {isLoading && <ActivityIndicator size="small" color={Colors.primary} />}
            </View>

            {isLoading && members.length === 0 ? (
              <View className="flex-1 items-center justify-center py-10">
                <ActivityIndicator color={Colors.primary} />
              </View>
            ) : (
              <FlatList
                data={members}
                keyExtractor={(item) => item.userId}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 30 }}
                renderItem={({ item }) => (
                  <GroupMemberRow
                    item={item}
                    currentUserId={currentUserId}
                    isCurrentUserAdmin={isCurrentUserAdmin}
                    onTransferAdmin={() => setConfirmTransferAdmin(item)}
                    onKick={() => setConfirmKickUser(item)}
                  />
                )}
              />
            )}
          </View>
          {isSubmitting && (
            <View className="absolute inset-0 bg-white/60 items-center justify-center z-50">
              <ActivityIndicator size="large" color={Colors.primary} />
            </View>
          )}
        </KeyboardAvoidingView>
      </View>

      <AppModal
        visible={!!confirmKickUser}
        type="confirm"
        title="Xóa thành viên"
        message={`Bạn có chắc chắn muốn xóa ${confirmKickUser?.fullName} khỏi nhóm chat này không?`}
        primaryText="Xóa thành viên"
        secondaryText="Hủy"
        onPrimary={() => confirmKickUser && handleKickMember(confirmKickUser)}
        onSecondary={() => setConfirmKickUser(null)}
        onBackdropPress={() => setConfirmKickUser(null)}
      />
      <AppModal
        visible={!!confirmTransferAdmin}
        type="confirm"
        title="Chuyển quyền trưởng nhóm"
        message={`Bạn có chắc chắn muốn chuyển quyền Trưởng Nhóm cho ${confirmTransferAdmin?.fullName}? Bạn sẽ mất quyền quản trị nhóm.`}
        primaryText="Chuyển quyền"
        secondaryText="Hủy"
        onPrimary={() => confirmTransferAdmin && handleTransferAdmin(confirmTransferAdmin)}
        onSecondary={() => setConfirmTransferAdmin(null)}
        onBackdropPress={() => setConfirmTransferAdmin(null)}
      />
      <AppModal
        visible={confirmLeaveGroup}
        type="confirm"
        title="Rời khỏi nhóm"
        message="Bạn có chắc chắn muốn rời khỏi nhóm chat này? Bạn sẽ không thể xem lại lịch sử tin nhắn mới."
        primaryText="Rời nhóm"
        secondaryText="Hủy"
        onPrimary={handleLeaveGroup}
        onSecondary={() => setConfirmLeaveGroup(false)}
        onBackdropPress={() => setConfirmLeaveGroup(false)}
      />
    </Modal>
  );
}
