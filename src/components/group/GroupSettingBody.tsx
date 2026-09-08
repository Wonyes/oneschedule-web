"use client";

import { Check, ChevronDown } from "lucide-react";

import DropdownMenu from "../ui/DropdownMenu";
import { Column, Row } from "../ui/layout/flex";
import { VISIBILITY_META, visibilityIcon } from "./VisibilityBadge";
import { useUpdateGroupSetting } from "@/src/hooks/querys/useGroup";
import { useOverlay } from "@/src/hooks/useOverlay";
import { CustomError, getErrorMessage } from "@/src/types/ErrorResponse";
import { GroupVisibility, MyGroupResponse } from "@/src/types/group";
import { cn } from "@/src/utils/cn";

const OPTIONS: GroupVisibility[] = [
  "PRIVATE",
  "PUBLIC_OPEN",
  "PUBLIC_APPROVAL",
];

/** 닫혔을 때와 열렸을 때가 같은 모양이라 한 곳에서 그린다. */
function OptionRow({
  option,
  selected,
  trailing,
}: {
  option: GroupVisibility;
  selected: boolean;
  trailing?: React.ReactNode;
}) {
  const { label, hint, tone } = VISIBILITY_META[option];

  return (
    <Row className="w-full items-start gap-2.5">
      <span className={cn("mt-0.5 shrink-0", selected ? tone : "text-place-h")}>
        {visibilityIcon(option, 14)}
      </span>

      <Column className="min-w-0 flex-1 gap-0.5 text-left">
        <span
          className={cn(
            "typo-caption-2 font-semibold",
            selected ? "text-accent" : "text-secondary",
          )}
        >
          {label}
        </span>
        <span className="typo-caption-3 text-muted">{hint}</span>
      </Column>

      {trailing}
    </Row>
  );
}

/**
 * 그룹 공개 범위 설정.
 *
 * 소개는 히어로에서 고친다. 그룹명 수정이 거기 있어 자리를 맞췄다.
 * 그룹장에게만 보인다.
 */
export default function GroupSettingBody({
  group,
}: {
  group: MyGroupResponse;
}) {
  const { openToast, openAlert } = useOverlay();

  const { mutate: updateSetting, isPending } = useUpdateGroupSetting(
    group.groupNo,
  );

  const current = group.visibility ?? "PRIVATE";

  const onError = (err: CustomError) =>
    openAlert({
      title: "변경에 실패했습니다.",
      message: getErrorMessage(err, "잠시 후 다시 시도해주세요."),
    });

  const selectVisibility = (value: GroupVisibility, close: () => void) => {
    close();

    if (value === current || isPending) return;

    updateSetting(
      { visibility: value },
      {
        onSuccess: () => openToast({ message: "공개 설정을 변경했습니다." }),
        onError,
      },
    );
  };

  return (
    <Column className="w-full gap-2">
      <DropdownMenu
        label="그룹 공개 설정 변경"
        align="stretch"
        disabled={isPending}
        className="w-full"
        triggerClassName="neu-btn w-full rounded-xl px-4 py-3"
        panelClassName="p-2"
        trigger={(isOpen) => (
          <OptionRow
            option={current}
            selected
            trailing={
              <ChevronDown
                size={14}
                strokeWidth={2}
                className={cn(
                  "mt-0.5 shrink-0 text-place-h transition-transform duration-200",
                  isOpen && "rotate-180",
                )}
              />
            }
          />
        )}
      >
        {(close) => (
          <Column className="w-full gap-1">
            {OPTIONS.map((option) => {
              const selected = option === current;

              return (
                <button
                  key={option}
                  type="button"
                  role="menuitemradio"
                  aria-checked={selected}
                  onClick={() => selectVisibility(option, close)}
                  className={cn(
                    "w-full rounded-xl px-3 py-2.5 focus-visible:outline-none",
                    selected ? "neu-flat" : "neu-pressed hover:bg-white/5",
                  )}
                >
                  <OptionRow
                    option={option}
                    selected={selected}
                    trailing={
                      selected ? (
                        <Check
                          size={14}
                          strokeWidth={2.5}
                          className="mt-0.5 shrink-0 text-accent"
                        />
                      ) : undefined
                    }
                  />
                </button>
              );
            })}
          </Column>
        )}
      </DropdownMenu>
    </Column>
  );
}
