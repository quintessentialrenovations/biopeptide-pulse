import { useState, useCallback, useRef, useEffect } from "react";

export function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    const loadVoice = () => {
      const voices = window.speechSynthesis?.getVoices() || [];
      // Prefer a Spanish voice
      const esVoice =
        voices.find((v) => v.lang.startsWith("es") && v.name.includes("Google")) ||
        voices.find((v) => v.lang.startsWith("es") && v.localService === false) ||
        voices.find((v) => v.lang.startsWith("es")) ||
        null;
      voiceRef.current = esVoice;
    };
    loadVoice();
    window.speechSynthesis?.addEventListener?.("voiceschanged", loadVoice);
    return () => window.speechSynthesis?.removeEventListener?.("voiceschanged", loadVoice);
  }, []);

  const speak = useCallback((text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "es-ES";
    u.rate = 0.95;
    u.pitch = 1.0;
    if (voiceRef.current) u.voice = voiceRef.current;
    u.onstart = () => setIsSpeaking(true);
    u.onend = () => setIsSpeaking(false);
    u.onerror = () => setIsSpeaking(false);
    utteranceRef.current = u;
    window.speechSynthesis.speak(u);
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  }, []);

  return { speak, stop, isSpeaking };
}

export function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<any>(null);

  const startListening = useCallback((onResult: (text: string) => void) => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = "es-ES";
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onresult = (event: any) => {
      let finalText = "";
      let interimText = "";
      for (let i = 0; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalText += event.results[i][0].transcript;
        } else {
          interimText += event.results[i][0].transcript;
        }
      }
      setTranscript(finalText || interimText);
      if (finalText) {
        onResult(finalText);
        setIsListening(false);
      }
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
    setTranscript("");
  }, []);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  return { startListening, stopListening, isListening, transcript };
}
