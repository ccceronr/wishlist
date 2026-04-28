import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  sparkleClassName?: string;
};

const sizes = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-xl",
  xl: "text-2xl",
};

export function Logo({ className, size = "md", sparkleClassName }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-bold tracking-tight",
        sizes[size],
        className
      )}
    >
      <span aria-hidden className={cn("drop-shadow-sm", sparkleClassName)}>✨</span>
      <span className="bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-500 bg-clip-text text-transparent">
        Wishlist
      </span>
    </span>
  );
}
