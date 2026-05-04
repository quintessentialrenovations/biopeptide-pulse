import { Syringe, Clock, Check } from "lucide-react";
import { useI18n } from "@/i18n/context";

const doses = [
  { week: 8, date: "Apr 28", dose: "7.5mg", units: "50u", status: "completed" as const },
  { week: 7, date: "Apr 21", dose: "7.5mg", units: "50u", status: "completed" as const },
  { week: 6, date: "Apr 14", dose: "5mg", units: "33u", status: "completed" as const },
  { week: 5, date: "Apr 7", dose: "5mg", units: "33u", status: "completed" as const },
  { week: 4, date: "Mar 31", dose: "5mg", units: "33u", status: "completed" as const },
];

const nextDose = { week: 9, date: "May 5", dose: "7.5mg", units: "50u", daysLeft: 1 };

export function DoseTimeline() {
  const { t } = useI18n();
  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="text-base font-bold text-foreground mb-4">{t("comp.doseTimeline")}</h3>

      <div className="mb-5 rounded-2xl gradient-blue p-5 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-white/70 uppercase tracking-wider">{t("comp.nextDose")}</p>
            <p className="text-xl font-extrabold mt-1">{nextDose.dose} <span className="text-sm font-medium text-white/70">({nextDose.units})</span></p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1.5 text-white/80">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-semibold">{nextDose.daysLeft} {nextDose.daysLeft === 1 ? t("comp.dayLeft") : t("comp.daysLeft")}</span>
            </div>
            <p className="text-base font-bold mt-1">{nextDose.date}</p>
          </div>
        </div>
      </div>

      <div className="space-y-0.5">
        {doses.map((dose, i) => (
          <div key={dose.week} className="flex items-center gap-3 py-2.5">
            <div className="relative flex flex-col items-center">
              <div className="h-7 w-7 rounded-full bg-bio-success/10 flex items-center justify-center">
                <Check className="h-3.5 w-3.5 text-bio-success" />
              </div>
              {i < doses.length - 1 && <div className="w-px h-5 bg-border mt-1" />}
            </div>
            <div className="flex-1 flex items-center justify-between">
              <div>
                <span className="text-sm font-semibold text-foreground">{t("comp.week")} {dose.week}</span>
                <span className="text-xs text-muted-foreground ml-2">{dose.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Syringe className="h-3.5 w-3.5 text-primary" />
                <span className="text-sm font-bold text-foreground">{dose.dose}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
