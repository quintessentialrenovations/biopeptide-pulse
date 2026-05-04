import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  glow?: boolean;
}

export function StatCard({ label, value, sub, icon: Icon, trend, glow }: StatCardProps) {
  return (
    <div className={cn("glass-card rounded-xl p-5 transition-all hover:border-primary/30", glow && "pulse-glow")}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
          <p className="mt-1.5 text-2xl font-bold text-foreground">{value}</p>
          {sub && (
            <p className={cn(
              "mt-1 text-xs font-medium",
              trend === "down" ? "text-bio-success" : trend === "up" ? "text-bio-danger" : "text-muted-foreground"
            )}>
              {sub}
            </p>
          )}
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
    </div>
  );
}
