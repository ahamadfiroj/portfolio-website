"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, X } from "lucide-react";

interface ToastProps {
  message: string;
  type: "success" | "error";
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export default function Toast({
  message,
  type,
  isVisible,
  onClose,
  duration = 5000
}: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="fixed top-4 right-4 z-50"
          style={{ width: 'max-content', maxWidth: 'calc(100vw - 32px)' }}
        >
          <div
            className={`p-4 rounded-lg shadow-lg border flex items-start gap-3 ${
              type === "success"
                ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200"
                : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200"
            }`}
          >
            <div className="flex-shrink-0">
              {type === "success" ? (
                <CheckCircle size={20} className="text-green-600 dark:text-green-400" />
              ) : (
                <XCircle size={20} className="text-red-600 dark:text-red-400" />
              )}
            </div>

            <div className="flex-1">
              <h4 className="font-semibold text-sm mb-1">
                {type === "success" ? "Message Sent!" : "Error"}
              </h4>
              <p className="text-sm">{message}</p>
            </div>

            <button
              onClick={onClose}
              className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
            >
              <X size={16} />
            </button>
          </div>

          {/* Progress bar */}
          <motion.div
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: duration / 1000, ease: "linear" }}
            className={`h-1 ${
              type === "success" ? "bg-green-400" : "bg-red-400"
            } rounded-b-lg`}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}