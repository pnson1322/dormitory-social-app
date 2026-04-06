import type { UserStatus } from "@/services/user.api";
import { Text, View } from "react-native";

type Props = {
  status?: UserStatus | string | null;
};

const STATUS_THEME = {
  active: {
    bg: "#DCFCE7",
    dot: "#16A34A",
    color: "#16A34A",
    label: "Hoạt động",
  },
  locked: {
    bg: "#FEE2E2",
    dot: "#DC2626",
    color: "#DC2626",
    label: "Đã khóa",
  },
} as const;

function normalizeStatus(status?: string | null): keyof typeof STATUS_THEME {
  const value = String(status || "")
    .trim()
    .toLowerCase();

  if (value === "active") return "active";
  return "locked";
}

export function UserStatusBadge({ status }: Props) {
  const safeStatus = normalizeStatus(status);
  const theme = STATUS_THEME[safeStatus];

  return (
    <View
      className="flex-row items-center rounded-full px-3 py-2"
      style={{ backgroundColor: theme.bg }}
    >
      <View
        className="mr-2 h-2.5 w-2.5 rounded-full"
        style={{ backgroundColor: theme.dot }}
      />
      <Text className="text-[12px] font-bold" style={{ color: theme.color }}>
        {theme.label}
      </Text>
    </View>
  );
}
