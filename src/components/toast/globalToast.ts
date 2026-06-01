import type { ToastType } from "./toast.types";

type ShowToastArgs = {
  type: ToastType;
  title: string;
  message?: string;
  durationMs?: number;
};

type ToastListener = (args: ShowToastArgs) => void;
const listeners = new Set<ToastListener>();

export const globalToast = {
  show: (args: ShowToastArgs) => {
    listeners.forEach((listener) => listener(args));
  },
  subscribe: (listener: ToastListener) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};
