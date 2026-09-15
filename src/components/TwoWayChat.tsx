import React, { useState, useEffect, useRef } from "react";
import { Language, ChatMessage, AccessibilitySettings } from "../types";
import {
  createSpeechRecognizer,
  isSpeechRecognitionSupported,
  speakText,
  stopSpeaking,
} from "../lib/speech";
import {
  Mic,
  MicOff,
  Send,
  Volume2,
  Maximize2,
  Trash2,
  Sparkles,
  ArrowDown,
  Check,
  X,
  Clock,
  ThumbsUp,
  ThumbsDown,
  Smile,
  AlertTriangle,
  Loader2,
} from "lucide-react";

interface TwoWayChatProps {
  language: Language;
  messages: ChatMessage[];
  onSendMessage: (sender: "deaf_user" | "hearing_person", text: string, icon?: string) => void;
  onClearChat: () => void;
  onOpenBigDisplay: (text: string) => void;
  accessibility: AccessibilitySettings;
}

export const TwoWayChat: React.FC<TwoWayChatProps> = ({
  language,
  messages,
  onSendMessage,
  onClearChat,
  onOpenBigDisplay,
  accessibility,
}) => {
  const isAr = language === "ar";
  const [activeTurn, setActiveTurn] = useState<"deaf" | "hearing">("hearing");
  const [deafInputText, setDeafInputText] = useState<string>("");
  const [hearingInputText, setHearingInputText] = useState<string>("");
  const [isListening, setIsListening] = useState<boolean>(false);
  const [interimHearingText, setInterimHearingText] = useState<string>("");
  const [visualFlash, setVisualFlash] = useState<boolean>(false);
  const [isSimplifying, setIsSimplifying] = useState<boolean>(false);

  const recognizerRef = useRef<any>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat on new message
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, interimHearingText]);

  // Handle Speech Recognition for the hearing person
  const toggleListening = () => {
    if (isListening) {
      recognizerRef.current?.stop();
      setIsListening(false);
    } else {
      if (!isSpeechRecognitionSupported()) {
        alert(
          isAr
            ? "متصفحك لا يدعم التعرف على الصوت المباشر (Speech Recognition)، يرجى الكتابة يدوياً."
            : "Speech recognition not supported in this browser. Please type directly."
        );
        return;
      }

      setInterimHearingText("");
      const handle = createSpeechRecognizer(
        language,
        (transcript, isFinal) => {
          if (isFinal) {
            setHearingInputText(transcript);
            setInterimHearingText("");
            triggerVisualAlert();
          } else {
            setInterimHearingText(transcript);
          }
        },
        (errMsg) => {
          console.warn("STT Error:", errMsg);
          setIsListening(false);
        },
        () => {
          setIsListening(false);
        }
      );

      if (handle) {
        recognizerRef.current = handle;
        handle.start();
        setIsListening(true);
        setActiveTurn("hearing");
      }
    }
  };

  const triggerVisualAlert = () => {
    if (accessibility.visualAlerts) {
      setVisualFlash(true);
      setTimeout(() => setVisualFlash(false), 800);
    }
  };

  const handleSendFromDeaf = (textToSend?: string, icon?: string) => {
    const txt = (textToSend || deafInputText).trim();
    if (!txt) return;
    onSendMessage("deaf_user", txt, icon);
    setDeafInputText("");
    setActiveTurn("hearing");

    // Optionally speak it aloud for the hearing person to hear!
    if (accessibility.soundEnabled) {
      speakText(txt, language);
    }
  };

  const handleSendFromHearing = (textToSend?: string) => {
    const txt = (textToSend || hearingInputText).trim();
    if (!txt) return;
    onSendMessage("hearing_person", txt);
    setHearingInputText("");
    setInterimHearingText("");
    setActiveTurn("deaf");
    triggerVisualAlert();
  };

  // AI speech simplifier
  const handleSimplifySpeech = async () => {
    if (!hearingInputText.trim()) return;
    setIsSimplifying(true);
    try {
      const res = await fetch("/api/gemini/assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "simplify_speech",
          text: hearingInputText,
          language,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.result) {
          setHearingInputText(data.result);
        }
      }
    } catch (err) {
      console.warn("AI simplify error:", err);
    } finally {
      setIsSimplifying(false);
    }
  };

  // Quick 1-tap deaf answer options
  const deafQuickChips = [
    { icon: "✅", textAr: "نعم", textEn: "Yes" },
    { icon: "❌", textAr: "لا", textEn: "No" },
    { icon: "⏳", textAr: "انتظر لحظة", textEn: "Wait a moment" },
    { icon: "❓", textAr: "لا أفهمك", textEn: "Don't understand" },
    { icon: "🚶", textAr: "لا أستطيع المشي", textEn: "Cannot walk" },
    { icon: "📍", textAr: "الألم هنا بالضبط", textEn: "Pain is right here" },
    { icon: "🚑", textAr: "أحتاج إسعاف فوراً", textEn: "Need ambulance now" },
    { icon: "✍️", textAr: "أرجو أن تكتب لي", textEn: "Please write to me" },
  ];

  return (
    <div
      id="two-way-bridge-container"
      className={`max-w-4xl mx-auto rounded-3xl border-4 overflow-hidden shadow-2xl transition-all ${
        visualFlash
          ? "ring-8 ring-amber-400 bg-amber-50"
          : "border-stone-800 bg-stone-100"
      }`}
    >
      {/* Turn Indicator Top Header */}
      <div className="bg-stone-900 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">🤝</span>
          <div>
            <h2 className="font-black text-sm sm:text-base">
              {isAr ? "جسر التواصل الثنائي المباشر" : "Two-Way Direct Communication Bridge"}
            </h2>
            <span className="text-xs text-stone-400">
              {isAr
                ? "الهاتف وسيط فوري بينك وبين الطرف الآخر"
                : "Phone acts as instant intermediary"}
            </span>
          </div>
        </div>

        {/* Turn Status Badge */}
        <div className="flex items-center gap-2">
          <div
            className={`px-3 py-1 rounded-full text-xs font-black flex items-center gap-1.5 shadow ${
              activeTurn === "hearing"
                ? "bg-blue-600 text-white animate-pulse"
                : "bg-red-600 text-white animate-pulse"
            }`}
          >
            <span>{activeTurn === "hearing" ? "🎤" : "👤"}</span>
            <span>
              {activeTurn === "hearing"
                ? isAr
                  ? "دور الشخص السامع (تحدث)"
                  : "Hearing Person's Turn"
                : isAr
                ? "دورك للرد (اختر أو اكتب)"
                : "Deaf User's Turn"}
            </span>
          </div>

          <button
            onClick={onClearChat}
            className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white transition-colors"
            title={isAr ? "مسح المحادثة" : "Clear conversation"}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Shared Conversation History Log */}
      <div
        ref={chatScrollRef}
        id="chat-history-scroll"
        className="h-64 sm:h-72 overflow-y-auto p-4 space-y-3 bg-white border-b-2 border-stone-300"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-stone-400 p-6">
            <span className="text-4xl mb-2">💬</span>
            <p className="font-bold text-sm sm:text-base text-stone-600">
              {isAr
                ? "ابدأ المحادثة: يستطيع الشخص السامع الضغط على 'تحدث'، أو تستطيع أنت اختيار رد سريع."
                : "Start communicating: The hearing person taps 'Speak', or you tap a quick response."}
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isDeaf = msg.sender === "deaf_user";
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isDeaf ? "items-start" : "items-end"}`}
              >
                <div className="flex items-center gap-1 mb-1 text-[11px] font-bold text-stone-500">
                  <span>{isDeaf ? "👤 " + (isAr ? "أنا (المستخدم)" : "Me (Deaf User)") : "👨 " + (isAr ? "الطرف الآخر (السامع)" : "Hearing Person")}</span>
                  <span>•</span>
                  <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                </div>

                <div
                  className={`p-3.5 sm:p-4 rounded-2xl max-w-[88%] sm:max-w-[80%] shadow-md border-2 ${
                    isDeaf
                      ? "bg-red-50 border-red-300 text-red-950 font-black text-base sm:text-lg rounded-tl-none"
                      : "bg-blue-600 border-blue-700 text-white font-extrabold text-base sm:text-xl rounded-tr-none"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {msg.icon && <span className="text-2xl">{msg.icon}</span>}
                    <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
                  </div>

                  <div className="mt-2 pt-2 border-t border-black/10 flex items-center justify-end gap-2 text-xs">
                    <button
                      onClick={() => speakText(msg.text, language)}
                      className="opacity-80 hover:opacity-100 flex items-center gap-1"
                      title={isAr ? "استماع صوتي" : "Listen aloud"}
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onOpenBigDisplay(msg.text)}
                      className="opacity-80 hover:opacity-100 flex items-center gap-1"
                      title={isAr ? "عرض بشاشة كاملة" : "Full screen"}
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}

        {/* Live speech preview if speech recognition is running */}
        {interimHearingText && (
          <div className="flex flex-col items-end animate-pulse">
            <span className="text-[11px] font-bold text-blue-600 mb-1">
              {isAr ? "جارٍ الاستماع للشخص السامع..." : "Listening to hearing person..."}
            </span>
            <div className="p-3 bg-blue-100 border-2 border-blue-400 text-blue-950 font-extrabold text-lg rounded-2xl max-w-[80%]">
              {interimHearingText} ...
            </div>
          </div>
        )}
      </div>

      {/* SPLIT INTERFACE: Hearing Person Section & Deaf Person Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y-4 md:divide-y-0 md:divide-x-4 md:divide-x-reverse divide-stone-300 bg-stone-50">
        {/* UPPER / RIGHT HALF: Hearing Person Zone (👨 الشخص السامع) */}
        <div
          id="hearing-person-panel"
          className={`p-4 sm:p-5 flex flex-col justify-between transition-colors ${
            activeTurn === "hearing" ? "bg-blue-50/70" : "bg-stone-50"
          }`}
        >
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">👨</span>
              <div>
                <h3 className="text-sm font-extrabold text-blue-950">
                  {isAr ? "الطرف السامع (تحدث هنا)" : "Hearing Person (Speak Here)"}
                </h3>
                <span className="text-[11px] text-stone-500 font-semibold">
                  {isAr ? "اضغط زر 'تحدث' ليتحدث بصوته" : "Tap speak to talk aloud"}
                </span>
              </div>
            </div>

            {isListening && (
              <span className="flex items-center gap-1 text-xs font-extrabold text-red-600 animate-pulse">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
                {isAr ? "يستمع الآن..." : "Listening..."}
              </span>
            )}
          </div>

          {/* Huge Voice Input Button */}
          <div className="mb-3">
            <button
              id="btn-hearing-speech-to-text"
              onClick={toggleListening}
              className={`w-full py-4 px-6 rounded-2xl font-black text-base sm:text-lg flex items-center justify-center gap-3 shadow-lg transition-all transform active:scale-95 border-3 ${
                isListening
                  ? "bg-red-600 hover:bg-red-700 text-white border-red-700 animate-bounce ring-4 ring-red-300"
                  : "bg-blue-600 hover:bg-blue-700 text-white border-blue-700 ring-4 ring-blue-200"
              }`}
            >
              {isListening ? (
                <>
                  <MicOff className="w-7 h-7" />
                  <span>{isAr ? "إنهاء التسجيل والإرسال ⏹️" : "Stop & Send ⏹️"}</span>
                </>
              ) : (
                <>
                  <Mic className="w-7 h-7" />
                  <span>{isAr ? "🎤 اضغط وتحدث بصوتك" : "🎤 Tap & Speak Out Loud"}</span>
                </>
              )}
            </button>
          </div>

          {/* Hearing person's text box fallback / edit */}
          <div className="space-y-2">
            <div className="relative">
              <input
                id="input-hearing-text"
                type="text"
                value={hearingInputText}
                onChange={(e) => setHearingInputText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendFromHearing()}
                placeholder={
                  isAr
                    ? "أو اكتب هنا (مثال: أين يؤلمك؟ هل تستطيع الوقوف؟)..."
                    : "Or type here (e.g. Can you walk? Where does it hurt?)..."
                }
                className="w-full p-3 rounded-xl border-2 border-stone-300 focus:border-blue-600 font-bold text-sm text-stone-900 placeholder:text-stone-400"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                id="btn-hearing-send"
                onClick={() => handleSendFromHearing()}
                disabled={!hearingInputText.trim()}
                className="flex-1 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>{isAr ? "إرسال كنص ضخم للأصم" : "Send Large Text to Deaf"}</span>
              </button>

              {hearingInputText.trim() && (
                <button
                  onClick={handleSimplifySpeech}
                  disabled={isSimplifying}
                  className="px-3 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 font-bold text-xs flex items-center gap-1 transition-colors"
                  title={isAr ? "تبسيط الكلام بواسطة الذكاء الاصطناعي" : "Simplify speech with AI"}
                >
                  {isSimplifying ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                  )}
                  <span className="hidden sm:inline">{isAr ? "تبسيط" : "Simplify"}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* LOWER / LEFT HALF: Deaf User Zone (👤 الشخص الأصم) */}
        <div
          id="deaf-person-panel"
          className={`p-4 sm:p-5 flex flex-col justify-between transition-colors ${
            activeTurn === "deaf" ? "bg-red-50/70" : "bg-stone-50"
          }`}
        >
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">👤</span>
              <div>
                <h3 className="text-sm font-extrabold text-red-950">
                  {isAr ? "أنا (المستخدم الأصم)" : "Deaf User (My Answers)"}
                </h3>
                <span className="text-[11px] text-stone-500 font-semibold">
                  {isAr ? "ردود بنقرة واحدة أو كتابة سريعة" : "1-tap quick replies or text"}
                </span>
              </div>
            </div>
            <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
              {isAr ? "نقرة واحدة" : "1-Tap"}
            </span>
          </div>

          {/* Quick One-Tap Reply Chips */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
            {deafQuickChips.map((chip, idx) => (
              <button
                key={idx}
                id={`btn-deaf-quick-${idx}`}
                onClick={() => handleSendFromDeaf(isAr ? chip.textAr : chip.textEn, chip.icon)}
                className="p-2 sm:p-2.5 rounded-xl border-2 border-stone-200 hover:border-red-500 bg-white hover:bg-red-50 text-stone-900 font-extrabold text-xs flex items-center gap-1.5 shadow-sm transition-all active:scale-95 text-start"
              >
                <span className="text-lg">{chip.icon}</span>
                <span className="line-clamp-1">{isAr ? chip.textAr : chip.textEn}</span>
              </button>
            ))}
          </div>

          {/* Deaf text input */}
          <div className="space-y-2">
            <div className="relative">
              <input
                id="input-deaf-text"
                type="text"
                value={deafInputText}
                onChange={(e) => setDeafInputText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendFromDeaf()}
                placeholder={
                  isAr
                    ? "اكتب أي رد تريده هنا..."
                    : "Type any custom response here..."
                }
                className="w-full p-3 rounded-xl border-2 border-stone-300 focus:border-red-600 font-bold text-sm text-stone-900 placeholder:text-stone-400"
              />
            </div>

            <button
              id="btn-deaf-send"
              onClick={() => handleSendFromDeaf()}
              disabled={!deafInputText.trim()}
              className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow transition-colors"
            >
              <Send className="w-4 h-4" />
              <span>{isAr ? "إرسال ونطق الرد بصوت واضح 🔊" : "Send & Speak Aloud 🔊"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
