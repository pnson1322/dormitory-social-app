import { AppModal } from "@/components/AppModal";
import { SectionCard } from "@/components/settings/SectionCard";
import { SETTINGS_SECTIONS } from "@/constants/settings";
import { Colors } from "@/constants/colors";
import { useSettings } from "@/hooks/settings/useSettings";
import { useCurrentUserRole } from "@/hooks/auth/useCurrentUserRole";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export function SettingsScreen() {
  const router = useRouter();
  const { role } = useCurrentUserRole();
  const {
    toggles,
    showLogoutModal,
    setShowLogoutModal,
    handleToggle,
    handleLogout,
  } = useSettings();

  const handleGoBack = () => {
    const r = role?.toLowerCase();
    if (r === "admin") {
      router.navigate("/(admin)/menu" as any);
    } else if (r === "manager") {
      router.navigate("/(manager)/menu" as any);
    } else {
      router.navigate("/(student)/menu" as any);
    }
  };

  return (
    <SafeAreaView
      edges={["top"]}
      style={{ flex: 1, backgroundColor: Colors.background }}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 48 }}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={[Colors.primary, Colors.primaryLight, Colors.accent]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            paddingTop: 24,
            paddingBottom: 32,
            paddingHorizontal: 24,
            borderBottomLeftRadius: 28,
            borderBottomRightRadius: 28,
          }}
        >
          <View
            style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
          >
            <TouchableOpacity
              onPress={handleGoBack}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: "rgba(255,255,255,0.2)",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 4,
              }}
            >
              <Ionicons name="arrow-back" size={22} color="#fff" />
            </TouchableOpacity>

            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 16,
                backgroundColor: "rgba(255,255,255,0.2)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="settings" size={26} color="#fff" />
            </View>
            <View>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "800",
                  color: "#fff",
                }}
              >
                Cài đặt
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: "rgba(255,255,255,0.8)",
                  marginTop: 2,
                }}
              >
                Tùy chỉnh trải nghiệm của bạn
              </Text>
            </View>
          </View>
        </LinearGradient>

        <View style={{ gap: 20, paddingHorizontal: 20, paddingTop: 24 }}>
          {SETTINGS_SECTIONS.map((section) => (
            <SectionCard
              key={section.title}
              section={section}
              toggles={toggles}
              onToggle={handleToggle}
            />
          ))}

          <TouchableOpacity
            onPress={() => setShowLogoutModal(true)}
            activeOpacity={0.6}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: Colors.surface,
              borderRadius: 24,
              borderWidth: 1,
              borderColor: "#FEE2E2",
              paddingVertical: 16,
              shadowColor: "#EF4444",
              shadowOpacity: 0.06,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 2 },
              elevation: 2,
            }}
          >
            <Ionicons name="log-out-outline" size={22} color={Colors.error} />
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: Colors.error,
                marginLeft: 10,
              }}
            >
              Đăng xuất
            </Text>
          </TouchableOpacity>

          <AppModal
            visible={showLogoutModal}
            type="confirm"
            title="Đăng xuất"
            message="Bạn có chắc chắn muốn đăng xuất khỏi tài khoản?"
            primaryText="Đăng xuất"
            secondaryText="Hủy"
            onPrimary={handleLogout}
            onSecondary={() => setShowLogoutModal(false)}
            onBackdropPress={() => setShowLogoutModal(false)}
          />

          <Text
            style={{
              textAlign: "center",
              fontSize: 12,
              color: Colors.textSecondary,
              marginTop: 4,
            }}
          >
            Dormitory Social App v1.0.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
