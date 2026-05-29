import { Colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { NavigationItem } from "@/services/settings.types";

type Props = {
  item: NavigationItem;
  isLast: boolean;
};

export function SettingsNavRow({ item, isLast }: Props) {
  return (
    <Pressable
      onPress={item.onPress}
      style={({ pressed }) => ({
        opacity: pressed ? 0.6 : 1,
      })}
    >
      <View
        style={[
          {
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 14,
          },
          !isLast && {
            borderBottomWidth: 1,
            borderBottomColor: Colors.border,
          },
        ]}
      >
        <View
          style={{
            width: 38,
            height: 38,
            borderRadius: 12,
            backgroundColor: `${Colors.primaryLight}14`,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name={item.icon} size={20} color={Colors.primaryLight} />
        </View>

        <View style={{ flex: 1, marginLeft: 14 }}>
          <Text
            style={{
              fontSize: 15,
              fontWeight: "600",
              color: Colors.textPrimary,
            }}
          >
            {item.label}
          </Text>
          {item.subtitle && (
            <Text
              style={{
                fontSize: 13,
                color: Colors.textSecondary,
                marginTop: 2,
              }}
            >
              {item.subtitle}
            </Text>
          )}
        </View>

        <Ionicons
          name="chevron-forward"
          size={18}
          color={Colors.textSecondary}
        />
      </View>
    </Pressable>
  );
}
