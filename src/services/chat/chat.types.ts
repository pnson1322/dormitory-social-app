export type ConversationItem = {
  id: string;
  type: "Direct" | "Group";
  name?: string;
  avatarUrl?: string | null;
  memberCount: number;
  lastMessage?: string | null;
  lastMessageAt?: string | null;
  createdAt: string;
};

export type CreateDirectConversationRequest = {
  targetUserId: string;
};

export type CreateGroupConversationRequest = {
  name: string;
  memberIds: string[];
};

export type CreateDirectConversationResponse = {
  id: string;
  type: "Direct";
  createdAt: string;
};

export type CreateGroupConversationResponse = {
  id: string;
  type: "Group";
  name: string;
  memberCount: number;
  createdAt: string;
};

export type MessageResponse = {
  id: string;
  conversationId: string;
  senderId: string;
  senderName?: string;
  senderAvatar?: string | null;
  content: string;
  mediaUrls: string[];
  isDeleted?: boolean;
  isMe?: boolean;
  readCount?: number;
  createdAt: string;
  status?: "sending" | "sent" | "failed";
};

export type GetMessagesParams = {
  cursor?: string;
  pageSize?: number;
};

export type MessagesListResponse = {
  items: MessageResponse[];
  nextCursor?: string;
  hasMore: boolean;
};

export type SendMessageRequest = {
  content: string;
  files?: string[];
};

export type AddGroupMembersRequest = {
  memberIds: string[];
};

export type AddGroupMembersResponse = {
  conversationId: string;
  addedMemberIds: string[];
  totalMemberCount: number;
};

export type ConversationMemberItem = {
  userId: string;
  fullName: string;
  avatarUrl: string | null;
  role: string;
  joinedAt: string;
};

export type GetConversationMembersResponse = {
  conversationId: string;
  totalMemberCount: number;
  members: ConversationMemberItem[];
};

export type RemoveGroupMemberRequest = {
  memberId: string;
};

export type RemoveGroupMemberResponse = {
  conversationId: string;
  removedMemberId: string;
  totalMemberCount: number;
};

export type RenameGroupConversationRequest = {
  name: string;
};

export type RenameGroupConversationResponse = {
  conversationId: string;
  name: string;
  updatedAt: string;
};

export type TransferGroupAdminRequest = {
  newAdminId: string;
};

export type TransferGroupAdminResponse = {
  conversationId: string;
  newAdminId: string;
  previousAdminId: string;
};
