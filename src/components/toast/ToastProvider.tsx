import { ToastViewport } from "@/components/toast/ToastViewport";
import type { ToastPayload, ToastType } from "@/components/toast/toast.types";
import React, {
  createContext,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ShowToastArgs = {
  type: ToastType;
  title: string;
  message?: string;
  durationMs?: number; // default 2500
};

type ToastContextValue = {
  showToast: (args: ShowToastArgs) => string;
  dismissToast: (id: string) => void;
  dismissAll: () => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

function makeId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const insets = useSafeAreaInsets();

  const TOP_OFFSET = 16;
  const toastTop = insets.top + TOP_OFFSET;

  const [toasts, setToasts] = useState<ToastPayload[]>([]);
  const maxToasts = 2;

  const timers = useRef<Record<string, NodeJS.Timeout | number>>({});

  function dismissToast(id: string) {
    const t = timers.current[id];
    if (t) {
      clearTimeout(t as any);
      delete timers.current[id];
    }
    setToasts((prev) => prev.filter((x) => x.id !== id));
  }

  function dismissAll() {
    Object.values(timers.current).forEach((t) => clearTimeout(t as any));
    timers.current = {};
    setToasts([]);
  }

  function showToast(args: ShowToastArgs) {
    const id = makeId();
    const durationMs = args.durationMs ?? 2500;

    const payload: ToastPayload = {
      id,
      type: args.type,
      title: args.title,
      message: args.message,
      durationMs,
      createdAt: Date.now(),
    };

    setToasts((prev) => {
      const next = [payload, ...prev];
      return next.slice(0, maxToasts);
    });

    timers.current[id] = setTimeout(() => dismissToast(id), durationMs + 250);

    return id;
  }

  const value = useMemo(
    () => ({ showToast, dismissToast, dismissAll }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} top={toastTop} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
