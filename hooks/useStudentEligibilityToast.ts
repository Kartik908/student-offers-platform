'use client';
/**
 * Student Eligibility Toast Hook
 * Shows eligibility info toast for first-time users
 */
import { useEffect } from "react";
import { toast } from "sonner";
import { TOAST_PRESETS } from "@/lib/toastHelpers";

const TOAST_STORAGE_KEY = "student_eligibility_toast_shown";

export const useStudentEligibilityToast = () => {

  useEffect(() => {
    // Check if toast has been shown before
    const hasShownToast = localStorage.getItem(TOAST_STORAGE_KEY);

    if (!hasShownToast) {
      // Wait a bit before showing (let page load first)
      const timer = setTimeout(() => {
        // Show the toast
        toast(TOAST_PRESETS.studentEligibility.title, {
          description: TOAST_PRESETS.studentEligibility.message,
          icon: TOAST_PRESETS.studentEligibility.icon,
          duration: TOAST_PRESETS.studentEligibility.duration,
        });

        // Mark as shown
        localStorage.setItem(TOAST_STORAGE_KEY, "true");
      }, 2000); // Show after 2 seconds

      return () => clearTimeout(timer);
    }
  }, []);
}


