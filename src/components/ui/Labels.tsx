type LabelProps = {
  children: React.ReactNode;
  className?: string;
};

export function Label({ children, className = "" }: LabelProps) {
  return (
    <div
      className={`
        inline-flex
        items-center
        justify-center
        rounded-md
        px-2
        py-1
        typo-caption-2
        ${className}
      `}
    >
      {children}
    </div>
  );
}
