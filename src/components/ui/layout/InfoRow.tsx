import { Pencil } from "lucide-react";
import { Input } from "./input";
import { LineBtn, Primary } from "./button";
import { Row } from "./flex";

export function InfoRow({
  name,
  label,
  value,
  error,
  editing,
  showCheck,
  onEdit,
  onSave,
  onCancel,
  onChange,
  onCheck,
}: {
  name?: string;
  label: string;
  error?: string;
  value?: string;
  editing?: boolean;
  showCheck?: boolean;
  onEdit?: () => void;
  onSave?: () => void;
  onCancel?: () => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCheck?: () => void;
}) {
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
        <div className="mt-3">
          <Input
            name={name}
            value={value ?? ""}
            onChange={onChange}
            errorMessage={error}
            autoFocus
            rightSection={
              showCheck && (
                <Primary
                  text="중복확인"
                  className="
                    py-[6px]
                    px-3
                    rounded-lg
                    text-xs
                  "
                  onClick={onCheck}
                />
              )
            }
          />

          <Row className="mt-3 justify-end gap-2">
            <LineBtn
              text="취소"
              onClick={onCancel}
              className="
                px-3
                h-8
                typo-caption-2
              "
            />

            <Primary
              text="완료"
              onClick={onSave}
              className="
                px-3
                h-8
                typo-caption-2
              "
            />
          </Row>
        </div>
      ) : (
        <p className="mt-1 typo-sub-t-3 text-slate-100">{value}</p>
      )}
    </div>
  );
}
