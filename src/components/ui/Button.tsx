import type { ComponentPropsWithoutRef } from "react";

type Variant = "chocolate" | "on-image";

const variants: Record<Variant, string> = {
  // Figma: Button / Chocolate (2:43)
  chocolate:
    "bg-brown border-brown text-cream hover:bg-olive hover:border-olive",
  // Figma: Button / On image (2:46)
  "on-image":
    "bg-transparent border-cream text-cream hover:bg-cream hover:text-brown",
};

type ButtonProps = ComponentPropsWithoutRef<"a"> & {
  variant?: Variant;
};

export function Button({
  variant = "chocolate",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <a
      className={`group inline-flex items-center gap-[34px] border px-[25px] py-[18px] font-sans whitespace-nowrap transition-colors duration-500 ${variants[variant]} ${className}`}
      {...props}
    >
      <span className="text-[12px] leading-[20.4px]">{children}</span>
      <span
        aria-hidden
        className="text-[18px] leading-[30.6px] transition-transform duration-500 group-hover:translate-x-1.5"
      >
        →
      </span>
    </a>
  );
}
