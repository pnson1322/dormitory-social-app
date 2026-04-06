import { Colors } from "@/constants/colors";
import { memo } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

type Props = {
  selected: "" | "active" | "locked";
  counts: {
    active: number;
    locked: number;
  };
  onChange: (status: "" | "active" | "locked") => void;
};

function UserStatusTabsBase({ selected, counts, onChange }: Props) {
  const tabs = [
    { key: "", label: "Tất cả", count: counts.active + counts.locked },
    { key: "active", label: "Hoạt động", count: counts.active },
    { key: "locked", label: "Đã khóa", count: counts.locked },
  ] as const;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="mt-4"
      contentContainerStyle={{ paddingRight: 24 }}
    >
      <View className="flex-row gap-3">
        {tabs.map((tab) => {
          const active = selected === tab.key;

          const activeBg =
            tab.key === "active"
              ? "#DCFCE7"
              : tab.key === "locked"
                ? "#FEE2E2"
                : Colors.primary;

          const activeText =
            tab.key === "active"
              ? "#16A34A"
              : tab.key === "locked"
                ? "#DC2626"
                : "#FFFFFF";

          const inactiveText =
            tab.key === "active"
              ? "#16A34A"
              : tab.key === "locked"
                ? "#DC2626"
                : Colors.textPrimary;

          return (
            <Pressable
              key={tab.key || "all-status"}
              onPress={() => onChange(tab.key)}
              className="rounded-2xl px-4 py-3"
              style={{
                backgroundColor: active ? activeBg : Colors.surface,
                borderWidth: active ? 0 : 1,
                borderColor: Colors.border,
              }}
            >
              <View className="flex-row items-center">
                <Text
                  numberOfLines={1}
                  className="text-[15px] font-bold"
                  style={{ color: active ? activeText : inactiveText }}
                >
                  {tab.label}
                </Text>

                <View
                  className="ml-2 min-w-[28px] items-center rounded-full px-2 py-1"
                  style={{
                    backgroundColor: active
                      ? "rgba(255,255,255,0.22)"
                      : "#E2E8F0",
                  }}
                >
                  <Text
                    className="text-[12px] font-bold"
                    style={{
                      color: active
                        ? activeText
                        : tab.key === "active"
                          ? "#16A34A"
                          : tab.key === "locked"
                            ? "#DC2626"
                            : Colors.textSecondary,
                    }}
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

export const UserStatusTabs = memo(UserStatusTabsBase);
