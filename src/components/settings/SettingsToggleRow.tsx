import { Colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Switch, Text, View } from "react-native";
import { ToggleItem } from "@/services/settings.types";

type Props = {
  item: ToggleItem;
  value: boolean;
  onToggle: (key: string, val: boolean) => void;
  isLast: boolean;
};

export function SettingsToggleRow({ item, value, onToggle, isLast }: Props) {
  return (
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

      <Switch
        value={value}
        onValueChange={(v) => onToggle(item.stateKey, v)}
        trackColor={{ false: "#E2E8F0", true: Colors.primaryLight }}
        thumbColor="#fff"
        ios_backgroundColor="#E2E8F0"
      />
    </View>
  );
}
