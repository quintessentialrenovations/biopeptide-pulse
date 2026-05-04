import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { StatCard } from "@/components/StatCard";
import { WeightChart } from "@/components/WeightChart";
import { DoseTimeline } from "@/components/DoseTimeline";
import { SideEffectsPanel } from "@/components/SideEffectsPanel";
import { InjectionSiteTracker } from "@/components/InjectionSiteTracker";
import { MedicationLevelChart } from "@/components/MedicationLevelChart";
import { Button } from "@/components/ui/button";
import { Scale, Target, TrendingDown, Syringe, Flame, Zap, Heart, Clock, Stethoscope, ArrowRight } from "lucide-react";
import { useI18n } from "@/i18n/context";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — BioPeptideX" },
      { name: "description", content: "Track your peptide protocol progress, weight changes, and dose schedule." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { t } = useI18n();
  const progressPercent = Math.round(((105 - 96.5) / (105 - 85)) * 100);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-12 px-4 mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-foreground">{t("dash.welcomeBack")}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t("dash.protocol")}</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard icon={Scale} label={t("dash.currentWeight")} value="96.5 kg" sub="-8.5 kg total" trend="down" gradient="gradient-blue" />
          <StatCard icon={Target} label={t("dash.goalProgress")} value={`${progressPercent}%`} sub={`${t("dash.target")} 85 kg`} glow gradient="gradient-green" />
          <StatCard icon={TrendingDown} label={t("dash.thisWeek")} value="-1.5 kg" sub={t("dash.onTrack")} trend="down" gradient="gradient-purple" />
          <StatCard icon={Syringe} label={t("dash.currentDose")} value="7.5 mg" sub={t("dash.weekProtocol")} gradient="gradient-warm" />
        </div>

        <div className="glass-card rounded-2xl p-5 mb-6">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t("dash.progressToGoal")}</span>
            <span className="text-sm font-extrabold text-primary">{progressPercent}%</span>
          </div>
          <div className="h-3 rounded-full bg-accent overflow-hidden">
            <div className="h-full rounded-full gradient-blue transition-all duration-1000" style={{ width: `${progressPercent}%` }} />
          </div>
          <div className="flex justify-between mt-2.5 text-xs text-muted-foreground font-medium">
            <span>{t("dash.start")} 105 kg</span>
            <span>{t("dash.current")} 96.5 kg</span>
            <span>{t("dash.goal")} 85 kg</span>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl gradient-blue flex items-center justify-center shrink-0">
              <Stethoscope className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">{t("dash.aiDoctorConsultation")}</p>
              <p className="text-xs text-muted-foreground">{t("dash.aiDoctorDesc")}</p>
            </div>
          </div>
          <Button variant="hero" size="sm" asChild className="rounded-xl shrink-0">
            <Link to="/consultation">
              {t("dash.startBtn")} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        <div className="glass-card rounded-2xl p-5 mb-6">
          <h3 className="text-sm font-bold text-foreground mb-3">{t("dash.quickLog")}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <QuickLogButton icon={Syringe} label={t("dash.logInjection")} color="gradient-blue" />
            <QuickLogButton icon={Scale} label={t("dash.logWeight")} color="gradient-green" />
            <QuickLogButton icon={Heart} label={t("dash.sideEffectsBtn")} color="gradient-warm" />
            <QuickLogButton icon={Clock} label={t("dash.dailyCheckin")} color="gradient-purple" />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <WeightChart />
            <MedicationLevelChart />
            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-base font-bold text-foreground mb-4">{t("dash.thisWeekLog")}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <LogItem label={t("dash.hungerLevel")} value="3/10" emoji="🍽️" />
                <LogItem label={t("dash.energyLevel")} value="7/10" emoji="⚡" />
                <LogItem label={t("dash.injectionDay")} value={t("dash.monday")} emoji="💉" />
                <LogItem label={t("dash.weeklyChange")} value="-1.5 kg" emoji="📉" />
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <DoseTimeline />
            <InjectionSiteTracker />
            <SideEffectsPanel />
          </div>
        </div>
      </main>
    </div>
  );
}

function QuickLogButton({ icon: Icon, label, color }: { icon: typeof Scale; label: string; color: string }) {
  return (
    <button className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-accent/50 hover:bg-accent transition-all active:scale-95">
      <div className={`h-10 w-10 rounded-xl ${color} flex items-center justify-center`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
      <span className="text-xs font-semibold text-foreground">{label}</span>
    </button>
  );
}

function LogItem({ label, value, emoji }: { label: string; value: string; emoji: string }) {
  return (
    <div className="rounded-xl bg-accent/50 p-4">
      <div className="text-lg mb-1">{emoji}</div>
      <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">{label}</p>
      <p className="text-sm font-bold text-foreground mt-0.5">{value}</p>
    </div>
  );
}
