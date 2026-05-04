import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { useState } from "react";
import {
  Video,
  Mic,
  MicOff,
  MessageSquare,
  ChevronRight,
  CheckCircle,
  AlertTriangle,
  FileText,
  Shield,
  Stethoscope,
  Heart,
  Brain,
  Pill,
  ClipboardList,
  Play,
  ArrowRight,
  Send,
  User,
  Bot,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/consultation")({
  head: () => ({
    meta: [
      { title: "AI Doctor Consultation — BioPeptideX" },
      {
        name: "description",
        content:
          "Speak with our AI Doctor for a personalized peptide therapy consultation. Get educated on protocols, contraindications, and prepare for your physician visit.",
      },
    ],
  }),
  component: ConsultationPage,
});

type Phase = "intro" | "questionnaire" | "chat" | "summary";

interface Message {
  role: "doctor" | "user";
  text: string;
}

const questionnaireSteps = [
  {
    id: "goals",
    icon: Heart,
    title: "What are your primary goals?",
    subtitle: "Select all that apply",
    options: [
      "Weight loss",
      "Body recomposition",
      "Appetite control",
      "Better metabolic health",
      "Improved energy",
      "Athletic performance",
    ],
    multi: true,
  },
  {
    id: "weight",
    icon: ClipboardList,
    title: "Tell us about your current health",
    subtitle: "This helps personalize your protocol",
    fields: [
      { label: "Current Weight (kg)", placeholder: "e.g. 105" },
      { label: "Goal Weight (kg)", placeholder: "e.g. 85" },
      { label: "Height (cm)", placeholder: "e.g. 175" },
    ],
  },
  {
    id: "history",
    icon: Stethoscope,
    title: "Medical History Check",
    subtitle: "Important safety screening",
    options: [
      "Type 2 Diabetes",
      "Thyroid condition (MTC/MEN2)",
      "Pancreatitis history",
      "Gallbladder issues",
      "Kidney disease",
      "Heart conditions",
      "Currently pregnant/nursing",
      "None of the above",
    ],
    multi: true,
    isRedFlag: true,
  },
  {
    id: "experience",
    icon: Pill,
    title: "Previous peptide experience",
    subtitle: "Have you used GLP-1 medications before?",
    options: [
      "First time — never used",
      "Tried Semaglutide",
      "Tried Tirzepatide",
      "Used other GLP-1s",
      "Currently on a protocol",
    ],
    multi: false,
  },
];

const doctorMessages: Message[] = [
  {
    role: "doctor",
    text: "Welcome! I'm Dr. AI, your BioPeptideX consultation guide. Based on your questionnaire, I can see you're interested in weight loss with Tirzepatide. Let me walk you through what to expect.",
  },
  {
    role: "doctor",
    text: "Tirzepatide is a dual GIP/GLP-1 receptor agonist. It works by mimicking two natural gut hormones — reducing appetite, slowing gastric emptying, and improving insulin sensitivity. Clinical trials showed an average weight loss of 15-22% body weight over 72 weeks.",
  },
  {
    role: "doctor",
    text: "Your starting dose will be 2.5mg weekly for the first 4 weeks. This allows your body to adjust gradually. Most people tolerate this very well with minimal side effects.",
  },
];

