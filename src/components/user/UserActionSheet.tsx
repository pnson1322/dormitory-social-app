import { AppButton } from "@/components/AppButton";
import { Colors } from "@/constants/colors";
import { UserRole, UserStatus } from "@/services/user.api";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";

type Props = {
  visible: boolean;
  userName?: string;
  role: UserRole | string;
  status: UserStatus;
  loading?: boolean;
  onClose: () => void;
  onSave: (role: UserRole, status: UserStatus) => void;
};

const ROLES: {
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

export function UserActionSheet({
  visible,
  userName,
  role,
  status,
  loading = false,
  onClose,
  onSave,
}: Props) {
  const currentRole = normalizeRole(role);

  const [draftRole, setDraftRole] = useState<UserRole>(currentRole);
  const [draftStatus, setDraftStatus] = useState<UserStatus>(status);

  useEffect(() => {
    if (visible) {
      setDraftRole(currentRole);
      setDraftStatus(status);
    }
  }, [visible, currentRole, status]);

  const hasChanges = useMemo(() => {
    return draftRole !== currentRole || draftStatus !== status;
  }, [draftRole, currentRole, draftStatus, status]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 justify-end">
        <Pressable
          className="absolute inset-0 bg-black/35"
          onPress={loading ? undefined : onClose}
        />

        <View
          className="rounded-t-[32px] px-5 pb-8 pt-3"
          style={{ backgroundColor: Colors.surface }}
        >
          <View className="items-center">
            <View
              className="h-1.5 w-14 rounded-full"
              style={{ backgroundColor: "#CBD5E1" }}
            />
          </View>

          <Text
            className="mt-5 text-[24px] font-extrabold"
            style={{ color: Colors.textPrimary }}
          >
            Quản lý người dùng
          </Text>

          {!!userName && (
            <Text
              className="mt-2 text-[15px]"
              style={{ color: Colors.textSecondary }}
            >
              {userName}
            </Text>
          )}

          <Text
            className="mt-6 text-[18px] font-bold"
            style={{ color: Colors.textPrimary }}
          >
            Đổi vai trò
          </Text>

          <View className="mt-4 gap-3">
            {ROLES.map((item) => {
              const active = item.value === draftRole;

              return (
                <Pressable
                  key={item.value}
                  disabled={loading}
                  onPress={() => setDraftRole(item.value)}
                  className="rounded-[22px] p-4"
                  style={{
                    backgroundColor: active ? "#EFF6FF" : Colors.surface,
                    borderWidth: 1.5,
                    borderColor: active ? Colors.primaryLight : Colors.border,
                    opacity: loading ? 0.7 : 1,
                  }}
                >
                  <View className="flex-row items-center">
                    <View
                      className="mr-4 h-12 w-12 items-center justify-center rounded-full"
                      style={{
                        backgroundColor: active ? item.iconColor : item.iconBg,
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
                            color: active ? Colors.primary : Colors.textPrimary,
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

          <Text
            className="mt-6 text-[18px] font-bold"
            style={{ color: Colors.textPrimary }}
          >
            Hành động nhanh
          </Text>

          <Pressable
            disabled={loading}
            onPress={() =>
              setDraftStatus((prev) =>
                prev === "active" ? "locked" : "active",
              )
            }
            className="mt-4 rounded-[22px] p-4"
            style={{
              backgroundColor: draftStatus === "active" ? "#FEF2F2" : "#F0FDF4",
              borderWidth: 1.5,
              borderColor: draftStatus === "active" ? "#FECACA" : "#BBF7D0",
              opacity: loading ? 0.7 : 1,
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

          <View className="mt-6 flex-row gap-3">
            <Pressable
              onPress={loading ? undefined : onClose}
              className="flex-1 h-[52px] items-center justify-center rounded-2xl"
              style={{
                backgroundColor: Colors.surface,
                borderWidth: 1,
                borderColor: Colors.border,
                opacity: loading ? 0.7 : 1,
              }}
            >
              <Text
                className="text-[16px] font-bold"
                style={{ color: Colors.textSecondary }}
              >
                Hủy
              </Text>
            </Pressable>

            <View className="flex-1">
              <AppButton
                title="Lưu"
                onPress={() => onSave(draftRole, draftStatus)}
                loading={loading}
                disabled={!hasChanges || loading}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
