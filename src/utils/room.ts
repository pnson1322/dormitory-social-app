import { Colors } from "@/constants/colors";
import { RoomStatus } from "@/services/room.api";

export function roomStatusToVietnamese(status: RoomStatus) {
  switch (status) {
    case "AVAILABLE":
      return "CÒN TRỐNG";
    case "FULL":
      return "ĐẦY";
    case "MAINTENANCE":
      return "BẢO TRÌ";
    default:
      return status;
  }
}

export function getRoomStatusColors(status: RoomStatus) {
  switch (status) {
    case "AVAILABLE":
      return {
        text: "#10B981",
        background: "#DCFCE7",
        dot: "#10B981",
      };
    case "FULL":
      return {
        text: "#EF4444",
        background: "#FEE2E2",
        dot: "#EF4444",
      };
    case "MAINTENANCE":
      return {
        text: "#F59E0B",
        background: "#FEF3C7",
        dot: "#F59E0B",
      };
    default:
      return {
        text: Colors.textSecondary,
        background: "#E2E8F0",
        dot: Colors.textSecondary,
      };
  }
}

export function getOccupancyBarColor(percent: number) {
  if (percent >= 100) return "#EF4444";
  if (percent >= 70) return "#F59E0B";
  return Colors.accent;
}

export function formatCurrency(value: number) {
  return `${value.toLocaleString("vi-VN")} đ`;
}
