import { Colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import { InfoItem } from "@/services/settings.types";

type Props = {
  item: InfoItem;
  isLast: boolean;
};

export function SettingsInfoRow({ item, isLast }: Props) {
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
      </View>

      <Text
        style={{
          fontSize: 14,
          color: Colors.textSecondary,
          fontWeight: "500",
        }}
      >
        {item.value}
      </Text>
    </View>
  );
}
