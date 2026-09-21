import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import Toast from "../components/feedback/Toast";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((type, message, options = {}) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => {
      // Keep only max 3 toasts visible
      const newToasts = [...prev, { id, type, message, ...options }];
      if (newToasts.length > 3) {
        return newToasts.slice(newToasts.length - 3);
      }
      return newToasts;
    });

    // Auto dismiss
    const duration = options.duration || (type === "error" ? 5000 : 3000);
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const toast = {
    success: (msg, opts) => addToast("success", msg, opts),
    error: (msg, opts) => addToast("error", msg, opts),
    warning: (msg, opts) => addToast("warning", msg, opts),
    info: (msg, opts) => addToast("info", msg, opts),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Toast Container */}
      <div className="fixed top-6 right-6 z-[100] flex flex-col gap-2 max-w-[400px] w-full max-sm:top-20 max-sm:left-1/2 max-sm:right-auto max-sm:-translate-x-1/2 max-sm:w-[calc(100%-32px)]">
        {toasts.map((t) => (
          <Toast key={t.id} toast={t} onClose={() => removeToast(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
