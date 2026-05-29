import { SettingsSection } from "@/services/settings.types";

export const SETTINGS_SECTIONS: SettingsSection[] = [
  {
    title: "Thông báo",
    icon: "notifications-outline",
    items: [
      {
        type: "toggle",
        icon: "notifications-outline",
        label: "Thông báo đẩy",
        subtitle: "Nhận thông báo về phòng, hóa đơn",
        stateKey: "pushNotifications",
      },
      {
        type: "toggle",
        icon: "mail-outline",
        label: "Thông báo email",
        subtitle: "Nhận email từ hệ thống",
        stateKey: "emailNotifications",
      },
      {
        type: "toggle",
        icon: "megaphone-outline",
        label: "Tin cộng đồng",
        subtitle: "Thông báo bài viết mới",
        stateKey: "communityNotifications",
      },
    ],
  },
  {
    title: "Giao diện",
    icon: "color-palette-outline",
    items: [
      {
        type: "toggle",
        icon: "moon-outline",
        label: "Chế độ tối",
        subtitle: "Giảm ánh sáng xanh vào ban đêm",
        stateKey: "darkMode",
      },
      {
        type: "nav",
        icon: "language-outline",
        label: "Ngôn ngữ",
        subtitle: "Tiếng Việt",
      },
      {
        type: "nav",
        icon: "text-outline",
        label: "Cỡ chữ",
        subtitle: "Mặc định",
      },
    ],
  },
  {
    title: "Bảo mật & Quyền riêng tư",
    icon: "shield-checkmark-outline",
    items: [
      {
        type: "nav",
        icon: "lock-closed-outline",
        label: "Đổi mật khẩu",
      },
      {
        type: "toggle",
        icon: "finger-print-outline",
        label: "Sinh trắc học",
        subtitle: "Đăng nhập bằng vân tay / Face ID",
        stateKey: "biometricLogin",
      },
      {
        type: "toggle",
        icon: "eye-off-outline",
        label: "Ẩn thông tin cá nhân",
        subtitle: "Ẩn SĐT, email với cư dân khác",
        stateKey: "hidePersonalInfo",
      },
    ],
  },
  {
    title: "Hỗ trợ",
    icon: "help-circle-outline",
    items: [
      {
        type: "nav",
        icon: "chatbubble-ellipses-outline",
        label: "Trung tâm hỗ trợ",
      },
      {
        type: "nav",
        icon: "bug-outline",
        label: "Báo lỗi ứng dụng",
      },
      {
        type: "nav",
        icon: "star-outline",
        label: "Đánh giá ứng dụng",
      },
    ],
  },
  {
    title: "Thông tin",
    icon: "information-circle-outline",
    items: [
      {
        type: "info",
        icon: "code-outline",
        label: "Phiên bản",
        value: "1.0.0",
      },
      {
        type: "nav",
        icon: "document-text-outline",
        label: "Điều khoản sử dụng",
      },
      {
        type: "nav",
        icon: "shield-outline",
        label: "Chính sách bảo mật",
      },
    ],
  },
];
