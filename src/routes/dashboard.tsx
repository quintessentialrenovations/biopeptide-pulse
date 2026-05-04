import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { StatCard } from "@/components/StatCard";
import { WeightChart } from "@/components/WeightChart";
import { DoseTimeline } from "@/components/DoseTimeline";
import { SideEffectsPanel } from "@/components/SideEffectsPanel";
import { InjectionSiteTracker } from "@/components/InjectionSiteTracker";
import { MedicationLevelChart } from "@/components/MedicationLevelChart";
import { Scale, Target, TrendingDown, Syringe, Flame, Zap, Heart, Clock } from "lucide-react";

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
  const progressPercent = Math.round(((105 - 96.5) / (105 - 85)) * 100);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-12 px-4 mx-auto max-w-7xl">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-foreground">Welcome back! 👋</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Tirzepatide Protocol · Week 8 · Started Feb 10, 2026
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard icon={Scale} label="Current Weight" value="96.5 kg" sub="-8.5 kg total" trend="down" gradient="gradient-blue" />
          <StatCard icon={Target} label="Goal Progress" value={`${progressPercent}%`} sub="Target: 85 kg" glow gradient="gradient-green" />
          <StatCard icon={TrendingDown} label="This Week" value="-1.5 kg" sub="On track ✓" trend="down" gradient="gradient-purple" />
          <StatCard icon={Syringe} label="Current Dose" value="7.5 mg" sub="Week 5–8 protocol" gradient="gradient-warm" />
        </div>

        {/* Progress Bar */}
        <div className="glass-card rounded-2xl p-5 mb-6">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Progress to Goal</span>
            <span className="text-sm font-extrabold text-primary">{progressPercent}%</span>
          </div>
          <div className="h-3 rounded-full bg-accent overflow-hidden">
            <div
              className="h-full rounded-full gradient-blue transition-all duration-1000"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between mt-2.5 text-xs text-muted-foreground font-medium">
            <span>Start: 105 kg</span>
            <span>Current: 96.5 kg</span>
            <span>Goal: 85 kg</span>
          </div>
        </div>

        {/* Quick Log Buttons */}
        <div className="glass-card rounded-2xl p-5 mb-6">
          <h3 className="text-sm font-bold text-foreground mb-3">Quick Log</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <QuickLogButton icon={Syringe} label="Log Injection" color="gradient-blue" />
            <QuickLogButton icon={Scale} label="Log Weight" color="gradient-green" />
            <QuickLogButton icon={Heart} label="Side Effects" color="gradient-warm" />
            <QuickLogButton icon={Clock} label="Daily Check-in" color="gradient-purple" />
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <WeightChart />
            <MedicationLevelChart />

            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-base font-bold text-foreground mb-4">This Week's Log</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <LogItem icon={Flame} label="Hunger Level" value="3/10" emoji="🍽️" />
                <LogItem icon={Zap} label="Energy Level" value="7/10" emoji="⚡" />
                <LogItem icon={Syringe} label="Injection Day" value="Monday" emoji="💉" />
                <LogItem icon={Scale} label="Weekly Change" value="-1.5 kg" emoji="📉" />
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

function LogItem({ icon: Icon, label, value, emoji }: { icon: typeof Scale; label: string; value: string; emoji: string }) {
  return (
    <div className="rounded-xl bg-accent/50 p-4">
      <div className="text-lg mb-1">{emoji}</div>
      <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">{label}</p>
      <p className="text-sm font-bold text-foreground mt-0.5">{value}</p>
    </div>
  );
}
