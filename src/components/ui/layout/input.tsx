import { cn } from "@/src/utils/cn";
import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";

type InputProps = React.ComponentProps<"input"> & {
  leftSection?: React.ReactNode;
  rightSection?: React.ReactNode;
  description?: string;
  errorMessage?: string;
  successMessage?: string;
  onEnter?: () => void;
};

export function Input({
  successMessage,
  rightSection,
  errorMessage,
  leftSection,
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
            leftSection && "gap-4",
            rightSection && "justify-between gap-2",
          )}
        >
          {leftSection}
          <input
            {...props}
            onKeyDown={handleKeyDown}
            className={cn(
              "w-full outline-none typo-caption-2 bg-transparent text-foreground placeholder:text-place-h",
              "disabled:text-place-h",
            )}
          />
          {rightSection}
        </div>
      </div>
      {!errorMessage && !successMessage && description && (
        <span className="typo-caption-3 text-muted pl-1">
          {description}
        </span>
      )}
      {errorMessage && (
        <span className="typo-caption-3 text-red-400 pl-1">{errorMessage}</span>
      )}
      {successMessage && (
        <span className="typo-caption-3 text-blue-400 pl-1">
          {successMessage}
        </span>
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
          className="text-muted hover:text-secondary transition flex items-center"
        >
          {show ? <Eye size={18} /> : <EyeClosed size={18} />}
        </button>
      }
    />
  );
}
