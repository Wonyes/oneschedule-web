"use client";

import { Primary } from "@/src/components/ui/layout/button";
import { Users, KeyRound } from "lucide-react";

export default function GroupPage() {
  return (
    <main className="w-full max-w-[720px] mx-auto">
      <section
        className="
          rounded-[32px]
          neu-flat
          p-10
          flex
          flex-col
          items-center
          text-center
          relative
          overflow-hidden
        "
      >
        {/* Background Glow */}
        <div
          className="
            absolute
            -top-24
            w-72
            h-72
            rounded-full
            bg-indigo-500/20
            blur-3xl
          "
        />

        <div
          className="
            relative
            w-20
            h-20
            rounded-3xl
            neu-pressed
            flex
            items-center
            justify-center
            text-indigo-400
          "
        >
          <Users size={36} />
        </div>

        <h1
          className="
            mt-7
            text-2xl
            font-bold
            text-slate-100
          "
        >
          함께할 그룹을 만들어보세요
        </h1>

        <p
          className="
            mt-3
            text-sm
            leading-relaxed
            text-slate-400
          "
        >
          그룹을 만들고 친구들과
          <br />
          일정을 공유해보세요.
        </p>

        <div
          className="
            mt-8
            flex
            flex-col
            w-full
            gap-3
          "
        >
          <Primary
            text="그룹 만들기"
            className="
              w-full
              h-12
              rounded-xl
              bg-indigo-600
              text-white
              flex
              items-center
              justify-center
              gap-2
              text-sm
              font-semibold
              hover:bg-indigo-500
              transition
            "
          />

          <button
            className="
              w-full
              h-12
              rounded-xl
              neu-pressed
              text-slate-300
              flex
              items-center
              justify-center
              gap-2
              text-sm
              hover:text-indigo-400
              transition
            "
          >
            <KeyRound size={17} />
            초대 코드 입력
          </button>
        </div>
      </section>
    </main>
  );
}
