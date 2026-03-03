const variantStyles = {
  default: "bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-200",
  primary: "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300",
  green: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300",
  yellow: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300",
  red: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300",
  purple: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300",
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
