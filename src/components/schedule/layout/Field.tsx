import { Column } from "../../ui/layout/flex";

interface FieldProps {
  label: string;
  children: React.ReactNode;
}

export default function Field({ label, children }: FieldProps) {
  return (
    <Column className="gap-[8px] w-full items-start">
      <label className="typo-caption-1">{label}</label>
      {children}
    </Column>
  );
}
