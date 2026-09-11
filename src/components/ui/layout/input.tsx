import { cn } from "@/src/utils/cn";
import { Eye, EyeClosed } from "lucide-react";
import { useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { springSnappy } from "@/src/lib/motion";

const shake = {
  idle: { x: 0 },
  error: { x: [0, -6, 6, -4, 4, 0], transition: { duration: 0.4 } },
};

function Message({ text, className }: { text: string; className: string }) {
  return (
    <motion.span
      key={text}
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.18 }}
      className={cn("typo-caption-3 pl-1", className)}
    >
      {text}
    </motion.span>
  );
}

type InputProps = React.ComponentProps<"input"> & {
  label?: string;
  invalid?: boolean;
  leftSection?: React.ReactNode;
  rightSection?: React.ReactNode;
  description?: string;
  errorMessage?: string;
  successMessage?: string;
  onEnter?: () => void;
};

export function Input({
  label,
  invalid,
  successMessage,
  rightSection,
  errorMessage,
  leftSection,
  description,
  className,
  onEnter,
  ...props
}: InputProps) {
  const autoId = useId();
  const id = props.id ?? autoId;

  const [focused, setFocused] = useState(false);
  const [typedLength, setTypedLength] = useState(0);

  const valueLength =
    props.value != null ? String(props.value).length : typedLength;
  const floated = !label || focused || valueLength > 0;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onEnter?.();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTypedLength(e.target.value.length);
    props.onChange?.(e);
  };

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <motion.div
        variants={shake}
        animate={errorMessage || invalid ? "error" : "idle"}
        data-invalid={errorMessage || invalid ? "true" : undefined}
        className={cn(
          "relative w-full rounded-xl flex items-center px-4 overflow-hidden",
          "neu-input",
          label ? "h-[52px]" : "py-3",
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

          <div className="relative flex h-full min-w-0 flex-1 items-center">
            {label && (
              <motion.label
                htmlFor={id}
                initial={false}
                animate={{
                  y: floated ? -11 : 0,
                  scale: floated ? 0.78 : 1,
                }}
                transition={springSnappy}
                className={cn(
                  "pointer-events-none absolute left-0.5 origin-left typo-caption-2 transition-colors duration-200",
                  focused ? "text-accent" : "text-place-h",
                )}
              >
                {label}
              </motion.label>
            )}

            <input
              {...props}
              id={id}
              placeholder={label ? undefined : props.placeholder}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onFocus={(e) => {
                setFocused(true);
                props.onFocus?.(e);
              }}
              onBlur={(e) => {
                setFocused(false);
                props.onBlur?.(e);
              }}
              className={cn(
                "w-full px-0.5 outline-none typo-caption-2 bg-transparent text-foreground placeholder:text-place-h",
                "disabled:text-place-h",
                label && "pt-4",
              )}
            />
          </div>

          {rightSection}
        </div>
      </motion.div>

      <AnimatePresence mode="wait" initial={false}>
        {errorMessage ? (
          <Message text={errorMessage} className="text-red-400" />
        ) : successMessage ? (
          <Message text={successMessage} className="text-blue-400" />
        ) : description ? (
          <Message text={description} className="text-muted" />
        ) : null}
      </AnimatePresence>
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
          aria-label={show ? "비밀번호 숨기기" : "비밀번호 표시"}
          className="text-muted hover:text-secondary transition flex items-center"
        >
          {show ? <Eye size={18} /> : <EyeClosed size={18} />}
        </button>
      }
    />
  );
}
