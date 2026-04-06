import { Colors } from "@/constants/colors";
import { UserRole } from "@/services/user.api";
import { memo } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

type Props = {
  summary: {
    all: number;
    admin: number;
    manager: number;
    seniormanager: number;
    student: number;
  };
  selected: UserRole | "";
  onChange: (role: UserRole | "") => void;
};

type TabTone = {
  text: string;
  badgeBg: string;
};

function getRoleTone(key: UserRole | ""): TabTone {
  switch (key) {
    case "admin":
      return { text: "#1E3A8A", badgeBg: "#DBEAFE" };
    case "manager":
      return { text: "#2563EB", badgeBg: "#DBEAFE" };
    case "seniormanager":
      return { text: "#6366F1", badgeBg: "#EDE9FE" };
    case "student":
      return { text: "#14B8A6", badgeBg: "#CCFBF1" };
    default:
      return { text: Colors.primary, badgeBg: "#E2E8F0" };
  }
}

function UserSummaryTabsBase({ summary, selected, onChange }: Props) {
  const tabs = [
    { key: "", label: "Tất cả", count: summary.all },
    { key: "admin", label: "Admin", count: summary.admin },
    { key: "manager", label: "Quản lý", count: summary.manager },
    { key: "seniormanager", label: "QL cấp cao", count: summary.seniormanager },
    { key: "student", label: "Sinh viên", count: summary.student },
  ] as const;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingRight: 24 }}
    >
      <View className="flex-row gap-3">
        {tabs.map((tab) => {
          const active = selected === tab.key;
          const tone = getRoleTone(tab.key);

          return (
            <Pressable
              key={tab.key || "all"}
              onPress={() => onChange(tab.key)}
              className="rounded-2xl px-4 py-3"
              style={{
                backgroundColor: active ? tone.text : Colors.surface,
                borderWidth: active ? 0 : 1,
                borderColor: Colors.border,
              }}
            >
              <View className="flex-row items-center">
                <Text
                  className="text-[15px] font-bold"
                  style={{ color: active ? "#FFFFFF" : tone.text }}
                >
                  {tab.label}
                </Text>

                <View
                  className="ml-2 min-w-[30px] items-center rounded-full px-2 py-1"
                  style={{
                    backgroundColor: active
                      ? "rgba(255,255,255,0.25)"
                      : tone.badgeBg,
                  }}
                >
                  <Text
                    className="text-[12px] font-bold"
                    style={{ color: active ? "#FFFFFF" : tone.text }}
                  >
                    {tab.count}
                  </Text>
                </View>
              </View>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}

export const UserSummaryTabs = memo(UserSummaryTabsBase);
