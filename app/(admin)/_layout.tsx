import { AppTabsLayout } from "@/components/navigation/AppTabsLayout";

export default function AdminLayout() {
  return (
    <AppTabsLayout
      activeBackgroundColor="rgba(59, 130, 246, 0.18)"
      initialRouteName="dashboard"
      tabs={[
        {
          name: "dashboard",
          label: "Thống kê",
          iconName: "bar-chart-outline",
        },
        {
          name: "users",
          label: "Người dùng",
          iconName: "people-outline",
        },
        {
          name: "chat",
          label: "Trò chuyện",
          iconName: "chatbubble-ellipses-outline",
        },
        {
          name: "menu",
          label: "Thêm",
          iconName: "menu-outline",
        },
        {
          name: "content-management",
          label: "Nội dung",
          iconName: "newspaper-outline",
          hidden: true,
        },
        {
          name: "settings",
          label: "Cài đặt",
          iconName: "settings-outline",
          hidden: true,
        },
        {
          name: "user-details/[id]",
          label: "Chi tiết",
          iconName: "person-outline",
          hidden: true,
        },
        {
          name: "create-user",
          label: "Tạo user",
          iconName: "add-outline",
          hidden: true,
        },
      ]}
    />
  );
}
