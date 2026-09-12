"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { fadeQuick, springFirm, springSoft } from "@/src/lib/motion";
import { useMediaQuery } from "@/src/hooks/useMediaQuery";
import { cn } from "@/src/utils/cn";
import { usePathname } from "next/navigation";
import AvatarImage from "@/src/components/common/AvatarImage";
import {
  CalendarDays,
  Check,
  ChevronDown,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useSheetStore } from "@/src/hooks/stores/useSheetStore";
import { useScheduleView } from "@/src/hooks/useScheduleView";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Input } from "../layout/input";
import { Row } from "../layout/flex";
import DropdownMenu from "../DropdownMenu";
import { Primary, GhostBtn } from "../layout/button";
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
  { value: "meeting", label: "회의" },
  { value: "important", label: "중요" },
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

function FieldLabel({
  children,
  required = false,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <span className="eyebrow flex items-center gap-1.5">
      {children}
      {required && (
        <span className="rounded-full bg-accent/12 px-1.5 py-px text-[10px] font-semibold leading-4 tracking-normal text-accent">
          필수
        </span>
      )}
    </span>
  );
}

function SheetHeader({
  onClose,
  isEditing,
  canEdit,
}: {
  onClose: () => void;
  isEditing: boolean;
  canEdit: boolean;
}) {
  return (
    <header className="flex shrink-0 items-center justify-between px-5 pt-4 sm:px-7 sm:pt-6">
      <span className="eyebrow">
        {isEditing ? (canEdit ? "EDIT SCHEDULE" : "SCHEDULE") : "NEW SCHEDULE"}
      </span>
      <button
        type="button"
        onClick={onClose}
        aria-label="닫기"
        className="neu-btn btn-spring flex h-9 w-9 items-center justify-center rounded-full text-muted hover:text-foreground"
      >
        <X size={16} strokeWidth={2} />
      </button>
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
    <footer className="flex shrink-0 items-center gap-2 border-t border-divider px-5 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-4 sm:px-7 lg:pb-5">
      {isEditing && canEdit && (
        <button
          type="button"
          onClick={onDelete}
          className="btn-spring flex h-10 items-center gap-1.5 rounded-xl px-3 typo-caption-2 font-medium text-place-h hover:text-error-500"
        >
          <Trash2 size={14} strokeWidth={1.75} />
          삭제
        </button>
      )}

      <div className="ml-auto flex items-center gap-2">
        <GhostBtn
          text={canEdit ? "취소" : "닫기"}
          onClick={onClose}
          className="h-10 rounded-xl px-4 typo-caption-2"
        />
        {canEdit && (
          <Primary
            text={isEditing ? "저장" : "추가"}
            onClick={onSave}
            className="h-10 rounded-xl px-6 typo-caption-2"
          />
        )}
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
  const { viewType } = useScheduleView();
  const { openAlert } = useOverlay();
  const { data: myInfo } = useMyInfo(open);
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const groupNo = group?.groupNo;

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "unset";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  useEffect(() => {
    closeSheet();
  }, [pathname, closeSheet]);

  const close = () => {
    closeSheet();
    if (isCalendarOpen) toggleCalendar();
  };

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      // 열린 드롭다운(참여자 선택)이 있으면 그쪽이 먼저 닫힌다.
      if (e.key === "Escape" && !document.querySelector('[role="menu"]')) {
        close();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

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

  const activeStyle =
    EVENT_STYLES[currentForm.category as keyof typeof EVENT_STYLES];
  const isGroupForm = (editingId ? viewType : createType) === "GROUP";
  const dateLabel = currentForm.startDate
    ? format(currentForm.startDate, "M월 d일 (EEE)", { locale: ko })
    : "날짜 선택";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="sheet-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={fadeQuick}
          className="fixed inset-0 z-40 bg-black/55"
          onClick={close}
        />
      )}

      {open && (
        <motion.section
          key="sheet"
          role="dialog"
          aria-modal="true"
          aria-label={isEditing ? "일정 수정" : "일정 추가"}
          initial={
            isDesktop
              ? { opacity: 0, scale: 0.94, x: "-50%", y: "-46%" }
              : { y: "100%" }
          }
          animate={
            isDesktop
              ? { opacity: 1, scale: 1, x: "-50%", y: "-50%" }
              : { y: 0 }
          }
          exit={
            isDesktop
              ? {
                  opacity: 0,
                  scale: 0.97,
                  x: "-50%",
                  y: "-48%",
                  transition: fadeQuick,
                }
              : { y: "100%", transition: springFirm }
          }
          transition={isDesktop ? springSoft : springFirm}
          className={cn(
            "neu-float fixed z-50 flex flex-col bg-surface text-foreground",
            "inset-x-0 bottom-0 max-h-[88dvh] rounded-t-[28px]",
            "lg:inset-auto lg:left-1/2 lg:top-1/2 lg:w-[560px] lg:max-h-[calc(100dvh-4rem)] lg:rounded-[var(--radius-outer)]",
          )}
        >
          <span
            aria-hidden
            className="mx-auto mt-2.5 h-1 w-10 shrink-0 rounded-full bg-divider lg:hidden"
          />

          <SheetHeader
            onClose={close}
            isEditing={isEditing}
            canEdit={canEdit}
          />

          <div className="scroll-hidden flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-5 pb-6 pt-3 sm:px-7">
            <div className="flex flex-col gap-2">
              <FieldLabel required>TITLE</FieldLabel>
              <label
                className="neu-input flex h-14 items-center gap-3 rounded-xl px-4"
                data-invalid={titleError ? "true" : undefined}
              >
                <span
                  aria-hidden
                  className={cn(
                    "h-3 w-3 shrink-0 rounded-full transition-colors",
                    activeStyle?.dot ?? "bg-accent",
                  )}
                />
                <input
                  value={currentForm.title}
                  required
                  maxLength={30}
                  readOnly={!canEdit}
                  autoFocus={isDesktop && canEdit}
                  aria-label="제목"
                  aria-invalid={!!titleError}
                  onChange={(e) => {
                    if (titleError) setTitleError("");
                    updateForm({ title: e.target.value });
                  }}
                  placeholder="무슨 일정인가요?"
                  className="w-full bg-transparent typo-sub-t-1 font-semibold tracking-tight text-foreground outline-none placeholder:font-medium placeholder:text-place-h"
                />
                <span className="shrink-0 typo-caption-3 tabular-nums text-place-h">
                  {currentForm.title.length}/30
                </span>
              </label>
              {titleError && (
                <p className="typo-caption-3 text-error-500">{titleError}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <FieldLabel required>WHEN</FieldLabel>
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:grid-cols-[1.4fr_1fr_auto_1fr]">
                <button
                  type="button"
                  disabled={!canEdit}
                  onClick={() => toggleCalendar(currentForm.startDate)}
                  aria-expanded={isCalendarOpen}
                  className={cn(
                    "btn-spring col-span-3 flex h-[52px] items-center gap-2.5 rounded-xl px-4 text-left sm:col-span-1",
                    "border transition-colors",
                    isCalendarOpen
                      ? "neu-pressed border-accent/60 text-accent"
                      : "neu-btn border-accent/20 text-foreground hover:-translate-y-0.5 hover:border-accent/50",
                  )}
                >
                  <CalendarDays
                    size={15}
                    strokeWidth={1.75}
                    className="shrink-0 text-accent"
                  />
                  <span className="min-w-0 flex-1 truncate typo-caption-1 font-medium">
                    {dateLabel}
                    {currentForm.endDate &&
                      ` ~ ${format(currentForm.endDate, "M월 d일", { locale: ko })}`}
                  </span>
                  <span
                    className={cn(
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/12 text-accent transition-transform",
                      isCalendarOpen && "rotate-180",
                    )}
                  >
                    <ChevronDown size={13} strokeWidth={2} />
                  </span>
                </button>

                <Input
                  type="text"
                  label="시작"
                  inputMode="numeric"
                  value={currentForm.startTime}
                  maxLength={5}
                  readOnly={!canEdit}
                  onChange={(e) =>
                    updateForm({ startTime: formatTime(e.target.value) })
                  }
                />
                <span className="typo-caption-2 text-place-h">~</span>
                <Input
                  type="text"
                  label="종료"
                  inputMode="numeric"
                  value={currentForm.endTime}
                  maxLength={5}
                  readOnly={!canEdit}
                  onChange={(e) =>
                    updateForm({ endTime: formatTime(e.target.value) })
                  }
                />
              </div>

              <AnimatePresence initial={false}>
                {isCalendarOpen && (
                  <motion.div
                    key="calendar"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={springFirm}
                    className="overflow-hidden"
                  >
                    <div className="-mx-3 px-3 pb-3 pt-2">
                      <CalendarBody />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex flex-col gap-2">
              <FieldLabel>CATEGORY</FieldLabel>
              <div className="flex flex-wrap gap-2">
                {categories.map((item) => {
                  const active = currentForm.category === item.value;
                  const style = EVENT_STYLES[item.value];

                  return (
                    <button
                      key={item.value}
                      type="button"
                      disabled={!canEdit}
                      aria-pressed={active}
                      onClick={() => updateForm({ category: item.value })}
                      className={cn(
                        "btn-spring flex h-9 items-center gap-2 rounded-full border pl-3 pr-3.5 typo-caption-2 font-medium transition-colors",
                        active
                          ? `neu-pressed font-semibold ${style.chip}`
                          : "neu-btn border-accent/20 text-secondary hover:-translate-y-0.5 hover:border-accent/50 hover:text-foreground",
                      )}
                    >
                      <span className={cn("h-2 w-2 rounded-full", style.dot)} />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {isGroupForm && (
              <div className="flex flex-col gap-2">
                <FieldLabel>WITH</FieldLabel>
                <ParticipantPicker
                  members={group?.members ?? []}
                  selected={currentForm.participantMemberNos}
                  readOnly={!canEdit}
                  onChange={(ids) => updateForm({ participantMemberNos: ids })}
                />
              </div>
            )}

            <div className="flex flex-col gap-2">
              <FieldLabel>NOTE</FieldLabel>
              <Input
                label="메모"
                maxLength={200}
                readOnly={!canEdit}
                value={currentForm.content}
                onChange={(e) => updateForm({ content: e.target.value })}
              />
            </div>
          </div>

          <SheetFooter
            onClose={close}
            onSave={handleSave}
            onDelete={handleDelete}
            isEditing={isEditing}
            canEdit={canEdit}
          />
        </motion.section>
      )}
    </AnimatePresence>
  );
}
