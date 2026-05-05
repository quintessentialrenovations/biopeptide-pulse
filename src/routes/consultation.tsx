import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  Video, Mic, MicOff, ChevronRight, CheckCircle, AlertTriangle, FileText,
  Shield, Stethoscope, Heart, Brain, Pill, ClipboardList, Play, ArrowRight,
  Send, User, Bot, Volume2, VolumeX, PhoneOff, Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n/context";
import type { TranslationKey } from "@/i18n/translations";
import { useSpeechSynthesis, useSpeechRecognition } from "@/hooks/useSpeech";
import doctorAvatar from "@/assets/doctor-avatar.png";
import ReactMarkdown from "react-markdown";

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
  fields?: { labelKey: TranslationKey; placeholder: string; type?: string }[];
  multi: boolean;
  isRedFlag?: boolean;
}

const questionnaireSteps: QStep[] = [
  {
    id: "basicInfo", icon: User, titleKey: "q.basicInfoTitle", subtitleKey: "q.basicInfoSub",
    fields: [
      { labelKey: "q.patientName", placeholder: "ej. María", type: "text" },
      { labelKey: "q.patientAge", placeholder: "ej. 35", type: "number" },
    ],
    multi: false,
  },
  {
    id: "goals", icon: Heart, titleKey: "q.goals", subtitleKey: "consult.selectAll",
    optionKeys: ["q.weightLoss", "q.bodyRecomp", "q.appetiteControl", "q.metabolicHealth", "q.improvedEnergy", "q.athletic"],
    multi: true,
  },
  {
    id: "weight", icon: ClipboardList, titleKey: "q.healthTitle", subtitleKey: "q.healthSub",
    fields: [
      { labelKey: "q.currentWeight", placeholder: "ej. 105", type: "number" },
      { labelKey: "q.goalWeight", placeholder: "ej. 85", type: "number" },
      { labelKey: "q.height", placeholder: "ej. 175", type: "number" },
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

const AI_DOCTOR_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-doctor`;

function ConsultationPage() {
  const { t } = useI18n();
  const [phase, setPhase] = useState<Phase>("intro");
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState<Record<string, string[]>>({});
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [showRedFlag, setShowRedFlag] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const { speak, stop: stopSpeaking, isSpeaking } = useSpeechSynthesis();
  const { startListening, stopListening, isListening, transcript } = useSpeechRecognition();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Clean text for TTS: strip markdown, emojis, symbols
  const cleanForTTS = useCallback((text: string): string => {
    let clean = text;
    // Remove markdown bold/italic
    clean = clean.replace(/\*{1,3}([^*]+)\*{1,3}/g, '$1');
    clean = clean.replace(/_{1,3}([^_]+)_{1,3}/g, '$1');
    // Remove markdown headers
    clean = clean.replace(/^#{1,6}\s+/gm, '');
    // Remove markdown links
    clean = clean.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
    // Remove markdown list bullets
    clean = clean.replace(/^[\s]*[-*+]\s+/gm, '');
    clean = clean.replace(/^[\s]*\d+\.\s+/gm, '');
    // Remove emojis
    clean = clean.replace(/[\u{1F600}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}\u{200D}\u{20E3}\u{E0020}-\u{E007F}]/gu, '');
    // Remove stray asterisks
    clean = clean.replace(/\*/g, '');
    // Collapse whitespace
    clean = clean.replace(/\n{3,}/g, '\n\n').trim();
    return clean;
  }, []);

  // Auto-speak completed doctor messages
  const lastSpokenRef = useRef(0);
  const prevLoadingRef = useRef(false);
  useEffect(() => {
    // Only speak when loading finishes (streaming complete)
    if (prevLoadingRef.current && !isAiLoading && voiceEnabled) {
      const doctorMessages = messages.filter((m) => m.role === "doctor");
      if (doctorMessages.length > lastSpokenRef.current) {
        const newest = doctorMessages[doctorMessages.length - 1];
        speak(cleanForTTS(newest.text));
        lastSpokenRef.current = doctorMessages.length;
      }
    }
    prevLoadingRef.current = isAiLoading;
  }, [isAiLoading, messages, voiceEnabled, speak, cleanForTTS]);

  const buildPatientContext = useCallback(() => {
    return {
      patientName: fieldValues["q.patientName"] || undefined,
      patientAge: fieldValues["q.patientAge"] || undefined,
      goals: selections["goals"] || [],
      currentWeight: fieldValues["q.currentWeight"] || undefined,
      goalWeight: fieldValues["q.goalWeight"] || undefined,
      height: fieldValues["q.height"] || undefined,
      medicalHistory: selections["history"] || [],
      experience: (selections["experience"] || [])[0] || undefined,
    };
  }, [selections, fieldValues]);

  const streamAiResponse = useCallback(async (chatMessages: Message[]) => {
    setIsAiLoading(true);
    const apiMessages = chatMessages.map((m) => ({
      role: m.role === "doctor" ? "assistant" : "user",
      content: m.text,
    }));

    try {
      const resp = await fetch(AI_DOCTOR_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: apiMessages, patientContext: buildPatientContext() }),
      });

      if (!resp.ok || !resp.body) {
        const err = await resp.json().catch(() => ({ error: "Error de conexión" }));
        setMessages((prev) => [...prev, { role: "doctor", text: `⚠️ ${err.error || "Error al conectar con el Doctor IA. Intenta de nuevo."}` }]);
        setIsAiLoading(false);
        return;
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let assistantSoFar = "";

      const upsertAssistant = (content: string) => {
        assistantSoFar = content;
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.role === "doctor" && last === prev[prev.length - 1] && assistantSoFar.startsWith("")) {
            return prev.map((m, i) => (i === prev.length - 1 ? { ...m, text: assistantSoFar } : m));
          }
          if (prev.length > 0 && prev[prev.length - 1].role === "doctor" && prev[prev.length - 1].text === "") {
            return prev.map((m, i) => (i === prev.length - 1 ? { ...m, text: assistantSoFar } : m));
          }
          return prev;
        });
      };

      // Add empty doctor message placeholder
      setMessages((prev) => [...prev, { role: "doctor", text: "" }]);

      let streamDone = false;
      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") { streamDone = true; break; }
          try {
            const parsed = JSON.parse(jsonStr);
            const delta = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (delta) {
              assistantSoFar += delta;
              upsertAssistant(assistantSoFar);
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }
    } catch (e) {
      console.error("AI Doctor stream error:", e);
      setMessages((prev) => [...prev, { role: "doctor", text: "⚠️ Error de conexión. Por favor intenta de nuevo." }]);
    }
    setIsAiLoading(false);
  }, [buildPatientContext]);

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
    else {
      lastSpokenRef.current = 0;
      setPhase("chat");
      const patientName = fieldValues["q.patientName"] || "";
      const initialMsg: Message = { role: "user", text: `Hola Doctor, me llamo ${patientName}. Acabo de completar el cuestionario. Estoy listo para mi consulta.` };
      const initialMessages = [initialMsg];
      setMessages([initialMsg]);
      streamAiResponse(initialMessages);
    }
  };

  const handleSendChat = (text?: string) => {
    const msg = text || chatInput.trim();
    if (!msg || isAiLoading) return;
    const userMsg: Message = { role: "user", text: msg };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setChatInput("");
    streamAiResponse(newMessages);
  };

  const handleVoiceInput = () => {
    if (isListening) {
      stopListening();
    } else {
      stopSpeaking();
      startListening((text) => {
        handleSendChat(text);
      });
    }
  };

  const advanceFromRedFlag = () => {
    setShowRedFlag(false);
    if (currentStep < questionnaireSteps.length - 1) setCurrentStep(currentStep + 1);
    else {
      lastSpokenRef.current = 0;
      setPhase("chat");
      const patientName = fieldValues["q.patientName"] || "";
      const initialMsg: Message = { role: "user", text: `Hola Doctor, me llamo ${patientName}. Tengo algunas condiciones médicas pero quiero continuar con la consulta.` };
      setMessages([initialMsg]);
      streamAiResponse([initialMsg]);
    }
  };

  const handleEndSession = () => {
    stopSpeaking();
    stopListening();
    setPhase("summary");
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
            <div className="mx-auto mb-6 h-28 w-28 rounded-full overflow-hidden shadow-lg ring-4 ring-primary/20">
              <img src={doctorAvatar} alt="Doctor IA" width={512} height={512} className="h-full w-full object-cover" />
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
                        <input type={field.type || "number"} placeholder={field.placeholder}
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
            {/* Video call header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full overflow-hidden ring-2 ring-primary/30">
                  <img src={doctorAvatar} alt="Doctor IA" width={40} height={40} className="h-full w-full object-cover" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-foreground">{t("chat.drAiConsultation")}</h2>
                  <p className="text-xs text-bio-success font-medium flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-bio-success animate-pulse" /> {t("chat.liveSession")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => { setVoiceEnabled(!voiceEnabled); if (voiceEnabled) stopSpeaking(); }}
                  className={cn("p-2 rounded-xl transition-colors", !voiceEnabled ? "bg-destructive/10 text-destructive" : "bg-accent text-muted-foreground hover:text-foreground")}
                  title={voiceEnabled ? "Silenciar voz" : "Activar voz"}>
                  {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                </button>
                <Button variant="outline" size="sm" onClick={handleEndSession} className="rounded-xl text-xs gap-1">
                  <PhoneOff className="h-3.5 w-3.5" />
                  {t("chat.endSession")}
                </Button>
              </div>
            </div>

            {/* Doctor avatar video area */}
            <div className="glass-card rounded-2xl overflow-hidden mb-4">
              <div className="relative bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 flex items-center justify-center"
                style={{ minHeight: "280px" }}>
                {/* Clinical background pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute inset-0" style={{
                    backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                    backgroundSize: "24px 24px"
                  }} />
                </div>

                {/* Doctor avatar */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className={cn(
                    "h-36 w-36 sm:h-44 sm:w-44 rounded-full overflow-hidden ring-4 transition-all duration-300 relative",
                    isSpeaking
                      ? "ring-bio-success shadow-[0_0_30px_rgba(34,197,94,0.4)] scale-105"
                      : "ring-white/20 shadow-lg"
                  )}>
                    <img src={doctorAvatar} alt="Doctor IA BioPeptideX"
                      width={512} height={512}
                      className="h-full w-full object-cover" />
                    {/* Lip-sync overlay */}
                    {isSpeaking && (
                      <div className="absolute bottom-[18%] left-1/2 -translate-x-1/2 w-[28%]">
                        <div className="lip-sync-mouth rounded-full bg-[#8B4513]/60 backdrop-blur-[1px]" />
                      </div>
                    )}
                  </div>

                  {/* Speaking indicator */}
                  <div className="mt-4 flex items-center gap-2">
                    {isSpeaking ? (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-bio-success/20 backdrop-blur-sm">
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <div
                              key={i}
                              className="w-1 bg-bio-success rounded-full"
                              style={{
                                animation: `soundbar 0.${3 + i}s ease-in-out infinite alternate`,
                                height: `${8 + Math.random() * 12}px`,
                              }}
                            />
                          ))}
                        </div>
                        <span className="text-xs font-medium text-bio-success ml-1">Hablando...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm">
                        <span className="h-2 w-2 rounded-full bg-bio-success animate-pulse" />
                        <span className="text-xs font-medium text-white/70">Dr. IA BioPeptideX</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Decorative corners - video call feel */}
                <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-white/20 rounded-tl-lg" />
                <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-white/20 rounded-tr-lg" />
                <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-white/20 rounded-bl-lg" />
                <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-white/20 rounded-br-lg" />

                {/* REC indicator */}
                <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2 py-1 rounded-md bg-destructive/80 backdrop-blur-sm">
                  <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
                  <span className="text-[10px] font-bold text-white tracking-wider">CONSULTA</span>
                </div>
              </div>
            </div>

            {/* Chat messages */}
            <div className="glass-card rounded-2xl p-4 mb-4 max-h-[300px] overflow-y-auto space-y-3">
              {messages.map((msg, i) => (
                <div key={i} className={cn("flex gap-3", msg.role === "user" ? "flex-row-reverse" : "")}>
                  <div className={cn("h-8 w-8 rounded-xl flex items-center justify-center shrink-0 overflow-hidden",
                    msg.role === "doctor" ? "" : "gradient-green")}>
                    {msg.role === "doctor"
                      ? <img src={doctorAvatar} alt="" width={32} height={32} className="h-full w-full object-cover rounded-xl" />
                      : <User className="h-4 w-4 text-white" />}
                  </div>
                  <div className={cn("max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                    msg.role === "doctor" ? "bg-accent text-foreground" : "bg-primary text-white")}>
                    {msg.role === "doctor" ? (
                      msg.text ? (
                        <div className="prose prose-sm max-w-none [&>p]:my-1 [&>ul]:my-1 [&>ol]:my-1">
                          <ReactMarkdown>{msg.text}</ReactMarkdown>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-xs text-muted-foreground">Pensando...</span>
                        </div>
                      )
                    ) : msg.text}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Input area with voice */}
            <div className="flex gap-2">
              <button
                onClick={handleVoiceInput}
                className={cn(
                  "h-12 w-12 rounded-2xl flex items-center justify-center transition-all shrink-0",
                  isListening
                    ? "bg-destructive text-white animate-pulse shadow-lg shadow-destructive/30"
                    : "bg-accent text-muted-foreground hover:text-foreground hover:bg-accent/80"
                )}
                title={isListening ? "Detener grabación" : "Hablar al doctor"}>
                {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </button>
              <input
                value={isListening ? transcript : chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
                placeholder={isListening ? "Escuchando..." : t("chat.askQuestion")}
                readOnly={isListening}
                className={cn(
                  "flex-1 h-12 px-4 rounded-2xl border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary",
                  isListening ? "border-destructive/30 bg-destructive/5 text-foreground" : "border-border bg-white text-foreground"
                )}
              />
              <Button variant="hero" onClick={() => handleSendChat()} className="h-12 w-12 rounded-2xl p-0" disabled={isListening || isAiLoading}>
                {isAiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>

            {isListening && (
              <p className="text-center text-xs text-destructive mt-2 animate-pulse">
                🎤 Habla ahora... el doctor te escucha
              </p>
            )}
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
              <Button variant="outline" size="lg" className="rounded-2xl" onClick={() => { setPhase("intro"); setCurrentStep(0); setSelections({}); setFieldValues({}); setMessages([]); lastSpokenRef.current = 0; }}>
                {t("summary.startNew")}
              </Button>
            </div>
          </div>
        )}
      </main>

      {/* Soundbar animation keyframes */}
      <style>{`
        @keyframes soundbar {
          0% { height: 4px; }
          100% { height: 18px; }
        }
        @keyframes lipSync {
          0%, 100% { height: 2px; opacity: 0.4; }
          15% { height: 6px; opacity: 0.7; }
          30% { height: 3px; opacity: 0.5; }
          45% { height: 8px; opacity: 0.8; }
          60% { height: 4px; opacity: 0.6; }
          75% { height: 7px; opacity: 0.75; }
          90% { height: 3px; opacity: 0.5; }
        }
        .lip-sync-mouth {
          animation: lipSync 0.35s ease-in-out infinite;
          width: 100%;
        }
      `}</style>
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
