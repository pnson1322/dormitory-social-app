import type { UserRole } from "@/services/user.api";
import { Text, View } from "react-native";

type Props = {
  role?: UserRole | string | null;
};

const ROLE_THEME = {
  admin: {
    bg: "#EEF2FF",
    color: "#1E3A8A",
    label: "Admin",
  },
  manager: {
    bg: "#EFF6FF",
    color: "#2563EB",
    label: "Quản lý",
  },
  seniormanager: {
    bg: "#EDE9FE",
    color: "#6366F1",
    label: "QL cấp cao",
  },
  student: {
    bg: "#ECFDF5",
    color: "#14B8A6",
    label: "Sinh viên",
  },
} as const;

function normalizeRole(role?: string | null): keyof typeof ROLE_THEME {
  const value = String(role || "")
    .trim()
    .toLowerCase();

  if (value === "admin") return "admin";
  if (value === "manager") return "manager";
  if (value === "seniormanager") return "seniormanager";
  return "student";
}

export function UserRoleBadge({ role }: Props) {
  const safeRole = normalizeRole(role);
  const theme = ROLE_THEME[safeRole];

  return (
    <View
      className="rounded-full px-3 py-2"
      style={{ backgroundColor: theme.bg }}
    >
      <Text className="text-[12px] font-bold" style={{ color: theme.color }}>
        {theme.label}
      </Text>
    </View>
  );
}
