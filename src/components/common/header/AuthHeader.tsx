"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { usePathname } from "next/navigation";

export default function AuthHeader() {
  const pathname = usePathname();
  const isTitle = pathname === "/login" ? "홈으로" : "뒤로가기";
  const isPath = pathname === "/login" ? "/" : "/login";
  return (
    <header className="w-full flex justify-between px-8 py-6 shrink-0 bg-transparent">
      <Link
        href={isPath}
        prefetch
        className="neu-btn btn-spring flex items-center gap-2 rounded-xl px-3.5 py-2 typo-caption-2 font-medium text-muted hover:text-foreground"
      >
        <ArrowLeft size={14} />
        {isTitle}
      </Link>
    </header>
  );
}
