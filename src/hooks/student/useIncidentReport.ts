import { useToast } from "@/components/toast/ToastProvider";
import { submitIncidentReport } from "@/services/incident/incident.api";
import { CreateIncidentRequest } from "@/services/incident/incident.types";
import { useRouter } from "expo-router";
import { useState } from "react";
import { getApiErrorMessage } from "@/services/apiError";

export function useIncidentReport() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  const submitIncident = async (
    roomId: string,
    categoryId: string,
    description: string,
    localImageUris: string[]
  ) => {
    try {
      setIsLoading(true);
      
      const payload: CreateIncidentRequest = {
        RoomId: roomId,
        CategoryId: categoryId,
        Description: description,
        Images: localImageUris,
      };

      await submitIncidentReport(payload);

      showToast({
        type: "success",
        title: "Thành công",
        message: "Đã gửi báo cáo sự cố thành công.",
      });
      
      router.navigate("/(student)/incidents");
      return true;
    } catch (error: any) {
      showToast({
        type: "error",
        title: "Thất bại",
        message: getApiErrorMessage(error, "Không thể gửi báo cáo sự cố."),
      });
      console.log(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    submitIncident,
    isLoading,
  };
}
