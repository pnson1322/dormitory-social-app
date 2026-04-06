import { UserSearchBox } from "@/components/user/UserSearchBox";
import { UserStatusTabs } from "@/components/user/UserStatusTabs";
import { UserSummaryTabs } from "@/components/user/UserSummaryTabs";
import { Colors } from "@/constants/colors";
import { UserRole } from "@/services/user.api";
import { LinearGradient } from "expo-linear-gradient";
import { memo } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  search: string;
  onSearchChange: (text: string) => void;
  summary: {
    all: number;
    admin: number;
    manager: number;
    seniormanager: number;
    student: number;
  };
  role: UserRole | "";
  onRoleChange: (role: UserRole | "") => void;
  status: "" | "active" | "locked";
  onStatusChange: (status: "" | "active" | "locked") => void;
  statusCounts: {
    active: number;
    locked: number;
  };
  resultText: string;
  filtering: boolean;
};

function UserHeaderSectionBase({
  search,
  onSearchChange,
  summary,
  role,
  onRoleChange,
  status,
  onStatusChange,
  statusCounts,
  resultText,
  filtering,
}: Props) {
  const insets = useSafeAreaInsets();

  return (
    <>
      <LinearGradient
        colors={[Colors.primary, Colors.primaryLight]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          paddingHorizontal: 20,
          paddingTop: insets.top + 10,
          paddingBottom: 70,
          borderBottomLeftRadius: 30,
          borderBottomRightRadius: 30,
        }}
      >
        <Text className="text-[28px] font-extrabold text-white">
          Người dùng
        </Text>
        <Text className="mt-2 text-[15px] text-white/90">
          Quản lý tài khoản và phân quyền hệ thống
        </Text>
      </LinearGradient>

      <View className="-mt-10 px-5">
        <UserSearchBox value={search} onChangeText={onSearchChange} />
      </View>

      <View className="px-5 pt-5">
        <UserSummaryTabs
          summary={summary}
          selected={role}
          onChange={onRoleChange}
        />

        <UserStatusTabs
          selected={status}
          counts={statusCounts}
          onChange={onStatusChange}
        />

        <View className="mt-5 flex-row items-center mb-2">
          <Text
            className="flex-1 text-[16px] font-semibold"
            style={{ color: Colors.textSecondary }}
          >
            {resultText}
          </Text>

          {filtering ? (
            <ActivityIndicator size="small" color={Colors.primary} />
          ) : null}
        </View>
      </View>
    </>
  );
}

export const UserHeaderSection = memo(UserHeaderSectionBase);
