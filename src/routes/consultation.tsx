import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { useState } from "react";
import {
  Video, Mic, MicOff, ChevronRight, CheckCircle, AlertTriangle, FileText,
  Shield, Stethoscope, Heart, Brain, Pill, ClipboardList, Play, ArrowRight,
  Send, User, Bot,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n/context";
import type { TranslationKey } from "@/i18n/translations";

export const Route = createFileRoute("/consultation")({
  head: () => ({
    meta: [
      { title: "Consulta Doctor IA — BioPeptideX" },
      { name: "description", content: "Consulta personalizada con nuestro Doctor IA sobre terapia de péptidos." },
    ],
  }),
  component: ConsultationPage,
});

type Phase = "intro" | "questionnaire" | "chat" | "summary";
interface Message { role: "doctor" | "user"; text: string; }

interface QStep {
  id: string;
  icon: typeof Heart;
  titleKey: TranslationKey;
  subtitleKey: TranslationKey;
  optionKeys?: TranslationKey[];
  fields?: { labelKey: TranslationKey; placeholder: string }[];
  multi: boolean;
  isRedFlag?: boolean;
}

const questionnaireSteps: QStep[] = [
  {
    id: "goals", icon: Heart, titleKey: "q.goals", subtitleKey: "consult.selectAll",
    optionKeys: ["q.weightLoss", "q.bodyRecomp", "q.appetiteControl", "q.metabolicHealth", "q.improvedEnergy", "q.athletic"],
    multi: true,
  },
  {
    id: "weight", icon: ClipboardList, titleKey: "q.healthTitle", subtitleKey: "q.healthSub",
    fields: [
      { labelKey: "q.currentWeight", placeholder: "ej. 105" },
      { labelKey: "q.goalWeight", placeholder: "ej. 85" },
      { labelKey: "q.height", placeholder: "ej. 175" },
    ],
    multi: false,
  },
  {
    id: "history", icon: Stethoscope, titleKey: "q.medicalHistory", subtitleKey: "q.safetyScreening",
    optionKeys: ["q.diabetes", "q.thyroid", "q.pancreatitis", "q.gallbladder", "q.kidney", "q.heart", "q.pregnant", "q.none"],
    multi: true, isRedFlag: true,
  },
  {
    id: "experience", icon: Pill, titleKey: "q.experienceTitle", subtitleKey: "q.experienceSub",
    optionKeys: ["q.firstTime", "q.triedSema", "q.triedTirz", "q.otherGlp", "q.currentlyOn"],
    multi: false,
  },
];

function ConsultationPage() {
  const { t } = useI18n();
  const [phase, setPhase] = useState<Phase>("intro");
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState<Record<string, string[]>>({});
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [showRedFlag, setShowRedFlag] = useState(false);

  const getDoctorMessages = (): Message[] => [
    { role: "doctor", text: t("chat.doctorMsg1") },
    { role: "doctor", text: t("chat.doctorMsg2") },
    { role: "doctor", text: t("chat.doctorMsg3") },
  ];

  const toggleSelection = (stepId: string, option: string, multi: boolean) => {
    setSelections((prev) => {
      const current = prev[stepId] || [];
      const noneKey = t("q.none");
      if (multi) {
        if (option === noneKey) return { ...prev, [stepId]: [option] };
        const filtered = current.filter((o) => o !== noneKey);
        return { ...prev, [stepId]: filtered.includes(option) ? filtered.filter((o) => o !== option) : [...filtered, option] };
      }
      return { ...prev, [stepId]: [option] };
    });
  };

  const handleNextStep = () => {
    const step = questionnaireSteps[currentStep];
    if (step.isRedFlag) {
      const selected = selections[step.id] || [];
      const noneKey = t("q.none");
      const gallbladderKey = t("q.gallbladder");
      const dangerItems = selected.filter((s) => s !== noneKey && s !== gallbladderKey);
      if (dangerItems.length > 0 && !selected.includes(noneKey)) { setShowRedFlag(true); return; }
    }
    if (currentStep < questionnaireSteps.length - 1) { setCurrentStep(currentStep + 1); setShowRedFlag(false); }
    else { setPhase("chat"); setMessages([...getDoctorMessages()]); }
  };

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    setMessages((prev) => [...prev, { role: "user", text: chatInput }]);
    setChatInput("");
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "doctor", text: t("chat.doctorReply") }]);
    }, 1500);
  };

  const advanceFromRedFlag = () => {
    setShowRedFlag(false);
    if (currentStep < questionnaireSteps.length - 1) setCurrentStep(currentStep + 1);
    else { setPhase("chat"); setMessages([...getDoctorMessages()]); }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-12 px-4 mx-auto max-w-4xl">
        <div className="mb-6 flex items-start gap-3 px-4 py-3 rounded-2xl bg-bio-warning/10 border border-bio-warning/20">
          <Shield className="h-5 w-5 text-bio-warning shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong className="text-foreground">{t("consult.educationalOnly")}</strong> {t("consult.disclaimer")}
          </p>
        </div>

        {phase === "intro" && (
          <div className="text-center py-8">
            <div className="mx-auto mb-6 h-24 w-24 rounded-3xl gradient-blue flex items-center justify-center shadow-lg">
              <Stethoscope className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-3xl font-extrabold text-foreground mb-3">{t("consult.meetDoctor")}</h1>
            <p className="text-muted-foreground max-w-lg mx-auto mb-8 leading-relaxed">{t("consult.meetDoctorDesc")}</p>
            <div className="grid sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-10">
              <ConsultFeature icon={Brain} title={t("consult.smartQuestionnaire")} desc={t("consult.smartQuestionnaireDesc")} />
              <ConsultFeature icon={Video} title={t("consult.liveChat")} desc={t("consult.liveChatDesc")} />
              <ConsultFeature icon={FileText} title={t("consult.doctorSummary")} desc={t("consult.doctorSummaryDesc")} />
            </div>
            <Button variant="hero" size="lg" onClick={() => setPhase("questionnaire")} className="rounded-2xl px-10">
              {t("consult.startConsultation")} <Play className="h-4 w-4 ml-1" />
            </Button>
            <p className="mt-6 text-xs text-muted-foreground max-w-md mx-auto">{t("consult.duration")}</p>
          </div>
        )}

        {phase === "questionnaire" && (() => {
          const step = questionnaireSteps[currentStep];
          const selected = selections[step.id] || [];
          const StepIcon = step.icon;
          const options = step.optionKeys?.map((k) => t(k));

          return (
            <div>
              <div className="flex items-center gap-2 mb-6">
                {Array.from({ length: questionnaireSteps.length }).map((_, i) => (
                  <div key={i} className={cn("h-2 flex-1 rounded-full transition-all", i <= currentStep ? "gradient-blue" : "bg-accent")} />
                ))}
              </div>
              <div className="glass-card rounded-2xl p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-12 w-12 rounded-xl gradient-blue flex items-center justify-center">
                    <StepIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-foreground">{t(step.titleKey)}</h2>
                    <p className="text-sm text-muted-foreground">{t(step.subtitleKey)}</p>
                  </div>
                </div>

                {options && (
                  <div className="grid sm:grid-cols-2 gap-3">
                    {options.map((opt) => (
                      <button key={opt} onClick={() => toggleSelection(step.id, opt, step.multi)}
                        className={cn("flex items-center gap-3 px-4 py-3.5 rounded-xl border text-left transition-all text-sm font-medium",
                          selected.includes(opt) ? "border-primary bg-primary/8 text-primary" : "border-border bg-white hover:bg-accent text-foreground"
                        )}>
                        <div className={cn("h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0",
                          selected.includes(opt) ? "border-primary bg-primary" : "border-muted-foreground/30")}>
                          {selected.includes(opt) && <CheckCircle className="h-3 w-3 text-white" />}
                        </div>
                        {opt}
                      </button>
                    ))}
                  </div>
                )}

                {step.fields && (
                  <div className="space-y-4">
                    {step.fields.map((field) => (
                      <div key={field.labelKey}>
                        <label className="text-sm font-semibold text-foreground mb-1.5 block">{t(field.labelKey)}</label>
                        <input type="number" placeholder={field.placeholder}
                          value={fieldValues[field.labelKey] || ""}
                          onChange={(e) => setFieldValues((p) => ({ ...p, [field.labelKey]: e.target.value }))}
                          className="w-full h-12 px-4 rounded-xl border border-border bg-white text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                      </div>
                    ))}
                  </div>
                )}

                {showRedFlag && (
                  <div className="mt-5 p-4 rounded-xl bg-destructive/8 border border-destructive/20">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-bold text-destructive">{t("q.redFlagTitle")}</p>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{t("q.redFlagDesc")}</p>
                        <Button variant="outline" size="sm" className="mt-3" onClick={advanceFromRedFlag}>
                          {t("q.understandContinue")}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-6 flex justify-end">
                  <Button variant="hero" onClick={handleNextStep} className="rounded-xl">
                    {currentStep === questionnaireSteps.length - 1 ? t("consult.startAiChat") : t("consult.continue")}
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })()}

        {phase === "chat" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl gradient-blue flex items-center justify-center">
                  <Stethoscope className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-foreground">{t("chat.drAiConsultation")}</h2>
                  <p className="text-xs text-bio-success font-medium flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-bio-success animate-pulse" /> {t("chat.liveSession")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setIsMuted(!isMuted)}
                  className={cn("p-2 rounded-xl transition-colors", isMuted ? "bg-destructive/10 text-destructive" : "bg-accent text-muted-foreground hover:text-foreground")}>
                  {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </button>
                <Button variant="outline" size="sm" onClick={() => setPhase("summary")} className="rounded-xl text-xs">
                  {t("chat.endSession")}
                </Button>
              </div>
            </div>

            <div className="glass-card rounded-2xl overflow-hidden mb-4">
              <div className="relative h-48 sm:h-56 gradient-blue flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="h-20 w-20 rounded-full bg-white/20 backdrop-blur flex items-center justify-center mx-auto mb-3">
                    <Stethoscope className="h-10 w-10" />
                  </div>
                  <p className="text-sm font-semibold">{t("chat.drAiBio")}</p>
                  <p className="text-xs opacity-80">{t("chat.aiVideoAvatar")}</p>
                </div>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="w-1 rounded-full bg-white/60"
                      style={{ height: `${12 + Math.sin(Date.now() / 300 + i) * 8}px`, animation: `pulse 1.${i}s ease-in-out infinite` }} />
                  ))}
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-4 mb-4 max-h-[360px] overflow-y-auto space-y-3">
              {messages.map((msg, i) => (
                <div key={i} className={cn("flex gap-3", msg.role === "user" ? "flex-row-reverse" : "")}>
                  <div className={cn("h-8 w-8 rounded-xl flex items-center justify-center shrink-0", msg.role === "doctor" ? "gradient-blue" : "gradient-green")}>
                    {msg.role === "doctor" ? <Bot className="h-4 w-4 text-white" /> : <User className="h-4 w-4 text-white" />}
                  </div>
                  <div className={cn("max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed", msg.role === "doctor" ? "bg-accent text-foreground" : "bg-primary text-white")}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input value={chatInput} onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
                placeholder={t("chat.askQuestion")}
                className="flex-1 h-12 px-4 rounded-2xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
              <Button variant="hero" onClick={handleSendChat} className="h-12 w-12 rounded-2xl p-0">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {phase === "summary" && (
          <div className="text-center py-8">
            <div className="mx-auto mb-6 h-20 w-20 rounded-3xl gradient-green flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-2xl font-extrabold text-foreground mb-2">{t("summary.complete")}</h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-8">{t("summary.desc")}</p>
            <div className="glass-card rounded-2xl p-6 max-w-lg mx-auto mb-8 text-left">
              <h3 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                {t("summary.title")}
              </h3>
              <div className="space-y-3">
                <SummaryItem label={t("summary.primaryGoal")} value={t("summary.primaryGoalVal")} />
                <SummaryItem label={t("summary.recommendedProtocol")} value={t("summary.recommendedProtocolVal")} />
                <SummaryItem label={t("summary.bmi")} value={t("summary.bmiVal")} />
                <SummaryItem label={t("summary.contraindications")} value={t("summary.contraindicationsVal")} />
                <SummaryItem label={t("summary.experience")} value={t("summary.experienceVal")} />
                <SummaryItem label={t("summary.duration")} value={t("summary.durationVal")} />
              </div>
              <div className="mt-5 p-3 rounded-xl bg-bio-warning/10 border border-bio-warning/20">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">{t("summary.reminderLabel")}</strong> {t("summary.reminder")}
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="hero" size="lg" className="rounded-2xl">
                <FileText className="h-4 w-4 mr-2" />
                {t("summary.downloadPdf")}
              </Button>
              <Button variant="outline" size="lg" className="rounded-2xl" onClick={() => { setPhase("intro"); setCurrentStep(0); setSelections({}); setFieldValues({}); setMessages([]); }}>
                {t("summary.startNew")}
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function ConsultFeature({ icon: Icon, title, desc }: { icon: typeof Heart; title: string; desc: string }) {
  return (
    <div className="glass-card rounded-2xl p-5 text-center">
      <div className="h-10 w-10 rounded-xl gradient-blue flex items-center justify-center mx-auto mb-3">
        <Icon className="h-5 w-5 text-white" />
      </div>
      <h3 className="text-sm font-bold text-foreground">{title}</h3>
      <p className="text-xs text-muted-foreground mt-1">{desc}</p>
    </div>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold text-foreground">{value}</span>
    </div>
  );
}
