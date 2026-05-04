import { AlertTriangle, CheckCircle, Lightbulb } from "lucide-react";
import { useI18n } from "@/i18n/context";
import type { TranslationKey } from "@/i18n/translations";

interface SideEffect {
  nameKey: TranslationKey;
  severity: string;
  causeKey: TranslationKey;
  fixKey: TranslationKey;
  active: boolean;
}

const sideEffects: SideEffect[] = [
  { nameKey: "comp.nausea", severity: "mild", causeKey: "comp.nauseaCause", fixKey: "comp.nauseaFix", active: true },
  { nameKey: "comp.fatigue", severity: "moderate", causeKey: "comp.fatigueCause", fixKey: "comp.fatigueFix", active: true },
  { nameKey: "comp.constipation", severity: "none", causeKey: "comp.constipationCause", fixKey: "comp.constipationFix", active: false },
  { nameKey: "comp.lowAppetite", severity: "none", causeKey: "comp.lowAppetiteCause", fixKey: "comp.lowAppetiteFix", active: false },
];

export function SideEffectsPanel() {
  const { t } = useI18n();

  const severityConfig: Record<string, { color: string; bg: string; labelKey: TranslationKey }> = {
    none: { color: "text-muted-foreground", bg: "bg-muted", labelKey: "comp.none" },
    mild: { color: "text-bio-warning", bg: "bg-bio-warning/10", labelKey: "comp.mild" },
    moderate: { color: "text-bio-danger", bg: "bg-bio-danger/10", labelKey: "comp.moderate" },
    severe: { color: "text-destructive", bg: "bg-destructive/10", labelKey: "comp.severe" },
  };

  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="text-base font-bold text-foreground mb-4">{t("comp.sideEffectsTitle")}</h3>
      <div className="space-y-3">
        {sideEffects.map((effect) => {
          const config = severityConfig[effect.severity];
          return (
            <div key={effect.nameKey} className="flex items-start gap-3 rounded-xl bg-accent/50 p-3.5">
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
                  <span className="text-sm font-semibold text-foreground">{t(effect.nameKey)}</span>
                  {effect.active && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${config.color} ${config.bg}`}>
                      {t(config.labelKey)}
                    </span>
                  )}
                </div>
                {effect.active && (
                  <div className="mt-1.5 flex items-start gap-1.5">
                    <Lightbulb className="h-3 w-3 text-bio-warning mt-0.5 shrink-0" />
                    <p className="text-xs text-muted-foreground">{t(effect.fixKey)}</p>
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
