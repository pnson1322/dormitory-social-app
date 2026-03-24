import { Colors } from "@/constants/colors";
import { ReactNode } from "react";
import { Text, View } from "react-native";

type Props = {
  title?: string;
  children: ReactNode;
};

export function FormSection({ title, children }: Props) {
  return (
    <View className="gap-3">
      {title ? (
        <Text className="text-[20px] font-extrabold text-textPrimary">
          {title}
        </Text>
      ) : null}

      <View
        className="rounded-[24px] bg-surface px-4 py-5"
        style={{ borderWidth: 1, borderColor: Colors.border }}
      >
        <View className="gap-4">{children}</View>
      </View>
    </View>
  );
}
