export type PostResponse = {
  id: string;
  authorId: string;
  authorName?: string;
  avatarUrl?: string;
  content: string;
  mediaUrls: string[];
  postType: string;
  isPinned: boolean;
  isHidden: boolean;
  createdAt: string;
  likeCount?: number;
  commentCount?: number;
  isLikedByMe?: boolean;
  updatedAt?: string;
};

export type CommunityPostsResponse = {
  pinned: PostResponse[];
  items: PostResponse[];
  nextCursor: string | null;
  hasMore: boolean;
};

export type CreateAnnouncementRequest = {
  content: string;
  isPinned?: boolean;
  files?: string[];
};

export type CreatePostRequest = {
  content: string;
  postType: string;
  files?: string[];
};

export type GetCommunityPostsParams = {
  Cursor?: string;
  PostType?: string;
  PageSize?: number;
};

export type HidePostResponse = {
  id: string;
  isHidden: boolean;
  updatedAt: string;
};

export type ReportReason = "Spam" | "Inappropriate" | "Harassment" | "FakeNews" | "Other";

export type ReportStatus = "Pending" | "Reviewed" | "Dismissed";

export type ReportRequest = {
  reason: number;
  note?: string;
};

export type ReportResponse = {
  id: string;
  postId: string;
  reporterId: string;
  reason: ReportReason;
  note: string | null;
  status: ReportStatus;
  createdAt: string;
};

export type GetReportsParams = {
  status?: string;
  page?: number;
  pageSize?: number;
};

export type ReviewReportRequest = {
  status: "Reviewed" | "Dismissed";
};

export type ReviewReportResponse = {
  id: string;
  postId: string;
  status: "Reviewed" | "Dismissed";
};

export type CommentResponse = {
  id: string;
  postId: string;
  authorId: string;
  authorName?: string;
  avatarUrl?: string;
  content: string;
  likeCount?: number;
  isLikedByMe?: boolean;
  isHidden?: boolean;
  createdAt: string;
  updatedAt?: string;
};

export type CommentsListResponse = {
  items: CommentResponse[];
  nextCursor: string | null;
  hasMore: boolean;
};

export type CreateCommentRequest = {
  content: string;
};

export type GetCommentsParams = {
  cursor?: string;
  pageSize?: number;
};

export type UpdateCommentResponse = {
  id: string;
  content: string;
  updatedAt: string;
};

export type DeleteCommentResponse = {
  id: string;
  isHidden: boolean;
  updatedAt: string;
};

export type LikePostResponse = {
  postId: string;
  isLiked: boolean;
  likeCount: number;
};

export type LikeCommentResponse = {
  commentId: string;
  isLiked: boolean;
  likeCount: number;
};

export type PinPostResponse = {
  postId: string;
  isPinned: boolean;
  updatedAt: string;
};

export type HiddenPostsResponse = {
  items: PostResponse[];
  nextCursor: string | null;
  hasMore: boolean;
};

export type GetHiddenPostsParams = {
  cursor?: string;
  pageSize?: number;
};

