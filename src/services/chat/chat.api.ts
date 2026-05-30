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
} from "./chat.types";

export async function getConversations() {
  const { data } = await http.get<ApiResponse<ConversationItem[]>>("/api/conversations");
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

// Placeholder for adding members, will update if needed
export async function addMemberToGroup(conversationId: string, userId: string) {
  const { data } = await http.post<ApiResponse<any>>(
    `/api/conversations/${conversationId}/members`,
    { userId }
  );
  return data.data;
}
