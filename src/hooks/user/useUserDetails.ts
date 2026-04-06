import { getApiErrorMessage } from "@/services/apiError";
import { getUserById, UserDetail } from "@/services/user.api";
import { useCallback, useEffect, useState } from "react";

export function useUserDetails(userId?: string) {
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    if (!userId) {
      setUser(null);
      setError("Không tìm thấy người dùng.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = await getUserById(userId);
      setUser(data);
    } catch (err) {
      setError(getApiErrorMessage(err));
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void fetchUser();
  }, [fetchUser]);

  return {
    user,
    loading,
    error,
    refetch: fetchUser,
    setUser,
  };
}
