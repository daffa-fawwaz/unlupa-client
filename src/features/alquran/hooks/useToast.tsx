import { useState, useCallback } from "react";

export type ToastType = "success" | "error" | "info";

interface ToastState {
  show: boolean;
  message: string;
  type: ToastType;
}

export function useToast() {
  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: "",
    type: "success",
  });

  const showToast = useCallback(
    (message: string, type: ToastType = "success") => {
      setToast({ show: true, message, type });

      // Auto-dismiss after 1.5 seconds
      setTimeout(() => {
        setToast((prev) => ({ ...prev, show: false }));
      }, 1500);
    },
    [],
  );

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, show: false }));
  }, []);

  return { toast, showToast, hideToast };
}
