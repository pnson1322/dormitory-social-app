import { useLogout } from "@/hooks/auth/useLogout";
import { useCallback, useState } from "react";

export function useSettings() {
  const logout = useLogout();

  const [toggles, setToggles] = useState<Record<string, boolean>>({
    pushNotifications: true,
    emailNotifications: true,
    communityNotifications: false,
    darkMode: false,
    biometricLogin: false,
    hidePersonalInfo: false,
  });

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleToggle = useCallback((key: string, value: boolean) => {
    setToggles((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleLogout = useCallback(() => {
    setShowLogoutModal(false);
    void logout();
  }, [logout]);

  return {
    toggles,
    showLogoutModal,
    setShowLogoutModal,
    handleToggle,
    handleLogout,
  };
}
