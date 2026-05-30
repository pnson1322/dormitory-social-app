import { ApiResponse } from "@/services/base.types";
import { http } from "@/services/http";
import {
  ConversationItem,
  CreateDirectConversationResponse,
  CreateDirectConversationRequest,
  CreateGroupConversationResponse,
  CreateGroupConversationRequest,
  GetMessagesParams,
  MessageResponse,
  MessagesListResponse,
  SendMessageRequest,
  AddGroupMembersResponse,
  GetConversationMembersResponse,
  RemoveGroupMemberResponse,
  RenameGroupConversationResponse,
  TransferGroupAdminResponse,
} from "./chat.types";

export async function getConversations(q?: string) {
  const query = q?.trim();
  const { data } = await http.get<ApiResponse<ConversationItem[]>>("/api/conversations", {
    params: query ? { q: query } : undefined,
  });
  return data.data;
}

export async function createDirectConversation(body: CreateDirectConversationRequest) {
  const { data } = await http.post<ApiResponse<CreateDirectConversationResponse>>(
    "/api/conversations/direct",
    body
  );
  return data.data;
}

export async function createGroupConversation(body: CreateGroupConversationRequest) {
  const { data } = await http.post<ApiResponse<CreateGroupConversationResponse>>(
    "/api/conversations/group",
    body
  );
  return data.data;
}

export async function getMessages(conversationId: string, params?: GetMessagesParams) {
  const { data } = await http.get<ApiResponse<MessagesListResponse>>(
    `/api/conversations/${conversationId}/messages`,
    { params }
  );
  return data.data;
}

export async function sendMessage(conversationId: string, body: SendMessageRequest) {
  const formData = new FormData();
  formData.append("content", body.content);

  if (body.files && body.files.length > 0) {
    const uniqueFiles = Array.from(new Set(body.files));
    uniqueFiles.forEach((uri) => {
      const filename = uri.split("/").pop() || "file.jpg";
      const match = /\.(\w+)$/.exec(filename);
      const ext = match?.[1]?.toLowerCase();

      let mimeType = "image/jpeg";
      if (ext === "png") mimeType = "image/png";
      if (ext === "jpg" || ext === "jpeg") mimeType = "image/jpeg";
      if (ext === "webp") mimeType = "image/webp";
      if (ext === "gif") mimeType = "image/gif";
      if (ext === "pdf") mimeType = "application/pdf";
      if (ext === "mp4") mimeType = "video/mp4";

      const fileObj = {
        uri,
        name: filename,
        type: mimeType,
      } as any;

      formData.append("files", fileObj);
    });
  }

  const { data } = await http.post<ApiResponse<MessageResponse>>(
    `/api/conversations/${conversationId}/messages`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return data.data;
}

export async function deleteMessage(conversationId: string, messageId: string) {
  const { data } = await http.delete<ApiResponse<{ id: string; isDeleted: boolean }>>(
    `/api/conversations/${conversationId}/messages/${messageId}`
  );
  return data.data;
}

export async function addGroupMembers(conversationId: string, memberIds: string[]) {
  const { data } = await http.post<ApiResponse<AddGroupMembersResponse>>(
    `/api/conversations/${conversationId}/members`,
    { memberIds }
  );
  return data.data;
}

export async function addMemberToGroup(conversationId: string, userId: string) {
  return addGroupMembers(conversationId, [userId]);
}

export async function getConversationMembers(conversationId: string) {
  const { data } = await http.get<ApiResponse<GetConversationMembersResponse>>(
    `/api/conversations/${conversationId}/members`
  );
  return data.data;
}

export async function removeGroupMember(conversationId: string, memberId: string) {
  const { data } = await http.delete<ApiResponse<RemoveGroupMemberResponse>>(
    `/api/conversations/${conversationId}/members`,
    { data: { memberId } }
  );
  return data.data;
}

export async function renameGroupConversation(conversationId: string, name: string) {
  const { data } = await http.patch<ApiResponse<RenameGroupConversationResponse>>(
    `/api/conversations/${conversationId}/name`,
    { name }
  );
  return data.data;
}

export async function transferGroupAdmin(conversationId: string, newAdminId: string) {
  const { data } = await http.patch<ApiResponse<TransferGroupAdminResponse>>(
    `/api/conversations/${conversationId}/admin`,
    { newAdminId }
  );
  return data.data;
}
