import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  useWindowDimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "@/constants/colors";
import { useCurrentUserRole } from "@/hooks/auth/useCurrentUserRole";
import useProfile from "@/hooks/profile/useProfile";
import { useLogout } from "@/hooks/auth/useLogout";
import { ConfirmModal } from "@/components/common/ConfirmModal";

type MenuItem = {
  name: string;
  label: string;
  description: string;
  iconName: keyof typeof Ionicons.glyphMap;
  color: string;
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
          color: "#8B5CF6",
          route: "/(admin)/content-management",
        },
        {
          name: "settings",
          label: "Cài đặt",
          description: "Đổi mật khẩu, cấu hình hệ thống",
          iconName: "settings-outline",
          color: "#64748B",
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
          color: "#3B82F6",
          route: "/(manager)/invoices",
        },
        {
          name: "content-management",
          label: "Quản lý nội dung",
          description: "Duyệt bài đăng, ghim, ẩn bài",
          iconName: "newspaper-outline",
          color: "#8B5CF6",
          route: "/(manager)/content-management",
        },
        {
          name: "settings",
          label: "Cài đặt",
          description: "Đổi mật khẩu, bảo mật tài khoản",
          iconName: "settings-outline",
          color: "#64748B",
          route: "/(manager)/settings",
        },
      ];
    }
    // Student
    return [
      {
        name: "rooms",
        label: "Tìm phòng",
        description: "Xem danh sách phòng & đăng ký ở",
        iconName: "search-outline",
        color: "#3B82F6",
        route: "/(student)/rooms",
      },
      {
        name: "profile",
        label: "Hồ sơ cá nhân",
        description: "Thông tin cá nhân & liên lạc",
        iconName: "person-outline",
        color: "#10B981",
        route: "/(student)/profile",
      },
      {
        name: "invoices",
        label: "Hóa đơn",
        description: "Thanh toán tiền phòng & dịch vụ",
        iconName: "receipt-outline",
        color: "#F59E0B",
        route: "/(student)/invoices",
      },
      {
        name: "contract",
        label: "Hợp đồng",
        description: "Xem chi tiết hợp đồng thuê phòng",
        iconName: "document-text-outline",
        color: "#8B5CF6",
        route: "/(student)/contract",
      },
      {
        name: "incidents",
        label: "Sự cố phòng",
        description: "Báo cáo hư hỏng cơ sở vật chất",
        iconName: "warning-outline",
        color: "#EF4444",
        route: "/(student)/incidents",
      },
      {
        name: "settings",
        label: "Cài đặt",
        description: "Đổi mật khẩu & bảo mật tài khoản",
        iconName: "settings-outline",
        color: "#64748B",
        route: "/(student)/settings",
      },
    ];
  };

  const menuItems = getMenuItems();
  const isLoading = roleLoading || profileLoading;

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-slate-50">
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const displayName = profile?.fullName || tokenFullName || "Người dùng";
  const displayEmail = profile?.email || tokenEmail || "";

  return (
    <View className="flex-1 bg-slate-50">
      {/* Premium Header with Linear Gradient and ample safe space */}
      <LinearGradient
        colors={[Colors.primary, "#1D4ED8"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          paddingTop: Math.max(insets.top, 24) + 16,
          paddingBottom: 28,
          paddingHorizontal: 20,
        }}
        className="rounded-b-[32px] shadow-lg shadow-blue-900/20"
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            {/* Avatar */}
            {profile?.avatarUrl ? (
              <Image
                source={{ uri: profile.avatarUrl }}
                className="w-16 h-16 rounded-full border-2 border-white/60 mr-4"
              />
            ) : (
              <View className="w-16 h-16 rounded-full bg-white border border-slate-100 items-center justify-center mr-4 shadow-sm shadow-slate-300">
                <Text className="text-blue-900 text-[20px] font-extrabold">
                  {getInitials(displayName)}
                </Text>
              </View>
            )}

            {/* Profile Text */}
            <View className="flex-1">
              <Text className="text-white text-[22px] font-extrabold mb-1" numberOfLines={1}>
                {displayName}
              </Text>
              <View className="flex-row items-center flex-wrap gap-2">
                <View
                  className="px-2.5 py-0.5 rounded-full"
                  style={{ backgroundColor: roleInfo.bg }}
                >
                  <Text className="text-[10px] font-black uppercase tracking-wider" style={{ color: roleInfo.text }}>
                    {roleInfo.label}
                  </Text>
                </View>
                {role?.toLowerCase() === "student" && profile?.room ? (
                  <Text className="text-blue-100 text-[13px] font-semibold">
                    Phòng {profile.room.name} • {profile.room.building}
                  </Text>
                ) : (
                  <Text className="text-blue-100/90 text-[12px] font-medium" numberOfLines={1}>
                    {displayEmail}
                  </Text>
                )}
              </View>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Grid Menu Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 40 }}
      >
        <Text className="text-slate-800 text-[16px] font-extrabold mb-4 px-1">
          DANH MỤC TÍNH NĂNG
        </Text>

        <View className="flex-row flex-wrap justify-between">
          {menuItems.map((item) => {
            const cardWidth = (width - 50) / 2; // 20 padding left/right + 10 gap = 50 total margins
            return (
              <TouchableOpacity
                key={item.name}
                onPress={() => router.push(item.route as any)}
                activeOpacity={0.7}
                style={{ width: cardWidth }}
                className="bg-white rounded-2xl p-4 mb-4 border border-slate-100/60 shadow-sm shadow-slate-100 justify-between min-h-[140px]"
              >
                {/* Icon Circle */}
                <View
                  className="w-10 h-10 rounded-xl justify-center items-center mb-3"
                  style={{ backgroundColor: `${item.color}15` }}
                >
                  <Ionicons name={item.iconName} size={20} color={item.color} />
                </View>

                {/* Text Content */}
                <View>
                  <Text className="text-slate-800 text-[14px] font-bold mb-1.5">
                    {item.label}
                  </Text>
                  <Text className="text-slate-400 text-[11px] leading-[15px]" numberOfLines={2}>
                    {item.description}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Divider */}
        <View className="h-[1px] bg-slate-200/60 my-6" />

        {/* Logout Button */}
        <TouchableOpacity
          onPress={() => setShowLogoutConfirm(true)}
          activeOpacity={0.7}
          className="flex-row items-center justify-between bg-white border border-red-100 rounded-2xl p-4 shadow-sm shadow-red-50/50"
        >
          <View className="flex-row items-center">
            <View className="w-10 h-10 rounded-xl bg-rose-50 justify-center items-center mr-3.5">
              <Ionicons name="log-out-outline" size={20} color="#EF4444" />
            </View>
            <View>
              <Text className="text-slate-800 text-[14px] font-bold">
                Đăng xuất
              </Text>
              <Text className="text-slate-400 text-[11px] mt-0.5">
                Đóng phiên đăng nhập tài khoản hiện tại
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward-outline" size={16} color="#EF4444" />
        </TouchableOpacity>
      </ScrollView>

      {/* Confirm Modal */}
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