function ConsultationPage() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState<Record<string, string[]>>({});
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [showRedFlag, setShowRedFlag] = useState(false);

  const toggleSelection = (stepId: string, option: string, multi: boolean) => {
    setSelections((prev) => {
      const current = prev[stepId] || [];
      if (multi) {
        if (option === "None of the above") return { ...prev, [stepId]: [option] };
        const filtered = current.filter((o) => o !== "None of the above");
        return {
          ...prev,
          [stepId]: filtered.includes(option)
            ? filtered.filter((o) => o !== option)
            : [...filtered, option],
        };
      }
      return { ...prev, [stepId]: [option] };
    });
  };

  const handleNextStep = () => {
    const step = questionnaireSteps[currentStep];
    if (step.isRedFlag) {
      const selected = selections[step.id] || [];
      const dangerItems = selected.filter(
        (s) => s !== "None of the above" && s !== "Gallbladder issues"
      );
      if (dangerItems.length > 0 && !selected.includes("None of the above")) {
        setShowRedFlag(true);
        return;
      }
    }
    if (currentStep < questionnaireSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      setShowRedFlag(false);
    } else {
      setPhase("chat");
      setMessages([...doctorMessages]);
    }
  };

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    const userMsg: Message = { role: "user", text: chatInput };
    setMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "doctor",
          text: "That's a great question. Based on the clinical data, most patients experience the greatest appetite suppression during weeks 4-8 as the medication reaches therapeutic levels. I recommend keeping a food journal during this period to track your hunger patterns and share with your prescribing physician.",
        },
      ]);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-12 px-4 mx-auto max-w-4xl">
        {/* Disclaimer Banner */}
        <div className="mb-6 flex items-start gap-3 px-4 py-3 rounded-2xl bg-bio-warning/10 border border-bio-warning/20">
          <Shield className="h-5 w-5 text-bio-warning shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Educational Only:</strong> This
            AI consultation provides educational guidance only. It is not a
            substitute for professional medical advice. A licensed physician must
            prescribe and supervise all peptide therapy.
          </p>
        </div>

        {phase === "intro" && <IntroPhase onStart={() => setPhase("questionnaire")} />}

        {phase === "questionnaire" && (
          <QuestionnairePhase
            step={questionnaireSteps[currentStep]}
            currentStep={currentStep}
            totalSteps={questionnaireSteps.length}
            selections={selections}
            fieldValues={fieldValues}
            showRedFlag={showRedFlag}
            onToggle={toggleSelection}
            onFieldChange={(key, val) => setFieldValues((p) => ({ ...p, [key]: val }))}
            onNext={handleNextStep}
            onDismissRedFlag={() => { setShowRedFlag(false); if (currentStep < questionnaireSteps.length - 1) setCurrentStep(currentStep + 1); else { setPhase("chat"); setMessages([...doctorMessages]); }}}
          />
        )}

        {phase === "chat" && (
          <ChatPhase
            messages={messages}
            chatInput={chatInput}
            isMuted={isMuted}
            onInputChange={setChatInput}
            onSend={handleSendChat}
            onToggleMute={() => setIsMuted(!isMuted)}
            onFinish={() => setPhase("summary")}
          />
        )}

        {phase === "summary" && <SummaryPhase onRestart={() => { setPhase("intro"); setCurrentStep(0); setSelections({}); setFieldValues({}); setMessages([]); }} />}
      </main>
    </div>
  );
}

function IntroPhase({ onStart }: { onStart: () => void }) {
  return (
    <div className="text-center py-8">
      <div className="mx-auto mb-6 h-24 w-24 rounded-3xl gradient-blue flex items-center justify-center shadow-lg">
        <Stethoscope className="h-12 w-12 text-white" />
      </div>
      <h1 className="text-3xl font-extrabold text-foreground mb-3">
        Meet Your AI Doctor
      </h1>
      <p className="text-muted-foreground max-w-lg mx-auto mb-8 leading-relaxed">
        Have a personalized one-on-one consultation about peptide therapy.
        Get educated on protocols, understand contraindications, and prepare
        a professional summary for your physician.
      </p>

      <div className="grid sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-10">
        <ConsultFeature
          icon={Brain}
          title="Smart Questionnaire"
          desc="Health screening & goals assessment"
        />
        <ConsultFeature
          icon={Video}
          title="Live AI Chat"
          desc="Ask questions in real-time"
        />
        <ConsultFeature
          icon={FileText}
          title="Doctor Summary"
          desc="PDF report for your physician"
        />
      </div>

      <Button variant="hero" size="lg" onClick={onStart} className="rounded-2xl px-10">
        Start Consultation <Play className="h-4 w-4 ml-1" />
      </Button>

      <p className="mt-6 text-xs text-muted-foreground max-w-md mx-auto">
        ~10 minutes · Completely free · Your data is kept private & secure
      </p>
    </div>
  );
}

