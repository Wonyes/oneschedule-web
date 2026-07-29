import { cn } from "@/src/utils/cn";
import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";

type InputProps = React.ComponentProps<"input"> & {
  rightSection?: React.ReactNode;
};

export function Input({ rightSection, className, ...props }: InputProps) {
  return (
    <div
      className={cn(
        "w-full rounded-xl flex shadow-soft transition px-4 py-3 border border-gray-300",
        "focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100",
      )}
    >
      <div className={cn("flex w-full", rightSection && "justify-between")}>
        <input
          {...props}
          className={cn(
            "w-full outline-none typo-caption-2",
            "disabled:bg-gray-100 disabled:text-gray-400",
            className,
          )}
        />
        {rightSection}
      </div>
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
        <button type="button" onClick={() => setShow(!show)}>
          {show ? <Eye size={20} /> : <EyeClosed size={20} />}
        </button>
      }
    />
  );
}
