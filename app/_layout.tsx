import { ToastProvider } from "@/components/toast/ToastProvider";
import { Stack } from "expo-router";
import "../global.css";

export default function RootLayout() {
  return (
    <ToastProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </ToastProvider>
  );
}
