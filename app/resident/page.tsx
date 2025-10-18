"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/auth-context";
import { useHousehold } from "@/lib/context/household-context";

export default function ResidentPage() {
  const router = useRouter();
  const { token } = useAuth();
  const { household, isLoading: isHouseholdLoading, refreshHousehold } = useHousehold();

  console.log("household:", household);
  console.log("isHouseholdLoading:", isHouseholdLoading);

  useEffect(() => {
    if (token && !household && !isHouseholdLoading) {
      refreshHousehold();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, household, isHouseholdLoading]);

  useEffect(() => {
    if (!token) {
      router.replace("/login");
      return;
    }
    if (!isHouseholdLoading && !household) {
      router.replace("/resident/form");
    }
  }, [token, isHouseholdLoading, household, router]);

  if (isHouseholdLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Đang kiểm tra thông tin hộ khẩu...
      </div>
    );
  }

  return (
    <div> đây là trang resident</div>
  );
}