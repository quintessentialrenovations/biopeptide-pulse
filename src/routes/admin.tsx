import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { AlertTriangle, ArrowDown, CheckCircle, Clock, Search, User, Stethoscope, Ticket, Copy, Plus, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n/context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Panel Admin — BioPeptideX" },
      { name: "description", content: "Monitorea clientes, protocolos, adherencia y alertas." },
    ],
  }),
  component: AdminPage,
});

interface Client {
  id: string; name: string; peptide: string; dose: string; week: number;
  startWeight: number; currentWeight: number; goalWeight: number;
  compliance: number; lastLog: string; alertKey?: string;
  aiConsultation?: "completed" | "in-progress" | "not-started"; aiSessionDate?: string;
}

const mockClients: Client[] = [
  { id: "1", name: "Sarah Mitchell", peptide: "Tirzepatide", dose: "7.5mg", week: 8, startWeight: 105, currentWeight: 96.5, goalWeight: 85, compliance: 96, lastLog: "Hoy", aiConsultation: "completed", aiSessionDate: "Abr 28, 2026" },
  { id: "2", name: "James Rivera", peptide: "Retatrutide", dose: "2mg", week: 4, startWeight: 120, currentWeight: 115, goalWeight: 95, compliance: 88, lastLog: "Ayer", alertKey: "admin.severeNausea", aiConsultation: "completed", aiSessionDate: "Abr 20, 2026" },
  { id: "3", name: "Emily Chen", peptide: "Tirzepatide", dose: "10mg", week: 12, startWeight: 92, currentWeight: 80, goalWeight: 72, compliance: 100, lastLog: "Hace 2 días", aiConsultation: "completed", aiSessionDate: "Mar 15, 2026" },
  { id: "4", name: "David Okafor", peptide: "Tirzepatide", dose: "5mg", week: 3, startWeight: 110, currentWeight: 108, goalWeight: 88, compliance: 67, lastLog: "Hace 5 días", alertKey: "admin.missedDoses", aiConsultation: "in-progress" },
  { id: "5", name: "Laura Kim", peptide: "Retatrutide", dose: "1mg", week: 2, startWeight: 88, currentWeight: 86.5, goalWeight: 70, compliance: 100, lastLog: "Hoy", aiConsultation: "not-started" },
];

interface InvitationCode {
  id: string; code: string; max_uses: number; times_used: number;
  used_by: string[]; active: boolean; expires_at: string | null; created_at: string;
}

