import { ActivityIndicator, Pressable, Text, View } from "react-native";

type Props = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: any;
  size?: "large" | "compact";
};

export function AppButton({
  title,
  onPress,
  loading,
  disabled,
  style,
  size = "large",
}: Props) {
  const isDisabled = !!disabled || !!loading;
  const isCompact = size === "compact";

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
          "absolute inset-0 bg-primary",
          isCompact ? "rounded-[18px]" : "rounded-2xl",
        ].join(" ")}
      />
      <View
        className={[
          "absolute inset-0 bg-primaryLight opacity-10",
          isCompact ? "rounded-[18px]" : "rounded-2xl",
        ].join(" ")}
      />

      {loading ? (
        <ActivityIndicator color="white" size="small" />
      ) : (
        <Text
          className={[
            isCompact ? "text-[15px]" : "text-[16px]",
            "font-bold text-white text-center",
          ].join(" ")}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}



