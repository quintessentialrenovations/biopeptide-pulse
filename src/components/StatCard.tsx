import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  glow?: boolean;
  gradient?: string;
}

export function StatCard({ label, value, sub, icon: Icon, trend, glow, gradient = "gradient-blue" }: StatCardProps) {
  return (
    <div className={cn("glass-card rounded-2xl p-5 card-hover", glow && "pulse-glow")}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</p>
          <p className="mt-1.5 text-2xl font-extrabold text-foreground">{value}</p>
          {sub && (
            <p className={cn(
              "mt-1 text-xs font-medium",
              trend === "down" ? "text-bio-success" : trend === "up" ? "text-bio-danger" : "text-muted-foreground"
            )}>
              {sub}
            </p>
          )}
        </div>
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", gradient)}>
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>
    </div>
  );
}
