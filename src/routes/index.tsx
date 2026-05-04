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
import { useI18n } from "@/i18n/context";
import type { TranslationKey } from "@/i18n/translations";

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

const featureKeys: { icon: typeof Stethoscope; titleKey: TranslationKey; descKey: TranslationKey; gradient: string }[] = [
  { icon: Stethoscope, titleKey: "feature.aiDoctor", descKey: "feature.aiDoctorDesc", gradient: "gradient-blue" },
  { icon: BarChart3, titleKey: "feature.charts", descKey: "feature.chartsDesc", gradient: "gradient-green" },
  { icon: Syringe, titleKey: "feature.injection", descKey: "feature.injectionDesc", gradient: "gradient-purple" },
  { icon: Shield, titleKey: "feature.sideEffects", descKey: "feature.sideEffectsDesc", gradient: "gradient-warm" },
  { icon: Users, titleKey: "feature.adminCrm", descKey: "feature.adminCrmDesc", gradient: "gradient-blue" },
];

const highlightKeys: TranslationKey[] = [
  "highlight.countdown",
  "highlight.rotation",
  "highlight.medLevels",
  "highlight.progress",
  "highlight.plateau",
  "highlight.push",
];

function HomePage() {
  const { t } = useI18n();

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
                  {t("landing.badge")}
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight text-foreground">
                {t("landing.heroTitle1")}{" "}
                <span className="text-gradient-blue">{t("landing.heroTitle2")}</span>
              </h1>

              <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
                {t("landing.heroDesc")}
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-start gap-3">
                <Button variant="hero" size="lg" asChild>
                  <Link to="/login">
                    {t("landing.getStarted")} <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/consultation">
                    {t("landing.startConsultation")} <Stethoscope className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/protocols">{t("landing.learnProtocols")}</Link>
                </Button>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative hidden lg:block">
              <div className="glass-card rounded-3xl p-6 card-hover">
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-10 w-10 rounded-xl gradient-blue flex items-center justify-center">
                    <Activity className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{t("landing.yourSummary")}</p>
                    <p className="text-xs text-muted-foreground">Week 8 · Tirzepatide</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <MiniPreviewCard icon={TrendingDown} label={t("landing.lost")} value="-8.5 kg" color="text-bio-success" />
                  <MiniPreviewCard icon={Calendar} label={t("landing.nextDose")} value="1 day" color="text-primary" />
                  <MiniPreviewCard icon={Heart} label={t("landing.energy")} value="7/10" color="text-bio-peach" />
                  <MiniPreviewCard icon={Bell} label={t("landing.compliance")} value="96%" color="text-bio-cyan" />
                </div>
                <div className="mt-4 h-20 rounded-xl bg-accent/50 flex items-end px-3 pb-2 gap-1.5">
                  {[40, 55, 48, 62, 58, 70, 65, 78].map((h, i) => (
                    <div key={i} className="flex-1 rounded-t-md gradient-blue opacity-60" style={{ height: `${h}%` }} />
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
              {t("landing.featuresTitle1")}{" "}
              <span className="text-gradient-blue">{t("landing.featuresTitle2")}</span>
            </h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">{t("landing.featuresDesc")}</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {featureKeys.map((f) => (
              <div key={f.titleKey} className="glass-card rounded-2xl p-6 card-hover">
                <div className={`h-11 w-11 rounded-xl ${f.gradient} flex items-center justify-center mb-4`}>
                  <f.icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-base font-bold text-foreground">{t(f.titleKey)}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{t(f.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-16 px-4 bg-accent/40">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-2xl font-bold text-foreground mb-8">{t("landing.builtFor")}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {highlightKeys.map((key) => (
              <div key={key} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white soft-shadow">
                <CheckCircle className="h-4 w-4 text-bio-success shrink-0" />
                <span className="text-sm font-medium text-foreground">{t(key)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Doctor CTA */}
      <section className="py-16 px-4">
        <div className="mx-auto max-w-4xl">
          <div className="glass-card rounded-3xl overflow-hidden">
            <div className="grid md:grid-cols-2">
              <div className="p-8 sm:p-10">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/8 border border-primary/15 mb-4">
                  <Video className="h-3 w-3 text-primary" />
                  <span className="text-[11px] font-semibold text-primary tracking-wide">{t("landing.newFeature")}</span>
                </div>
                <h2 className="text-2xl font-extrabold text-foreground mb-3">
                  {t("landing.aiDoctorTitle")} <span className="text-gradient-blue">{t("landing.consultation")}</span>
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">{t("landing.aiDoctorDesc")}</p>
                <Button variant="hero" size="lg" asChild className="rounded-2xl">
                  <Link to="/consultation">
                    {t("landing.startFreeConsultation")} <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div className="gradient-blue flex items-center justify-center p-8">
                <div className="text-center text-white">
                  <div className="h-20 w-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                    <Stethoscope className="h-10 w-10" />
                  </div>
                  <p className="text-lg font-bold">{t("landing.drAi")}</p>
                  <p className="text-xs opacity-80 mt-1">{t("landing.drAiSub")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-12 px-4 border-t border-border/50">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong>{t("landing.disclaimerLabel")}</strong> {t("landing.disclaimer")}
          </p>
        </div>
      </section>
    </div>
  );
}

function MiniPreviewCard({ icon: Icon, label, value, color }: { icon: typeof Activity; label: string; value: string; color: string }) {
  return (
    <div className="rounded-xl bg-accent/50 p-3.5">
      <Icon className={`h-4 w-4 ${color} mb-1.5`} />
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="text-sm font-bold text-foreground">{value}</p>
    </div>
  );
}
