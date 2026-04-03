import { AppTabsLayout } from "@/components/navigation/AppTabsLayout";

export default function ManagerLayout() {
  return (
    <AppTabsLayout
      activeBackgroundColor="rgba(59, 130, 246, 0.18)"
      tabs={[
        {
          name: "rooms",
          label: "Phòng",
          iconName: "home-outline",
        },
        {
          name: "residents",
          label: "Cư dân",
          iconName: "people-outline",
        },
        {
          name: "reports",
          label: "Báo cáo",
          iconName: "bar-chart-outline",
        },
        {
          name: "settings",
          label: "Cài đặt",
          iconName: "settings-outline",
        },
        {
          name: "create-room",
          label: "Thêm phòng",
          iconName: "add-outline",
          hidden: true,
        },
        {
          name: "room-details/[id]",
          label: "Chi tiết phòng",
          iconName: "document-text-outline",
          hidden: true,
        },
      ]}
    />
  );
}
