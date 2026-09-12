import { Pencil, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { springFirm } from "@/src/lib/motion";
import { cn } from "@/src/utils/cn";
import EditArea from "../EditArea";

interface InfoRowProps {
  deps?: string;
  name?: string;
  label: string;
  value?: string;
  error?: string;
  success?: string;
  editing?: boolean;
  dimmed?: boolean;
  showCheck?: boolean;
  icon?: React.ReactNode;
  valueSlot?: React.ReactNode;

  onEdit?: () => void;
  onSave?: () => boolean | void;
  onCancel?: () => void;
  onCheck?: () => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function InfoRow({
  deps,
  name,
  label,
  value,
  error,
  success,
  editing = false,
  dimmed = false,
  showCheck = false,
  icon,
  valueSlot,

  onEdit,
  onSave,
  onCancel,
  onChange,
  onCheck,
}: InfoRowProps) {
  return (
    <motion.div
      animate={{ opacity: dimmed ? 0.4 : 1 }}
      transition={springFirm}
      className="w-full border-b border-divider py-4 last:border-none"
    >
      <div className="flex items-center gap-3">
        {icon && (
          <motion.span
            animate={
              editing ? { scale: 1.08, rotate: -8 } : { scale: 1, rotate: 0 }
            }
            transition={springFirm}
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors duration-200",
              editing
                ? "bg-accent text-on-primary shadow-[var(--elevation-2)]"
                : "neu-btn text-accent",
            )}
          >
            {icon}
          </motion.span>
        )}

        <div className="min-w-0 flex-1">
          <span
            className={cn(
              "typo-caption-3 transition-colors",
              editing ? "text-accent" : "text-place-h",
            )}
          >
            {label}
          </span>

          {editing ? (
            <p className="mt-0.5 typo-caption-2 text-muted">수정 중</p>
          ) : valueSlot ? (
            <div className="mt-1">{valueSlot}</div>
          ) : (
            <p className="mt-0.5 truncate typo-sub-t-3 text-foreground">
              {value}
            </p>
          )}
        </div>

        {onEdit && (
          <button
            type="button"
            onClick={editing ? onCancel : onEdit}
            aria-label={editing ? `${label} 수정 취소` : `${label} 수정`}
            className={cn(
              "neu-btn btn-spring flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
              editing ? "text-accent" : "text-muted hover:text-accent",
            )}
          >
            {editing ? (
              <X size={13} strokeWidth={2} />
            ) : (
              <Pencil size={13} strokeWidth={1.75} />
            )}
            <span className="sr-only">{editing ? "취소" : "수정"}</span>
          </button>
        )}
      </div>

      <AnimatePresence initial={false}>
        {editing && (
          <motion.div
            key="edit"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={springFirm}
          >
            <div className="-mx-2 px-2 pb-2 pt-1">
              <EditArea
                label={label}
                name={name}
                value={value}
                error={error}
                deps={deps}
                success={success}
                showCheck={showCheck}
                onChange={onChange}
                onCheck={onCheck}
                onSave={onSave}
                onCancel={onCancel}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
