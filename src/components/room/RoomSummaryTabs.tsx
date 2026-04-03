import { Colors } from "@/constants/colors";
import { RoomStatus } from "@/services/room.api";
import { memo } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

type Summary = {
  all: number;
  available: number;
  full: number;
  maintenance: number;
};

type Props = {
  summary: Summary;
  selected: RoomStatus | "";
  onChange: (status: RoomStatus | "") => void;
};

type TabTone = {
  text: string;
  badgeBg: string;
};

function getTabTone(key: RoomStatus | ""): TabTone {
  switch (key) {
    case "AVAILABLE":
      return {
        text: "rgb(16, 185, 129)",
        badgeBg: "rgb(209, 250, 229)",
      };
    case "FULL":
      return {
        text: "rgb(239, 68, 68)",
        badgeBg: "rgb(254, 226, 226)",
      };
    case "MAINTENANCE":
      return {
        text: "rgb(245, 158, 11)",
        badgeBg: "rgb(254, 243, 199)",
      };
    default:
      return {
        text: Colors.primary,
        badgeBg: "#E2E8F0",
      };
  }
}

function RoomSummaryTabsBase({ summary, selected, onChange }: Props) {
  const tabs = [
    { key: "", label: "Tất cả", count: summary.all },
    { key: "AVAILABLE", label: "Còn trống", count: summary.available },
    { key: "FULL", label: "Đầy", count: summary.full },
    { key: "MAINTENANCE", label: "Bảo trì", count: summary.maintenance },
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
          const tone = getTabTone(tab.key);

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
                  style={{
                    color: active ? "#FFFFFF" : tone.text,
                  }}
                >
                  {tab.label}
                </Text>

                <View
                  className="ml-2 min-w-[30px] rounded-full px-2 py-1 items-center"
                  style={{
                    backgroundColor: active
                      ? "rgba(255,255,255,0.25)"
                      : tone.badgeBg,
                  }}
                >
                  <Text
                    className="text-[12px] font-bold"
                    style={{
                      color: active ? "#FFFFFF" : tone.text,
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

export const RoomSummaryTabs = memo(RoomSummaryTabsBase);
