"use client";

import { useState } from "react";
import { Primary } from "../ui/layout/button";
import { KeySquare, Users } from "lucide-react";
import CreateGroup from "./CreateGroup";
import BaseCard from "../ui/card/BaseCard";
import { Row } from "../ui/layout/flex";
import { Input } from "../ui/layout/input";

export default function GroupLanding() {
  const [createGroup, setCreateGroup] = useState(false);

  return (
    <main className="max-w-[420px] w-full mx-auto">
      {!createGroup ? (
        <BaseCard
          className="
            p-10
            flex
            flex-col
            items-center
            text-center
            relative
            w-full
            overflow-hidden
          "
          glow
        >
          <Row className="w-full justify-center">
            <div
              className="
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
          </Row>

          <h1 className="mt-7 typo-title-1 text-slate-100">
            함께할 그룹을 만들어보세요
          </h1>

          <p className="mt-3 typo-caption-2 leading-relaxed text-slate-400">
            그룹을 만들고 친구들과
            <br />
            일정을 공유해보세요.
          </p>

          <div className="mt-8 flex flex-col w-full gap-3">
            <Primary
              text="그룹 만들기"
              icon={<Users size={14} />}
              onClick={() => setCreateGroup(true)}
            />

            <Input
              placeholder="초대 코드를 입력해주세요"
              className="h-[44px]"
              leftSection={<KeySquare size={14} />}
            />
          </div>
        </BaseCard>
      ) : (
        <CreateGroup onBack={() => setCreateGroup(false)} />
      )}
    </main>
  );
}
