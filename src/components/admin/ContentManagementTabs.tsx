import { Colors } from "@/constants/colors";
import { AdminTab } from "@/hooks/admin/useAdminContentManagement";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";

interface ContentManagementTabsProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
}

export function ContentManagementTabs({ activeTab, setActiveTab }: ContentManagementTabsProps) {
  return (
    <View className="flex-row mx-5 mt-4 mb-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200/50 shadow-sm">
      <Pressable
        onPress={() => setActiveTab("posts")}
        className="flex-1 py-3 rounded-xl flex-row items-center justify-center"
        style={{
          backgroundColor: activeTab === "posts" ? "#FFFFFF" : "transparent",
          shadowColor: activeTab === "posts" ? "#000" : "transparent",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 3,
          elevation: activeTab === "posts" ? 2 : 0,
        }}
      >
        <Ionicons
          name="newspaper-outline"
          size={16}
          color={activeTab === "posts" ? Colors.primary : Colors.textSecondary}
          style={{ marginRight: 6 }}
        />
        <Text
          className="text-[13px] font-bold"
          style={{
            color: activeTab === "posts" ? Colors.primary : Colors.textSecondary,
          }}
        >
          Bài viết
        </Text>
      </Pressable>

      <Pressable
        onPress={() => setActiveTab("announcement")}
        className="flex-1 py-3 rounded-xl flex-row items-center justify-center"
        style={{
          backgroundColor: activeTab === "announcement" ? "#FFFFFF" : "transparent",
          shadowColor: activeTab === "announcement" ? "#000" : "transparent",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 3,
          elevation: activeTab === "announcement" ? 2 : 0,
        }}
      >
        <Ionicons
          name="create-outline"
          size={16}
          color={activeTab === "announcement" ? Colors.primary : Colors.textSecondary}
          style={{ marginRight: 6 }}
        />
        <Text
          className="text-[13px] font-bold"
          style={{
            color: activeTab === "announcement" ? Colors.primary : Colors.textSecondary,
          }}
        >
          Thông báo
        </Text>
      </Pressable>

      <Pressable
        onPress={() => setActiveTab("reports")}
        className="flex-1 py-3 rounded-xl flex-row items-center justify-center"
        style={{
          backgroundColor: activeTab === "reports" ? "#FFFFFF" : "transparent",
          shadowColor: activeTab === "reports" ? "#000" : "transparent",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 3,
          elevation: activeTab === "reports" ? 2 : 0,
        }}
      >
        <Ionicons
          name="flag-outline"
          size={16}
          color={activeTab === "reports" ? Colors.primary : Colors.textSecondary}
          style={{ marginRight: 6 }}
        />
        <Text
          className="text-[13px] font-bold"
          style={{
            color: activeTab === "reports" ? Colors.primary : Colors.textSecondary,
          }}
        >
          Báo cáo
        </Text>
      </Pressable>
    </View>
  );
}
