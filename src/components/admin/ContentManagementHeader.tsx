import { Colors } from "@/constants/colors";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text } from "react-native";

interface ContentManagementHeaderProps {
  topInset: number;
}

export function ContentManagementHeader({ topInset }: ContentManagementHeaderProps) {
  return (
    <LinearGradient
      colors={[Colors.primary, Colors.primaryLight]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        paddingHorizontal: 20,
        paddingTop: topInset + 10,
        paddingBottom: 24,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
      }}
    >
      <Text className="text-[26px] font-black text-white">Quản lý nội dung</Text>
      <Text className="mt-1 text-[14px] text-white/85 font-medium">
        Duyệt bài viết của sinh viên & Đăng thông báo hành chính
      </Text>
    </LinearGradient>
  );
}
