import { cn } from "@/src/utils/cn";
import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";

type InputProps = React.ComponentProps<"input"> & {
  rightSection?: React.ReactNode;
  description?: string;
  errorMessage?: string;
  onEnter?: () => void;
};

export function Input({
  rightSection,
  errorMessage,
  description,
  className,
  onEnter,
  ...props
}: InputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onEnter?.();
    }
  };

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <div
        className={cn(
          "w-full rounded-xl flex items-center transition px-4",
          "neu-pressed",
          "focus-within:ring-2 focus-within:ring-indigo-500/30",
          "py-3",
          className,
        )}
      >
        <div
          className={cn(
            "flex w-full items-center h-full",
            rightSection && "justify-between gap-2",
          )}
        >
          <input
            {...props}
            onKeyDown={handleKeyDown}
            className={cn(
              "w-full outline-none typo-caption-2 bg-transparent text-slate-100 placeholder:text-slate-500",
              "disabled:text-slate-600",
            )}
          />
          {rightSection}
        </div>
      </div>
      {description && (
        <span className="typo-caption-3 text-slate-400 pl-1">
          {description}
        </span>
      )}
      {errorMessage && (
        <span className="typo-caption-3 text-red-400 pl-1">{errorMessage}</span>
      )}
    </div>
  );
}

export function PasswordInput(props: InputProps) {
  const [show, setShow] = useState(false);

  return (
    <Input
      {...props}
      type={show ? "text" : "password"}
      rightSection={
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="text-slate-400 hover:text-slate-200 transition flex items-center"
        >
          {show ? <Eye size={18} /> : <EyeClosed size={18} />}
        </button>
      }
    />
  );
}
