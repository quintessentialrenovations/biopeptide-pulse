import { useState, useCallback, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const stop = useCallback(() => {
    abortRef.current?.abort();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setIsSpeaking(false);
  }, []);

  const speak = useCallback(async (text: string) => {
    stop();

    // Limit text length for API
    const trimmed = text.slice(0, 4500);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      setIsSpeaking(true);

      const { data, error } = await supabase.functions.invoke("elevenlabs-tts", {
        body: { text: trimmed },
      });

      if (controller.signal.aborted) return;

      if (error || !data?.audio) {
        console.warn("ElevenLabs TTS failed, falling back to browser TTS:", error);
        fallbackBrowserTTS(trimmed, setIsSpeaking);
        return;
      }

      const audioUrl = `data:audio/mpeg;base64,${data.audio}`;
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onended = () => {
        setIsSpeaking(false);
        audioRef.current = null;
      };
      audio.onerror = () => {
        setIsSpeaking(false);
        audioRef.current = null;
      };

      await audio.play();
    } catch (err) {
      if (controller.signal.aborted) return;
      console.warn("ElevenLabs TTS error, falling back:", err);
      fallbackBrowserTTS(trimmed, setIsSpeaking);
    }
  }, [stop]);

  return { speak, stop, isSpeaking };
}

// Fallback to browser TTS if ElevenLabs fails
function fallbackBrowserTTS(text: string, setIsSpeaking: (v: boolean) => void) {
  if (!window.speechSynthesis) {
    setIsSpeaking(false);
    return;
  }
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "es-ES";
  u.rate = 0.95;
  u.pitch = 1.0;
  const voices = window.speechSynthesis.getVoices();
  const esVoice =
    voices.find((v) => v.lang.startsWith("es") && v.name.includes("Google")) ||
    voices.find((v) => v.lang.startsWith("es")) ||
    null;
  if (esVoice) u.voice = esVoice;
  u.onstart = () => setIsSpeaking(true);
  u.onend = () => setIsSpeaking(false);
  u.onerror = () => setIsSpeaking(false);
  window.speechSynthesis.speak(u);
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
