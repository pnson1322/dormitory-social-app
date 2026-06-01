import { ConfirmModal } from "@/components/common/ConfirmModal";
import { Colors } from "@/constants/colors";
import { useCurrentUserRole } from "@/hooks/auth/useCurrentUserRole";
import { useLogout } from "@/hooks/auth/useLogout";
import useProfile from "@/hooks/profile/useProfile";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type MenuItem = {
  name: string;
  label: string;
  description: string;
  iconName: keyof typeof Ionicons.glyphMap;
  color: string;
  iconBg: string;
  route: string;
};

export function MenuScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { role, fullName: tokenFullName, email: tokenEmail, loading: roleLoading } = useCurrentUserRole();
  const { profile, loading: profileLoading } = useProfile();
  const logout = useLogout();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const getInitials = (name: string) => {
    if (!name) return "";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const getRoleLabelAndColor = () => {
    const r = role?.toLowerCase();
    if (r === "admin") return { label: "Admin", bg: "#FEE2E2", text: "#EF4444" };
    if (r === "manager") return { label: "Quản lý", bg: "#FEF3C7", text: "#D97706" };
    return { label: "Sinh viên", bg: "#CCFBF1", text: "#0D9488" };
  };

  const roleInfo = getRoleLabelAndColor();

  const getMenuItems = (): MenuItem[] => {
    const r = role?.toLowerCase();
    if (r === "admin") {
      return [
        {
          name: "content-management",
          label: "Quản lý nội dung",
          description: "Duyệt bài đăng, thông báo, ghim bài",
          iconName: "newspaper-outline",
          color: "#7C3AED",
          iconBg: "rgba(124, 58, 237, 0.08)",
          route: "/(admin)/content-management",
        },
        {
          name: "settings",
          label: "Cài đặt",
          description: "Đổi mật khẩu, cấu hình hệ thống",
          iconName: "settings-outline",
          color: "#475569",
          iconBg: "rgba(71, 85, 105, 0.08)",
          route: "/(admin)/settings",
        },
      ];
    }
    if (r === "manager") {
      return [
        {
          name: "invoices",
          label: "Quản lý hóa đơn",
          description: "Xem hóa đơn, nhập chỉ số điện nước",
          iconName: "receipt-outline",
          color: "#1D4ED8",
          iconBg: "rgba(29, 78, 216, 0.08)",
          route: "/(manager)/invoices",
        },
        {
          name: "content-management",
          label: "Quản lý nội dung",
          description: "Duyệt bài đăng, ghim, ẩn bài",
          iconName: "newspaper-outline",
          color: "#7C3AED",
          iconBg: "rgba(124, 58, 237, 0.08)",
          route: "/(manager)/content-management",
        },
        {
          name: "settings",
          label: "Cài đặt",
          description: "Đổi mật khẩu, bảo mật tài khoản",
          iconName: "settings-outline",
          color: "#475569",
          iconBg: "rgba(71, 85, 105, 0.08)",
          route: "/(manager)/settings",
        },
      ];
    }
    return [
      {
        name: "rooms",
        label: "Tìm phòng",
        description: "Xem danh sách phòng & đăng ký ở",
        iconName: "search-outline",
        color: "#1D4ED8",
        iconBg: "rgba(29, 78, 216, 0.08)",
        route: "/(student)/rooms",
      },
      {
        name: "profile",
        label: "Hồ sơ cá nhân",
        description: "Thông tin cá nhân & liên lạc",
        iconName: "person-outline",
        color: "#059669",
        iconBg: "rgba(5, 150, 105, 0.08)",
        route: "/(student)/profile",
      },
      {
        name: "invoices",
        label: "Hóa đơn",
        description: "Thanh toán tiền phòng & dịch vụ",
        iconName: "receipt-outline",
        color: "#D97706",
        iconBg: "rgba(217, 119, 6, 0.08)",
        route: "/(student)/invoices",
      },
      {
        name: "contract",
        label: "Hợp đồng",
        description: "Xem chi tiết hợp đồng thuê phòng",
        iconName: "document-text-outline",
        color: "#7C3AED",
        iconBg: "rgba(124, 58, 237, 0.08)",
        route: "/(student)/contract",
      },
      {
        name: "incidents",
        label: "Sự cố phòng",
        description: "Báo cáo hư hỏng cơ sở vật chất",
        iconName: "warning-outline",
        color: "#DC2626",
        iconBg: "rgba(220, 38, 38, 0.08)",
        route: "/(student)/incidents",
      },
      {
        name: "settings",
        label: "Cài đặt",
        description: "Đổi mật khẩu & bảo mật tài khoản",
        iconName: "settings-outline",
        color: "#475569",
        iconBg: "rgba(71, 85, 105, 0.08)",
        route: "/(student)/settings",
      },
    ];
  };

  const menuItems = getMenuItems();
  const isLoading = roleLoading || profileLoading;

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F8FAFC" }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const displayName = profile?.fullName || tokenFullName || "Người dùng";
  const displayEmail = profile?.email || tokenEmail || "";
  const cardWidth = (width - 44) / 2;

  return (
    <View style={{ flex: 1, backgroundColor: "#F8FAFC" }}>
      <LinearGradient
        colors={[Colors.primary, "#1D4ED8"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          paddingTop: Math.max(insets.top, 24) + 16,
          paddingBottom: 32,
          paddingHorizontal: 20,
          borderBottomLeftRadius: 32,
          borderBottomRightRadius: 32,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {profile?.avatarUrl ? (
            <Image
              source={{ uri: profile.avatarUrl }}
              style={{ width: 64, height: 64, borderRadius: 32, borderWidth: 2, borderColor: "rgba(255,255,255,0.6)", marginRight: 16 }}
            />
          ) : (
            <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: "white", alignItems: "center", justifyContent: "center", marginRight: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.4)" }}>
              <Text style={{ color: "#1D4ED8", fontSize: 22, fontWeight: "900" }}>
                {getInitials(displayName)}
              </Text>
            </View>
          )}

          <View style={{ flex: 1 }}>
            <Text style={{ color: "white", fontSize: 20, fontWeight: "800", marginBottom: 6 }} numberOfLines={1}>
              {displayName}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <View style={{ paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12, backgroundColor: roleInfo.bg }}>
                <Text style={{ fontSize: 10, fontWeight: "900", letterSpacing: 0.5, color: roleInfo.text }}>
                  {roleInfo.label}
                </Text>
              </View>
              {role?.toLowerCase() === "student" && profile?.room ? (
                <Text style={{ color: "rgba(219,234,254,0.9)", fontSize: 13, fontWeight: "600" }}>
                  Phòng {profile.room.name} • {profile.room.building}
                </Text>
              ) : (
                <Text style={{ color: "rgba(219,234,254,0.9)", fontSize: 12, fontWeight: "500" }} numberOfLines={1}>
                  {displayEmail}
                </Text>
              )}
            </View>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 24, paddingBottom: 40 }}
      >
        <Text style={{ fontSize: 11, fontWeight: "800", color: "#94A3B8", letterSpacing: 1.5, marginBottom: 16, paddingHorizontal: 4 }}>
          DANH MỤC TÍNH NĂNG
        </Text>

        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.name}
              onPress={() => router.push(item.route as any)}
              activeOpacity={0.8}
              style={{
                width: cardWidth,
                borderRadius: 20,
                backgroundColor: "white",
                borderWidth: 1.5,
                borderColor: item.color,
                padding: 16,
                minHeight: 150,
                justifyContent: "space-between",
                shadowColor: "#000000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.04,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              <View style={{
                width: 46,
                height: 46,
                borderRadius: 14,
                backgroundColor: item.iconBg,
                alignItems: "center",
                justifyContent: "center",
              }}>
                <Ionicons name={item.iconName} size={24} color={item.color} />
              </View>

              <View style={{ marginTop: 12 }}>
                <Text style={{ color: "#1E293B", fontSize: 14, fontWeight: "800", marginBottom: 4 }}>
                  {item.label}
                </Text>
                <Text style={{ color: "#64748B", fontSize: 11, lineHeight: 15, fontWeight: "600" }} numberOfLines={2}>
                  {item.description}
                </Text>
              </View>

              <View style={{
                position: "absolute",
                top: 16,
                right: 16,
                width: 24,
                height: 24,
                borderRadius: 12,
                backgroundColor: item.iconBg,
                alignItems: "center",
                justifyContent: "center",
              }}>
                <Ionicons name="chevron-forward" size={12} color={item.color} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 1, backgroundColor: "#E2E8F0", marginVertical: 24 }} />

        <TouchableOpacity
          onPress={() => setShowLogoutConfirm(true)}
          activeOpacity={0.8}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "white",
            borderRadius: 16,
            padding: 16,
            borderWidth: 1,
            borderColor: "#FEE2E2",
            shadowColor: "#EF4444",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.04,
            shadowRadius: 6,
            elevation: 1,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={{ width: 42, height: 42, borderRadius: 12, backgroundColor: "#FEF2F2", alignItems: "center", justifyContent: "center", marginRight: 14 }}>
              <Ionicons name="log-out-outline" size={20} color="#EF4444" />
            </View>
            <View>
              <Text style={{ color: "#1E293B", fontSize: 14, fontWeight: "800" }}>Đăng xuất</Text>
              <Text style={{ color: "#94A3B8", fontSize: 11, marginTop: 2 }}>Đóng phiên đăng nhập tài khoản hiện tại</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward-outline" size={16} color="#EF4444" />
        </TouchableOpacity>
      </ScrollView>

      <ConfirmModal
        visible={showLogoutConfirm}
        title="ĐĂNG XUẤT TÀI KHOẢN"
        message="Bạn có chắc chắn muốn đăng xuất khỏi tài khoản hiện tại không?"
        confirmLabel="Đăng xuất"
        cancelLabel="Hủy"
        type="danger"
        onConfirm={async () => {
          setShowLogoutConfirm(false);
          await logout();
        }}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </View>
  );
}
