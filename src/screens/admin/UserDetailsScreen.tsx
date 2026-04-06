import { AppButton } from "@/components/AppButton";
import { useToast } from "@/components/toast/ToastProvider";
import { UserRoleBadge } from "@/components/user/UserRoleBadge";
import { UserStatusBadge } from "@/components/user/UserStatusBadge";
import { Colors } from "@/constants/colors";
import { emitUserListRefresh } from "@/hooks/user/userRefreshBus";
import { useUserDetails } from "@/hooks/user/useUserDetails";
import {
  updateUserRole,
  updateUserStatus,
  UserRole,
  UserStatus,
} from "@/services/user.api";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const ROLE_OPTIONS: {
  value: UserRole;
  label: string;
  desc: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconBg: string;
  iconColor: string;
}[] = [
  {
    value: "admin",
    label: "Admin",
    desc: "Toàn quyền hệ thống",
    icon: "shield-outline",
    iconBg: "#EEF2FF",
    iconColor: "#1E3A8A",
  },
  {
    value: "manager",
    label: "Quản lý",
    desc: "Quản lý phòng và cư dân",
    icon: "people-outline",
    iconBg: "#EFF6FF",
    iconColor: "#3B82F6",
  },
  {
    value: "seniormanager",
    label: "QL cấp cao",
    desc: "Quản lý vận hành cấp cao",
    icon: "briefcase-outline",
    iconBg: "#EDE9FE",
    iconColor: "#6366F1",
  },
  {
    value: "student",
    label: "Sinh viên",
    desc: "Quyền truy cập cơ bản",
    icon: "school-outline",
    iconBg: "#ECFDF5",
    iconColor: "#14B8A6",
  },
];

function normalizeRole(role?: string | null): UserRole {
  const value = String(role || "")
    .trim()
    .toLowerCase();
  if (value === "admin") return "admin";
  if (value === "manager") return "manager";
  if (value === "seniormanager") return "seniormanager";
  return "student";
}

