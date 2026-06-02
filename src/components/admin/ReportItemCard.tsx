import { Colors } from "@/constants/colors";
import { ReportResponse, ReportStatus } from "@/services/community/community.types";
import { formatDate, getInitials } from "@/utils/communityUtils";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

function parseReport(report: ReportResponse) {
  let displayReason = String(report.reason || "Spam");
  let displayNote = report.note || "Không có ghi chú thêm.";

  if (report.note && report.note.startsWith("[Lý do: ")) {
    const match = report.note.match(/^\[Lý do:\s*([^\]]+)\]\s*(.*)$/);
    if (match) {
      displayReason = match[1];
      displayNote = match[2] || "Không có ghi chú thêm.";
    }
  } else if (report.note && report.note.startsWith("Báo cáo lý do: ")) {
    displayReason = report.note.replace("Báo cáo lý do: ", "");
    displayNote = "Không có ghi chú thêm.";
  }
  return { displayReason, displayNote };
}

function getReasonBadgeColors(reason: string) {
  const r = reason.toLowerCase();
  if (r.includes("spam")) return { bg: "#FEE2E2", text: "#EF4444" };
  if (r.includes("phù hợp")) return { bg: "#FFEDD5", text: "#F97316" };
  if (r.includes("quấy rối") || r.includes("công kích")) return { bg: "#F3E8FF", text: "#A855F7" };
  if (r.includes("tin giả") || r.includes("sự thật")) return { bg: "#FEF3C7", text: "#D97706" };
  return { bg: "#F1F5F9", text: "#64748B" };
}

interface ReportItemCardProps {
  item: ReportResponse;
  isLoadingPost: boolean;
  onViewPost: (postId: string) => void;
  onReview: (reportId: string, status: "Reviewed" | "Dismissed") => Promise<void>;
}

export function ReportItemCard({ item, isLoadingPost, onViewPost, onReview }: ReportItemCardProps) {
  const { displayReason, displayNote } = parseReport(item);
  const badgeColors = getReasonBadgeColors(displayReason);
  const initials = "AD";

  return (
    <View className="bg-white rounded-2xl p-4 mb-4 border border-slate-100 shadow-sm">
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center flex-1 mr-2">
          <View
            className="w-8 h-8 rounded-full justify-center items-center mr-2.5"
            style={{ backgroundColor: Colors.primary + "15" }}
          >
            <Text className="font-bold text-[13px]" style={{ color: Colors.primary }}>
              {initials}
            </Text>
          </View>
          <View className="flex-1">
            <Text className="font-bold text-[14px] text-slate-800" numberOfLines={1}>
              Người dùng ẩn danh
            </Text>
            <Text className="text-[11px] text-slate-400 mt-0.5">
              {formatDate(item.createdAt)}
            </Text>
          </View>
        </View>

        {item.status !== "Pending" && (
          <View
            className="px-2.5 py-0.5 rounded-full"
            style={{ backgroundColor: item.status === "Reviewed" ? "#EFF6FF" : "#F1F5F9" }}
          >
            <Text
              className="text-[10px] font-bold"
              style={{ color: item.status === "Reviewed" ? "#3B82F6" : "#64748B" }}
            >
              {item.status === "Reviewed" ? "Đã duyệt" : "Đã bỏ qua"}
            </Text>
          </View>
        )}
      </View>

      <View className="flex-row mb-2">
        <View className="px-2.5 py-1 rounded-lg" style={{ backgroundColor: badgeColors.bg }}>
          <Text className="text-[11px] font-bold" style={{ color: badgeColors.text }}>
            {displayReason}
          </Text>
        </View>
      </View>

      <Text className="text-[14px] text-slate-600 leading-5 mb-4">{displayNote}</Text>

      <View className="h-px bg-slate-100 mb-3" />

      <View className="flex-row items-center justify-between">
        <TouchableOpacity
          onPress={() => onViewPost(item.postId)}
          disabled={isLoadingPost}
          activeOpacity={0.7}
          className="flex-row items-center px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-100 active:bg-slate-100"
        >
          {isLoadingPost ? (
            <ActivityIndicator size="small" color={Colors.primary} style={{ marginRight: 4 }} />
          ) : (
            <Ionicons name="eye-outline" size={14} color={Colors.primary} style={{ marginRight: 4 }} />
          )}
          <Text className="text-[11px] font-bold" style={{ color: Colors.primary }}>
            Xem bài đăng
          </Text>
        </TouchableOpacity>

        {item.status === "Pending" && (
          <View className="flex-row gap-1.5">
            <TouchableOpacity
              onPress={() => onReview(item.id, "Dismissed")}
              activeOpacity={0.7}
              className="flex-row items-center px-2 py-1.5 rounded-xl bg-slate-50 border border-slate-200 active:bg-slate-100"
            >
              <Ionicons name="close-circle-outline" size={14} color="#64748B" style={{ marginRight: 3 }} />
              <Text className="text-[11px] font-bold text-slate-600">Bỏ qua</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => onReview(item.id, "Reviewed")}
              activeOpacity={0.7}
              className="flex-row items-center px-2.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-100 active:bg-emerald-100"
            >
              <Ionicons name="checkmark-circle-outline" size={14} color="#10B981" style={{ marginRight: 3 }} />
              <Text className="text-[11px] font-bold text-emerald-600">Duyệt vi phạm</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}
