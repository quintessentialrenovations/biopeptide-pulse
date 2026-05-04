import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { StatCard } from "@/components/StatCard";
import { WeightChart } from "@/components/WeightChart";
import { DoseTimeline } from "@/components/DoseTimeline";
import { SideEffectsPanel } from "@/components/SideEffectsPanel";
import { Scale, Target, TrendingDown, Syringe, Flame, Zap } from "lucide-react";

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
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Client Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Tirzepatide Protocol · Week 8 · Started Feb 10, 2026
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard icon={Scale} label="Current Weight" value="96.5 kg" sub="-8.5 kg total" trend="down" />
          <StatCard icon={Target} label="Goal Progress" value={`${progressPercent}%`} sub="Target: 85 kg" glow />
          <StatCard icon={TrendingDown} label="This Week" value="-1.5 kg" sub="On track" trend="down" />
          <StatCard icon={Syringe} label="Current Dose" value="7.5 mg" sub="Week 5–8 protocol" />
        </div>

        {/* Progress Bar */}
        <div className="glass-card rounded-xl p-5 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground">Progress to Goal</span>
            <span className="text-xs font-bold text-primary">{progressPercent}%</span>
          </div>
          <div className="h-2.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full gradient-blue transition-all duration-1000"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-[11px] text-muted-foreground">
            <span>Start: 105 kg</span>
            <span>Current: 96.5 kg</span>
            <span>Goal: 85 kg</span>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <WeightChart />

            <div className="glass-card rounded-xl p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">This Week's Log</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <LogItem icon={Flame} label="Hunger Level" value="3/10" />
                <LogItem icon={Zap} label="Energy Level" value="7/10" />
                <LogItem icon={Syringe} label="Injection Day" value="Monday" />
                <LogItem icon={Scale} label="Weekly Change" value="-1.5 kg" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <DoseTimeline />
            <SideEffectsPanel />
          </div>
        </div>
      </main>
    </div>
  );
}

function LogItem({ icon: Icon, label, value }: { icon: typeof Scale; label: string; value: string }) {
  return (
    <div className="rounded-lg bg-background/50 border border-border/30 p-3.5">
      <Icon className="h-4 w-4 text-primary mb-2" />
      <p className="text-[11px] text-muted-foreground uppercase tracking-wider">{label}</p>
      <p className="text-sm font-bold text-foreground mt-0.5">{value}</p>
    </div>
  );
}
