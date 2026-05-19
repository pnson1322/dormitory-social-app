import { ApiResponse } from "@/services/base.types";
import { http } from "@/services/http";
import {
  CreateIncidentRequest,
  IncidentResponse,
  IncidentCategoryResponse,
} from "./incident.types";

export async function getIncidentCategories() {
  const { data } = await http.get<ApiResponse<IncidentCategoryResponse[]>>("/api/incident-categories");
  return data.data;
}

export async function getIncidents(params: { RoomId: string; Status?: string; Page?: number; PageSize?: number }) {
  const { data } = await http.get<ApiResponse<IncidentResponse[]>>("/api/incidents", { params });
  return data.data;
}

export async function getMyIncidents(params?: { roomId?: string; status?: string; page?: number; pageSize?: number }) {
  const { data } = await http.get<ApiResponse<IncidentResponse[]>>("/api/incidents/me", { params });
  return data.data;
}

export async function submitIncidentReport(body: CreateIncidentRequest) {
  const formData = new FormData();
  formData.append("RoomId", body.RoomId);
  formData.append("CategoryId", body.CategoryId);
  formData.append("Description", body.Description);

  if (body.Images && body.Images.length > 0) {
    body.Images.forEach((uri) => {
      const filename = uri.split("/").pop() || "image.jpg";
      const match = /\.(\w+)$/.exec(filename);
      const ext = match?.[1]?.toLowerCase();

      let mimeType = "image/jpeg";
      if (ext === "png") mimeType = "image/png";
      if (ext === "jpg" || ext === "jpeg") mimeType = "image/jpeg";
      if (ext === "webp") mimeType = "image/webp";

      formData.append("Images", {
        uri,
        name: filename,
        type: mimeType,
      } as any);
    });
  }

  const { data } = await http.post<ApiResponse<IncidentResponse>>(
    "/api/incidents",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return data.data;
}
