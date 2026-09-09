"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import AvatarImage from "@/src/components/common/AvatarImage";
import { Check, ChevronDown, Search, X } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useSheetStore } from "@/src/hooks/stores/useSheetStore";
import { useScheduleViewStore } from "@/src/hooks/stores/useScheduleViewStore";
import { format } from "date-fns";
import { Input } from "../layout/input";
import { Column } from "../layout/flex";
import DropdownMenu from "../DropdownMenu";
import { Primary, SecondaryBtn, GhostBtn, RedBtn } from "../layout/button";
import CalendarBody from "./calendar/CalendarBody";
import { useCalendarStore } from "@/src/hooks/stores/useCalendarStore";
import { formatTime } from "@/src/utils/time";
import { EVENT_STYLES } from "@/src/constant/schedule";
import { canEditSchedule, toScheduleRequest } from "@/src/utils/schedule";
import {
  createSchedule,
  createGroupSchedule,
  deleteSchedule,
  updateSchedule,
} from "@/src/hooks/querys/useSchedule";
import { scheduleKeys } from "@/src/hooks/querys/key/scheduleKey";
import { useOverlay } from "@/src/hooks/useOverlay";
import { getErrorMessage, useAppMutation } from "@/src/types/ErrorResponse";
import { useActiveGroup } from "@/src/hooks/querys/useGroup";
import { GroupMember } from "@/src/types/group";
import { useMyInfo } from "@/src/hooks/querys/useMembers";

const combineDateTime = (date: Date, time: string) => {
  const [hour, minute] = time.split(":").map(Number);
  const combined = new Date(date);
  combined.setHours(hour || 0, minute || 0, 0, 0);
  return format(combined, "yyyy-MM-dd'T'HH:mm:ss");
};

const categories = [
  { value: "work", label: "업무" },
  { value: "personal", label: "개인" },
  { value: "meeting", label: "약속" },
  { value: "important", label: "운동" },
] as const;

