"use client";

import { Moon, Sun } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

import { Comet } from "@/src/components/common/Plate";
import { pickDailyLine } from "@/src/constant/dailyLines";
import { useMyInfo } from "@/src/hooks/querys/useMembers";
import { springSoft } from "@/src/lib/motion";

const DAY_START = 6;
const DAY_END = 18;
/** 원판이 화면보다 훨씬 커서 꼭대기 근처만 보인다 → 해/달은 이 각도 폭 안에서만 움직인다 */
const SWEEP = Math.PI / 15; // ±12°

/** 지금 시각을 지평선 위 각도(왼쪽 → 꼭대기 → 오른쪽)로 */
function skyPosition(now: Date) {
  const h = now.getHours() + now.getMinutes() / 60;
  const isDay = h >= DAY_START && h < DAY_END;
  // 밤은 18시→다음날 6시를 한 바퀴로 본다
  const progress = isDay
    ? (h - DAY_START) / (DAY_END - DAY_START)
    : ((h - DAY_END + 24) % 24) / (24 - (DAY_END - DAY_START));
  const theta = Math.PI / 2 + SWEEP - progress * SWEEP * 2;
  return { isDay, cos: Math.cos(theta), sin: Math.sin(theta) };
}

/**
 * 대시보드 맨 아래에서 떠오르는 큰 원판의 윗부분. 지금 시각에 맞춰 해/달이 링 위를 지나가고,
 * 혜성이 천천히 돌며, 가운데엔 오늘의 한 줄.
 */
export default function HorizonFooter() {
  const { data: me } = useMyInfo();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const { isDay, cos, sin } = skyPosition(now);
  const line = pickDailyLine(now, me?.memberNo ?? 0);
  const Icon = isDay ? Sun : Moon;

  return (
    <footer
      className="relative mt-6 h-36 select-none overflow-hidden sm:h-44"
      style={{
        // 아래로 갈수록 배경에 녹아들어 잘린 선이 안 보이게
        maskImage: "linear-gradient(to bottom, black 62%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to bottom, black 62%, transparent 100%)",
      }}
    >
      {/* 원판: 윗부분만 보이도록 아래로 내려 둔다 */}
      <div
        aria-hidden
        className="absolute left-1/2 top-12 aspect-square w-[max(220vw,1800px)] -translate-x-1/2 sm:top-14"
      >
        <div className="absolute inset-0 rounded-full neu-pressed" />
        <motion.div
          className="absolute inset-4 rounded-full border border-dashed border-divider/70"
          animate={{ rotate: 360 }}
          transition={{ duration: 240, ease: "linear", repeat: Infinity }}
        />
        <Comet className="absolute inset-4" duration={90} />

        {/* 해/달: 링(inset-4) 위 현재 시각 위치 */}
        <motion.span
          initial={false}
          animate={{
            left: `calc(50% + ${cos * 50}% - ${cos * 16}px)`,
            top: `calc(50% - ${sin * 50}% + ${sin * 16}px)`,
          }}
          transition={springSoft}
          className="absolute flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full neu-flat text-pending-500 ring-4 ring-[var(--back)]"
        >
          <Icon size={14} strokeWidth={2} />
        </motion.span>
      </div>

      {/* 오늘의 한 줄 + 워드마크 */}
      <div className="absolute inset-x-0 top-0 flex flex-col items-center gap-1.5 px-4 text-center">
        <p className="typo-caption-2 max-w-md text-secondary">{line}</p>
        <span className="eyebrow text-place-h">ONE SCHEDULER</span>
      </div>
    </footer>
  );
}
