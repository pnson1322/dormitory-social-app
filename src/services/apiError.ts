import type { AxiosError } from "axios";

export function getApiErrorMessage(err: unknown, fallback = "Có lỗi xảy ra.") {
  const e = err as AxiosError<any>;
  
  const backendMsg = e?.response?.data?.message || e?.response?.data?.error;
  if (typeof backendMsg === "string" && backendMsg.trim()) {
    return backendMsg.trim();
  }

  const status = e?.response?.status;
  if (status) {
    switch (status) {
      case 400:
        return "Yêu cầu không hợp lệ.";
      case 401:
        return "Phiên đăng nhập đã hết hạn.";
      case 403:
        return "Bạn không có quyền thực hiện hành động này.";
      case 404:
        return "Không tìm thấy dữ liệu yêu cầu.";
      case 500:
        return "Lỗi máy chủ nội bộ. Vui lòng thử lại sau.";
      case 502:
      case 503:
      case 504:
        return "Hệ thống đang bảo trì hoặc quá tải. Vui lòng thử lại sau.";
      default:
        break;
    }
  }

  const msg = e?.message;
  if (typeof msg === "string") {
    if (msg.toLowerCase().includes("network error")) {
      return "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.";
    }
    if (msg.toLowerCase().includes("timeout")) {
      return "Kết nối quá hạn. Vui lòng thử lại.";
    }
  }

  return fallback;
}
