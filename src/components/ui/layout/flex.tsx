import { cn } from "@/src/utils/cn";

interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

const Row = ({ className, children, ...props }: FlexProps) => {
  return (
    <div className={cn("flex items-center", className)} {...props}>
      {children}
    </div>
  );
};

const Column = ({ className, children, ...props }: FlexProps) => {
  return (
    <div className={cn("flex flex-col items-start", className)} {...props}>
      {children}
    </div>
  );
};

const Between = ({ className, children, ...props }: FlexProps) => {
  return (
    <div
      className={cn("flex justify-between items-center", className)}
      {...props}
    >
      {children}
    </div>
  );
};

export { Row, Column, Between };
