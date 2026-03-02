const variantStyles = {
  default: "bg-surface-100 text-surface-700",
  primary: "bg-primary-100 text-primary-700",
  green: "bg-green-100 text-green-700",
  yellow: "bg-yellow-100 text-yellow-700",
  red: "bg-red-100 text-red-700",
  purple: "bg-purple-100 text-purple-700",
} as const;

interface BadgeProps {
  children: React.ReactNode;
  variant?: keyof typeof variantStyles;
}

export function Badge({ children, variant = "default" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${variantStyles[variant]}`}
    >
      {children}
    </span>
  );
}

export function CostTierBadge({ tier }: { tier: string }) {
  const variant = tier === "cheap" ? "green" : tier === "mid" ? "yellow" : "red";
  return <Badge variant={variant}>{tier}</Badge>;
}

export function SpeedTierBadge({ tier }: { tier: string }) {
  const variant = tier === "fast" ? "green" : tier === "balanced" ? "yellow" : "purple";
  return <Badge variant={variant}>{tier}</Badge>;
}

export function StatusBadge({ status }: { status: string }) {
  const variant = status === "active" ? "green" : "red";
  return <Badge variant={variant}>{status}</Badge>;
}
