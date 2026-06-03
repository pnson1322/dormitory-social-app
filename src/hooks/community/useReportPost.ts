import { useToast } from "@/components/toast/ToastProvider";
import { reportPost } from "@/services/community/community.api";
import { ReportReason } from "@/services/community/community.types";
import { useEffect, useRef, useState } from "react";
import { Animated } from "react-native";
import { getApiErrorMessage } from "@/services/apiError";

interface UseReportPostProps {
  visible: boolean;
  postId: string;
  onClose: () => void;
}

export function useReportPost({
  visible,
  postId,
  onClose,
}: UseReportPostProps) {
  const { showToast } = useToast();
  const [selectedReason, setSelectedReason] = useState<ReportReason | null>(
    null,
  );
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const scale = useRef(new Animated.Value(0.96)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setSelectedReason(null);
      setNote("");
      setIsSubmitting(false);

      scale.setValue(0.96);
      opacity.setValue(0);
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          speed: 18,
          bounciness: 8,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, scale, opacity]);

  const handleSubmit = async () => {
    if (!selectedReason) return;

    if (note.length > 500) {
      showToast({
        type: "error",
        title: "Ghi chú quá dài",
        message: "Ghi chú không được vượt quá 500 ký tự.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const reasonLabels: Record<ReportReason, string> = {
        Spam: "Spam",
        Inappropriate: "Nội dung không phù hợp",
        Harassment: "Quấy rối / Công kích",
        FakeNews: "Tin giả / Sai sự thật",
        Other: "Lý do khác",
      };

      const reasonText = reasonLabels[selectedReason];
      const userNote = note.trim();
      const finalNote = userNote ? `[Lý do: ${reasonText}] ${userNote}` : `Báo cáo lý do: ${reasonText}`;

      await reportPost(postId, {
        reason: 0,
        note: finalNote,
      });

      showToast({
        type: "success",
        title: "Đã gửi báo cáo",
        message: "Cảm ơn bạn đã đóng góp xây dựng cộng đồng văn minh.",
      });
      onClose();
    } catch (error: any) {
      const errorMessage = getApiErrorMessage(error, "Đã xảy ra lỗi khi gửi báo cáo. Vui lòng thử lại.");

      showToast({
        type: "error",
        title: "Gửi báo cáo thất bại",
        message: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    selectedReason,
    setSelectedReason,
    note,
    setNote,
    isSubmitting,
    scale,
    opacity,
    handleSubmit,
  };
}
