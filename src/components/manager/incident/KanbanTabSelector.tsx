import React, { useEffect, useRef } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ManagerTabStatus } from "@/hooks/manager/useManagerIncidents";

interface TabConfig {
  key: ManagerTabStatus;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

const TABS: TabConfig[] = [
  { key: "Pending", label: "Mới", icon: "alert-circle-outline", color: "#F59E0B" },
  { key: "InProgress", label: "Đang làm", icon: "play-circle-outline", color: "#3B82F6" },
  { key: "Resolved", label: "Đã xong", icon: "checkmark-circle-outline", color: "#10B981" },
  { key: "Rejected", label: "Từ chối", icon: "close-circle-outline", color: "#EF4444" },
];

interface Props {
  activeTab: ManagerTabStatus;
  onTabPress: (tabKey: ManagerTabStatus, index: number) => void;
  incidentsMap: Record<ManagerTabStatus, any[]>;
}

export function KanbanTabSelector({ activeTab, onTabPress, incidentsMap }: Props) {
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    const idx = TABS.findIndex(t => t.key === activeTab);
    if (idx !== -1) {
      let targetX = 0;
      if (idx === 2) targetX = 60;
      if (idx === 3) targetX = 180;

      scrollRef.current?.scrollTo({
        x: targetX,
        animated: true,
      });
    }
  }, [activeTab]);

  return (
    <View className="bg-white border-b border-slate-100 py-3">
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}
      >
        {TABS.map((tab, idx) => {
          const isActive = activeTab === tab.key;
          const count = (incidentsMap[tab.key] || []).length;

          return (
            <Pressable
              key={tab.key}
              onPress={() => onTabPress(tab.key, idx)}
              className="items-center py-2 px-4 rounded-full flex-row justify-center"
              style={{
                backgroundColor: isActive ? `${tab.color}15` : "#F8FAFC",
                borderWidth: 1,
                borderColor: isActive ? `${tab.color}35` : "#E2E8F0",
              }}
            >
              <Ionicons
                name={tab.icon}
                size={18}
                color={isActive ? tab.color : "#64748B"}
              />
              <Text
                className="text-[15.5px] ml-1.5 font-bold"
                style={{ color: isActive ? tab.color : "#475569" }}
              >
                {tab.label}
              </Text>

              {count > 0 && (
                <View
                  className="ml-2 px-2 py-0.5 rounded-full items-center justify-center min-w-[22px]"
                  style={{
                    backgroundColor: isActive ? tab.color : "#94A3B8",
                  }}
                >
                  <Text className="text-[11px] font-black text-white">
                    {count}
                  </Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
