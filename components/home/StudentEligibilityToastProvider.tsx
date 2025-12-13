'use client';

import { useStudentEligibilityToast } from "@/hooks/useStudentEligibilityToast";

export function StudentEligibilityToastProvider() {
    useStudentEligibilityToast();
    return null;
}
