import React from "react";
import { Language } from "../types";
import { X, Volume2, VolumeX, Minimize2 } from "lucide-react";
import { speakText, stopSpeaking } from "../lib/speech";

interface BigDisplayModalProps {
  text: string;
  language: Language;
  onClose: () => void;
}

export const BigDisplayModal: React.FC<BigDisplayModalProps> = ({
  text,
  language,
  onClose,
}) => {
  const isAr = language === "ar";
  const [isPlaying, setIsPlaying] = React.useState(false);

  const handleToggleVoice = () => {
    if (isPlaying) {
      stopSpeaking();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      speakText(
        text,
        language,
        () => setIsPlaying(false),
        () => setIsPlaying(false)
      );
    }
  };

  return (
    <div
      id="modal-big-display"
      className="fixed inset-0 z-50 bg-black text-yellow-400 p-6 flex flex-col justify-between select-text"
      role="dialog"
      aria-modal="true"
    >
      {/* Top Controls */}
      <div className="flex items-center justify-between border-b-2 border-yellow-400/40 pb-4">
        <div className="flex items-center gap-2">
          <span className="text-3xl">📱</span>
          <span className="text-sm sm:text-base font-extrabold uppercase tracking-widest text-white">
            {isAr ? "وضع العرض المكبر للعامة" : "Large Screen Public Display"}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleVoice}
            className="px-4 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-black text-sm flex items-center gap-2 transition-transform active:scale-95"
          >
            {isPlaying ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            <span>{isPlaying ? (isAr ? "إيقاف الصوت" : "Stop") : (isAr ? "نطق بصوت عالٍ" : "Speak Aloud")}</span>
          </button>

          <button
            onClick={onClose}
            className="p-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-white font-bold transition-colors"
            aria-label={isAr ? "إغلاق الشاشة المكبرة" : "Close big display"}
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Giant Typography Center */}
      <div className="flex-1 flex items-center justify-center my-6 text-center px-4 overflow-y-auto">
        <div className="max-w-4xl">
          <p className="text-3xl sm:text-5xl md:text-6xl font-black leading-tight sm:leading-snug tracking-normal drop-shadow-md">
            {text}
          </p>
        </div>
      </div>

      {/* Bottom hint */}
      <div className="border-t-2 border-yellow-400/40 pt-4 flex items-center justify-between text-xs sm:text-sm text-stone-300 font-bold">
        <span>{isAr ? "وجّه شاشة الهاتف نحو الشخص المقابل ليقرأ الرسالة بوضوح" : "Show this screen to the person facing you"}</span>
        <button
          onClick={onClose}
          className="text-yellow-400 hover:underline flex items-center gap-1"
        >
          <Minimize2 className="w-4 h-4" />
          <span>{isAr ? "تصغير والعودة" : "Exit"}</span>
        </button>
      </div>
    </div>
  );
};
