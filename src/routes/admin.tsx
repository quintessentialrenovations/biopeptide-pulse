import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import {
  AlertTriangle,
  ArrowDown,
  CheckCircle,
  Clock,
  Search,
  User,
  TrendingDown,
  Stethoscope,
  Video,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Panel — BioPeptideX" },
      { name: "description", content: "Monitor all clients, protocols, compliance, and alerts." },
    ],
  }),
  component: AdminPage,
});

interface Client {
  id: string;
  name: string;
  peptide: string;
  dose: string;
  week: number;
  startWeight: number;
  currentWeight: number;
  goalWeight: number;
  compliance: number;
  lastLog: string;
  alert?: string;
  aiConsultation?: "completed" | "in-progress" | "not-started";
  aiSessionDate?: string;
}

const mockClients: Client[] = [
  { id: "1", name: "Sarah Mitchell", peptide: "Tirzepatide", dose: "7.5mg", week: 8, startWeight: 105, currentWeight: 96.5, goalWeight: 85, compliance: 96, lastLog: "Today", aiConsultation: "completed", aiSessionDate: "Apr 28, 2026" },
  { id: "2", name: "James Rivera", peptide: "Retatrutide", dose: "2mg", week: 4, startWeight: 120, currentWeight: 115, goalWeight: 95, compliance: 88, lastLog: "Yesterday", alert: "Severe nausea reported", aiConsultation: "completed", aiSessionDate: "Apr 20, 2026" },
  { id: "3", name: "Emily Chen", peptide: "Tirzepatide", dose: "10mg", week: 12, startWeight: 92, currentWeight: 80, goalWeight: 72, compliance: 100, lastLog: "2 days ago", aiConsultation: "completed", aiSessionDate: "Mar 15, 2026" },
  { id: "4", name: "David Okafor", peptide: "Tirzepatide", dose: "5mg", week: 3, startWeight: 110, currentWeight: 108, goalWeight: 88, compliance: 67, lastLog: "5 days ago", alert: "Missed last 2 doses", aiConsultation: "in-progress" },
  { id: "5", name: "Laura Kim", peptide: "Retatrutide", dose: "1mg", week: 2, startWeight: 88, currentWeight: 86.5, goalWeight: 70, compliance: 100, lastLog: "Today", aiConsultation: "not-started" },
];

function AdminPage() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"compliance" | "progress" | "name">("name");

  const clients = mockClients
    .filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "compliance") return b.compliance - a.compliance;
      if (sortBy === "progress") {
        const pa = ((a.startWeight - a.currentWeight) / (a.startWeight - a.goalWeight)) * 100;
        const pb = ((b.startWeight - b.currentWeight) / (b.startWeight - b.goalWeight)) * 100;
        return pb - pa;
      }
      return a.name.localeCompare(b.name);
    });

  const alertCount = mockClients.filter((c) => c.alert).length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-12 px-4 mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-foreground">Admin Panel</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {mockClients.length} active clients · {alertCount} alert{alertCount !== 1 && "s"}
            </p>
          </div>
          {alertCount > 0 && (
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-bio-danger/8 border border-bio-danger/15">
              <AlertTriangle className="h-4 w-4 text-bio-danger" />
              <span className="text-sm font-semibold text-bio-danger">{alertCount} clients need attention</span>
            </div>
          )}
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <OverviewStat label="Total Clients" value={String(mockClients.length)} icon="👥" />
          <OverviewStat label="Avg Compliance" value={`${Math.round(mockClients.reduce((s, c) => s + c.compliance, 0) / mockClients.length)}%`} icon="✅" />
          <OverviewStat label="AI Consults Done" value={`${mockClients.filter(c => c.aiConsultation === "completed").length}/${mockClients.length}`} icon="🩺" />
          <OverviewStat label="Avg Weight Lost" value={`${(mockClients.reduce((s, c) => s + (c.startWeight - c.currentWeight), 0) / mockClients.length).toFixed(1)} kg`} icon="📉" />
        </div>

        {/* Search & Sort */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search clients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
            />
          </div>
          <div className="flex gap-2">
            {(["name", "compliance", "progress"] as const).map((key) => (
              <button
                key={key}
                onClick={() => setSortBy(key)}
                className={cn(
                  "px-4 py-2.5 rounded-xl text-xs font-semibold transition-all capitalize",
                  sortBy === key
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "bg-white text-muted-foreground border border-border hover:bg-accent"
                )}
              >
                {key}
              </button>
            ))}
          </div>
        </div>

        {/* Client Cards */}
        <div className="space-y-3">
          {clients.map((client) => {
            const progress = Math.round(((client.startWeight - client.currentWeight) / (client.startWeight - client.goalWeight)) * 100);
            const weightLost = (client.startWeight - client.currentWeight).toFixed(1);

            return (
              <div
                key={client.id}
                className={cn(
                  "glass-card rounded-2xl p-5 card-hover cursor-pointer",
                  client.alert && "border-bio-danger/30"
                )}
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-center gap-3 min-w-0 sm:w-56">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/8 shrink-0">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-foreground truncate">{client.name}</p>
                      <p className="text-xs text-muted-foreground">{client.peptide} · {client.dose}</p>
                    </div>
                  </div>

                  <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                    <MiniStat label="Week" value={String(client.week)} />
                    <MiniStat label="Lost" value={`${weightLost} kg`} icon={<ArrowDown className="h-3 w-3 text-bio-success" />} />
                    <MiniStat label="Progress" value={`${progress}%`} />
                    <MiniStat
                      label="Compliance"
                      value={`${client.compliance}%`}
                      icon={
                        client.compliance >= 90 ? <CheckCircle className="h-3 w-3 text-bio-success" /> :
                        client.compliance >= 70 ? <Clock className="h-3 w-3 text-bio-warning" /> :
                        <AlertTriangle className="h-3 w-3 text-bio-danger" />
                      }
                    />
                  </div>

                  <div className="sm:w-52 sm:text-right">
                    {client.alert ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-bio-danger bg-bio-danger/8 px-3 py-1.5 rounded-full">
                        <AlertTriangle className="h-3 w-3" />
                        {client.alert}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground font-medium">Last log: {client.lastLog}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

function OverviewStat({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="glass-card rounded-2xl p-4">
      <div className="text-lg mb-1">{icon}</div>
      <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">{label}</p>
      <p className="text-xl font-extrabold text-foreground mt-0.5">{value}</p>
    </div>
  );
}

function MiniStat({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">{label}</p>
      <div className="flex items-center gap-1 mt-0.5">
        {icon}
        <span className="text-sm font-bold text-foreground">{value}</span>
      </div>
    </div>
  );
}
