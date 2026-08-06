import { LineBtn, Primary } from "./layout/button";
import { Row } from "./layout/flex";
import { Input } from "./layout/input";

interface Props {
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
        description={deps}
        value={value ?? ""}
        onChange={onChange}
        errorMessage={error}
        successMessage={success}
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

      <Row
        className="
          mt-3
          justify-end
          gap-2
        "
      >
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
  );
}
