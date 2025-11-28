/**
 * Toast Helper Functions
 * Utility functions for showing common toast notifications
 */
import React from "react";
import { GraduationCap, Heart, HeartOff, Check } from "lucide-react";

export interface ToastConfig {
  icon?: React.ReactNode | string;
  title?: string;
  message: string;
  duration?: number;
}

/**
 * Common toast configurations
 */
export const TOAST_PRESETS = {
  studentEligibility: {
    icon: React.createElement(GraduationCap, { className: "w-4 h-4 sm:w-5 sm:h-5" }),
    title: "Welcome to Student Offers!",
    message:
      "Most offers require a student (.edu / university) email for verification. Some perks are open to everyone.",
    duration: 5000,
  },
  offerSaved: {
    icon: React.createElement(Heart, { className: "w-4 h-4 sm:w-5 sm:h-5 text-red-500 fill-red-500" }),
    title: "Saved",
    message: "Offer saved to your favorites!",
    duration: 2000,
  },
  offerRemoved: {
    icon: React.createElement(HeartOff, { className: "w-4 h-4 sm:w-5 sm:h-5 text-gray-100" }),
    title: "Removed",
    message: "Offer removed from favorites.",
    duration: 2000,
  },
  copySuccess: {
    icon: React.createElement(Check, { className: "w-4 h-4 sm:w-5 sm:h-5 text-gray-100" }),
    title: "Copied",
    message: "Copied to clipboard!",
    duration: 2000,
  },
  error: {
    icon: "⚠️",
    message: "Something went wrong. Please try again.",
    duration: 3000,
  },
  success: {
    icon: "✨",
    message: "Success!",
    duration: 2000,
  },
} as const;

/**
 * Development helper: Reset first-time toast flag
 * Run in console: window.resetStudentToast()
 */
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).resetStudentToast = () => {
    localStorage.removeItem("student_eligibility_toast_shown");

  };
}
