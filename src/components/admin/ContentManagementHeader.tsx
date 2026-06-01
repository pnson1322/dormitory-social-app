import { Colors } from "@/constants/colors";
import { useCurrentUserRole } from "@/hooks/auth/useCurrentUserRole";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";

interface ContentManagementHeaderProps {
  topInset: number;
}

export function ContentManagementHeader({ topInset }: ContentManagementHeaderProps) {
  const router = useRouter();
  const { role } = useCurrentUserRole();

  const handleGoBack = () => {
    const r = role?.toLowerCase();
    if (r === "admin") {
      router.navigate("/(admin)/menu" as any);
    } else {
      router.navigate("/(manager)/menu" as any);
    }
  };

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
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
        <Pressable
          onPress={handleGoBack}
          style={{
            marginRight: 12,
            height: 40,
            width: 40,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 20,
            backgroundColor: "rgba(255,255,255,0.15)",
          }}
        >
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </Pressable>
        <Text className="text-[26px] font-black text-white">Quản lý nội dung</Text>
      </View>
      <Text className="text-[14px] text-white/85 font-medium" style={{ marginLeft: 52 }}>
        Duyệt bài viết của sinh viên & Đăng thông báo hành chính
      </Text>
    </LinearGradient>
  );
}
