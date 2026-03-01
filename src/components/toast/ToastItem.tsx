import type { ToastPayload, ToastType } from "@/components/toast/toast.types";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useRef } from "react";
import {
  Animated,
  Easing,
  PanResponder,
  Pressable,
  Text,
  View,
} from "react-native";

type Props = {
  toast: ToastPayload;
  onDismiss: (id: string) => void;
};

function getTheme(type: ToastType) {
  switch (type) {
    case "success":
      return {
        container: "bg-emerald-600",
        icon: "checkmark-circle",
      } as const;
    case "error":
      return {
        container: "bg-rose-600",
        icon: "close-circle",
      } as const;
    case "info":
    default:
      return {
        container: "bg-sky-600",
        icon: "information-circle",
      } as const;
  }
}

export function ToastItem({ toast, onDismiss }: Props) {
  const theme = useMemo(() => getTheme(toast.type), [toast.type]);

  // enter animation
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-8)).current;

  // swipe to dismiss
  const dragX = useRef(new Animated.Value(0)).current;

  // progress (1 -> 0)
  const progress = useRef(new Animated.Value(1)).current;

  // keep current progress value for pause/resume
  const progressValueRef = useRef(1);
  const progressAnimRef = useRef<Animated.CompositeAnimation | null>(null);

  const startProgress = (fromValue: number) => {
    progress.stopAnimation();
    progress.setValue(fromValue);

    const remainingMs = Math.max(0, Math.round(toast.durationMs * fromValue));

    // nếu thời gian còn lại quá ít thì dismiss luôn cho khỏi giật
    if (remainingMs <= 30) {
      onDismiss(toast.id);
      return;
    }

    const anim = Animated.timing(progress, {
      toValue: 0,
      duration: remainingMs,
      useNativeDriver: false, // width
      easing: Easing.linear,
    });

    progressAnimRef.current = anim;

    anim.start(({ finished }) => {
      if (finished) onDismiss(toast.id);
    });
  };

  useEffect(() => {
    // enter
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
        easing: Easing.out(Easing.quad),
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
        easing: Easing.out(Easing.quad),
      }),
    ]).start();

    // progress
    progressValueRef.current = 1;
    startProgress(1);

    // cleanup
    return () => {
      progress.stopAnimation();
      dragX.stopAnimation();
      opacity.stopAnimation();
      translateY.stopAnimation();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toast.id]);

  const panResponder = useMemo(() => {
    return PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 6,

      onPanResponderGrant: () => {
        // pause progress when start dragging
        progress.stopAnimation((v: number) => {
          progressValueRef.current = typeof v === "number" ? v : 0;
        });
        // stop any spring while dragging
        dragX.stopAnimation();
      },

      // ✅ function handler to avoid Animated.event bug
      onPanResponderMove: (_, g) => {
        dragX.setValue(g.dx);
      },

      onPanResponderRelease: (_, g) => {
        const shouldDismiss = Math.abs(g.dx) > 120;

        if (shouldDismiss) {
          // dismiss animation
          Animated.parallel([
            Animated.timing(opacity, {
              toValue: 0,
              duration: 120,
              useNativeDriver: true,
            }),
            Animated.timing(dragX, {
              toValue: g.dx > 0 ? 240 : -240,
              duration: 120,
              useNativeDriver: true,
            }),
          ]).start(() => onDismiss(toast.id));
          return;
        }

        // snap back
        Animated.spring(dragX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();

        // resume progress from last value
        const v = progressValueRef.current;
        startProgress(v);
      },

      onPanResponderTerminate: () => {
        Animated.spring(dragX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();

        // resume progress
        startProgress(progressValueRef.current);
      },
    });
  }, [dragX, opacity, onDismiss, progress, toast.durationMs, toast.id]);

  const barWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <Animated.View
      style={{
        opacity,
        transform: [{ translateY }, { translateX: dragX }],
      }}
      className={["rounded-2xl px-4 py-3 shadow-lg", theme.container].join(" ")}
      {...panResponder.panHandlers}
    >
      <View className="flex-row items-start">
        <Ionicons name={theme.icon as any} size={22} color="white" />
        <View className="ml-3 flex-1">
          <Text className="text-white font-extrabold text-[16px]">
            {toast.title}
          </Text>
          {toast.message ? (
            <Text className="text-white/90 mt-0.5 text-[13px]">
              {toast.message}
            </Text>
          ) : null}
        </View>

        <Pressable onPress={() => onDismiss(toast.id)} hitSlop={12}>
          <Text className="text-white/90 font-bold text-[13px]">Ẩn</Text>
        </Pressable>
      </View>

      {/* progress bar */}
      <View className="mt-2 h-[3px] w-full rounded-full bg-white/25 overflow-hidden">
        <Animated.View
          style={{ width: barWidth }}
          className="h-full rounded-full bg-white/80"
        />
      </View>
    </Animated.View>
  );
}
