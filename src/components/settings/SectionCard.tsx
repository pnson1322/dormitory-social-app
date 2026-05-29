import { Colors } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import { SettingsInfoRow } from "./SettingsInfoRow";
import { SettingsNavRow } from "./SettingsNavRow";
import { SettingsToggleRow } from "./SettingsToggleRow";
import { SettingsSection } from "@/services/settings.types";

type Props = {
  section: SettingsSection;
  toggles: Record<string, boolean>;
  onToggle: (key: string, val: boolean) => void;
};

export function SectionCard({ section, toggles, onToggle }: Props) {
  return (
    <View
      style={{
        backgroundColor: Colors.surface,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: Colors.border,
        paddingHorizontal: 20,
        paddingVertical: 6,
        shadowColor: "#000",
        shadowOpacity: 0.04,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          paddingTop: 14,
          paddingBottom: 6,
        }}
      >
        <Ionicons
          name={section.icon}
          size={18}
          color={Colors.textSecondary}
        />
        <Text
          style={{
            fontSize: 13,
            fontWeight: "700",
            color: Colors.textSecondary,
            textTransform: "uppercase",
            letterSpacing: 0.5,
          }}
        >
          {section.title}
        </Text>
      </View>

      {section.items.map((item, idx) => {
        const isLast = idx === section.items.length - 1;

        if (item.type === "toggle") {
          return (
            <SettingsToggleRow
              key={item.stateKey}
              item={item}
              value={toggles[item.stateKey] ?? false}
              onToggle={onToggle}
              isLast={isLast}
            />
          );
        }
        if (item.type === "nav") {
          return (
            <SettingsNavRow
              key={item.label}
              item={item}
              isLast={isLast}
            />
          );
        }
        return (
          <SettingsInfoRow
            key={item.label}
            item={item}
            isLast={isLast}
          />
        );
      })}
    </View>
  );
}
