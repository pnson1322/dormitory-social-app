import { ApiResponse, PagingMeta } from "@/services/base.types";
import { http } from "@/services/http";
import {
  CommentResponse,
  CommentsListResponse,
  CommunityPostsResponse,
  CreateAnnouncementRequest,
  CreateCommentRequest,
  CreatePostRequest,
  DeleteCommentResponse,
  GetCommentsParams,
  GetCommunityPostsParams,
  GetHiddenPostsParams,
  GetReportsParams,
  HiddenPostsResponse,
  HidePostResponse,
  LikeCommentResponse,
  LikePostResponse,
  PinPostResponse,
  PostResponse,
  ReportRequest,
  ReportResponse,
  ReviewReportRequest,
  ReviewReportResponse,
  UpdateCommentResponse,
} from "./community.types";

export async function getCommunityPosts(params?: GetCommunityPostsParams) {
  const { data } = await http.get<ApiResponse<CommunityPostsResponse>>("/api/community/posts", { params });
  return data.data;
}

export async function createAnnouncement(body: CreateAnnouncementRequest) {
  const formData = new FormData();
  formData.append("content", body.content);
  if (body.isPinned !== undefined) {
    formData.append("isPinned", String(body.isPinned));
  }

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
      if (ext === "mp4") mimeType = "video/mp4";

      const fileObj = {
        uri,
        name: filename,
        type: mimeType,
      } as any;

      formData.append("files", fileObj);
    });
  }

  const { data } = await http.post<ApiResponse<PostResponse>>(
    "/api/community/announcements",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return data.data;
}

export async function createPost(body: CreatePostRequest) {
  const formData = new FormData();
  formData.append("content", body.content);
  formData.append("postType", String(body.postType));

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
      if (ext === "mp4") mimeType = "video/mp4";

      const fileObj = {
        uri,
        name: filename,
        type: mimeType,
      } as any;

      formData.append("files", fileObj);
    });
  }

  const { data } = await http.post<ApiResponse<PostResponse>>(
    "/api/community/posts",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return data.data;
}

export async function getPostDetail(postId: string) {
  const { data } = await http.get<ApiResponse<PostResponse>>(`/api/posts/${postId}`);
  return data.data;
}

export async function hidePost(id: string) {
  const { data } = await http.patch<ApiResponse<HidePostResponse>>(`/api/community/posts/${id}/hide`);
  return data.data;
}

export async function reportPost(postId: string, body: ReportRequest) {
  const { data } = await http.post<ApiResponse<ReportResponse>>(`/api/posts/${postId}/reports`, body);
  return data.data;
}

export async function getComments(postId: string, params?: GetCommentsParams) {
  const { data } = await http.get<ApiResponse<CommentsListResponse>>(`/api/posts/${postId}/comments`, { params });
  return data.data;
}

export async function createComment(postId: string, body: CreateCommentRequest) {
  const { data } = await http.post<ApiResponse<CommentResponse>>(`/api/posts/${postId}/comments`, body);
  return data.data;
}

export async function updateComment(postId: string, commentId: string, body: { content: string }) {
  const { data } = await http.patch<ApiResponse<UpdateCommentResponse>>(`/api/posts/${postId}/comments/${commentId}`, body);
  return data.data;
}

export async function deleteComment(postId: string, commentId: string) {
  const { data } = await http.delete<ApiResponse<DeleteCommentResponse>>(`/api/posts/${postId}/comments/${commentId}`);
  return data.data;
}

export async function likePost(postId: string) {
  const { data } = await http.post<ApiResponse<LikePostResponse>>(`/api/posts/${postId}/like`);
  return data.data;
}

export async function likeComment(postId: string, commentId: string) {
  const { data } = await http.post<ApiResponse<LikeCommentResponse>>(`/api/posts/${postId}/comments/${commentId}/like`);
  return data.data;
}

export async function getReports(params?: GetReportsParams) {
  const { data } = await http.get<ApiResponse<ReportResponse[]>>("/api/posts/reports", { params });
  return {
    items: data.data,
    meta: data.meta as PagingMeta,
  };
}

export async function reviewReport(reportId: string, body: ReviewReportRequest) {
  const { data } = await http.patch<ApiResponse<ReviewReportResponse>>(`/api/posts/reports/${reportId}/review`, body);
  return data.data;
}

export async function pinPost(postId: string) {
  const { data } = await http.post<ApiResponse<PinPostResponse>>(`/api/posts/${postId}/pin`);
  return data.data;
}

export async function getHiddenPosts(params?: GetHiddenPostsParams) {
  const { data } = await http.get<ApiResponse<HiddenPostsResponse>>("/api/community/posts/hidden", { params });
  return data.data;
}
