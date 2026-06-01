import { useToast } from "@/components/toast/ToastProvider";
import { useFeeTemplates } from "@/hooks/student/useFeeTemplates";
import { useStudentRoomDetails } from "@/hooks/student/useStudentRoomDetails";
import { getApiErrorMessage } from "@/services/apiError";
import { createBooking } from "@/services/booking/booking.api";
import { getAuthTokens } from "@/storage/authStorage";
import { getUserInfoFromToken } from "@/utils/jwt";
import { getUpcomingTerms } from "@/utils/term";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";

export function useRoomBooking(roomId: string) {
  const router = useRouter();
  const { showToast } = useToast();

  const { room, loading: roomLoading, error: roomError } = useStudentRoomDetails(roomId);
  const { fees, loading: feesLoading, error: feesError } = useFeeTemplates();

  const terms = useMemo(() => getUpcomingTerms(), []);
  
  const [selectedTerm, setSelectedTerm] = useState<string>(terms[0]?.id || "");
  const [selectedOptionalFees, setSelectedOptionalFees] = useState<string[]>([]);
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (terms.length > 0 && !selectedTerm) {
      setSelectedTerm(terms[0].id);
    }
  }, [terms, selectedTerm]);

  const loading = roomLoading || feesLoading;
  const error = roomError || feesError;

  const mandatoryFees = useMemo(() => fees.filter(f => f.isMandatory), [fees]);
  const optionalFees = useMemo(() => fees.filter(f => !f.isMandatory), [fees]);

  const mandatoryTotal = useMemo(() => mandatoryFees.reduce((sum, f) => sum + f.amount, 0), [mandatoryFees]);
  const optionalTotal = useMemo(() => 
    optionalFees
      .filter(f => selectedOptionalFees.includes(f.feeCode))
      .reduce((sum, f) => sum + f.amount, 0), 
  [optionalFees, selectedOptionalFees]);

  const estimatedInitialTotal = (room?.basePrice || 0) + mandatoryTotal + optionalTotal;

  const toggleOptionalFee = (feeCode: string) => {
    setSelectedOptionalFees(prev => 
      prev.includes(feeCode) 
        ? prev.filter(code => code !== feeCode)
        : [...prev, feeCode]
    );
  };

  const goBack = () => {
    router.navigate(`/(student)/rooms/${roomId}`);
  };

  const submitBooking = async () => {
    if (!room) return;
    
    try {
      setIsSubmitting(true);
      const { accessToken } = await getAuthTokens();
      if (!accessToken) throw new Error("Chưa đăng nhập");
      const userInfo = getUserInfoFromToken(accessToken);
      if (!userInfo?.userId) throw new Error("Không tìm thấy thông tin user");

      const payload = {
        roomId: room.id,
        userId: userInfo.userId,
        termName: selectedTerm,
        selectedOptionalFeeCodes: selectedOptionalFees.length > 0 ? selectedOptionalFees : null,
      };

      await createBooking(payload);

      showToast({
        type: "success",
        title: "Đăng ký thành công",
        message: "Yêu cầu đăng ký phòng của bạn đã được gửi đi.",
      });

      router.replace("/(student)/my-room");
    } catch (err: any) {
      const msg = getApiErrorMessage(err);
      showToast({
        type: "error",
        title: "Đăng ký thất bại",
        message: msg,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    room,
    loading,
    error,
    terms,
    selectedTerm,
    setSelectedTerm,
    mandatoryFees,
    optionalFees,
    selectedOptionalFees,
    toggleOptionalFee,
    estimatedInitialTotal,
    agreed,
    setAgreed,
    isSubmitting,
    goBack,
    submitBooking
  };
}
