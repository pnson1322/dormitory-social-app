import { useEffect, useMemo, useRef } from "react";
import {
  Animated,
  Modal,
  Pressable,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

type Props = {
  visible: boolean;
  type?: "info" | "success" | "error" | "confirm";
  title: string;
  message?: string;

  primaryText?: string;
  secondaryText?: string;

  onPrimary: () => void;
  onSecondary?: () => void;
  onBackdropPress?: () => void;

  autoCloseMs?: number;
};

export function AppModal({
  visible,
  type = "info",
  title,
  message,
  primaryText = "Đồng ý",
  secondaryText = "Hủy",
  onPrimary,
  onSecondary,
  onBackdropPress,
  autoCloseMs,
}: Props) {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  const scale = useRef(new Animated.Value(0.96)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const tone = useMemo(() => {
    if (type === "success")
      return {
        chip: "bg-emerald-100",
        text: "text-emerald-700",
        btn: "bg-primary",
        symbol: "✓",
      };
    if (type === "error")
      return {
        chip: "bg-red-100",
        text: "text-red-700",
        btn: "bg-red-500",
        symbol: "✕",
      };
    if (type === "confirm")
      return {
        chip: "bg-amber-100",
        text: "text-amber-800",
        btn: "bg-slate-900",
        symbol: "!",
      };
    return {
      chip: "bg-slate-100",
      text: "text-slate-800",
      btn: "bg-slate-900",
      symbol: "i",
    };
  }, [type]);

  useEffect(() => {
    if (!visible) return;

    scale.setValue(0.96);
    opacity.setValue(0);

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 160,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        speed: 18,
        bounciness: 10,
        useNativeDriver: true,
      }),
    ]).start();

    if (autoCloseMs && autoCloseMs > 0) {
      const t = setTimeout(onPrimary, autoCloseMs);
      return () => clearTimeout(t);
    }
  }, [visible, autoCloseMs, onPrimary, opacity, scale]);

  return (
    <Modal visible={visible} transparent animationType="none">
      <View className="flex-1 items-center justify-center px-6">
        <Pressable
          className="absolute inset-0 bg-black/45"
          onPress={onBackdropPress}
        />

        <Animated.View
          style={{ opacity, transform: [{ scale }] }}
          className={[
            "w-full rounded-3xl bg-white shadow-2xl px-6 py-6",
            isTablet ? "max-w-[440px]" : "max-w-[390px]",
          ].join(" ")}
        >
          <View
            className={[
              "h-12 w-12 rounded-full items-center justify-center self-center",
              tone.chip,
            ].join(" ")}
          >
            <Text className={["text-[18px] font-black", tone.text].join(" ")}>
              {tone.symbol}
            </Text>
          </View>

          <Text className="mt-4 text-center text-[20px] font-extrabold text-slate-900">
            {title}
          </Text>

          {!!message && (
            <Text className="mt-2 text-center text-slate-500 text-[15px] leading-5">
              {message}
            </Text>
          )}

          <View
            className={["mt-6", onSecondary ? "flex-row gap-3" : ""].join(" ")}
          >
            {onSecondary ? (
              <Pressable
                onPress={onSecondary}
                className="flex-1 h-[48px] rounded-2xl items-center justify-center bg-slate-100 active:opacity-90"
              >
                <Text className="text-slate-900 font-extrabold text-[15px]">
                  {secondaryText}
                </Text>
              </Pressable>
            ) : null}

            <Pressable
              onPress={onPrimary}
              className={[
                onSecondary ? "flex-1" : "w-full",
                "h-[48px] rounded-2xl items-center justify-center active:opacity-90",
                tone.btn,
              ].join(" ")}
            >
              <Text className="text-white font-extrabold text-[15px]">
                {primaryText}
              </Text>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}
