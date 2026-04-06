import { UserRoleBadge } from "@/components/user/UserRoleBadge";
import { UserStatusBadge } from "@/components/user/UserStatusBadge";
import { Colors } from "@/constants/colors";
import { UserItem } from "@/services/user.api";
import { Ionicons } from "@expo/vector-icons";
import { memo, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";

type Props = {
  user: Partial<UserItem> & {
    id: string;
    status?: "active" | "locked" | string;
    avatarUrl?: string | null;
  };
  onPress: () => void;
  onPressMenu?: () => void;
};

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
        className="h-[56px] w-[56px] rounded-full"
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <View
      className="h-[56px] w-[56px] items-center justify-center rounded-full"
      style={{ backgroundColor: "#E2E8F0" }}
    >
      <Text
        className="text-[18px] font-extrabold"
        style={{ color: Colors.primary }}
      >
        {getInitials(fullName)}
      </Text>
    </View>
  );
}

function UserCardBase({ user, onPress, onPressMenu }: Props) {
  return (
    <Pressable
      onPress={onPress}
      className="rounded-[24px] px-4 py-4"
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
      <View className="flex-row items-start">
        <View className="mr-4">
          <Avatar fullName={user.fullName} avatarUrl={user.avatarUrl} />

          <View
            className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-white"
            style={{
              backgroundColor: user.status === "active" ? "#10B981" : "#EF4444",
            }}
          />
        </View>

        <View className="flex-1 pr-3">
          <Text
            className="text-[20px] font-extrabold"
            style={{ color: Colors.textPrimary }}
            numberOfLines={1}
          >
            {user.fullName || "Người dùng"}
          </Text>

          <Text
            className="mt-1 text-[15px]"
            style={{ color: Colors.textSecondary }}
            numberOfLines={1}
          >
            {user.email || "--"}
          </Text>

          <View className="mt-3 flex-row flex-wrap gap-2">
            <UserRoleBadge role={user.role} />
            <UserStatusBadge status={user.status} />
          </View>
        </View>

        <Pressable onPress={onPressMenu} hitSlop={12}>
          <Ionicons
            name="ellipsis-vertical"
            size={20}
            color={Colors.textSecondary}
          />
        </Pressable>
      </View>
    </Pressable>
  );
}

export const UserCard = memo(UserCardBase);
