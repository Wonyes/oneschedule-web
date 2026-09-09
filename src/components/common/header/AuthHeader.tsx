"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AuthHeader() {
  return (
    <header className="w-full flex justify-between px-8 py-6 shrink-0 bg-transparent">
      <Link
        href="/"
        prefetch
        className="flex items-center gap-2 text-xs font-medium text-muted hover:text-foreground bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 px-3.5 py-2 rounded-xl transition-all duration-200 shadow-sm"
      >
        <ArrowLeft size={14} />
        홈으로
      </Link>
    </header>
  );
}
