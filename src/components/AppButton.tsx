import { Colors } from "@/constants/colors";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

type Props = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: any;
  size?: "large" | "compact";
  variant?: "primary" | "secondary";
};

export function AppButton({
  title,
  onPress,
  loading,
  disabled,
  style,
  size = "large",
  variant = "primary",
}: Props) {
  const isDisabled = !!disabled || !!loading;
  const isCompact = size === "compact";
  const isSecondary = variant === "secondary";

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      className={[
        isCompact ? "h-[46px] rounded-[18px]" : "h-[52px] rounded-2xl",
        "items-center justify-center overflow-hidden px-6",
        isDisabled ? "opacity-70" : "active:opacity-80",
      ].join(" ")}
      style={[{ minWidth: 120 }, style]}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
    >
      <View
        className={[
          "absolute inset-0",
          isSecondary ? "bg-slate-100" : "bg-primary",
          isCompact ? "rounded-[18px]" : "rounded-2xl",
        ].join(" ")}
      />
      
      {!isSecondary && (
        <View
          className={[
            "absolute inset-0 bg-primaryLight opacity-10",
            isCompact ? "rounded-[18px]" : "rounded-2xl",
          ].join(" ")}
        />
      )}

      {loading ? (
        <ActivityIndicator color={isSecondary ? Colors.primary : "white"} size="small" />
      ) : (
        <Text
          className={[
            isCompact ? "text-[15px]" : "text-[16px]",
            "font-bold text-center",
            isSecondary ? "text-slate-600" : "text-white",
          ].join(" ")}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}
