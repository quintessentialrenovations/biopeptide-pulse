import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Activity, ArrowRight, ArrowLeft, Check, User, Ruler, Scale, Target, Pill, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/i18n/context";
import type { TranslationKey } from "@/i18n/translations";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Comenzar — BioPeptideX" },
      { name: "description", content: "Completa tu perfil para comenzar el seguimiento." },
    ],
  }),
  component: OnboardingPage,
});

function OnboardingPage() {
  const { t } = useI18n();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    age: "",
    height_cm: "",
    starting_weight: "",
    current_weight: "",
    goal_weight: "",
    peptide_type: "Tirzepatide",
    start_date: new Date().toISOString().split("T")[0],
  });

  const STEPS: { icon: typeof User; labelKey: TranslationKey; field: string }[] = [
    { icon: User, labelKey: "onboard.yourInfo", field: "name" },
    { icon: Ruler, labelKey: "onboard.bodyStats", field: "stats" },
    { icon: Target, labelKey: "onboard.goals", field: "goals" },
    { icon: Pill, labelKey: "onboard.protocol", field: "protocol" },
  ];

  useEffect(() => {
    if (!authLoading && !user) {
      navigate({ to: "/login" });
    }
  }, [authLoading, user, navigate]);

  if (authLoading || !user) return null;

  const progress = ((step + 1) / STEPS.length) * 100;
  const update = (key: string, val: string) => setForm((f) => ({ ...f, [key]: val }));

  const canNext = () => {
    if (step === 0) return form.full_name.trim().length > 0 && form.age.length > 0;
    if (step === 1) return form.height_cm.length > 0 && form.starting_weight.length > 0 && form.current_weight.length > 0;
    if (step === 2) return form.goal_weight.length > 0;
    return true;
  };

  const handleFinish = async () => {
    setSaving(true);
    const { error } = await supabase.from("profiles").update({
      full_name: form.full_name,
      age: parseInt(form.age),
      height_cm: parseFloat(form.height_cm),
      starting_weight: parseFloat(form.starting_weight),
      current_weight: parseFloat(form.current_weight),
      goal_weight: parseFloat(form.goal_weight),
      peptide_type: form.peptide_type,
      start_date: form.start_date,
      onboarding_complete: true,
    }).eq("id", user.id);

    setSaving(false);
    if (!error) {
      navigate({ to: "/dashboard" });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg">
        <div className="flex items-center gap-2.5 justify-center mb-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-blue">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground">
            Bio<span className="text-gradient-blue">PeptideX</span>
          </span>
        </div>

        <div className="mb-6">
          <div className="flex justify-between mb-2">
            {STEPS.map((s, i) => (
              <div key={s.field} className="flex flex-col items-center gap-1">
                <div className={`h-9 w-9 rounded-xl flex items-center justify-center transition-all ${
                  i < step ? "gradient-green" : i === step ? "gradient-blue" : "bg-accent"
                }`}>
                  {i < step ? (
                    <Check className="h-4 w-4 text-white" />
                  ) : (
                    <s.icon className={`h-4 w-4 ${i === step ? "text-white" : "text-muted-foreground"}`} />
                  )}
                </div>
                <span className={`text-[10px] font-medium ${i === step ? "text-primary" : "text-muted-foreground"}`}>
                  {t(s.labelKey)}
                </span>
              </div>
            ))}
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="glass-card rounded-3xl p-8">
          {step === 0 && (
            <div className="space-y-5">
              <div className="text-center mb-2">
                <h2 className="text-xl font-extrabold text-foreground">{t("onboard.letsKnow")}</h2>
                <p className="text-sm text-muted-foreground mt-1">{t("onboard.letsKnowSub")}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground mb-1.5 block">{t("onboard.fullName")}</label>
                <Input placeholder={t("onboard.fullNamePlaceholder")} value={form.full_name} onChange={(e) => update("full_name", e.target.value)} className="h-12 rounded-2xl" />
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground mb-1.5 block">{t("onboard.age")}</label>
                <Input type="number" placeholder={t("onboard.agePlaceholder")} value={form.age} onChange={(e) => update("age", e.target.value)} className="h-12 rounded-2xl" min={18} max={100} />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <div className="text-center mb-2">
                <h2 className="text-xl font-extrabold text-foreground">{t("onboard.bodyStatsTitle")}</h2>
                <p className="text-sm text-muted-foreground mt-1">{t("onboard.bodyStatsSub")}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground mb-1.5 block">{t("onboard.height")}</label>
                <Input type="number" placeholder="ej. 175" value={form.height_cm} onChange={(e) => update("height_cm", e.target.value)} className="h-12 rounded-2xl" />
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground mb-1.5 block">{t("onboard.startingWeight")}</label>
                <Input type="number" placeholder={t("onboard.startingWeightPlaceholder")} value={form.starting_weight} onChange={(e) => update("starting_weight", e.target.value)} className="h-12 rounded-2xl" />
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground mb-1.5 block">{t("onboard.currentWeight")}</label>
                <Input type="number" placeholder={t("onboard.currentWeightPlaceholder")} value={form.current_weight} onChange={(e) => update("current_weight", e.target.value)} className="h-12 rounded-2xl" />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div className="text-center mb-2">
                <h2 className="text-xl font-extrabold text-foreground">{t("onboard.setGoal")}</h2>
                <p className="text-sm text-muted-foreground mt-1">{t("onboard.setGoalSub")}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground mb-1.5 block">{t("onboard.goalWeight")}</label>
                <Input type="number" placeholder="ej. 85" value={form.goal_weight} onChange={(e) => update("goal_weight", e.target.value)} className="h-12 rounded-2xl" />
              </div>
              {form.starting_weight && form.goal_weight && (
                <div className="glass-card rounded-2xl p-4 bg-primary/5 border border-primary/10">
                  <p className="text-sm font-semibold text-foreground">
                    {t("onboard.totalToLose")} {(parseFloat(form.starting_weight) - parseFloat(form.goal_weight)).toFixed(1)} kg
                  </p>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div className="text-center mb-2">
                <h2 className="text-xl font-extrabold text-foreground">{t("onboard.yourProtocol")}</h2>
                <p className="text-sm text-muted-foreground mt-1">{t("onboard.yourProtocolSub")}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground mb-1.5 block">{t("onboard.peptideType")}</label>
                <div className="grid grid-cols-1 gap-2">
                  {["Tirzepatide", "Retatrutide", t("onboard.other")].map((p) => (
                    <button
                      key={p}
                      onClick={() => update("peptide_type", p)}
                      className={`p-4 rounded-2xl border-2 text-left transition-all ${
                        form.peptide_type === p
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/30"
                      }`}
                    >
                      <span className="text-sm font-semibold text-foreground">{p}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground mb-1.5 block">{t("onboard.startDate")}</label>
                <Input type="date" value={form.start_date} onChange={(e) => update("start_date", e.target.value)} className="h-12 rounded-2xl" />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mt-8">
            <Button variant="ghost" onClick={() => setStep(step - 1)} disabled={step === 0} className="rounded-2xl">
              <ArrowLeft className="h-4 w-4 mr-1" /> {t("onboard.back")}
            </Button>

            {step < STEPS.length - 1 ? (
              <Button variant="hero" onClick={() => setStep(step + 1)} disabled={!canNext()} className="rounded-2xl">
                {t("onboard.next")} <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button variant="hero" onClick={handleFinish} disabled={saving} className="rounded-2xl">
                {saving ? t("onboard.saving") : t("onboard.startTracking")} <Check className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
