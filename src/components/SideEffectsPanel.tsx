import { AlertTriangle, CheckCircle, Info } from "lucide-react";

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

const severityColors: Record<string, string> = {
  none: "text-muted-foreground",
  mild: "text-bio-warning",
  moderate: "text-bio-danger",
  severe: "text-destructive",
};

export function SideEffectsPanel() {
  return (
    <div className="glass-card rounded-xl p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">Side Effects Monitor</h3>
      <div className="space-y-3">
        {sideEffects.map((effect) => (
          <div
            key={effect.name}
            className="flex items-start gap-3 rounded-lg bg-background/50 p-3 border border-border/30"
          >
            <div className="mt-0.5">
              {effect.active ? (
                <AlertTriangle className={`h-4 w-4 ${severityColors[effect.severity]}`} />
              ) : (
                <CheckCircle className="h-4 w-4 text-bio-success" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">{effect.name}</span>
                {effect.active && (
                  <span className={`text-[10px] uppercase tracking-wider font-bold ${severityColors[effect.severity]}`}>
                    {effect.severity}
                  </span>
                )}
              </div>
              {effect.active && (
                <div className="mt-1.5 flex items-start gap-1.5">
                  <Info className="h-3 w-3 text-muted-foreground mt-0.5 shrink-0" />
                  <p className="text-xs text-muted-foreground">{effect.fix}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
