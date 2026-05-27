import { getAccessToken } from "@/storage/authStorage";
import { getUserInfoFromToken } from "@/utils/jwt";
import { useEffect, useState } from "react";

export function useCurrentUserRole() {
  const [role, setRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRole() {
      try {
        const token = await getAccessToken();
        if (token) {
          const userInfo = getUserInfoFromToken(token);
          if (userInfo) {
            setRole(userInfo.role);
            setUserId(userInfo.userId);
          }
        }
      } catch (error) {
        console.error("Error loading user role from token:", error);
      } finally {
        setLoading(false);
      }
    }
    loadRole();
  }, []);

  return {
    role,
    userId,
    loading,
    isAdminOrManager: role?.toLowerCase() === "admin" || role?.toLowerCase() === "manager",
  };
}
