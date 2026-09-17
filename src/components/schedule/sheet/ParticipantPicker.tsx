"use client";

import { useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";

import MemberAvatar from "@/src/components/common/MemberAvatar";
import DropdownMenu from "@/src/components/ui/DropdownMenu";
import { Row } from "@/src/components/ui/layout/flex";
import { GroupMember } from "@/src/types/group";

/** 그룹 일정 참여자 선택 드롭다운: 검색 + 전체 선택/해제 + 체크 목록 */
export default function ParticipantPicker({
  members,
  selected,
  onChange,
  readOnly = false,
}: {
  members: GroupMember[];
  selected: number[];
  onChange: (ids: number[]) => void;
  readOnly?: boolean;
}) {
  const [query, setQuery] = useState("");

  const filtered = members.filter((m) =>
    m.nickname.toLowerCase().includes(query.toLowerCase()),
  );

  const selectedMembers = members.filter((m) => selected.includes(m.memberNo));
  const allFilteredSelected =
    filtered.length > 0 && filtered.every((m) => selected.includes(m.memberNo));

  const toggleAll = () => {
    const ids = filtered.map((m) => m.memberNo);
    onChange(
      allFilteredSelected
        ? selected.filter((id) => !ids.includes(id))
        : Array.from(new Set([...selected, ...ids])),
    );
  };

  const toggle = (memberNo: number) => {
    onChange(
      selected.includes(memberNo)
        ? selected.filter((id) => id !== memberNo)
        : [...selected, memberNo],
    );
  };

  return (
    <DropdownMenu
      label="참여자 선택"
      align="stretch"
      className="w-full"
      disabled={readOnly}
      triggerClassName={`w-full justify-between rounded-xl neu-btn border border-accent/20 px-4 py-3 text-left transition-colors ${
        readOnly
          ? "opacity-70"
          : "hover:-translate-y-0.5 hover:border-accent/50"
      }`}
      trigger={(isOpen) => (
        <>
          {selectedMembers.length === 0 ? (
            <span className="typo-caption-2 text-place-h">
              참여자를 선택하세요.
            </span>
          ) : (
            <div className="flex flex-wrap items-center gap-1.5">
              {selectedMembers.map((m) => (
                <span
                  key={m.memberNo}
                  className="flex items-center gap-1 rounded-full bg-accent/10 py-0.5 pl-1 pr-2"
                >
                  <MemberAvatar
                    nickname={m.nickname}
                    src={m.profileImageUrl}
                    size="2xs"
                  />
                  <span className="typo-caption-3 text-secondary">
                    {m.nickname}
                  </span>
                </span>
              ))}
            </div>
          )}

          <span
            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/12 text-accent transition-transform ${isOpen ? "rotate-180" : ""}`}
          >
            <ChevronDown size={13} strokeWidth={2} />
          </span>
        </>
      )}
    >
      {() => (
        <>
          <div className="neu-pressed flex items-center gap-2 rounded-xl px-3 py-2">
            <Search size={14} strokeWidth={1.75} className="text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="이름으로 검색"
              className="typo-caption-2 text-foreground placeholder:text-place-h w-full bg-transparent focus:outline-none"
            />
          </div>

          {filtered.length > 0 && (
            <Row className="mt-2 items-center justify-between px-2 pt-1">
              <span className="typo-caption-3 text-place-h">
                {selected.length > 0
                  ? `${selected.length}명 선택`
                  : `멤버 ${members.length}명`}
              </span>
              <button
                type="button"
                onClick={toggleAll}
                className="neu-btn btn-spring flex h-7 items-center gap-1 rounded-lg px-2.5 typo-caption-3 font-semibold text-accent"
              >
                <Check size={12} strokeWidth={2.5} />
                {allFilteredSelected ? "전체 해제" : "전체 선택"}
              </button>
            </Row>
          )}

          <div className="mt-1 flex max-h-[min(60dvh,320px)] flex-col gap-0.5 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="typo-caption-2 text-muted py-4 text-center">
                검색 결과가 없습니다.
              </p>
            ) : (
              filtered.map((m) => {
                const isSelected = selected.includes(m.memberNo);
                return (
                  <button
                    key={m.memberNo}
                    type="button"
                    role="menuitemcheckbox"
                    aria-checked={isSelected}
                    onClick={() => toggle(m.memberNo)}
                    className="hover:bg-surface-hover flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left transition-colors"
                  >
                    <MemberAvatar
                      nickname={m.nickname}
                      src={m.profileImageUrl}
                      size="xs"
                    />
                    <span className="typo-caption-2 flex-1 text-secondary">
                      {m.nickname}
                    </span>
                    {isSelected && (
                      <Check
                        size={14}
                        strokeWidth={2}
                        className="text-accent"
                      />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </>
      )}
    </DropdownMenu>
  );
}
