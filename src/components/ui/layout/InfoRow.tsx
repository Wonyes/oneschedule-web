import { Pencil } from "lucide-react";
import EditArea from "../EditArea";

interface InfoRowProps {
  deps?: string;
  name?: string;
  label: string;
  value?: string;
  error?: string;
  success?: string;
  editing?: boolean;
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
    <div
      className="
        py-4
        w-full
        border-b
        border-divider
        last:border-none
      "
    >
      <div className="flex justify-between items-center gap-2">
        <span className="flex items-center gap-1.5">
          {icon && <span className="text-place-h shrink-0">{icon}</span>}
          <span className="typo-caption-2 text-place-h">{label}</span>
        </span>

        {!editing && onEdit && (
          <button
            type="button"
            onClick={onEdit}
            aria-label={`${label} 수정`}
            className="
              btn-spring
              flex
              shrink-0
              items-center
              gap-1
              rounded-lg
              px-2
              py-1
              text-accent
              typo-caption-2
              hover:bg-accent/10
            "
          >
            <Pencil size={12} />
            수정
          </button>
        )}
      </div>

      {editing ? (
        <EditArea
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
      ) : valueSlot ? (
        <div className="mt-1.5">{valueSlot}</div>
      ) : (
        <p className="mt-1 typo-sub-t-3 text-foreground">{value}</p>
      )}
    </div>
  );
}
