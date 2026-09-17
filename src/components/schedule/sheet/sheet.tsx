"use client";

import { useEffect, useEffectEvent, useState } from "react";
import { usePathname } from "next/navigation";
import { format } from "date-fns";

import { Input } from "@/src/components/ui/layout/input";
import { useActiveGroup } from "@/src/hooks/querys/useGroup";
import { useMyInfo } from "@/src/hooks/querys/useMembers";
import { useCalendarStore } from "@/src/hooks/stores/useCalendarStore";
import { useSheetStore } from "@/src/hooks/stores/useSheetStore";
import { useMediaQuery } from "@/src/hooks/useMediaQuery";
import { useScheduleView } from "@/src/hooks/useScheduleView";
import { canEditSchedule, toScheduleRequest } from "@/src/utils/schedule";
import CategoryField from "./fields/CategoryField";
import TitleField from "./fields/TitleField";
import WhenField from "./fields/WhenField";
import ParticipantPicker from "./ParticipantPicker";
import { FieldLabel, SheetFooter, SheetHeader } from "./SheetParts";
import SheetShell from "./SheetShell";
import { useScheduleMutations } from "./useScheduleMutations";

const combineDateTime = (date: Date, time: string) => {
  const [hour, minute] = time.split(":").map(Number);
  const combined = new Date(date);
  combined.setHours(hour || 0, minute || 0, 0, 0);
  return format(combined, "yyyy-MM-dd'T'HH:mm:ss");
};

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
  const { data: myInfo } = useMyInfo(open);
  const pathname = usePathname();
  const isDesktop = useMediaQuery("(min-width: 1024px)");

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

  // 열린 드롭다운(참여자 선택)이 있으면 그쪽이 먼저 닫힌다.
  const onEscape = useEffectEvent(() => {
    if (!document.querySelector('[role="menu"]')) close();
  });

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onEscape();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const { create, update, remove } = useScheduleMutations({
    groupNo: createType === "GROUP" ? group?.groupNo : undefined,
    onDone: close,
  });

  if (!form) return null;

  const isEditing = !!editingId;
  const isGroupForm = (editingId ? viewType : createType) === "GROUP";

  const canEdit =
    !isEditing ||
    canEditSchedule({
      createdBy: editingAuthorNo ?? undefined,
      myMemberNo: myInfo?.memberNo,
      myGroupRole: group?.groupRole,
    });

  const handleSave = () => {
    if (!form.title.trim()) {
      setTitleError("제목을 입력해주세요.");
      return;
    }
    setTitleError("");

    const startDate = form.startDate ?? new Date();
    const endDate = form.endDate ?? startDate;
    const startTime = form.startTime || "00:00";
    const endTime = form.endTime || startTime;

    const body = toScheduleRequest({
      title: form.title.trim(),
      content: form.content,
      category: form.category || "personal",
      startDate: combineDateTime(startDate, startTime),
      endDate: combineDateTime(endDate, endTime),
      participantMemberNos: isGroupForm ? form.participantMemberNos : undefined,
    });

    if (editingId) update({ id: editingId, body });
    else create(body);
  };

  return (
    <SheetShell
      open={open}
      isDesktop={isDesktop}
      label={isEditing ? "일정 수정" : "일정 추가"}
      onClose={close}
    >
      <SheetHeader onClose={close} isEditing={isEditing} canEdit={canEdit} />

      <div className="scroll-hidden flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-5 pb-6 pt-3 sm:px-7">
        <TitleField
          value={form.title}
          category={form.category}
          error={titleError}
          readOnly={!canEdit}
          autoFocus={isDesktop && canEdit}
          onChange={(title) => {
            if (titleError) setTitleError("");
            updateForm({ title });
          }}
        />

        <WhenField value={form} readOnly={!canEdit} onChange={updateForm} />

        <CategoryField
          value={form.category}
          readOnly={!canEdit}
          onChange={(category) => updateForm({ category })}
        />

        {isGroupForm && (
          <div className="flex flex-col gap-2">
            <FieldLabel>WITH</FieldLabel>
            <ParticipantPicker
              members={group?.members ?? []}
              selected={form.participantMemberNos}
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
            value={form.content}
            onChange={(e) => updateForm({ content: e.target.value })}
          />
        </div>
      </div>

      <SheetFooter
        onClose={close}
        onSave={handleSave}
        onDelete={() => editingId && remove(editingId)}
        isEditing={isEditing}
        canEdit={canEdit}
      />
    </SheetShell>
  );
}
