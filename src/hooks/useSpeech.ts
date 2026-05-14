import { useState, useCallback, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

// Tiny silent MP3 used to unlock audio playback on iOS Safari / mobile browsers.
// Must be played from a real user gesture before any subsequent programmatic .play().
const SILENT_MP3 =
  "data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQxAADB8AhSmxhIIEVCSiJrDCQBTcu3UrAIwUdkRgQbFAZC1CQEwTJ9mjRvBA4UOLD8nKVOWfh+UlK3z/177OXrfOdKl7097LFr89vIRzh9Bb1RH7sdo+jATWdvWZHKpr6+TVk4irGksRsoNOl9rJUYxsAJ8jrj9/Q6/RCKRghQDVlDWNlrUlVKbW/G14u1XOqFaPFc/nGu/GMYjRDyLjmRgQS47akctjOuq56XJBfvcdHhZ4mPxEmZTkhpMUQqdUFOuJ7e3ckh6N4MMiAlGgGLAiwiIIBAQ4uGgUZIEoBAaQiABNAQQEEEAQMEYBjAxhAQyEhwOFBAcjogkB8EQEAYAEABACEYBAYJI8DAYE7AYHCBQQGAwG4DAQGEAQMAQUDBAEDAhAlBwHEBQQDIxAjAcGAYBA0OBgEDgcCBAGAYDAwIBwGEhAEAQMBAwGAwIB4HAgIBgQDgQEAYDAYBg4BBAJDAQEAwHA4DAEAQDAcEAYBAwGAQGAwHBAGCwGAwGAwHAwGBAGCQGBgGBAEAwGBAEAwGAQGAwGAQGAQGAYBAYBAQGAYBAQGAQGAQGAYBAQGAYBAYBAYBAYBAYBAYBAYBAYBAYBAYBAYBAYBAYBAYBAYBAYBAYBAYBAYBAYBAYBAYBAYBAYBAYBAYBAYBAYBAYBAYBAYBAYBAYBAYBAYBAYBAYBA";

let audioUnlocked = false;
let audioBlocked = false;
let sharedAudio: HTMLAudioElement | null = null;
const blockedSubscribers = new Set<(blocked: boolean) => void>();

function setAudioBlocked(v: boolean) {
  if (audioBlocked === v) return;
  audioBlocked = v;
  blockedSubscribers.forEach((cb) => cb(v));
}

export function useAudioBlocked() {
  const [blocked, setBlocked] = useState(audioBlocked);
  useEffect(() => {
    blockedSubscribers.add(setBlocked);
    return () => {
      blockedSubscribers.delete(setBlocked);
    };
  }, []);
  return blocked;
}

function getSharedAudio(): HTMLAudioElement {
  if (!sharedAudio) {
    sharedAudio = new Audio();
    sharedAudio.preload = "auto";
    (sharedAudio as any).playsInline = true;
    sharedAudio.setAttribute("playsinline", "true");
  }
  return sharedAudio;
}

/**
 * Call from a real user gesture (click/touch) BEFORE any programmatic audio playback.
 * Plays a silent MP3 through the shared <audio> element so iOS marks it as user-activated.
 * Also tries to resume any AudioContext and unlock speechSynthesis.
 */
export function unlockAudioPlayback() {
  try {
    const a = getSharedAudio();
    a.src = SILENT_MP3;
    a.muted = false;
    a.volume = 1;
    const p = a.play();
    if (p && typeof p.then === "function") {
      p.then(() => {
        audioUnlocked = true;
        setAudioBlocked(false);
      }).catch(() => {
        setAudioBlocked(true);
      });
    } else {
      audioUnlocked = true;
      setAudioBlocked(false);
    }
  } catch {
    /* ignore */
  }
  // Prime browser speechSynthesis (Safari needs an utterance from a gesture)
  try {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      const u = new SpeechSynthesisUtterance("");
      u.volume = 0;
      window.speechSynthesis.speak(u);
    }
  } catch {
    /* ignore */
  }
}

