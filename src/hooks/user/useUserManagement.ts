import { useToast } from "@/components/toast/ToastProvider";
import { useUsers } from "@/hooks/user/useUsers";
import {
  updateUserRole,
  updateUserStatus,
  UserItem,
  UserRole,
  UserStatus,
} from "@/services/user.api";
import { useCallback, useMemo, useState } from "react";

function normalizeRole(role?: string | null) {
  return String(role || "")
    .trim()
    .toLowerCase();
}

export function useUserManagement() {
  const { showToast } = useToast();
  const {
    items,
    search,
    role,
    status,
    loading,
    refreshing,
    filtering,
    error,
    setSearch,
    setRole,
    setStatus,
    refetch,
  } = useUsers();

  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const filteredItems = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return items.filter((user) => {
      const matchSearch =
        !keyword ||
        user.fullName.toLowerCase().includes(keyword) ||
        user.email.toLowerCase().includes(keyword);

      const matchRole =
        !role || normalizeRole(user.role) === normalizeRole(role);

      const userStatus = user.isActive ? "active" : "locked";
      const matchStatus = !status || userStatus === status;

      return matchSearch && matchRole && matchStatus;
    });
  }, [items, search, role, status]);

  const summary = useMemo(() => {
    return {
      all: items.length,
      admin: items.filter((x) => normalizeRole(x.role) === "admin").length,
      manager: items.filter((x) => normalizeRole(x.role) === "manager").length,
      seniormanager: items.filter(
        (x) => normalizeRole(x.role) === "seniormanager",
      ).length,
      student: items.filter((x) => normalizeRole(x.role) === "student").length,
    };
  }, [items]);

  const statusCounts = useMemo(() => {
    const source = role || status || search.trim() ? filteredItems : items;

    return {
      active: source.filter((x) => x.isActive).length,
      locked: source.filter((x) => !x.isActive).length,
    };
  }, [items, filteredItems, role, status, search]);

  const resultText = useMemo(() => {
    if (search.trim()) return `${filteredItems.length} người dùng tìm thấy`;
    if (status === "active")
      return `${filteredItems.length} tài khoản hoạt động`;
    if (status === "locked") return `${filteredItems.length} tài khoản đã khóa`;
    if (role === "admin") return `${filteredItems.length} quản trị viên`;
    if (role === "manager") return `${filteredItems.length} quản lý`;
    if (role === "seniormanager")
      return `${filteredItems.length} quản lý cấp cao`;
    if (role === "student") return `${filteredItems.length} sinh viên`;
    return `${filteredItems.length} người dùng`;
  }, [search, status, role, filteredItems.length]);

  const openUser = useCallback((user: UserItem) => {
    setSelectedUser(user);
  }, []);

  const closeSheet = useCallback(() => {
    if (actionLoading) return;
    setSelectedUser(null);
  }, [actionLoading]);

  const saveUserChanges = useCallback(
    async (nextRole: UserRole, nextStatus: UserStatus) => {
      if (!selectedUser) return;

      const currentStatus: UserStatus = selectedUser.isActive
        ? "active"
        : "locked";

      const roleChanged = selectedUser.role !== nextRole;
      const statusChanged = currentStatus !== nextStatus;

      if (!roleChanged && !statusChanged) return;

      try {
        setActionLoading(true);

        if (roleChanged) {
          await updateUserRole(selectedUser.id, nextRole);
        }

        if (statusChanged) {
          await updateUserStatus(selectedUser.id, nextStatus);
        }

        showToast({
          type: "success",
          title: "Cập nhật thành công",
          message: "Thông tin người dùng đã được cập nhật.",
        });

        setSelectedUser(null);
        await refetch({ silent: true });
      } catch (error: any) {
        showToast({
          type: "error",
          title: "Cập nhật thất bại",
          message: error?.message || "Không thể cập nhật người dùng.",
        });
      } finally {
        setActionLoading(false);
      }
    },
    [selectedUser, refetch, showToast],
  );

  return {
    search,
    role,
    status,
    loading,
    refreshing,
    filtering,
    error,
    summary,
    statusCounts,
    items: filteredItems,
    selectedUser,
    actionLoading,
    resultText,
    setSearch,
    setRole,
    setStatus,
    refetch,
    openUser,
    closeSheet,
    saveUserChanges,
  };
}
