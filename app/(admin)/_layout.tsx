import { AppTabsLayout } from "@/components/navigation/AppTabsLayout";

export default function AdminLayout() {
  return (
    <AppTabsLayout
      activeBackgroundColor="rgba(59, 130, 246, 0.18)"
      tabs={[
        {
          name: "users",
          label: "Người dùng",
          iconName: "people-outline",
        },
        {
          name: "permissions",
          label: "Phân quyền",
          iconName: "shield-outline",
        },
        {
          name: "audit-logs",
          label: "Nhật ký",
          iconName: "document-text-outline",
        },
        {
          name: "settings",
          label: "Cài đặt",
          iconName: "settings-outline",
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
