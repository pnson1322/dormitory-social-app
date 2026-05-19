import { ENV } from "@/config/env";

export function getCategoryStyle(name?: string) {
  const normalized = (name || "").toLowerCase();
  if (normalized.includes("điện")) {
    return { icon: "flash" as const, color: "#F59E0B" };
  }
  if (normalized.includes("nước")) {
    return { icon: "water" as const, color: "#3B82F6" };
  }
  if (
    normalized.includes("nội thất") ||
    normalized.includes("giường") ||
    normalized.includes("tủ") ||
    normalized.includes("bàn") ||
    normalized.includes("ghế")
  ) {
    return { icon: "bed" as const, color: "#8B5CF6" };
  }
  return { icon: "help-circle" as const, color: "#94A3B8" };
}

export function getFullImageUrl(url?: string | null) {
  if (!url) return "";
  const trimmed = url.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  const cleanUrl = trimmed.startsWith("/") ? trimmed.substring(1) : trimmed;
  const cleanBase = ENV.API_BASE_URL.endsWith("/") ? ENV.API_BASE_URL : `${ENV.API_BASE_URL}/`;
  return `${cleanBase}${cleanUrl}`;
}

export function getRoomLabel(roomId: string) {
  if (roomId === "3fa85f64-5717-4562-b3fc-2c963f66afa6") {
    return "Phòng 101 (Tòa A1)";
  }
  return `Phòng ${roomId.substring(0, 5).toUpperCase()}`;
}
