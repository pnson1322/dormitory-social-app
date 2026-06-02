import { getApiErrorMessage } from "@/services/apiError";
import { getMyProfile } from "@/services/profile/profile.api";
import { ProfileData } from "@/services/profile/profile.types";
import { useCallback, useEffect, useState } from "react";

// Global state variables to synchronize profile data across all components
let globalProfile: ProfileData | null = null;
let globalLoading = true;
let globalError: string | null = null;
const listeners = new Set<(state: { profile: ProfileData | null; loading: boolean; error: string | null }) => void>();

function updateGlobalState(newState: Partial<{ profile: ProfileData | null; loading: boolean; error: string | null }>) {
  if (newState.profile !== undefined) globalProfile = newState.profile;
  if (newState.loading !== undefined) globalLoading = newState.loading;
  if (newState.error !== undefined) globalError = newState.error;

  listeners.forEach((listener) =>
    listener({
      profile: globalProfile,
      loading: globalLoading,
      error: globalError,
    })
  );
}

export default function useProfile() {
  const [profile, setProfile] = useState<ProfileData | null>(globalProfile);
  const [loading, setLoading] = useState<boolean>(globalLoading);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(globalError);

  useEffect(() => {
    const listener = (state: { profile: ProfileData | null; loading: boolean; error: string | null }) => {
      setProfile(state.profile);
      setLoading(state.loading);
      setError(state.error);
    };
    listeners.add(listener);

    // Sync state on mount
    setProfile(globalProfile);
    setLoading(globalLoading);
    setError(globalError);

    return () => {
      listeners.delete(listener);
    };
  }, []);

  const fetchProfile = useCallback(async (opts?: { silent?: boolean }) => {
    try {
      if (!opts?.silent) updateGlobalState({ loading: true });
      updateGlobalState({ error: null });

      const data = await getMyProfile();
      updateGlobalState({ profile: data });
    } catch (err) {
      const message = getApiErrorMessage(err);
      updateGlobalState({ error: message });
    } finally {
      if (!opts?.silent) updateGlobalState({ loading: false });
    }
  }, []);

  const refetch = useCallback(async () => {
    try {
      setRefreshing(true);
      updateGlobalState({ error: null });

      const data = await getMyProfile();
      updateGlobalState({ profile: data });
    } catch (err) {
      const message = getApiErrorMessage(err);
      updateGlobalState({ error: message });
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (globalProfile === null && globalLoading) {
      void fetchProfile();
    }
  }, [fetchProfile]);

  const updateProfileLocally = useCallback((newProfile: ProfileData | null) => {
    updateGlobalState({ profile: newProfile });
  }, []);

  return {
    profile,
    loading,
    refreshing,
    error,
    refetch,
    setProfile: updateProfileLocally,
  };
}
