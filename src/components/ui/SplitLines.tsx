import type { ElementType } from "react";

type SplitLinesProps = {
  lines: string[];
  as?: ElementType;
  className?: string;
  id?: string;
};

/**
 * Renders a multi-line headline with each line wrapped in an overflow mask,
 * so GSAP can slide lines up into view (`[data-line]`).
 * Lines follow the line breaks set in the Figma design.
 */
export function SplitLines({ lines, as: Tag = "h2", className = "", id }: SplitLinesProps) {
  return (
    <Tag id={id} className={className}>
      {lines.map((line, i) => (
        <span key={i} className="line-mask">
          <span data-line>{line}</span>
        </span>
      ))}
    </Tag>
  );
}