function ConsultFeature({ icon: Icon, title, desc }: { icon: typeof Brain; title: string; desc: string }) {
  return (
    <div className="glass-card rounded-2xl p-5 text-center">
      <div className="h-11 w-11 rounded-xl gradient-blue flex items-center justify-center mx-auto mb-3">
        <Icon className="h-5 w-5 text-white" />
      </div>
      <h3 className="text-sm font-bold text-foreground">{title}</h3>
      <p className="text-xs text-muted-foreground mt-1">{desc}</p>
    </div>
  );
}

function QuestionnairePhase({
  step,
  currentStep,
  totalSteps,
  selections,
  fieldValues,
  showRedFlag,
  onToggle,
  onFieldChange,
  onNext,
  onDismissRedFlag,
}: {
  step: (typeof questionnaireSteps)[number];
  currentStep: number;
  totalSteps: number;
  selections: Record<string, string[]>;
  fieldValues: Record<string, string>;
  showRedFlag: boolean;
  onToggle: (stepId: string, option: string, multi: boolean) => void;
  onFieldChange: (key: string, val: string) => void;
  onNext: () => void;
  onDismissRedFlag: () => void;
}) {
  const selected = selections[step.id] || [];
  const StepIcon = step.icon;

  return (
    <div>
      {/* Progress */}
      <div className="flex items-center gap-2 mb-6">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-2 flex-1 rounded-full transition-all",
              i <= currentStep ? "gradient-blue" : "bg-accent"
            )}
          />
        ))}
      </div>

      <div className="glass-card rounded-2xl p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-12 w-12 rounded-xl gradient-blue flex items-center justify-center">
            <StepIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">{step.title}</h2>
            <p className="text-sm text-muted-foreground">{step.subtitle}</p>
          </div>
        </div>

        {step.options && (
          <div className="grid sm:grid-cols-2 gap-3">
            {step.options.map((opt) => (
              <button
                key={opt}
                onClick={() => onToggle(step.id, opt, step.multi ?? false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3.5 rounded-xl border text-left transition-all text-sm font-medium",
                  selected.includes(opt)
                    ? "border-primary bg-primary/8 text-primary"
                    : "border-border bg-white hover:bg-accent text-foreground"
                )}
              >
                <div
                  className={cn(
                    "h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0",
                    selected.includes(opt)
                      ? "border-primary bg-primary"
                      : "border-muted-foreground/30"
                  )}
                >
                  {selected.includes(opt) && (
                    <CheckCircle className="h-3 w-3 text-white" />
                  )}
                </div>
                {opt}
              </button>
            ))}
          </div>
        )}

        {step.fields && (
          <div className="space-y-4">
            {step.fields.map((field) => (
              <div key={field.label}>
                <label className="text-sm font-semibold text-foreground mb-1.5 block">
                  {field.label}
                </label>
                <input
                  type="number"
                  placeholder={field.placeholder}
                  value={fieldValues[field.label] || ""}
                  onChange={(e) => onFieldChange(field.label, e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border border-border bg-white text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>
            ))}
          </div>
        )}

        {showRedFlag && (
          <div className="mt-5 p-4 rounded-xl bg-destructive/8 border border-destructive/20">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-destructive">
                  Important Medical Flag
                </p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Based on your selections, there may be contraindications
                  that need to be discussed with your physician before
                  starting peptide therapy. We strongly recommend consulting
                  with your doctor about these conditions.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={onDismissRedFlag}
                >
                  I understand, continue
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <Button variant="hero" onClick={onNext} className="rounded-xl">
            {currentStep === totalSteps - 1 ? "Start AI Chat" : "Continue"}
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function ChatPhase({
  messages,
  chatInput,
  isMuted,
  onInputChange,
  onSend,
  onToggleMute,
  onFinish,
}: {
  messages: Message[];
  chatInput: string;
  isMuted: boolean;
  onInputChange: (v: string) => void;
  onSend: () => void;
  onToggleMute: () => void;
  onFinish: () => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl gradient-blue flex items-center justify-center">
            <Stethoscope className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground">Dr. AI Consultation</h2>
            <p className="text-xs text-bio-success font-medium flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-bio-success animate-pulse" /> Live Session
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleMute}
            className={cn(
              "p-2 rounded-xl transition-colors",
              isMuted ? "bg-destructive/10 text-destructive" : "bg-accent text-muted-foreground hover:text-foreground"
            )}
          >
            {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </button>
          <Button variant="outline" size="sm" onClick={onFinish} className="rounded-xl text-xs">
            End Session
          </Button>
        </div>
      </div>

      {/* AI Doctor Video Placeholder */}
      <div className="glass-card rounded-2xl overflow-hidden mb-4">
        <div className="relative h-48 sm:h-56 gradient-blue flex items-center justify-center">
          <div className="text-center text-white">
            <div className="h-20 w-20 rounded-full bg-white/20 backdrop-blur flex items-center justify-center mx-auto mb-3">
              <Stethoscope className="h-10 w-10" />
            </div>
            <p className="text-sm font-semibold">Dr. AI — BioPeptideX</p>
            <p className="text-xs opacity-80">AI Video Avatar</p>
          </div>
          {/* Animated speaking indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="w-1 rounded-full bg-white/60"
                style={{
                  height: `${12 + Math.sin(Date.now() / 300 + i) * 8}px`,
                  animation: `pulse 1.${i}s ease-in-out infinite`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="glass-card rounded-2xl p-4 mb-4 max-h-[360px] overflow-y-auto space-y-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={cn(
              "flex gap-3",
              msg.role === "user" ? "flex-row-reverse" : ""
            )}
          >
            <div
              className={cn(
                "h-8 w-8 rounded-xl flex items-center justify-center shrink-0",
                msg.role === "doctor" ? "gradient-blue" : "gradient-green"
              )}
            >
              {msg.role === "doctor" ? (
                <Bot className="h-4 w-4 text-white" />
              ) : (
                <User className="h-4 w-4 text-white" />
              )}
            </div>
            <div
              className={cn(
                "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                msg.role === "doctor"
                  ? "bg-accent text-foreground"
                  : "bg-primary text-white"
              )}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          value={chatInput}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSend()}
          placeholder="Ask Dr. AI a question..."
          className="flex-1 h-12 px-4 rounded-2xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
        />
        <Button variant="hero" onClick={onSend} className="h-12 w-12 rounded-2xl p-0">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function SummaryPhase({ onRestart }: { onRestart: () => void }) {
  return (
    <div className="text-center py-8">
      <div className="mx-auto mb-6 h-20 w-20 rounded-3xl gradient-green flex items-center justify-center">
        <CheckCircle className="h-10 w-10 text-white" />
      </div>
      <h2 className="text-2xl font-extrabold text-foreground mb-2">
        Consultation Complete
      </h2>
      <p className="text-muted-foreground max-w-md mx-auto mb-8">
        Your Doctor-Ready Summary has been generated. Share this with your
        prescribing physician to discuss your peptide therapy options.
      </p>

      <div className="glass-card rounded-2xl p-6 max-w-lg mx-auto mb-8 text-left">
        <h3 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Doctor-Ready Summary
        </h3>
        <div className="space-y-3">
          <SummaryItem label="Primary Goal" value="Weight Loss (105kg → 85kg)" />
          <SummaryItem label="Recommended Protocol" value="Tirzepatide — Starting 2.5mg weekly" />
          <SummaryItem label="BMI Category" value="Obese Class I (34.3)" />
          <SummaryItem label="Contraindications Flagged" value="None identified" />
          <SummaryItem label="Previous Experience" value="First-time user" />
          <SummaryItem label="AI Consultation Duration" value="12 minutes" />
        </div>

        <div className="mt-5 p-3 rounded-xl bg-bio-warning/10 border border-bio-warning/20">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Reminder:</strong> This summary
            is for educational purposes only. All treatment decisions must be
            made in consultation with a licensed physician.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button variant="hero" size="lg" className="rounded-2xl">
          <FileText className="h-4 w-4 mr-2" />
          Download PDF Summary
        </Button>
        <Button variant="outline" size="lg" className="rounded-2xl" onClick={onRestart}>
          Start New Consultation
        </Button>
      </div>
    </div>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-border/50 last:border-0">
      <span className="text-xs text-muted-foreground font-medium">{label}</span>
      <span className="text-sm font-semibold text-foreground">{value}</span>
    </div>
  );
}
