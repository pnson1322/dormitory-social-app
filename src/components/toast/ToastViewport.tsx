import { ToastItem } from "@/components/toast/ToastItem";
import type { ToastPayload } from "@/components/toast/toast.types";
import React from "react";
import { View } from "react-native";

type Props = {
  toasts: ToastPayload[];
  top: number;
  onDismiss: (id: string) => void;
};

export function ToastViewport({ toasts, top, onDismiss }: Props) {
  return (
    <View
      pointerEvents="box-none"
      style={{
        position: "absolute",
        left: 16,
        right: 16,
        top,
        zIndex: 9999,
      }}
    >
      <View className="gap-3">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
        ))}
      </View>
    </View>
  );
}
