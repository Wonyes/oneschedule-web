"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthRefreshListener() {
  const router = useRouter();

  useEffect(() => {
    const refreshHeader = () => router.refresh();

    window.addEventListener("auth:refreshed", refreshHeader);

    return () => {
      window.removeEventListener("auth:refreshed", refreshHeader);
    };
  }, [router]);

  return null;
}
