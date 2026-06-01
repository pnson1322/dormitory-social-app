import { getAccessToken } from "@/storage/authStorage";
import { getUserInfoFromToken } from "@/utils/jwt";
import { useEffect, useState } from "react";

export function useCurrentUserRole() {
  const [role, setRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
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
            setFullName(userInfo.fullName);
            setEmail(userInfo.email);
          }
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    }
    loadRole();
  }, []);

  return {
    role,
    userId,
    fullName,
    email,
    loading,
    isAdminOrManager: role?.toLowerCase() === "admin" || role?.toLowerCase() === "manager",
  };
}