export function isAudioUnlocked() {
  return audioUnlocked;
}

export function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const stop = useCallback(() => {
    abortRef.current?.abort();
    if (sharedAudio) {
      try {
        sharedAudio.pause();
        sharedAudio.removeAttribute("src");
        sharedAudio.load();
      } catch {
        /* noop */
      }
    }
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, []);

  const speak = useCallback(
    async (text: string, locale: "es" | "en" = "es") => {
      stop();
      const trimmed = text.slice(0, 4500);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        setIsSpeaking(true);

        const { data, error } = await supabase.functions.invoke("elevenlabs-tts", {
          body: { text: trimmed, locale },
        });

        if (controller.signal.aborted) return;

        if (error || !data?.audio) {
          console.warn("ElevenLabs TTS failed, falling back to browser TTS:", error);
          fallbackBrowserTTS(trimmed, locale, setIsSpeaking);
          return;
        }

        const audio = getSharedAudio();
        audio.src = `data:audio/mpeg;base64,${data.audio}`;
        audio.muted = false;
        audio.volume = 1;

        const onEnd = () => {
          setIsSpeaking(false);
          audio.removeEventListener("ended", onEnd);
          audio.removeEventListener("error", onErr);
        };
        const onErr = () => {
          setIsSpeaking(false);
          audio.removeEventListener("ended", onEnd);
          audio.removeEventListener("error", onErr);
          // If playback fails (often mobile gesture issue), fall back to browser TTS
          console.warn("Audio element playback failed, falling back to browser TTS");
          fallbackBrowserTTS(trimmed, locale, setIsSpeaking);
        };
        audio.addEventListener("ended", onEnd);
        audio.addEventListener("error", onErr);

        try {
          await audio.play();
          audioUnlocked = true;
          setAudioBlocked(false);
        } catch (playErr) {
          console.warn("audio.play() rejected, falling back:", playErr);
          audio.removeEventListener("ended", onEnd);
          audio.removeEventListener("error", onErr);
          setAudioBlocked(true);
          fallbackBrowserTTS(trimmed, locale, setIsSpeaking);
        }
      } catch (err) {
        if (controller.signal.aborted) return;
        console.warn("ElevenLabs TTS error, falling back:", err);
        fallbackBrowserTTS(trimmed, locale, setIsSpeaking);
      }
    },
    [stop]
  );

  return { speak, stop, isSpeaking };
}

// Fallback to browser TTS if ElevenLabs fails or audio.play() blocked
function fallbackBrowserTTS(
  text: string,
  locale: "es" | "en",
  setIsSpeaking: (v: boolean) => void
) {
  if (typeof window === "undefined" || !window.speechSynthesis) {
    setIsSpeaking(false);
    return;
  }
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = locale === "en" ? "en-US" : "es-ES";
  u.rate = 1.05;
  u.pitch = 1.1;
  const voices = window.speechSynthesis.getVoices();
  const langPrefix = locale === "en" ? "en" : "es";
  const voice =
    voices.find(
      (v) => v.lang.startsWith(langPrefix) && /female|samantha|google/i.test(v.name)
    ) ||
    voices.find((v) => v.lang.startsWith(langPrefix)) ||
    null;
  if (voice) u.voice = voice;
  u.onstart = () => setIsSpeaking(true);
  u.onend = () => setIsSpeaking(false);
  u.onerror = () => setIsSpeaking(false);
  window.speechSynthesis.speak(u);
}

export function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<any>(null);

  const startListening = useCallback(
    (onResult: (text: string) => void, locale: "es" | "en" = "es") => {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) return;

      const recognition = new SpeechRecognition();
      recognition.lang = locale === "en" ? "en-US" : "es-ES";
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
    },
    []
  );

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  return { startListening, stopListening, isListening, transcript };
}
