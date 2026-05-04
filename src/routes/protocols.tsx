import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { ProtocolCard } from "@/components/ProtocolCard";
import { Clock, ArrowDown, Flame, Brain, BookOpen } from "lucide-react";

export const Route = createFileRoute("/protocols")({
  head: () => ({
    meta: [
      { title: "Protocols — BioPeptideX" },
      { name: "description", content: "Peptide protocol database with dosing schedules and mechanisms of action." },
    ],
  }),
  component: ProtocolsPage,
});

const protocols = [
  {
    name: "Tirzepatide",
    mechanism: "Dual GLP-1 + GIP receptor activation. Slows gastric emptying, reduces appetite, and improves insulin sensitivity.",
    startingDose: "5mg weekly",
    targets: ["GLP-1", "GIP", "Appetite", "Insulin"],
    color: "#4F7AEF",
  },
  {
    name: "Retatrutide",
    mechanism: "Triple agonist targeting GLP-1, GIP, and Glucagon receptors. Increases energy expenditure, enhances fat burning, strong appetite suppression.",
    startingDose: "1–2mg weekly",
    targets: ["GLP-1", "GIP", "Glucagon", "Fat Oxidation"],
    color: "#6BBFB5",
  },
];

const timeline = [
  { period: "0–24 Hours", icon: Clock, desc: "Appetite drops significantly, gastric emptying slows, mild nausea possible.", emoji: "💊" },
  { period: "1–3 Days", icon: ArrowDown, desc: "Reduced calorie intake, stable blood sugar, increased satiety.", emoji: "📉" },
  { period: "Week 1–2", icon: Flame, desc: "Noticeable weight drop (water + fat), cravings reduced significantly.", emoji: "🔥" },
  { period: "Week 3–6", icon: Flame, desc: "Fat loss accelerates, metabolism improves, body composition changes.", emoji: "⚡" },
  { period: "Long-Term", icon: Brain, desc: "Sustained fat loss, hormonal balance improves, appetite regulation normalizes.", emoji: "🧠" },
];

const tirzepatideSchedule = [
  { weeks: "1–4", dose: "5 mg", units: "33u", phase: "Loading" },
  { weeks: "5–8", dose: "7.5 mg", units: "50u", phase: "Titration" },
  { weeks: "9–12", dose: "10 mg", units: "67u", phase: "Titration" },
  { weeks: "13–16", dose: "12.5 mg", units: "83u", phase: "Optimization" },
  { weeks: "17+", dose: "15 mg", units: "100u", phase: "Maintenance" },
];

function ProtocolsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-12 px-4 mx-auto max-w-5xl">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/8 border border-primary/15 mb-3">
            <BookOpen className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-semibold text-primary">EDUCATION CENTER</span>
          </div>
          <h1 className="text-2xl font-extrabold text-foreground">Protocol Database</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Evidence-based peptide protocols with dosing schedules and mechanisms of action.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5 mb-12">
          {protocols.map((p) => (
            <ProtocolCard key={p.name} {...p} />
          ))}
        </div>

        {/* Dose Escalation Table */}
        <div className="glass-card rounded-2xl p-6 mb-12">
          <h2 className="text-lg font-bold text-foreground mb-1">Tirzepatide Dose Escalation</h2>
          <p className="text-xs text-muted-foreground mb-5">Increase every 4 weeks based on tolerability</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Weeks</th>
                  <th className="text-left py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Dose</th>
                  <th className="text-left py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Units</th>
                  <th className="text-left py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Phase</th>
                </tr>
              </thead>
              <tbody>
                {tirzepatideSchedule.map((row) => (
                  <tr key={row.weeks} className="border-b border-border/50">
                    <td className="py-3.5 text-foreground font-semibold">{row.weeks}</td>
                    <td className="py-3.5 text-foreground font-medium">{row.dose}</td>
                    <td className="py-3.5 text-muted-foreground">{row.units}</td>
                    <td className="py-3.5">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-primary/8 text-primary">
                        {row.phase}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Post-Injection Timeline */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-foreground mb-2">What Happens After Your Injection</h2>
          <p className="text-xs text-muted-foreground mb-6">Here's what to expect at each stage of your protocol</p>
          <div className="space-y-4">
            {timeline.map((item, i) => (
              <div key={item.period} className="flex items-start gap-4">
                <div className="relative flex flex-col items-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/8 shrink-0 text-lg">
                    {item.emoji}
                  </div>
                  {i < timeline.length - 1 && <div className="w-px h-8 bg-border mt-2" />}
                </div>
                <div className="pt-1.5">
                  <h3 className="text-sm font-bold text-foreground">{item.period}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
