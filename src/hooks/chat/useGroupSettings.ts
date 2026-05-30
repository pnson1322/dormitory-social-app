import { useToast } from "@/components/toast/ToastProvider";
import {
  getConversationMembers,
  removeGroupMember,
  renameGroupConversation,
  transferGroupAdmin,
} from "@/services/chat/chat.api";
import { ConversationMemberItem } from "@/services/chat/chat.types";
import { useEffect, useState } from "react";

interface UseGroupSettingsProps {
  visible: boolean;
  conversationId: string;
  currentUserId: string;
  conversationName: string;
  onGroupUpdated: (newName?: string) => void;
  onClose: () => void;
}

export function useGroupSettings({
  visible,
  conversationId,
  currentUserId,
  conversationName,
  onGroupUpdated,
  onClose,
}: UseGroupSettingsProps) {
  const { showToast } = useToast();
  const [members, setMembers] = useState<ConversationMemberItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [groupName, setGroupName] = useState(conversationName);
  const [isEditingName, setIsEditingName] = useState(false);
  const [confirmKickUser, setConfirmKickUser] = useState<ConversationMemberItem | null>(null);
  const [confirmTransferAdmin, setConfirmTransferAdmin] = useState<ConversationMemberItem | null>(null);
  const [confirmLeaveGroup, setConfirmLeaveGroup] = useState(false);

  useEffect(() => {
    if (visible) {
      fetchMembers();
      setGroupName(conversationName);
      setIsEditingName(false);
    }
  }, [visible, conversationName]);

  const fetchMembers = async () => {
    try {
      setIsLoading(true);
      const res = await getConversationMembers(conversationId);
      setMembers(res.members || []);
    } catch (err) {
      console.error(err);
      showToast({ type: "error", title: "Lỗi", message: "Không thể lấy danh sách thành viên." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRename = async () => {
    if (!groupName.trim() || groupName.trim() === conversationName) {
      setIsEditingName(false);
      setGroupName(conversationName);
      return;
    }
    try {
      setIsSubmitting(true);
      await renameGroupConversation(conversationId, groupName.trim());
      showToast({ type: "success", title: "Thành công", message: "Đã đổi tên nhóm." });
      setIsEditingName(false);
      onGroupUpdated(groupName.trim());
    } catch (err) {
      console.error(err);
      showToast({ type: "error", title: "Lỗi", message: "Không thể đổi tên nhóm. Vui lòng thử lại." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKickMember = async (member: ConversationMemberItem) => {
    try {
      setIsSubmitting(true);
      await removeGroupMember(conversationId, member.userId);
      showToast({ type: "success", title: "Thành công", message: `Đã xóa ${member.fullName} khỏi nhóm.` });
      setMembers((prev) => prev.filter((m) => m.userId !== member.userId));
      onGroupUpdated();
    } catch (err) {
      console.error(err);
      showToast({ type: "error", title: "Lỗi", message: "Không thể xóa thành viên này." });
    } finally {
      setIsSubmitting(false);
      setConfirmKickUser(null);
    }
  };

  const handleTransferAdmin = async (member: ConversationMemberItem) => {
    try {
      setIsSubmitting(true);
      await transferGroupAdmin(conversationId, member.userId);
      showToast({ type: "success", title: "Thành công", message: `Đã chuyển quyền trưởng nhóm cho ${member.fullName}.` });
      await fetchMembers();
      onGroupUpdated();
    } catch (err) {
      console.error(err);
      showToast({ type: "error", title: "Lỗi", message: "Không thể chuyển quyền trưởng nhóm." });
    } finally {
      setIsSubmitting(false);
      setConfirmTransferAdmin(null);
    }
  };

  const handleLeaveGroup = async () => {
    try {
      setIsSubmitting(true);
      await removeGroupMember(conversationId, currentUserId);
      showToast({ type: "success", title: "Thành công", message: "Bạn đã rời khỏi nhóm chat." });
      setConfirmLeaveGroup(false);
      onClose();
      onGroupUpdated();
    } catch (err) {
      console.error(err);
      showToast({
        type: "error",
        title: "Lỗi",
        message: "Không thể rời nhóm. Đảm bảo bạn đã chuyển quyền Admin trước khi rời đi nếu là Admin duy nhất.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isCurrentUserAdmin = members.find((m) => m.userId === currentUserId)?.role === "Admin";

  return {
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
    fetchMembers,
  };
}
