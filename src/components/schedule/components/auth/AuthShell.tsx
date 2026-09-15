"use client";

import { Bell, CalendarDays, Users } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

import OrbitHero from "@/src/components/common/OrbitHero";
import Plate from "@/src/components/common/Plate";
import { Column, Row } from "@/src/components/ui/layout/flex";
import GoogleLoginButton from "./GoogleLoginButton";
import { rise, stagger } from "@/src/lib/motion";

const FEATURES = [
  { icon: CalendarDays, text: "개인·그룹 일정을 한 화면에서" },
  { icon: Users, text: "멤버 온라인 상태와 마지막 접속" },
  { icon: Bell, text: "가입 승인과 새 일정 실시간 알림" },
];

export { rise, stagger };

export function BrandPlate({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <Plate size="wide">
      <motion.section
        variants={stagger}
        className="flex flex-col items-center gap-0 text-center lg:w-[420px]"
      >
        <motion.div variants={rise} className="pt-4 lg:pt-0">
          <OrbitHero />
        </motion.div>

        <motion.div variants={rise} className="mt-2">
          <span className="eyebrow">ONE SCHEDULER</span>
          <h1 className="typo-h1 mt-2 break-keep tracking-tight">
            {title}
          </h1>
          <p className="typo-caption-2 text-muted lg:typo-title-2 lg:mt-2">
            {subtitle}
          </p>
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
    </Plate>
  );
}

export function AuthLayoutGrid({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="grid w-full gap-4 lg:grid-cols-[auto_auto] lg:items-center lg:justify-center lg:gap-0"
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
            className="typo-sub-t-1 -m-2 p-2 text-accent hover:underline"
          >
            {linkText}
          </Link>
        </Row>
      </motion.div>
    </>
  );
}
