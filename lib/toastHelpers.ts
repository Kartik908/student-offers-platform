/**
 * Toast Helper Functions
 * Utility functions for showing common toast notifications
 */
import React from "react";
import { GraduationCap, Heart, HeartOff, Check, AlertCircle, CheckCircle2 } from "lucide-react";

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
    duration: 3500, // Reduced from 5000ms - still readable but snappier
  },
  offerSaved: {
    icon: React.createElement(Heart, { className: "w-4 h-4 sm:w-5 sm:h-5 text-red-500 fill-red-500" }),
    title: "Saved",
    message: "Offer saved to your favorites!",
    duration: 1500, // Reduced from 2000ms - quick confirmation
  },
  offerRemoved: {
    icon: React.createElement(HeartOff, { className: "w-4 h-4 sm:w-5 sm:h-5 text-gray-100" }),
    title: "Removed",
    message: "Offer removed from favorites.",
    duration: 1500, // Reduced from 2000ms - quick confirmation
  },
  copySuccess: {
    icon: React.createElement(Check, { className: "w-4 h-4 sm:w-5 sm:h-5 text-gray-100" }),
    title: "Copied",
    message: "Copied to clipboard!",
    duration: 1500, // Reduced from 2000ms - quick confirmation
  },
  error: {
    icon: React.createElement(AlertCircle, { className: "w-4 h-4 sm:w-5 sm:h-5 text-destructive" }),
    message: "Something went wrong. Please try again.",
    duration: 4000, // Increased from 2500ms - industry standard for errors (4-6s)
  },
  success: {
    icon: React.createElement(CheckCircle2, { className: "w-4 h-4 sm:w-5 sm:h-5 text-green-500" }),
    message: "Success!",
    duration: 2000, // Increased from 1500ms - industry standard for success (2-3s)
  },
} as const;

/**
 * Development helper: Reset first-time toast flag
 * Run in console: window.resetStudentToast()
 */
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  (window as any).resetStudentToast = () => {
    localStorage.removeItem("student_eligibility_toast_shown");

  };
}
