import { cn } from "@/src/utils/cn";
import { Row, Column } from "./flex";

export default function SectionHeading({
  eyebrow,
  title,
  meta,
  description,
  className,
}: {
  eyebrow: string;
  title: React.ReactNode;
  meta?: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
}) {
  return (
    <Column className={cn("min-w-0 gap-1", className)}>
      <span className="eyebrow">{eyebrow}</span>
      <Row className="items-baseline gap-2">
        <h2 className="typo-sub-t-1 text-foreground">{title}</h2>
        {meta != null && meta !== false && (
          <span className="typo-caption-3 text-place-h">{meta}</span>
        )}
      </Row>
      {description && (
        <p className="typo-caption-2 text-muted">{description}</p>
      )}
    </Column>
  );
}
