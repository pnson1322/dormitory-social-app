import { AppTabsLayout } from "@/components/navigation/AppTabsLayout";

export default function StudentLayout() {
  return (
    <AppTabsLayout
      tabs={[
        {
          name: "my-room",
          label: "Phòng tôi",
          iconName: "home-outline",
        },
        {
          name: "rooms",
          label: "Tìm phòng",
          iconName: "search-outline",
        },
        {
          name: "profile",
          label: "Hồ sơ",
          iconName: "person-outline",
        },
        {
          name: "community",
          label: "Cộng đồng",
          iconName: "people-outline",
        },
        {
          name: "settings",
          label: "Cài đặt",
          iconName: "settings-outline",
        },
        {
          name: "edit-profile",
          label: "Chỉnh sửa",
          iconName: "create-outline",
          hidden: true,
        },
        {
          name: "rooms/[id]",
          label: "Chi tiết phòng",
          iconName: "information-circle-outline",
          hidden: true,
        },
        {
          name: "rooms/[id]/book",
          label: "Đăng ký phòng",
          iconName: "create-outline",
          hidden: true,
        },
        {
          name: "invoices/index",
          label: "Hóa đơn",
          iconName: "receipt-outline",
          hidden: true,
        },
        {
          name: "contract/index",
          label: "Hợp đồng",
          iconName: "document-text-outline",
          hidden: true,
        },
      ]}
    />
  );
}
