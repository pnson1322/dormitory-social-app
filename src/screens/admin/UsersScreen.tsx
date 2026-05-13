import { DraggableFAB } from "@/components/common/DraggableFAB";
import { AppButton } from "@/components/AppButton";
import { UserActionSheet } from "@/components/user/UserActionSheet";
import { UserHeaderSection } from "@/components/user/UserHeaderSection";
import { UserListContent } from "@/components/user/UserListContent";
import { Colors } from "@/constants/colors";
import { useUserManagement } from "@/hooks/user/useUserManagement";
import { subscribeUserListRefresh } from "@/hooks/user/userRefreshBus";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export function UsersScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const {
    search,
    role,
    status,
    loading,
    refreshing,
    filtering,
    error,
    summary,
    statusCounts,
    items,
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
  } = useUserManagement();

  useEffect(() => {
    const unsubscribe = subscribeUserListRefresh(() => {
      void refetch({ silent: true });
    });

    return unsubscribe;
  }, [refetch]);

  function handlePressUser(id: string) {
    router.push(`/(admin)/user-details/${id}`);
  }

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <View className="flex-1" style={{ backgroundColor: Colors.background }}>
        <UserHeaderSection
          search={search}
          onSearchChange={setSearch}
          summary={summary}
          role={role}
          onRoleChange={setRole}
          status={status}
          onStatusChange={setStatus}
          statusCounts={statusCounts}
          resultText={resultText}
          filtering={filtering}
        />

        {error ? (
          <View className="flex-1 items-center justify-center px-6">
            <Text
              className="text-center text-[16px] font-semibold mb-6"
              style={{ color: Colors.textPrimary }}
            >
              {error}
            </Text>

            <AppButton 
              title="Thử lại" 
              onPress={() => void refetch({ refreshing: true })} 
              loading={loading || refreshing} 
            />
          </View>
        ) : (
          <UserListContent
            items={items}
            refreshing={refreshing}
            onRefresh={() => void refetch({ refreshing: true })}
            onPressUser={(user) => handlePressUser(user.id)}
            onOpenMenu={openUser}
          />
        )}

        <DraggableFAB
          onPress={() => router.push("/(admin)/create-user")}
          icon="person-add"
          iconSize={26}
        />

        <UserActionSheet
          visible={!!selectedUser}
          userName={selectedUser?.fullName}
          role={selectedUser?.role || "student"}
          status={selectedUser?.isActive ? "active" : "locked"}
          loading={actionLoading}
          onClose={closeSheet}
          onSave={(nextRole, nextStatus) => {
            void saveUserChanges(nextRole, nextStatus);
          }}
        />
      </View>
    </SafeAreaView>
  );
}
