import { updateUserRole, updateUserStatus } from "@/services/user/user.api";
import { UserItem, UserRole, UserStatus } from "@/services/user/user.types";

export function useUserActions() {
  async function changeRole(user: UserItem, role: UserRole) {
    await updateUserRole(user.id, role);
  }

  async function toggleStatus(user: UserItem) {
    const newStatus: UserStatus = user.isActive ? "locked" : "active";

    await updateUserStatus(user.id, newStatus);
  }

  return {
    changeRole,
    toggleStatus,
  };
}
