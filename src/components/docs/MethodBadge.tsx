import { cn } from "@/lib/utils";

interface MethodBadgeProps {
  type: "core" | "payment" | "query" | "terminal" | "session";
  className?: string;
}

const methodStyles = {
  core: "bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] border-[hsl(var(--primary))]/20",
  payment: "bg-[hsl(var(--method-get))]/10 text-[hsl(var(--method-get))] border-[hsl(var(--method-get))]/20",
  query: "bg-[hsl(var(--accent))]/10 text-[hsl(var(--accent))] border-[hsl(var(--accent))]/20",
  terminal: "bg-[hsl(var(--method-put))]/10 text-[hsl(var(--method-put))] border-[hsl(var(--method-put))]/20",
  session: "bg-[hsl(var(--method-delete))]/10 text-[hsl(var(--method-delete))] border-[hsl(var(--method-delete))]/20",
};

const methodLabels = {
  core: "Core",
  payment: "Payment",
  query: "Query",
  terminal: "Terminal",
  session: "Session",
};

export const MethodBadge = ({ type, className }: MethodBadgeProps) => {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border",
        methodStyles[type],
        className
      )}
    >
      {methodLabels[type]}
    </span>
  );
};
