import { GhostBtn, Primary } from "./layout/button";
import { Row } from "./layout/flex";
import { Input } from "./layout/input";

interface Props {
  label?: string;
  deps?: string;
  name?: string;
  value?: string;
  error?: string;
  success?: string;
  showCheck?: boolean;

  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCheck?: () => void;
  onSave?: () => void;
  onCancel?: () => void;
}

export default function EditArea({
  label,
  deps,
  name,
  error,
  value,
  success,
  showCheck,

  onSave,
  onCheck,
  onCancel,
  onChange,
}: Props) {
  return (
    <div className="mt-3">
      <Input
        name={name}
        label={label}
        onEnter={onSave}
        description={deps}
        value={value ?? ""}
        onChange={onChange}
        errorMessage={error}
        successMessage={success}
        rightSection={
          showCheck && (
            <Primary
              text="중복확인"
              className="h-8 shrink-0 rounded-lg px-3 typo-caption-3"
              onClick={onCheck}
            />
          )
        }
      />

      <Row
        className="
          mt-3
          justify-end
          gap-2
        "
      >
        <GhostBtn
          text="취소"
          onClick={onCancel}
          className="h-9 rounded-xl px-3 typo-caption-2"
        />

        <Primary
          text="완료"
          onClick={onSave}
          className="h-9 rounded-xl px-4 typo-caption-2"
        />
      </Row>
    </div>
  );
}
