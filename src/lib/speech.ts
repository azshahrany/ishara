import { Language } from "../types";

export function isSpeechSynthesisSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === "undefined") return false;
  return "SpeechRecognition" in window || "webkitSpeechRecognition" in window;
}

let activeUtterance: SpeechSynthesisUtterance | null = null;

export function stopSpeaking(): void {
  if (isSpeechSynthesisSupported()) {
    window.speechSynthesis.cancel();
    activeUtterance = null;
  }
}

export function speakText(
  text: string,
  language: Language = "ar",
  onEnd?: () => void,
  onError?: (err: any) => void
): boolean {
  if (!isSpeechSynthesisSupported()) {
    onError?.("Speech synthesis not supported on this browser.");
    return false;
  }

  try {
    stopSpeaking();

    const utterance = new SpeechSynthesisUtterance(text);
    activeUtterance = utterance;

    // Pick appropriate language code
    utterance.lang = language === "ar" ? "ar-SA" : "en-US";
    utterance.rate = 0.95; // Clear slightly slower rate for emergencies
    utterance.pitch = 1.0;

    // Try finding matching voice
    const voices = window.speechSynthesis.getVoices();
    const targetPrefix = language === "ar" ? "ar" : "en";
    const matchedVoice = voices.find((v) => v.lang.startsWith(targetPrefix));
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onend = () => {
      activeUtterance = null;
      onEnd?.();
    };

    utterance.onerror = (e) => {
      activeUtterance = null;
      onError?.(e);
    };

    window.speechSynthesis.speak(utterance);
    return true;
  } catch (err) {
    console.error("TTS error:", err);
    onError?.(err);
    return false;
  }
}

export interface SpeechRecognizerHandle {
  start: () => void;
  stop: () => void;
  abort: () => void;
}

export function createSpeechRecognizer(
  language: Language = "ar",
  onTranscript: (text: string, isFinal: boolean) => void,
  onError: (errorMessage: string) => void,
  onEnd: () => void
): SpeechRecognizerHandle | null {
  if (!isSpeechRecognitionSupported()) {
    return null;
  }

  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = language === "ar" ? "ar-SA" : "en-US";

  recognition.onresult = (event: any) => {
    let interim = "";
    let final = "";

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        final += transcript;
      } else {
        interim += transcript;
      }
    }

    if (final) {
      onTranscript(final.trim(), true);
    } else if (interim) {
      onTranscript(interim.trim(), false);
    }
  };

  recognition.onerror = (event: any) => {
    console.warn("Speech recognition error event:", event.error);
    if (event.error === "not-allowed") {
      onError("تم رفض إذن استخدام الميكروفون. يرجى تفعيل الإذن من إعدادات المتصفح.");
    } else if (event.error === "no-speech") {
      // Ignored for continuous listening
    } else {
      onError(`خطأ في التعرف على الصوت: ${event.error}`);
    }
  };

  recognition.onend = () => {
    onEnd();
  };

  return {
    start: () => {
      try {
        recognition.start();
      } catch (err) {
        console.warn("Could not start recognition:", err);
      }
    },
    stop: () => {
      try {
        recognition.stop();
      } catch (err) {
        console.warn("Could not stop recognition:", err);
      }
    },
    abort: () => {
      try {
        recognition.abort();
      } catch (err) {
        console.warn("Could not abort recognition:", err);
      }
    },
  };
}
