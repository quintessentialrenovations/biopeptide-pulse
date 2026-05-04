import { Syringe, Calendar, Clock } from "lucide-react";

const doses = [
  { week: 8, date: "Apr 28", dose: "7.5mg", units: "50u", status: "completed" as const },
  { week: 7, date: "Apr 21", dose: "7.5mg", units: "50u", status: "completed" as const },
  { week: 6, date: "Apr 14", dose: "5mg", units: "33u", status: "completed" as const },
  { week: 5, date: "Apr 7", dose: "5mg", units: "33u", status: "completed" as const },
  { week: 4, date: "Mar 31", dose: "5mg", units: "33u", status: "completed" as const },
];

const nextDose = { week: 9, date: "May 5", dose: "7.5mg", units: "50u", daysLeft: 1 };

export function DoseTimeline() {
  return (
    <div className="glass-card rounded-xl p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">Dose Timeline</h3>

      {/* Next Dose */}
      <div className="mb-4 rounded-lg gradient-blue p-4 glow-blue">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-primary-foreground/70 uppercase tracking-wider">Next Dose</p>
            <p className="text-lg font-bold text-primary-foreground mt-0.5">{nextDose.dose} ({nextDose.units})</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1.5 text-primary-foreground/80">
              <Clock className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">{nextDose.daysLeft} day left</span>
            </div>
            <p className="text-sm font-semibold text-primary-foreground mt-0.5">{nextDose.date}</p>
          </div>
        </div>
      </div>

      {/* Past Doses */}
      <div className="space-y-1">
        {doses.map((dose, i) => (
          <div key={dose.week} className="flex items-center gap-3 py-2.5">
            <div className="relative flex flex-col items-center">
              <div className="h-2.5 w-2.5 rounded-full bg-primary/60" />
              {i < doses.length - 1 && <div className="w-px h-6 bg-border/50 mt-1" />}
            </div>
            <div className="flex-1 flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-foreground">Week {dose.week}</span>
                <span className="text-xs text-muted-foreground ml-2">{dose.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Syringe className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">{dose.dose}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
