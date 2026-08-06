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

  onEdit,
  onSave,
  onCancel,
  onChange,
  onCheck,
}: InfoRowProps) {
  return (
    <div
      className="
        py-5
        w-full
        border-b
        border-white/5
        last:border-none
      "
    >
      <div className="flex justify-between items-center">
        <p className="typo-caption-2 text-slate-500">{label}</p>

        {!editing && onEdit && (
          <button
            onClick={onEdit}
            className="
              flex
              items-center
              gap-1
              text-indigo-400
              typo-caption-2
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
      ) : (
        <p
          className="
          mt-1
          typo-sub-t-3
          text-slate-100
        "
        >
          {value}
        </p>
      )}
    </div>
  );
}