function formatDate(value?: string | null) {
  if (!value) return "--";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getInitials(name?: string) {
  const safeName = (name || "").trim();
  if (!safeName) return "U";

  return safeName
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

function Avatar({
  fullName,
  avatarUrl,
}: {
  fullName?: string;
  avatarUrl?: string | null;
}) {
  const [failed, setFailed] = useState(false);

  if (avatarUrl?.trim() && !failed) {
    return (
      <Image
        source={{ uri: avatarUrl.trim() }}
        className="h-[88px] w-[88px] rounded-full"
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <View
      className="h-[88px] w-[88px] items-center justify-center rounded-full"
      style={{ backgroundColor: "#E2E8F0" }}
    >
      <Text
        className="text-[28px] font-extrabold"
        style={{ color: Colors.primary }}
      >
        {getInitials(fullName)}
      </Text>
    </View>
  );
}

export function UserDetailsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { showToast } = useToast();
  const { id } = useLocalSearchParams();

  const { user, loading, error, refetch, setUser } = useUserDetails(
    id as string,
  );

  const currentStatus = useMemo<UserStatus>(() => {
    return user?.isActive ? "active" : "locked";
  }, [user?.isActive]);

  const [draftRole, setDraftRole] = useState<UserRole>("student");
  const [draftStatus, setDraftStatus] = useState<UserStatus>("locked");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    setDraftRole(normalizeRole(user.role));
    setDraftStatus(user.isActive ? "active" : "locked");
  }, [user]);

  const hasChanges = useMemo(() => {
    if (!user) return false;
    return (
      draftRole !== normalizeRole(user.role) || draftStatus !== currentStatus
    );
  }, [user, draftRole, draftStatus, currentStatus]);

  async function handleSaveChanges() {
    if (!user || !hasChanges) return;

    try {
      setSaving(true);

      if (draftRole !== normalizeRole(user.role)) {
        await updateUserRole(user.id, draftRole);
      }

      if (draftStatus !== currentStatus) {
        await updateUserStatus(user.id, draftStatus);
      }

      setUser((prev) =>
        prev
          ? {
              ...prev,
              role: draftRole,
              isActive: draftStatus === "active",
            }
          : prev,
      );

      emitUserListRefresh();

      showToast({
        type: "success",
        title: "Cập nhật thành công",
        message: "Thông tin người dùng đã được cập nhật.",
      });

      await refetch();
    } catch (err: any) {
      showToast({
        type: "error",
        title: "Cập nhật thất bại",
        message: err?.message || "Không thể cập nhật người dùng.",
      });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !user) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
        <View
          className="px-5 pb-5"
          style={{
            paddingTop: insets.top - 10,
            backgroundColor: Colors.primary,
          }}
        >
          <View className="flex-row items-center">
            <Pressable
              onPress={() => router.back()}
              className="mr-4 h-11 w-11 items-center justify-center rounded-full bg-white/15"
            >
              <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
            </Pressable>

            <Text className="text-[24px] font-extrabold text-white">
              Chi tiết người dùng
            </Text>
          </View>
        </View>

        <View className="flex-1 items-center justify-center px-6">
          <Text
            className="text-center text-[16px] font-semibold"
            style={{ color: Colors.textPrimary }}
          >
            {error || "Không tải được chi tiết người dùng."}
          </Text>

          <Pressable
            onPress={() => void refetch()}
            className="mt-4 h-12 items-center justify-center rounded-2xl px-5"
            style={{ backgroundColor: Colors.primary }}
          >
            <Text className="font-bold text-white">Thử lại</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <View
        className="px-5 pb-5"
        style={{
          paddingTop: insets.top - 10,
          backgroundColor: Colors.primary,
        }}
      >
        <View className="flex-row items-center">
          <Pressable
            onPress={() => router.back()}
            className="mr-4 h-11 w-11 items-center justify-center rounded-full bg-white/15"
          >
            <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
          </Pressable>

          <Text className="text-[24px] font-extrabold text-white">
            Chi tiết người dùng
          </Text>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-5 pt-5"
        contentContainerStyle={{ paddingBottom: 120 }}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => void refetch()}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-5">
          <View
            className="rounded-[24px] p-5"
            style={{
              backgroundColor: Colors.surface,
              borderWidth: 1,
              borderColor: Colors.border,
              shadowColor: "#000",
              shadowOpacity: 0.04,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 2 },
              elevation: 2,
            }}
          >
            <View className="flex-row">
              <View className="mr-4">
                <View>
                  <Avatar fullName={user.fullName} avatarUrl={user.avatarUrl} />
                  <View
                    className="absolute bottom-0 right-0 h-5 w-5 rounded-full border-[3px] border-white"
                    style={{
                      backgroundColor:
                        draftStatus === "active" ? "#10B981" : "#EF4444",
                    }}
                  />
                </View>
              </View>

              <View className="flex-1">
                <Text
                  className="text-[28px] font-extrabold"
                  style={{ color: Colors.textPrimary }}
                >
                  {user.fullName}
                </Text>

                <View className="mt-3 flex-row flex-wrap gap-2">
                  <UserRoleBadge role={draftRole} />
                  <UserStatusBadge status={draftStatus} />
                </View>

                <View className="mt-4 flex-row items-center">
                  <Ionicons
                    name="mail-outline"
                    size={18}
                    color={Colors.textSecondary}
                  />
                  <Text
                    className="ml-2 text-[15px]"
                    style={{ color: Colors.textSecondary }}
                  >
                    {user.email}
                  </Text>
                </View>
              </View>
            </View>

            <View
              className="my-5 h-[1px]"
              style={{ backgroundColor: Colors.border }}
            />

            <View className="flex-row">
              <View className="flex-1 pr-3">
                <Text
                  className="text-[13px] font-semibold uppercase"
                  style={{ color: Colors.textSecondary }}
                >
                  Tham gia
                </Text>
                <Text
                  className="mt-2 text-[16px] font-extrabold"
                  style={{ color: Colors.textPrimary }}
                >
                  {formatDate(user.joinedAt)}
                </Text>
              </View>

              <View className="flex-1">
                <Text
                  className="text-[13px] font-semibold uppercase"
                  style={{ color: Colors.textSecondary }}
                >
                  Hoạt động gần nhất
                </Text>
                <Text
                  className="mt-2 text-[16px] font-extrabold"
                  style={{ color: Colors.textPrimary }}
                >
                  {formatDate(user.lastActiveAt)}
                </Text>
              </View>
            </View>
          </View>

          <View
            className="rounded-[24px] p-5"
            style={{
              backgroundColor: Colors.surface,
              borderWidth: 1,
              borderColor: Colors.border,
              shadowColor: "#000",
              shadowOpacity: 0.04,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 2 },
              elevation: 2,
            }}
          >
            <Text
              className="text-[20px] font-bold"
              style={{ color: Colors.textPrimary }}
            >
              Đổi vai trò
            </Text>

            <View className="mt-4 gap-3">
              {ROLE_OPTIONS.map((item) => {
                const active = item.value === draftRole;

                return (
                  <Pressable
                    key={item.value}
                    onPress={() => setDraftRole(item.value)}
                    className="rounded-[22px] p-4"
                    style={{
                      backgroundColor: active ? "#EFF6FF" : Colors.surface,
                      borderWidth: 1.5,
                      borderColor: active ? Colors.primaryLight : Colors.border,
                    }}
                  >
                    <View className="flex-row items-center">
                      <View
                        className="mr-4 h-12 w-12 items-center justify-center rounded-full"
                        style={{
                          backgroundColor: active
                            ? item.iconColor
                            : item.iconBg,
                        }}
                      >
                        <Ionicons
                          name={item.icon}
                          size={22}
                          color={active ? "#FFFFFF" : item.iconColor}
                        />
                      </View>

                      <View className="flex-1">
                        <View className="flex-row items-center">
                          <Text
                            className="text-[16px] font-bold"
                            style={{
                              color: active
                                ? Colors.primary
                                : Colors.textPrimary,
                            }}
                          >
                            {item.label}
                          </Text>

                          {active ? (
                            <View
                              className="ml-2 h-2.5 w-2.5 rounded-full"
                              style={{ backgroundColor: Colors.primaryLight }}
                            />
                          ) : null}
                        </View>

                        <Text
                          className="mt-1 text-[14px]"
                          style={{ color: Colors.textSecondary }}
                        >
                          {item.desc}
                        </Text>
                      </View>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View
            className="rounded-[24px] p-5"
            style={{
              backgroundColor: Colors.surface,
              borderWidth: 1,
              borderColor: Colors.border,
              shadowColor: "#000",
              shadowOpacity: 0.04,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 2 },
              elevation: 2,
            }}
          >
            <Text
              className="text-[20px] font-bold"
              style={{ color: Colors.textPrimary }}
            >
              Hành động nhanh
            </Text>

            <Pressable
              onPress={() =>
                setDraftStatus((prev) =>
                  prev === "active" ? "locked" : "active",
                )
              }
              className="mt-4 rounded-[22px] p-4"
              style={{
                backgroundColor:
                  draftStatus === "active" ? "#FEF2F2" : "#F0FDF4",
                borderWidth: 1.5,
                borderColor: draftStatus === "active" ? "#FECACA" : "#BBF7D0",
              }}
            >
              <View className="flex-row items-center">
                <View
                  className="mr-4 h-12 w-12 items-center justify-center rounded-full"
                  style={{
                    backgroundColor:
                      draftStatus === "active" ? "#FEE2E2" : "#DCFCE7",
                  }}
                >
                  <Ionicons
                    name={
                      draftStatus === "active"
                        ? "lock-closed-outline"
                        : "lock-open-outline"
                    }
                    size={22}
                    color={draftStatus === "active" ? "#DC2626" : "#16A34A"}
                  />
                </View>

                <View className="flex-1">
                  <Text
                    className="text-[16px] font-bold"
                    style={{
                      color: draftStatus === "active" ? "#DC2626" : "#16A34A",
                    }}
                  >
                    {draftStatus === "active"
                      ? "Khóa tài khoản"
                      : "Mở khóa tài khoản"}
                  </Text>

                  <Text
                    className="mt-1 text-[14px]"
                    style={{ color: Colors.textSecondary }}
                  >
                    {draftStatus === "active"
                      ? "Ngăn người dùng truy cập hệ thống"
                      : "Cho phép người dùng đăng nhập lại"}
                  </Text>
                </View>
              </View>
            </Pressable>
          </View>

          {hasChanges ? (
            <AppButton
              title="Lưu thay đổi"
              onPress={() => void handleSaveChanges()}
              loading={saving}
              disabled={saving}
            />
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
