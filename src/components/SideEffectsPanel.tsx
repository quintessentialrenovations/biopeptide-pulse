import { AlertTriangle, CheckCircle, Lightbulb } from "lucide-react";

const sideEffects = [
  {
    name: "Nausea",
    severity: "mild",
    cause: "Delayed gastric emptying",
    fix: "Smaller meals, avoid fatty foods, stay hydrated",
    active: true,
  },
  {
    name: "Fatigue",
    severity: "moderate",
    cause: "Caloric deficit adaptation",
    fix: "Electrolytes, adequate sleep, slight calorie adjustment",
    active: true,
  },
  {
    name: "Constipation",
    severity: "none",
    cause: "Slower digestion",
    fix: "Fiber, magnesium, increased hydration",
    active: false,
  },
  {
    name: "Low Appetite",
    severity: "none",
    cause: "Strong receptor activation",
    fix: "Lower dose or intentional meal spacing",
    active: false,
  },
];

const severityConfig: Record<string, { color: string; bg: string; label: string }> = {
  none: { color: "text-muted-foreground", bg: "bg-muted", label: "None" },
  mild: { color: "text-bio-warning", bg: "bg-bio-warning/10", label: "Mild" },
  moderate: { color: "text-bio-danger", bg: "bg-bio-danger/10", label: "Moderate" },
  severe: { color: "text-destructive", bg: "bg-destructive/10", label: "Severe" },
};

export function SideEffectsPanel() {
  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="text-base font-bold text-foreground mb-4">Side Effects</h3>
      <div className="space-y-3">
        {sideEffects.map((effect) => {
          const config = severityConfig[effect.severity];
          return (
            <div
              key={effect.name}
              className="flex items-start gap-3 rounded-xl bg-accent/50 p-3.5"
            >
              <div className="mt-0.5">
                {effect.active ? (
                  <div className={`h-7 w-7 rounded-full ${config.bg} flex items-center justify-center`}>
                    <AlertTriangle className={`h-3.5 w-3.5 ${config.color}`} />
                  </div>
                ) : (
                  <div className="h-7 w-7 rounded-full bg-bio-success/10 flex items-center justify-center">
                    <CheckCircle className="h-3.5 w-3.5 text-bio-success" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">{effect.name}</span>
                  {effect.active && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${config.color} ${config.bg}`}>
                      {config.label}
                    </span>
                  )}
                </div>
                {effect.active && (
                  <div className="mt-1.5 flex items-start gap-1.5">
                    <Lightbulb className="h-3 w-3 text-bio-warning mt-0.5 shrink-0" />
                    <p className="text-xs text-muted-foreground">{effect.fix}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
