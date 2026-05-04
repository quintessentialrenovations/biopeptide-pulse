import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Heart,
  Shield,
  Syringe,
  Users,
  TrendingDown,
  Calendar,
  Bell,
  Sparkles,
  CheckCircle,
  Stethoscope,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BioPeptideX — Client Progress Tracker" },
      {
        name: "description",
        content:
          "Professional peptide protocol tracking for Tirzepatide, Retatrutide, and performance peptides. Monitor client progress, optimize dosing, and track results.",
      },
    ],
  }),
  component: HomePage,
});

const features = [
  {
    icon: BarChart3,
    title: "Beautiful Progress Charts",
    desc: "Interactive weight charts with actual vs expected vs goal overlays, medication level tracking, and dose-colored trends.",
    gradient: "gradient-blue",
  },
  {
    icon: Syringe,
    title: "One-Tap Injection Logging",
    desc: "Log your weekly dose in seconds. Track injection sites, get rotation suggestions, and see your remaining vial usage.",
    gradient: "gradient-green",
  },
  {
    icon: Shield,
    title: "Side Effect Support",
    desc: "Interactive guide with severity tracking, smart fixes, and actionable recommendations to stay comfortable.",
    gradient: "gradient-purple",
  },
  {
    icon: Users,
    title: "Admin CRM Dashboard",
    desc: "Monitor all clients at a glance. Track compliance, spot risks, adjust protocols, and send personalized guidance.",
    gradient: "gradient-warm",
  },
];

const highlights = [
  "Next-dose countdown timer",
  "Injection site rotation tracker",
  "Estimated medication levels chart",
  "Expected vs actual progress overlay",
  "Plateau detection & smart alerts",
  "Push notifications & reminders",
];

function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-28 pb-20 px-4 overflow-hidden">
        <div className="absolute top-20 right-0 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-bio-cyan/5 blur-3xl" />

        <div className="relative mx-auto max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/8 border border-primary/15 mb-6">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-semibold text-primary tracking-wide">
                  PEPTIDE PROTOCOL MANAGEMENT
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight text-foreground">
                Track Your Journey.{" "}
                <span className="text-gradient-blue">See Real Results.</span>
              </h1>

              <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
                The friendliest peptide tracking app for Tirzepatide &
                Retatrutide. Log doses, track weight, monitor side effects,
                and watch your progress come to life with beautiful charts.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-start gap-3">
                <Button variant="hero" size="lg" asChild>
                  <Link to="/dashboard">
                    Open My Dashboard <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/protocols">Learn About Protocols</Link>
                </Button>
              </div>
            </div>

            {/* Hero Visual — Friendly stat preview */}
            <div className="relative hidden lg:block">
              <div className="glass-card rounded-3xl p-6 card-hover">
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-10 w-10 rounded-xl gradient-blue flex items-center justify-center">
                    <Activity className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">Your Summary</p>
                    <p className="text-xs text-muted-foreground">Week 8 · Tirzepatide</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <MiniPreviewCard icon={TrendingDown} label="Lost" value="-8.5 kg" color="text-bio-success" />
                  <MiniPreviewCard icon={Calendar} label="Next Dose" value="1 day" color="text-primary" />
                  <MiniPreviewCard icon={Heart} label="Energy" value="7/10" color="text-bio-peach" />
                  <MiniPreviewCard icon={Bell} label="Compliance" value="96%" color="text-bio-cyan" />
                </div>

                {/* Mini chart preview */}
                <div className="mt-4 h-20 rounded-xl bg-accent/50 flex items-end px-3 pb-2 gap-1.5">
                  {[40, 55, 48, 62, 58, 70, 65, 78].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t-md gradient-blue opacity-60"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">
              Everything you need to{" "}
              <span className="text-gradient-blue">stay on track</span>
            </h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              A beautiful, intuitive experience designed for peptide therapy
              — with powerful tools for both clients and practitioners.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {features.map((f) => (
              <div
                key={f.title}
                className="glass-card rounded-2xl p-6 card-hover"
              >
                <div
                  className={`h-11 w-11 rounded-xl ${f.gradient} flex items-center justify-center mb-4`}
                >
                  <f.icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-base font-bold text-foreground">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-16 px-4 bg-accent/40">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-2xl font-bold text-foreground mb-8">
            Built for how you actually track
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {highlights.map((h) => (
              <div key={h} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white soft-shadow">
                <CheckCircle className="h-4 w-4 text-bio-success shrink-0" />
                <span className="text-sm font-medium text-foreground">{h}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-12 px-4 border-t border-border/50">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong>Disclaimer:</strong> BioPeptideX is for educational and
            tracking purposes only. It is not a substitute for medical advice,
            diagnosis, or treatment. Always consult with a qualified
            healthcare provider before starting any peptide protocol.
          </p>
        </div>
      </section>
    </div>
  );
}

function MiniPreviewCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: typeof Activity;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="rounded-xl bg-accent/50 p-3.5">
      <Icon className={`h-4 w-4 ${color} mb-1.5`} />
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="text-sm font-bold text-foreground">{value}</p>
    </div>
  );
}
