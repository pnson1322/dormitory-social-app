export type ToastType = "success" | "error" | "info";

export type ToastPayload = {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  durationMs: number;
  createdAt: number;
};
