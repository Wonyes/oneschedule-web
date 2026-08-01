"use client";

import { useRouter } from "next/navigation";

export default function Logo() {
  const router = useRouter();

  return (
    <img
      src="/assets/schedule_logo.png"
      alt="logo"
      className="h-9 w-auto cursor-pointer drop-shadow-sm"
      onClick={() => router.push("/")}
    />
  );
}
