"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

import BaseCard from "@/src/components/ui/card/BaseCard";
import { Column, Row } from "@/src/components/ui/layout/flex";
import IconBox from "@/src/components/ui/IconBox";

export default function QuickLink({
  icon,
  title,
  description,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
  href: string;
}) {
  return (
    <BaseCard glow className="p-5">
      <Link
        href={href}
        prefetch
        className="group flex w-full items-center justify-between gap-4 text-left"
      >
        <Row className="gap-3">
          <IconBox size="lg">{icon}</IconBox>

          <Column className="gap-0.5">
            <span className="typo-sub-t-2 text-foreground">{title}</span>
            {typeof description === "string" ? (
              <span className="typo-caption-2 text-muted">{description}</span>
            ) : (
              description
            )}
          </Column>
        </Row>

        <ArrowRight
          size={16}
          strokeWidth={1.75}
          className="shrink-0 text-muted transition-transform group-hover:translate-x-0.5"
        />
      </Link>
    </BaseCard>
  );
}
