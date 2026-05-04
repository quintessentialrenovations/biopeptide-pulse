import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Activity, ArrowRight, ArrowLeft, Check, User, Ruler, Scale, Target, Pill, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Get Started — BioPeptideX" },
      { name: "description", content: "Complete your profile to start tracking." },
    ],
  }),
  component: OnboardingPage,
});

const STEPS = [
  { icon: User, label: "Your Info", field: "name" },
  { icon: Ruler, label: "Body Stats", field: "stats" },
  { icon: Target, label: "Goals", field: "goals" },
  { icon: Pill, label: "Protocol", field: "protocol" },
];

function OnboardingPage() {
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
        {/* Logo */}
        <div className="flex items-center gap-2.5 justify-center mb-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-blue">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground">
            Bio<span className="text-gradient-blue">PeptideX</span>
          </span>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            {STEPS.map((s, i) => (
              <div key={s.label} className="flex flex-col items-center gap-1">
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
                  {s.label}
                </span>
              </div>
            ))}
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Content */}
        <div className="glass-card rounded-3xl p-8">
          {step === 0 && (
            <div className="space-y-5">
              <div className="text-center mb-2">
                <h2 className="text-xl font-extrabold text-foreground">Let's get to know you</h2>
                <p className="text-sm text-muted-foreground mt-1">This info helps personalize your experience</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground mb-1.5 block">Full Name</label>
                <Input
                  placeholder="Your full name"
                  value={form.full_name}
                  onChange={(e) => update("full_name", e.target.value)}
                  className="h-12 rounded-2xl"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground mb-1.5 block">Age</label>
                <Input
                  type="number"
                  placeholder="Your age"
                  value={form.age}
                  onChange={(e) => update("age", e.target.value)}
                  className="h-12 rounded-2xl"
                  min={18}
                  max={100}
                />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <div className="text-center mb-2">
                <h2 className="text-xl font-extrabold text-foreground">Your Body Stats</h2>
                <p className="text-sm text-muted-foreground mt-1">We'll use this to track your progress</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground mb-1.5 block">Height (cm)</label>
                <Input
                  type="number"
                  placeholder="e.g. 175"
                  value={form.height_cm}
                  onChange={(e) => update("height_cm", e.target.value)}
                  className="h-12 rounded-2xl"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground mb-1.5 block">Starting Weight (kg)</label>
                <Input
                  type="number"
                  placeholder="When you started peptides"
                  value={form.starting_weight}
                  onChange={(e) => update("starting_weight", e.target.value)}
                  className="h-12 rounded-2xl"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground mb-1.5 block">Current Weight (kg)</label>
                <Input
                  type="number"
                  placeholder="Your weight today"
                  value={form.current_weight}
                  onChange={(e) => update("current_weight", e.target.value)}
                  className="h-12 rounded-2xl"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div className="text-center mb-2">
                <h2 className="text-xl font-extrabold text-foreground">Set Your Goal</h2>
                <p className="text-sm text-muted-foreground mt-1">What's your target weight?</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground mb-1.5 block">Goal Weight (kg)</label>
                <Input
                  type="number"
                  placeholder="e.g. 85"
                  value={form.goal_weight}
                  onChange={(e) => update("goal_weight", e.target.value)}
                  className="h-12 rounded-2xl"
                />
              </div>
              {form.starting_weight && form.goal_weight && (
                <div className="glass-card rounded-2xl p-4 bg-primary/5 border border-primary/10">
                  <p className="text-sm font-semibold text-foreground">
                    🎯 Total to lose: {(parseFloat(form.starting_weight) - parseFloat(form.goal_weight)).toFixed(1)} kg
                  </p>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div className="text-center mb-2">
                <h2 className="text-xl font-extrabold text-foreground">Your Protocol</h2>
                <p className="text-sm text-muted-foreground mt-1">Which peptide are you using?</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground mb-1.5 block">Peptide Type</label>
                <div className="grid grid-cols-1 gap-2">
                  {["Tirzepatide", "Retatrutide", "Other"].map((p) => (
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
                <label className="text-sm font-semibold text-foreground mb-1.5 block">Start Date</label>
                <Input
                  type="date"
                  value={form.start_date}
                  onChange={(e) => update("start_date", e.target.value)}
                  className="h-12 rounded-2xl"
                />
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <Button
              variant="ghost"
              onClick={() => setStep(step - 1)}
              disabled={step === 0}
              className="rounded-2xl"
            >
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>

            {step < STEPS.length - 1 ? (
              <Button
                variant="hero"
                onClick={() => setStep(step + 1)}
                disabled={!canNext()}
                className="rounded-2xl"
              >
                Next <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                variant="hero"
                onClick={handleFinish}
                disabled={saving}
                className="rounded-2xl"
              >
                {saving ? "Saving..." : "Start Tracking"} <Check className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