function ParticipantPicker({
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
      disabled={readOnly}
      triggerClassName={`w-full justify-between rounded-xl neu-pressed px-4 py-3 text-left shadow-sm ${
        readOnly ? "opacity-70" : "hover:ring-2 hover:ring-indigo-500/30"
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
                  <span className="flex h-4 w-4 items-center justify-center overflow-hidden rounded-full bg-accent/20 text-[9px] font-bold text-accent">
                    <AvatarImage
                      src={m.profileImageUrl}
                      nickname={m.nickname}
                    />
                  </span>
                  <span className="typo-caption-3 text-secondary">
                    {m.nickname}
                  </span>
                </span>
              ))}
            </div>
          )}

          <ChevronDown
            size={14}
            strokeWidth={1.75}
            className={`shrink-0 text-muted transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
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

          <div className="mt-2 flex max-h-48 flex-col gap-0.5 overflow-y-auto">
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
                    <span className="typo-caption-3 flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-full bg-accent/15 font-bold text-accent">
                      <AvatarImage
                        src={m.profileImageUrl}
                        nickname={m.nickname}
                      />
                    </span>
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

function SheetHeader({
  onClose,
  isEditing,
}: {
  onClose: () => void;
  isEditing: boolean;
}) {
  return (
    <header className="flex items-center justify-between border-b border-white/10 px-4 sm:px-6 py-4">
      <h2 className="typo-title-2 text-foreground">
        {isEditing ? "일정 수정" : "일정 추가"}
      </h2>
      <GhostBtn
        icon={<X size={20} />}
        onClick={onClose}
        className="h-auto rounded-full p-2"
      />
    </header>
  );
}

function SheetFooter({
  onClose,
  onSave,
  onDelete,
  isEditing,
  canEdit,
}: {
  onClose: () => void;
  onSave: () => void;
  onDelete: () => void;
  isEditing: boolean;
  canEdit: boolean;
}) {
  return (
    <footer className="border-t border-white/10 px-4 sm:px-6 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))] bg-surface/90 rounded-b-[32px]">
      <div className="flex gap-3">
        {isEditing && canEdit && (
          <RedBtn text="삭제" onClick={onDelete} className="flex-1" />
        )}

        <SecondaryBtn
          text={canEdit ? "취소" : "닫기"}
          onClick={onClose}
          className="flex-1"
        />

        {canEdit && <Primary text="저장" onClick={onSave} className="flex-1" />}
      </div>
    </footer>
  );
}

export default function Sheet() {
  const {
    form,
    updateForm,
    open,
    closeSheet,
    editingId,
    createType,
    editingAuthorNo,
  } = useSheetStore();
  const { isCalendarOpen, toggleCalendar } = useCalendarStore();
  const [titleError, setTitleError] = useState("");
  const { group } = useActiveGroup(open);
  const viewType = useScheduleViewStore((s) => s.viewType);
  const { openAlert } = useOverlay();
  const { data: myInfo } = useMyInfo(open);
  const queryClient = useQueryClient();
  const pathname = usePathname();

  const groupNo = group?.groupNo;

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "unset";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  useEffect(() => {
    closeSheet();
  }, [pathname]);

  const close = () => {
    closeSheet();
    if (isCalendarOpen) toggleCalendar();
  };

  const invalidateSchedules = () => {
    queryClient.invalidateQueries({ queryKey: [scheduleKeys.list] });
  };

  const { mutate: create } = useAppMutation({
    mutationFn: (body: ReturnType<typeof toScheduleRequest>) =>
      createType === "GROUP" && group
        ? createGroupSchedule(groupNo!, body)
        : createSchedule(body),
    onSuccess: () => {
      invalidateSchedules();
      close();
    },
    onError: (err) =>
      openAlert({
        title: "일정 저장에 실패했습니다.",
        message: getErrorMessage(err),
      }),
  });

  const { mutate: update } = useAppMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: number;
      body: ReturnType<typeof toScheduleRequest>;
    }) => updateSchedule(id, body),
    onSuccess: () => {
      invalidateSchedules();
      close();
    },
    onError: (err) =>
      openAlert({
        title: "일정 수정에 실패했습니다.",
        message: getErrorMessage(err),
      }),
  });

  const { mutate: remove } = useAppMutation({
    mutationFn: deleteSchedule,
    onSuccess: () => {
      invalidateSchedules();
      close();
    },
    onError: (err) =>
      openAlert({
        title: "일정 삭제에 실패했습니다.",
        message: getErrorMessage(err),
      }),
  });

  const currentForm = form;
  if (!currentForm) return null;

  const isEditing = !!editingId;

  const canEdit =
    !isEditing ||
    canEditSchedule({
      createdBy: editingAuthorNo ?? undefined,
      myMemberNo: myInfo?.memberNo,
      myGroupRole: group?.groupRole,
    });

  const handleSave = () => {
    if (!currentForm.title.trim()) {
      setTitleError("제목을 입력해주세요.");
      return;
    }

    setTitleError("");

    const startDate = currentForm.startDate ?? new Date();
    const endDate = currentForm.endDate ?? startDate;
    const startTime = currentForm.startTime || "00:00";
    const endTime = currentForm.endTime || startTime;

    const body = toScheduleRequest({
      title: currentForm.title.trim(),
      content: currentForm.content,
      category: currentForm.category || "personal",
      startDate: combineDateTime(startDate, startTime),
      endDate: combineDateTime(endDate, endTime),
      participantMemberNos:
        (editingId ? viewType : createType) === "GROUP"
          ? currentForm.participantMemberNos
          : undefined,
    });

    if (editingId) {
      update({ id: editingId, body });
    } else {
      create(body);
    }
  };

  const handleDelete = () => {
    if (editingId) remove(editingId);
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/60 transition-opacity duration-300 ${
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={close}
      />

      <section
        aria-hidden={!open}
        inert={!open}
        className={`fixed bottom-0 left-0 right-0 z-50 mx-auto flex h-[75dvh] max-w-[800px] flex-col rounded-t-[32px] glass text-foreground transition-transform duration-300 ease-out ${
          open
            ? "translate-y-0 pointer-events-auto"
            : "translate-y-full pointer-events-none"
        }`}
      >
        <SheetHeader onClose={close} isEditing={isEditing} />

        <div className="flex-1 space-y-6 overflow-y-auto px-4 sm:px-6 py-6 scrollbar-thin">
          <Column className="space-y-2 gap-1.5">
            <label className="typo-sub-t-2 text-secondary">📝 제목</label>
            <Input
              value={currentForm.title}
              required
              aria-invalid={!!titleError}
              errorMessage={titleError}
              onChange={(e) => {
                if (titleError) setTitleError("");
                updateForm({ title: e.target.value });
              }}
              placeholder="일정 제목을 입력하세요."
            />
          </Column>

          <Column className="space-y-2 gap-1.5">
            <label className="typo-sub-t-2 text-secondary">📅 날짜</label>

            <button
              type="button"
              onClick={() => toggleCalendar(currentForm.startDate)}
              className="flex w-full items-center justify-between rounded-xl neu-pressed px-4 py-3 text-left hover:ring-2 hover:ring-indigo-500/30 transition-all shadow-sm"
            >
              <div className="flex items-center gap-2">
                <span className="typo-caption-2 text-foreground font-medium">
                  {currentForm.startDate
                    ? format(currentForm.startDate, "yyyy. MM. dd")
                    : "날짜를 선택해 주세요."}
                </span>

                <span className="text-place-h typo-caption-2">
                  {currentForm.endDate ? "~" : ""}
                </span>

                <span className="typo-caption-2 text-foreground font-medium">
                  {currentForm.endDate &&
                    format(currentForm.endDate, "yyyy. MM. dd")}
                </span>
              </div>
            </button>
            {isCalendarOpen && <CalendarBody />}
          </Column>

          <Column className="space-y-2 gap-1.5">
            <label className="typo-sub-t-2 text-secondary">⏰ 시간</label>

            <div className="flex items-center gap-3">
              <Input
                type="text"
                value={currentForm.startTime}
                maxLength={5}
                placeholder="00:00"
                onChange={(e) =>
                  updateForm({ startTime: formatTime(e.target.value) })
                }
              />

              <span className="text-place-h font-medium">~</span>

              <Input
                type="text"
                value={currentForm.endTime}
                maxLength={5}
                placeholder="00:00"
                onChange={(e) =>
                  updateForm({ endTime: formatTime(e.target.value) })
                }
              />
            </div>
          </Column>

          <Column className="gap-2">
            <label className="typo-sub-t-2 text-secondary">🏷️ 카테고리</label>

            <div className="flex flex-wrap gap-2">
              {categories.map((item) => {
                const active = currentForm.category === item.value;
                const style = EVENT_STYLES[item.value];

                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => updateForm({ category: item.value })}
                    className={`
                      rounded-full
                      px-4
                      py-2
                      typo-caption-2
                      transition-all
                      duration-200
                      border
                      ${
                        active
                          ? `${style.label} ${style.border} scale-[1.03] shadow-md`
                          : `border-white/10 neu-pressed text-muted hover:text-secondary`
                      }
                    `}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </Column>

          {(editingId ? viewType : createType) === "GROUP" && (
            <Column className="space-y-2  gap-1.5">
              <label className="typo-sub-t-2 text-secondary">👥 참여자</label>
              <ParticipantPicker
                members={group?.members ?? []}
                selected={currentForm.participantMemberNos}
                readOnly={!canEdit}
                onChange={(ids) => updateForm({ participantMemberNos: ids })}
              />
            </Column>
          )}

          <Column className="space-y-2 gap-1.5">
            <label className="typo-sub-t-2 text-secondary">📌 메모</label>

            <Input
              value={currentForm.content}
              onChange={(e) => updateForm({ content: e.target.value })}
              placeholder="일정 내용을 입력하세요."
            />
          </Column>
        </div>

        <SheetFooter
          onClose={close}
          onSave={handleSave}
          onDelete={handleDelete}
          isEditing={isEditing}
          canEdit={canEdit}
        />
      </section>
    </>
  );
}
