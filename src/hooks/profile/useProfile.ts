import { getApiErrorMessage } from "@/services/apiError";
import { getMyProfile, ProfileData } from "@/services/profile.api";
import { useCallback, useEffect, useState } from "react";

export default function useProfile() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async (opts?: { silent?: boolean }) => {
    try {
      if (!opts?.silent) setLoading(true);
      setError(null);

      const data = await getMyProfile();
      setProfile(data);
    } catch (err) {
      const message = getApiErrorMessage(err);
      setError(message);
    } finally {
      if (!opts?.silent) setLoading(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    try {
      setRefreshing(true);
      setError(null);

      const data = await getMyProfile();
      setProfile(data);
    } catch (err) {
      const message = getApiErrorMessage(err);
      setError(message);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    loading,
    refreshing,
    error,
    refetch,
    setProfile,
  };
}
