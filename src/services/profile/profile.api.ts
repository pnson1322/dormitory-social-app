import { ApiResponse } from "@/services/base.types";
import { http } from "@/services/http";
import {
  ProfileData,
  UpdateProfileBody,
  UploadAvatarResponse,
} from "./profile.types";

export async function getMyProfile() {
  const { data } = await http.get<ApiResponse<ProfileData>>("/api/profile/me");
  return data.data;
}

export async function updateMyProfile(body: UpdateProfileBody) {
  const { data } = await http.put<ApiResponse<ProfileData>>(
    "/api/profile/me",
    body,
  );
  return data.data;
}

export async function uploadMyAvatar(uri: string) {
  const formData = new FormData();

  const filename = uri.split("/").pop() || "avatar.jpg";
  const match = /\.(\w+)$/.exec(filename);
  const ext = match?.[1]?.toLowerCase();

  let mimeType = "image/jpeg";
  if (ext === "png") mimeType = "image/png";
  if (ext === "jpg" || ext === "jpeg") mimeType = "image/jpeg";
  if (ext === "webp") mimeType = "image/webp";

  formData.append("file", {
    uri,
    name: filename,
    type: mimeType,
  } as any);

  const { data } = await http.post<ApiResponse<UploadAvatarResponse>>(
    "/api/profile/me/avatar",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return data.data;
}
