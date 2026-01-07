"use client";
import React, { useState, useEffect } from "react";
import { CheckCircle, XCircle, X, Info, AlertTriangle } from "lucide-react";

type ToastType = "success" | "error" | "info" | "warn" | "warning";

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

// Toast context/state
let toasts: Toast[] = [];
let listeners: Array<(toasts: Toast[]) => void> = [];

const notify = (type: ToastType, message: string) => {
  const id = Date.now().toString() + Math.random().toString(36);
  toasts = [...toasts, { id, type, message }];
  listeners.forEach((listener) => listener(toasts));

  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    listeners.forEach((listener) => listener(toasts));
  }, 4000);
};

export const toast = {
  success: (message?: string) => notify("success", message || ""),
  error: (message?: string) => notify("error", message || ""),
  info: (message?: string) => notify("info", message || ""),
  warn: (message?: string) => notify("warn", message || ""),
  warning: (message?: string) => notify("warning", message || ""),
};

// Toast icon component
const ToastIcon = ({ type }: { type: ToastType }) => {
  const normalizedType = type === "warning" ? "warn" : type;

  switch (normalizedType) {
    case "success":
      return (
        <div className="toast-icon toast-icon--success">
          <CheckCircle className="toast-icon__svg" />
        </div>
      );
    case "error":
      return (
        <div className="toast-icon toast-icon--error">
          <XCircle className="toast-icon__svg" />
        </div>
      );
    case "info":
      return (
        <div className="toast-icon toast-icon--info">
          <Info className="toast-icon__svg" />
        </div>
      );
    case "warn":
      return (
        <div className="toast-icon toast-icon--warn">
          <AlertTriangle className="toast-icon__svg" />
        </div>
      );
    default:
      return null;
  }
};

// Toast Container Component
export const ToastContainer = () => {
  const [currentToasts, setCurrentToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const listener = (newToasts: Toast[]) => setCurrentToasts(newToasts);
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, []);

  const removeToast = (id: string) => {
    toasts = toasts.filter((t) => t.id !== id);
    listeners.forEach((listener) => listener(toasts));
  };

  return (
    <>
      <div className="toast-container">
        {currentToasts.map((t) => {
          const normalizedType = t.type === "warning" ? "warn" : t.type;

          return (
            <div key={t.id} className={`toast toast--${normalizedType}`}>
              <div className="toast__content">
                <ToastIcon type={t.type} />

                <div className="toast__text">
                  <p className="toast__message">{t.message}</p>
                </div>

                <button
                  onClick={() => removeToast(t.id)}
                  className="toast__close"
                >
                  <X className="toast__close-icon" />
                </button>
              </div>

              <div className="toast__progress">
                <div
                  className={`toast__progress-bar toast__progress-bar--${normalizedType}`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
