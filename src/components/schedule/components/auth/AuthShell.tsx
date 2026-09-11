"use client";

import { Bell, CalendarDays, Users } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

import OrbitHero from "@/src/components/common/OrbitHero";
import { Column, Row } from "@/src/components/ui/layout/flex";
import GoogleLoginButton from "./GoogleLoginButton";
import { rise, stagger } from "@/src/lib/motion";

const FEATURES = [
  { icon: CalendarDays, text: "개인·그룹 일정을 한 화면에서" },
  { icon: Users, text: "멤버 온라인 상태와 마지막 접속" },
  { icon: Bell, text: "가입 승인과 새 일정 실시간 알림" },
];

const PLATE =
  "lg:h-[var(--plate)] lg:w-[var(--plate)] lg:[--plate:min(640px,100dvh-9rem,50vw-1.5rem)]";

export { rise, stagger };

function Plate() {
  return (
    <>
      <div
        aria-hidden
        className="neu-pressed pointer-events-none absolute inset-0 -z-10 hidden rounded-full lg:block"
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-5 -z-10 hidden rounded-full border border-dashed border-divider lg:block"
        animate={{ rotate: 360 }}
        transition={{ duration: 180, ease: "linear", repeat: Infinity }}
      />
    </>
  );
}

export function BrandPlate({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div
      className={`relative isolate lg:flex lg:items-center lg:justify-center ${PLATE}`}
    >
      <Plate />

      <motion.section
        variants={stagger}
        className="flex flex-col lg:w-[420px] lg:items-center lg:text-center"
      >
        <motion.div variants={rise}>
          <OrbitHero />
        </motion.div>

        <motion.div variants={rise} className="mt-2">
          <span className="eyebrow">ONE SCHEDULER</span>
          <h1 className="typo-h1 mt-2 tracking-tight">{title}</h1>
          <p className="typo-title-3 mt-2 text-muted">{subtitle}</p>
        </motion.div>

        <motion.ul
          variants={stagger}
          className="mt-5 hidden flex-col gap-2 lg:flex lg:[@media(max-height:860px)]:hidden"
        >
          {FEATURES.map(({ icon: Icon, text }) => (
            <motion.li
              key={text}
              variants={rise}
              className="flex items-center gap-3"
            >
              <span className="neu-btn flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-accent">
                <Icon size={15} strokeWidth={1.75} />
              </span>
              <span className="typo-caption-1 text-secondary">{text}</span>
            </motion.li>
          ))}
        </motion.ul>
      </motion.section>
    </div>
  );
}

export function AuthLayoutGrid({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="grid w-full gap-8 lg:grid-cols-[auto_auto] lg:items-center lg:justify-center lg:gap-0"
    >
      {children}
    </motion.div>
  );
}

const GOOGLE_OAUTH_URL = `${process.env.NEXT_PUBLIC_SERVER_IP}/oauth2/authorization/google`;

export function AuthAlternatives({
  googleLabel,
  dividerText,
  question,
  linkHref,
  linkText,
}: {
  googleLabel: string;
  dividerText: string;
  question: string;
  linkHref: string;
  linkText: string;
}) {
  return (
    <>
      <motion.div variants={rise}>
        <Column className="w-full items-center gap-4">
          <Row className="w-full items-center gap-3">
            <span className="h-px flex-1 bg-divider" />
            <span className="typo-caption-2 text-place-h">{dividerText}</span>
            <span className="h-px flex-1 bg-divider" />
          </Row>

          <GoogleLoginButton href={GOOGLE_OAUTH_URL} label={googleLabel} />
        </Column>
      </motion.div>

      <motion.div variants={rise}>
        <Row className="w-full justify-center gap-2">
          <p className="typo-sub-t-3 text-place-h">{question}</p>
          <Link
            href={linkHref}
            prefetch
            className="typo-sub-t-1 text-accent hover:underline"
          >
            {linkText}
          </Link>
        </Row>
      </motion.div>
    </>
  );
}
