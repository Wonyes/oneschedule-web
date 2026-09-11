"use client";

import { ArrowLeft, Compass, KeySquare, Plus } from "lucide-react";
import { useState } from "react";

import CreateGroup from "./CreateGroup";
import JoinByCode from "./JoinByCode";
import PublicGroupList from "./PublicGroupList";
import { GhostBtn } from "../ui/layout/button";
import { Row } from "../ui/layout/flex";
import SegmentedTabs from "../ui/layout/SegmentedTabs";

type TabKey = "explore" | "code" | "create";

const TABS = [
  { key: "explore" as const, label: "둘러보기", icon: <Compass size={12} /> },
  { key: "code" as const, label: "코드 참여", icon: <KeySquare size={12} /> },
  { key: "create" as const, label: "만들기", icon: <Plus size={12} /> },
];

export default function GroupLanding({ onCancel }: { onCancel?: () => void }) {
  const [tab, setTab] = useState<TabKey>(onCancel ? "explore" : "create");

  return (
    <main className="mx-auto flex w-full max-w-[420px] flex-col gap-3 lg:max-w-[720px]">
      {onCancel && (
        <Row className="w-full">
          <GhostBtn
            text="돌아가기"
            icon={<ArrowLeft size={14} />}
            onClick={onCancel}
          />
        </Row>
      )}

      <SegmentedTabs
        tabs={TABS}
        value={tab}
        onChange={setTab}
        label="그룹 참여 방법"
      />

      {tab === "explore" && <PublicGroupList />}

      {tab === "code" && <JoinByCode onJoined={onCancel} />}

      {tab === "create" && (
        <CreateGroup showBack={false} onBack={() => setTab("explore")} />
      )}
    </main>
  );
}
