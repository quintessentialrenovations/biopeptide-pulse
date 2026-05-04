import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { ProtocolCard } from "@/components/ProtocolCard";
import { motion } from "framer-motion";
import { Clock, ArrowDown, Flame, Brain } from "lucide-react";

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
    color: "oklch(0.65 0.18 250)",
  },
  {
    name: "Retatrutide",
    mechanism: "Triple agonist targeting GLP-1, GIP, and Glucagon receptors. Increases energy expenditure, enhances fat burning, strong appetite suppression.",
    startingDose: "1–2mg weekly",
    targets: ["GLP-1", "GIP", "Glucagon", "Fat Oxidation"],
    color: "oklch(0.78 0.12 200)",
  },
];

const timeline = [
  { period: "0–24 Hours", icon: Clock, desc: "Appetite drops significantly, gastric emptying slows, mild nausea possible." },
  { period: "1–3 Days", icon: ArrowDown, desc: "Reduced calorie intake, stable blood sugar, increased satiety." },
  { period: "Week 1–2", icon: Flame, desc: "Noticeable weight drop (water + fat), cravings reduced significantly." },
  { period: "Week 3–6", icon: Flame, desc: "Fat loss accelerates, metabolism improves, body composition changes." },
  { period: "Long-Term", icon: Brain, desc: "Sustained fat loss, hormonal balance improves, appetite regulation normalizes." },
];

const tirzepatideSchedule = [
  { weeks: "1–4", dose: "5 mg", units: "33u" },
  { weeks: "5–8", dose: "7.5 mg", units: "50u" },
  { weeks: "9–12", dose: "10 mg", units: "67u" },
  { weeks: "13–16", dose: "12.5 mg", units: "83u" },
  { weeks: "17+", dose: "15 mg", units: "100u" },
];

function ProtocolsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-12 px-4 mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Protocol Database</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Evidence-based peptide protocols with dosing schedules and mechanisms of action.
          </p>
        </div>

        {/* Protocol Cards */}
        <div className="grid md:grid-cols-2 gap-5 mb-12">
          {protocols.map((p) => (
            <ProtocolCard key={p.name} {...p} />
          ))}
        </div>

        {/* Tirzepatide Dose Schedule */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card rounded-xl p-6 mb-12"
        >
          <h2 className="text-base font-bold text-foreground mb-4">Tirzepatide Dose Escalation</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">Weeks</th>
                  <th className="text-left py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">Dose</th>
                  <th className="text-left py-2.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">Units</th>
                </tr>
              </thead>
              <tbody>
                {tirzepatideSchedule.map((row) => (
                  <tr key={row.weeks} className="border-b border-border/20">
                    <td className="py-3 text-foreground font-medium">{row.weeks}</td>
                    <td className="py-3 text-foreground">{row.dose}</td>
                    <td className="py-3 text-muted-foreground">{row.units}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Post-Injection Timeline */}
        <div className="mb-8">
          <h2 className="text-base font-bold text-foreground mb-5">Post-Injection Timeline</h2>
          <div className="space-y-4">
            {timeline.map((item, i) => (
              <motion.div
                key={item.period}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-start gap-4"
              >
                <div className="relative flex flex-col items-center">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                    <item.icon className="h-4 w-4 text-primary" />
                  </div>
                  {i < timeline.length - 1 && <div className="w-px h-8 bg-border/40 mt-2" />}
                </div>
                <div className="pt-1">
                  <h3 className="text-sm font-semibold text-foreground">{item.period}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
