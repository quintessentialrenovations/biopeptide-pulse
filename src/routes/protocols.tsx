import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { ProtocolCard } from "@/components/ProtocolCard";
import { Clock, ArrowDown, Flame, Brain, BookOpen } from "lucide-react";
import { useI18n } from "@/i18n/context";
import type { TranslationKey } from "@/i18n/translations";

export const Route = createFileRoute("/protocols")({
  head: () => ({
    meta: [
      { title: "Protocols — BioPeptideX" },
      { name: "description", content: "Peptide protocol database with dosing schedules and mechanisms of action." },
    ],
  }),
  component: ProtocolsPage,
});

const tirzepatideSchedule = [
  { weeks: "1–4", dose: "5 mg", units: "33u", phaseKey: "proto.loading" as TranslationKey },
  { weeks: "5–8", dose: "7.5 mg", units: "50u", phaseKey: "proto.titration" as TranslationKey },
  { weeks: "9–12", dose: "10 mg", units: "67u", phaseKey: "proto.titration" as TranslationKey },
  { weeks: "13–16", dose: "12.5 mg", units: "83u", phaseKey: "proto.optimization" as TranslationKey },
  { weeks: "17+", dose: "15 mg", units: "100u", phaseKey: "proto.maintenance" as TranslationKey },
];

const timelineKeys: { period: string; icon: typeof Clock; descKey: TranslationKey; emoji: string }[] = [
  { period: "0–24 Hours", icon: Clock, descKey: "proto.timeline0", emoji: "💊" },
  { period: "1–3 Days", icon: ArrowDown, descKey: "proto.timeline1", emoji: "📉" },
  { period: "Week 1–2", icon: Flame, descKey: "proto.timeline2", emoji: "🔥" },
  { period: "Week 3–6", icon: Flame, descKey: "proto.timeline3", emoji: "⚡" },
  { period: "Long-Term", icon: Brain, descKey: "proto.timeline4", emoji: "🧠" },
];

function ProtocolsPage() {
  const { t } = useI18n();

  const protocols = [
    {
      name: "Tirzepatide",
      mechanism: t("proto.tirzepatideMechanism"),
      startingDose: "5mg weekly",
      targets: ["GLP-1", "GIP", "Appetite", "Insulin"],
      color: "#4F7AEF",
    },
    {
      name: "Retatrutide",
      mechanism: t("proto.retatrutideMechanism"),
      startingDose: "1–2mg weekly",
      targets: ["GLP-1", "GIP", "Glucagon", "Fat Oxidation"],
      color: "#6BBFB5",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-12 px-4 mx-auto max-w-5xl">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/8 border border-primary/15 mb-3">
            <BookOpen className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-semibold text-primary">{t("proto.educationCenter")}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-foreground">{t("proto.title")}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t("proto.desc")}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-5 mb-12">
          {protocols.map((p) => (
            <ProtocolCard key={p.name} {...p} />
          ))}
        </div>

        <div className="glass-card rounded-2xl p-6 mb-12">
          <h2 className="text-lg font-bold text-foreground mb-1">{t("proto.doseEscalation")}</h2>
          <p className="text-xs text-muted-foreground mb-5">{t("proto.escalationDesc")}</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t("proto.weeks")}</th>
                  <th className="text-left py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t("proto.dose")}</th>
                  <th className="text-left py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t("proto.units")}</th>
                  <th className="text-left py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t("proto.phase")}</th>
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
                        {t(row.phaseKey)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-bold text-foreground mb-2">{t("proto.postInjection")}</h2>
          <p className="text-xs text-muted-foreground mb-6">{t("proto.postInjectionDesc")}</p>
          <div className="space-y-4">
            {timelineKeys.map((item, i) => (
              <div key={item.period} className="flex items-start gap-4">
                <div className="relative flex flex-col items-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/8 shrink-0 text-lg">
                    {item.emoji}
                  </div>
                  {i < timelineKeys.length - 1 && <div className="w-px h-8 bg-border mt-2" />}
                </div>
                <div className="pt-1.5">
                  <h3 className="text-sm font-bold text-foreground">{item.period}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">{t(item.descKey)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