function AdminPage() {
  const { t } = useI18n();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"compliance" | "progress" | "name">("name");
  const [activeTab, setActiveTab] = useState<"clients" | "invitations">("clients");

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

  const alertCount = mockClients.filter((c) => c.alertKey).length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-12 px-4 mx-auto max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-foreground">{t("admin.title")}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {mockClients.length} {t("admin.activeClients")} · {alertCount} {alertCount !== 1 ? t("admin.alerts") : t("admin.alert")}
            </p>
          </div>
          {alertCount > 0 && (
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-bio-danger/8 border border-bio-danger/15">
              <AlertTriangle className="h-4 w-4 text-bio-danger" />
              <span className="text-sm font-semibold text-bio-danger">{alertCount} {t("admin.needAttention")}</span>
            </div>
          )}
        </div>

        <div className="flex gap-2 mb-6">
          <button onClick={() => setActiveTab("clients")}
            className={cn("px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2",
              activeTab === "clients" ? "bg-primary text-white shadow-md" : "bg-white text-muted-foreground border border-border hover:bg-accent")}>
            <User className="h-4 w-4" /> {t("admin.clients")}
          </button>
          <button onClick={() => setActiveTab("invitations")}
            className={cn("px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2",
              activeTab === "invitations" ? "bg-primary text-white shadow-md" : "bg-white text-muted-foreground border border-border hover:bg-accent")}>
            <Ticket className="h-4 w-4" /> {t("admin.invitations")}
          </button>
        </div>

        {activeTab === "clients" ? (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <OverviewStat label={t("admin.totalClients")} value={String(mockClients.length)} icon="👥" />
              <OverviewStat label={t("admin.avgCompliance")} value={`${Math.round(mockClients.reduce((s, c) => s + c.compliance, 0) / mockClients.length)}%`} icon="✅" />
              <OverviewStat label={t("admin.aiConsultsDone")} value={`${mockClients.filter(c => c.aiConsultation === "completed").length}/${mockClients.length}`} icon="🩺" />
              <OverviewStat label={t("admin.avgWeightLost")} value={`${(mockClients.reduce((s, c) => s + (c.startWeight - c.currentWeight), 0) / mockClients.length).toFixed(1)} kg`} icon="📉" />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input type="text" placeholder={t("admin.searchClients")} value={search} onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
              </div>
              <div className="flex gap-2">
                {(["name", "compliance", "progress"] as const).map((key) => (
                  <button key={key} onClick={() => setSortBy(key)}
                    className={cn("px-4 py-2.5 rounded-xl text-xs font-semibold transition-all capitalize",
                      sortBy === key ? "bg-primary/10 text-primary border border-primary/20" : "bg-white text-muted-foreground border border-border hover:bg-accent")}>
                    {key === "name" ? t("admin.name") : key === "compliance" ? t("admin.avgCompliance") : t("admin.progress")}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {clients.map((client) => {
                const progress = Math.round(((client.startWeight - client.currentWeight) / (client.startWeight - client.goalWeight)) * 100);
                const weightLost = (client.startWeight - client.currentWeight).toFixed(1);

                return (
                  <div key={client.id} className={cn("glass-card rounded-2xl p-5 card-hover cursor-pointer", client.alertKey && "border-bio-danger/30")}>
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
                        <MiniStat label={t("admin.week")} value={String(client.week)} />
                        <MiniStat label={t("admin.lost")} value={`${weightLost} kg`} icon={<ArrowDown className="h-3 w-3 text-bio-success" />} />
                        <MiniStat label={t("admin.progress")} value={`${progress}%`} />
                        <MiniStat label={t("landing.compliance")} value={`${client.compliance}%`}
                          icon={client.compliance >= 90 ? <CheckCircle className="h-3 w-3 text-bio-success" /> :
                            client.compliance >= 70 ? <Clock className="h-3 w-3 text-bio-warning" /> :
                            <AlertTriangle className="h-3 w-3 text-bio-danger" />} />
                      </div>
                      <div className="sm:w-56 sm:text-right space-y-1.5">
                        {client.aiConsultation && (
                          <span className={cn("inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full",
                            client.aiConsultation === "completed" ? "bg-bio-success/10 text-bio-success" :
                            client.aiConsultation === "in-progress" ? "bg-bio-warning/10 text-bio-warning" : "bg-accent text-muted-foreground")}>
                            <Stethoscope className="h-3 w-3" />
                            {client.aiConsultation === "completed" ? `${t("admin.aiConsultCompleted")} · ${client.aiSessionDate}` :
                             client.aiConsultation === "in-progress" ? t("admin.aiConsultInProgress") : t("admin.noAiConsult")}
                          </span>
                        )}
                        {client.alertKey ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-bio-danger bg-bio-danger/8 px-3 py-1.5 rounded-full">
                            <AlertTriangle className="h-3 w-3" />
                            {t(client.alertKey as any)}
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground font-medium block">{t("admin.lastLog")} {client.lastLog}</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <InvitationsPanel />
        )}
      </main>
    </div>
  );
}

function InvitationsPanel() {
  const { t } = useI18n();
  const [codes, setCodes] = useState<InvitationCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [maxUses, setMaxUses] = useState(1);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchCodes = async () => {
    const { data } = await supabase.from("invitation_codes").select("*").order("created_at", { ascending: false });
    if (data) setCodes(data as unknown as InvitationCode[]);
    setLoading(false);
  };

  useEffect(() => { fetchCodes(); }, []);

  const generateCode = async () => {
    setGenerating(true);
    const code = `BPX-${randomStr(4)}-${randomStr(4)}`.toUpperCase();
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from("invitation_codes").insert({ code, max_uses: maxUses, created_by: user?.id ?? null });
    await fetchCodes();
    setGenerating(false);
  };

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStatus = (c: InvitationCode): string => {
    if (!c.active) return t("admin.deactivated");
    if (c.expires_at && new Date(c.expires_at) < new Date()) return t("admin.expired");
    if (c.times_used >= c.max_uses) return t("admin.used");
    return t("admin.active");
  };

  const statusColor = (s: string) => {
    if (s === t("admin.active")) return "bg-bio-success/10 text-bio-success";
    if (s === t("admin.used")) return "bg-primary/10 text-primary";
    return "bg-muted text-muted-foreground";
  };

  return (
    <div>
      <div className="glass-card rounded-2xl p-6 mb-6">
        <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          <Ticket className="h-5 w-5 text-primary" />
          {t("admin.generateCode")}
        </h2>
        <div className="flex flex-col sm:flex-row gap-3 items-end">
          <div className="flex-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">
              {t("admin.maxUses")}
            </label>
            <Input type="number" min={1} max={100} value={maxUses}
              onChange={(e) => setMaxUses(Math.max(1, Math.min(100, Number(e.target.value))))} className="h-12 rounded-xl w-32" />
          </div>
          <Button variant="hero" className="h-12 rounded-xl px-6" onClick={generateCode} disabled={generating}>
            <Plus className="h-4 w-4 mr-2" />
            {generating ? t("admin.generating") : t("admin.generateNew")}
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-12 text-muted-foreground text-sm">{t("admin.loadingCodes")}</div>
        ) : codes.length === 0 ? (
          <div className="text-center py-12">
            <Ticket className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">{t("admin.noCodes")}</p>
          </div>
        ) : (
          codes.map((c) => {
            const status = getStatus(c);
            return (
              <div key={c.id} className="glass-card rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <code className="text-base font-bold font-mono tracking-widest text-foreground">{c.code}</code>
                    <span className={cn("text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider", statusColor(status))}>
                      {status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t("admin.usedOf")} {c.times_used}/{c.max_uses} · {t("admin.created")} {new Date(c.created_at).toLocaleDateString()}
                  </p>
                </div>
                <Button variant="outline" size="sm" className="rounded-xl shrink-0" onClick={() => copyCode(c.code, c.id)}>
                  {copiedId === c.id ? (
                    <><Check className="h-3.5 w-3.5 mr-1.5 text-bio-success" /> {t("admin.copied")}</>
                  ) : (
                    <><Copy className="h-3.5 w-3.5 mr-1.5" /> {t("admin.copyCode")}</>
                  )}
                </Button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function randomStr(len: number) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < len; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
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
