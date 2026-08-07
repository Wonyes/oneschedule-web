"use client";

import {
  Users,
  Settings,
  Copy,
  Crown,
  CalendarDays,
  Clock,
  Activity,
} from "lucide-react";

import BaseCard from "../ui/card/BaseCard";
import { Between, Column, Row } from "../ui/layout/flex";
import { MyGroupResponse } from "@/src/types/group";

export default function GroupDashboard({ group }: { group: MyGroupResponse }) {
  return (
    <Column className="w-full gap-5">
      {/* Hero */}
      <BaseCard
        glow
        className="
          p-7
        "
      >
        <Between>
          <Column>
            <Row className="gap-3">
              <h1 className="text-2xl font-bold text-white">
                {group.groupName}
              </h1>

              {group.groupRole === "SUPER" && (
                <Row
                  className="
                    gap-1
                    rounded-full
                    bg-yellow-400/10
                    px-3
                    py-1
                  "
                >
                  <Crown size={13} className="text-yellow-400" />

                  <span
                    className="
                      typo-caption-2
                      text-yellow-400
                    "
                  >
                    관리자
                  </span>
                </Row>
              )}
            </Row>

            <p
              className="
                mt-3
                typo-sub-t-3
                text-slate-400
              "
            >
              함께 일정을 관리하는 그룹입니다.
            </p>

            <Row className="mt-6 gap-3">
              <span
                className="
                  typo-caption-2
                  text-slate-500
                "
              >
                초대 코드
              </span>

              <Row
                className="
                  gap-2
                  rounded-xl
                  bg-slate-800
                  px-4
                  py-2
                "
              >
                <span
                  className="
                    typo-sub-t-3
                    text-slate-200
                  "
                >
                  {group.groupCode}
                </span>

                <button
                  className="
                    text-slate-400
                    transition
                    hover:text-white
                  "
                >
                  <Copy size={15} />
                </button>
              </Row>
            </Row>
          </Column>

          <button
            className="
              rounded-xl
              border
              border-slate-700
              p-3
              text-slate-400
              transition
              hover:bg-slate-800
            "
          >
            <Settings size={20} />
          </button>
        </Between>
      </BaseCard>

      {/* Summary */}

      <Row className="w-full gap-5">
        <Summary
          icon={<Users size={22} />}
          title="멤버"
          value={`${group.members.length}명`}
        />

        <Summary
          icon={<CalendarDays size={22} />}
          title="오늘 일정"
          value="0개"
        />

        <Summary icon={<Clock size={22} />} title="다가오는 일정" value="0개" />
      </Row>

      {/* Main */}

      <Row className="w-full gap-5">
        {/* Members */}

        <BaseCard
          className="
            flex-1
            p-6
            h-[520px]
          "
          glow
        >
          <Row className="mb-6 gap-2">
            <Users size={18} />

            <h2 className="typo-title-2 text-white">그룹 멤버</h2>
          </Row>

          <Column
            className="
              h-[430px]
              gap-4
              overflow-y-auto
              pr-2
            "
          >
            {group.members.map((member) => (
              <Between
                key={member.memberNo}
                className="
                  rounded-2xl
                  border
                  border-slate-800
                  bg-slate-900/40
                  px-5
                  py-4
                  w-full
                  neu-pressed
                "
              >
                <Row className="gap-4">
                  <Row
                    className="
                      h-11
                      w-11
                      justify-center
                      rounded-full
                      bg-blue-500/10
                      font-bold
                      text-blue-400
                    "
                  >
                    {member.nickname[0]}
                  </Row>

                  <Column>
                    <Row className="gap-2">
                      <span className="typo-sub-t-2 text-white">
                        {member.nickname}
                      </span>

                      {member.groupRole === "SUPER" && (
                        <Crown size={14} className="text-yellow-400" />
                      )}
                    </Row>

                    <span
                      className="
                        mt-1
                        typo-caption-2
                        text-slate-500
                      "
                    >
                      {member.position}
                    </span>
                  </Column>
                </Row>

                <span
                  className="
                    rounded-full
                    bg-slate-800
                    px-3
                    py-1
                    typo-caption-2
                    text-slate-300
                  "
                >
                  {member.groupRole}
                </span>
              </Between>
            ))}
          </Column>
        </BaseCard>

        {/* Schedule */}

        <BaseCard
          glow
          className="
            flex-1
            p-6
            h-[520px]
          "
        >
          <Row className="mb-6 gap-2">
            <CalendarDays size={18} />

            <h2 className="typo-title-2 text-white">오늘 일정</h2>
          </Row>

          <Column className="gap-4">
            <ScheduleItem time="09:00" title="등록된 일정이 없습니다" />

            <ScheduleItem
              time="13:00"
              title="새로운 일정이 추가되면 표시됩니다"
            />
          </Column>
        </BaseCard>
      </Row>

      {/* Activity */}

      <BaseCard
        glow
        className="
          p-6
        "
      >
        <Row className="mb-5 gap-2">
          <Activity size={18} />

          <h2 className="typo-title-2 text-white">최근 활동</h2>
        </Row>

        <Column
          className="
            rounded-2xl
            bg-slate-900/40
            p-5
            neu-pressed
            gap-3
          "
        >
          <span className="typo-sub-t-3 text-slate-400">
            최근 그룹 활동이 없습니다.
          </span>
        </Column>
      </BaseCard>
    </Column>
  );
}

function Summary({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <BaseCard
      glow
      className="
        flex-1
        p-5
      "
    >
      <Row className="gap-4">
        <Row
          className="
            h-12
            w-12
            justify-center
            rounded-2xl
            bg-blue-500/10
            text-blue-400
          "
        >
          {icon}
        </Row>

        <Column>
          <span
            className="
              typo-caption-2
              text-slate-500
            "
          >
            {title}
          </span>

          <span
            className="
              mt-1
              text-xl
              font-bold
              text-white
            "
          >
            {value}
          </span>
        </Column>
      </Row>
    </BaseCard>
  );
}

function ScheduleItem({ time, title }: { time: string; title: string }) {
  return (
    <Between
      className="
        rounded-xl
        border
        border-slate-800
        bg-slate-900/40
        px-4
        w-full
        neu-pressed
        py-3
      "
    >
      <span
        className="
          typo-caption-2
          text-slate-500
        "
      >
        {time}
      </span>

      <span
        className="
          typo-sub-t-3
        "
      >
        {title}
      </span>
    </Between>
  );
}
