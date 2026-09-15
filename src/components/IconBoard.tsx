import React, { useState } from "react";
import { Language } from "../types";
import { EMERGENCY_ICONS, SMART_SUGGESTIONS, IconItem } from "../data/emergencyData";
import { speakText, stopSpeaking } from "../lib/speech";
import {
  Volume2,
  VolumeX,
  Maximize2,
  Send,
  Trash2,
  Sparkles,
  Search,
  Check,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

interface IconBoardProps {
  language: Language;
  onOpenBigDisplay: (text: string) => void;
  onSendToChat: (text: string) => void;
}

export const IconBoard: React.FC<IconBoardProps> = ({
  language,
  onOpenBigDisplay,
  onSendToChat,
}) => {
  const isAr = language === "ar";
  const [activeTab, setActiveTab] = useState<"grid" | "expression" | "smart_text">("grid");

  // Selected icon / active broadcast message
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [typedText, setTypedText] = useState<string>("");

  // Expression builder state: ❤️ -> 😣 -> 8/10 -> 👈 (Left/Right/Center)
  const [expressionArea, setExpressionArea] = useState<string>("❤️");
  const [expressionSymptom, setExpressionSymptom] = useState<string>("😣");
  const [expressionSeverity, setExpressionSeverity] = useState<number>(8);
  const [expressionSide, setExpressionSide] = useState<string>("👈");

  const handleSelectIcon = (item: IconItem) => {
    const text = isAr ? item.fullMessageAr : item.fullMessageEn;
    setCurrentMessage(text);
    // Instant voice feedback if desired
    setIsPlayingAudio(true);
    speakText(
      text,
      language,
      () => setIsPlayingAudio(false),
      () => setIsPlayingAudio(false)
    );
  };

  const handleToggleVoice = () => {
    if (isPlayingAudio) {
      stopSpeaking();
      setIsPlayingAudio(false);
    } else if (currentMessage) {
      setIsPlayingAudio(true);
      speakText(
        currentMessage,
        language,
        () => setIsPlayingAudio(false),
        () => setIsPlayingAudio(false)
      );
    }
  };

  // Build Expression Result (Method 2)
  const generateExpressionMessage = (
    area: string,
    symptom: string,
    severity: number,
    side: string
  ): string => {
    const sideMapAr: Record<string, string> = {
      "👈": "في الجانب الأيسر",
      "👉": "في الجانب الأيمن",
      "🎯": "في المنتصف",
      "🔄": "في كل مكان",
    };
    const sideMapEn: Record<string, string> = {
      "👈": "on the left side",
      "👉": "on the right side",
      "🎯": "in the center",
      "🔄": "all over",
    };

    const areaMapAr: Record<string, string> = {
      "❤️": "صدري",
      "🧠": "رأسي",
      "🫃": "بطني",
      "🦵": "ساقي",
      "💪": "ذراعي",
    };
    const areaMapEn: Record<string, string> = {
      "❤️": "my chest",
      "🧠": "my head",
      "🫃": "my abdomen",
      "🦵": "my leg",
      "💪": "my arm",
    };

    const targetSide = isAr ? sideMapAr[side] || "" : sideMapEn[side] || "";
    const targetArea = isAr ? areaMapAr[area] || "جسمي" : areaMapEn[area] || "my body";

    const painLevelText =
      severity >= 8
        ? isAr
          ? "ألم شديد جداً لا يطاق"
          : "extremely severe pain"
        : severity >= 6
        ? isAr
          ? "ألم حاد"
          : "sharp pain"
        : isAr
        ? "ألم متوسط"
        : "moderate discomfort";

    if (isAr) {
      return `لدي ${painLevelText} ${targetSide} من ${targetArea} (مقياس ${severity}/10). أرجو المساعدة فوراً.`;
    } else {
      return `I have ${painLevelText} ${targetSide} of ${targetArea} (Severity ${severity}/10). Please help me immediately.`;
    }
  };

  const handleUpdateExpression = (
    newArea: string,
    newSymptom: string,
    newSeverity: number,
    newSide: string
  ) => {
    setExpressionArea(newArea);
    setExpressionSymptom(newSymptom);
    setExpressionSeverity(newSeverity);
    setExpressionSide(newSide);
    const generated = generateExpressionMessage(newArea, newSymptom, newSeverity, newSide);
    setCurrentMessage(generated);
  };

  // Smart suggestions for text
  const filteredSuggestions = typedText.trim()
    ? SMART_SUGGESTIONS.filter((s) =>
        s.keyword.includes(typedText.trim()) ||
        s.labelAr.includes(typedText.trim()) ||
        s.labelEn.toLowerCase().includes(typedText.toLowerCase().trim())
      )
    : [];

  return (
    <div id="icon-board-container" className="max-w-4xl mx-auto space-y-4">
      {/* Method Switcher Tabs */}
      <div className="flex bg-stone-200 p-1 rounded-2xl gap-1">
        <button
          id="tab-icons-grid"
          onClick={() => setActiveTab("grid")}
          className={`flex-1 py-2.5 px-3 rounded-xl font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "grid"
              ? "bg-white text-stone-900 shadow-md"
              : "text-stone-600 hover:text-stone-900"
          }`}
        >
          <span className="text-base">🚑</span>
          <span>{isAr ? "لوحة الأيقونات الضخمة" : "Giant Icon Board"}</span>
        </button>

        <button
          id="tab-icons-expression"
          onClick={() => {
            setActiveTab("expression");
            const initial = generateExpressionMessage(
              expressionArea,
              expressionSymptom,
              expressionSeverity,
              expressionSide
            );
            setCurrentMessage(initial);
          }}
          className={`flex-1 py-2.5 px-3 rounded-xl font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "expression"
              ? "bg-white text-stone-900 shadow-md"
              : "text-stone-600 hover:text-stone-900"
          }`}
        >
          <span className="text-base">❤️➡️😣</span>
          <span>{isAr ? "مُركّب الحالة السريع" : "Expression Builder"}</span>
        </button>

        <button
          id="tab-icons-smart-text"
          onClick={() => setActiveTab("smart_text")}
          className={`flex-1 py-2.5 px-3 rounded-xl font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "smart_text"
              ? "bg-white text-stone-900 shadow-md"
              : "text-stone-600 hover:text-stone-900"
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>{isAr ? "كتابة واقتراحات ذكية" : "Smart Suggestions"}</span>
        </button>
      </div>

      {/* Active Output Bar */}
      {currentMessage && (
        <div className="bg-stone-900 text-white p-4 rounded-2xl shadow-lg border-2 border-stone-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-start gap-2.5">
            <span className="text-2xl">📢</span>
            <div>
              <span className="text-[11px] font-bold text-amber-400 block mb-0.5">
                {isAr ? "الرسالة الجاهزة للبث:" : "Ready Broadcast Message:"}
              </span>
              <p className="text-base sm:text-lg font-extrabold leading-snug">
                {currentMessage}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleToggleVoice}
              className={`p-2.5 rounded-xl font-bold text-xs flex items-center gap-1 shadow-sm transition-colors ${
                isPlayingAudio
                  ? "bg-amber-500 text-black font-extrabold"
                  : "bg-red-600 hover:bg-red-700 text-white"
              }`}
              title={isAr ? "نطق الرسالة" : "Speak Message"}
            >
              {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span>{isPlayingAudio ? (isAr ? "إيقاف" : "Stop") : (isAr ? "نطق" : "Speak")}</span>
            </button>

            <button
              onClick={() => onOpenBigDisplay(currentMessage)}
              className="p-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-white font-bold text-xs flex items-center gap-1 transition-colors"
              title={isAr ? "عرض كبير" : "Big Display"}
            >
              <Maximize2 className="w-4 h-4 text-yellow-400" />
              <span>{isAr ? "تكبير" : "Display"}</span>
            </button>

            <button
              onClick={() => onSendToChat(currentMessage)}
              className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1 transition-colors"
              title={isAr ? "إرسال للمحادثة" : "Send to Chat"}
            >
              <Send className="w-4 h-4" />
              <span>{isAr ? "إرسال" : "Send"}</span>
            </button>

            <button
              onClick={() => {
                setCurrentMessage("");
                stopSpeaking();
              }}
              className="p-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors"
              title={isAr ? "مسح" : "Clear"}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* METHOD 1: Giant Icon Board */}
      {activeTab === "grid" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-stone-600 px-1">
            <span>{isAr ? "اضغط على أي رمز لنطقه فوراً وعرضه بحجم كبير:" : "Tap any symbol to speak and display aloud:"}</span>
            <span className="text-[11px] text-stone-500">{EMERGENCY_ICONS.length} {isAr ? "أيقونة" : "icons"}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-3">
            {EMERGENCY_ICONS.map((item) => (
              <button
                key={item.id}
                id={`btn-icon-${item.id}`}
                onClick={() => handleSelectIcon(item)}
                className={`p-4 sm:p-5 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 shadow-sm transition-all transform active:scale-95 text-center min-h-[110px] focus:ring-4 focus:ring-red-400 ${item.colorClass}`}
              >
                <span className="text-4xl sm:text-5xl filter drop-shadow-sm">{item.icon}</span>
                <span className="font-black text-sm sm:text-base leading-tight">
                  {isAr ? item.labelAr : item.labelEn}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* METHOD 2: Expression Builder (❤️ -> 😣 -> 8/10 -> 👈) */}
      {activeTab === "expression" && (
        <div className="bg-white p-5 rounded-2xl border-2 border-stone-300 shadow-sm space-y-6">
          <div>
            <h3 className="text-base sm:text-lg font-black text-stone-900 mb-1">
              {isAr ? "التعبير التركيبي عن الحالة بدون كتابة" : "Visual Expression Builder"}
            </h3>
            <p className="text-xs text-stone-500 font-semibold">
              {isAr
                ? "اختر موضع الجسم + العرض + شدة الألم + الاتجاه لإنشاء جملة كاملة فصيحة فوراً:"
                : "Combine Body + Symptom + Severity + Direction to synthesize full natural sentences:"}
            </p>
          </div>

          {/* Current Flow Preview */}
          <div className="p-3 bg-stone-100 rounded-xl border border-stone-200 flex items-center justify-center gap-3 text-2xl font-black">
            <span>{expressionArea}</span>
            <span className="text-stone-400 text-sm">➡️</span>
            <span>{expressionSymptom}</span>
            <span className="text-stone-400 text-sm">➡️</span>
            <span className="text-red-600 text-lg font-mono">{expressionSeverity}/10</span>
            <span className="text-stone-400 text-sm">➡️</span>
            <span>{expressionSide}</span>
          </div>

          {/* 1. Body area */}
          <div>
            <label className="block text-xs font-extrabold text-stone-700 mb-2">
              1. {isAr ? "مكان العرض:" : "Body Area:"}
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[
                { icon: "❤️", labelAr: "صدر", labelEn: "Chest" },
                { icon: "🧠", labelAr: "رأس", labelEn: "Head" },
                { icon: "🫃", labelAr: "بطن", labelEn: "Abdomen" },
                { icon: "🦵", labelAr: "ساق", labelEn: "Leg" },
                { icon: "💪", labelAr: "ذراع", labelEn: "Arm" },
              ].map((item) => (
                <button
                  key={item.icon}
                  onClick={() =>
                    handleUpdateExpression(
                      item.icon,
                      expressionSymptom,
                      expressionSeverity,
                      expressionSide
                    )
                  }
                  className={`p-3 rounded-xl border-2 flex flex-col items-center gap-1 transition-all ${
                    expressionArea === item.icon
                      ? "border-red-600 bg-red-50 ring-2 ring-red-300 font-black"
                      : "border-stone-200 hover:bg-stone-50"
                  }`}
                >
                  <span className="text-3xl">{item.icon}</span>
                  <span className="text-xs font-bold">{isAr ? item.labelAr : item.labelEn}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Symptom */}
          <div>
            <label className="block text-xs font-extrabold text-stone-700 mb-2">
              2. {isAr ? "نوع الإحساس:" : "Sensation / Symptom:"}
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { icon: "😣", labelAr: "ألم ضاغط", labelEn: "Severe Pain" },
                { icon: "🫁", labelAr: "ضيق تنفس", labelEn: "Breathless" },
                { icon: "🩸", labelAr: "نزيف", labelEn: "Bleeding" },
                { icon: "😵", labelAr: "دوخة", labelEn: "Dizziness" },
              ].map((item) => (
                <button
                  key={item.icon}
                  onClick={() =>
                    handleUpdateExpression(
                      expressionArea,
                      item.icon,
                      expressionSeverity,
                      expressionSide
                    )
                  }
                  className={`p-3 rounded-xl border-2 flex flex-col items-center gap-1 transition-all ${
                    expressionSymptom === item.icon
                      ? "border-amber-600 bg-amber-50 ring-2 ring-amber-300 font-black"
                      : "border-stone-200 hover:bg-stone-50"
                  }`}
                >
                  <span className="text-3xl">{item.icon}</span>
                  <span className="text-xs font-bold">{isAr ? item.labelAr : item.labelEn}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Severity Scale */}
          <div>
            <label className="block text-xs font-extrabold text-stone-700 mb-2">
              3. {isAr ? "شدة الألم:" : "Pain Severity:"}
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { val: 2, label: "2 خفيف", color: "bg-emerald-100 border-emerald-300 text-emerald-900" },
                { val: 4, label: "4 متوسط", color: "bg-yellow-100 border-yellow-300 text-yellow-900" },
                { val: 8, label: "8 شديد", color: "bg-orange-100 border-orange-300 text-orange-900" },
                { val: 10, label: "10 طارئ", color: "bg-red-100 border-red-300 text-red-900" },
              ].map((item) => (
                <button
                  key={item.val}
                  onClick={() =>
                    handleUpdateExpression(
                      expressionArea,
                      expressionSymptom,
                      item.val,
                      expressionSide
                    )
                  }
                  className={`p-3 rounded-xl border-2 font-black text-center text-xs sm:text-sm transition-all ${
                    expressionSeverity === item.val
                      ? "border-stone-900 bg-stone-900 text-white scale-105 shadow-md"
                      : item.color
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Direction Side */}
          <div>
            <label className="block text-xs font-extrabold text-stone-700 mb-2">
              4. {isAr ? "الجهة / الاتجاه:" : "Direction / Side:"}
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { icon: "👈", labelAr: "الجانب الأيسر", labelEn: "Left Side" },
                { icon: "👉", labelAr: "الجانب الأيمن", labelEn: "Right Side" },
                { icon: "🎯", labelAr: "المنتصف تماماً", labelEn: "Center" },
                { icon: "🔄", labelAr: "منتشر كامل", labelEn: "All over" },
              ].map((item) => (
                <button
                  key={item.icon}
                  onClick={() =>
                    handleUpdateExpression(
                      expressionArea,
                      expressionSymptom,
                      expressionSeverity,
                      item.icon
                    )
                  }
                  className={`p-3 rounded-xl border-2 flex flex-col items-center gap-1 transition-all ${
                    expressionSide === item.icon
                      ? "border-blue-600 bg-blue-50 ring-2 ring-blue-300 font-black"
                      : "border-stone-200 hover:bg-stone-50"
                  }`}
                >
                  <span className="text-3xl">{item.icon}</span>
                  <span className="text-xs font-bold text-center">
                    {isAr ? item.labelAr : item.labelEn}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* METHOD 3: Smart Text Input with Suggestions */}
      {activeTab === "smart_text" && (
        <div className="bg-white p-5 rounded-2xl border-2 border-stone-300 shadow-sm space-y-4">
          <div>
            <h3 className="text-base sm:text-lg font-black text-stone-900 mb-1">
              {isAr ? "كتابة سريعة مع اقتراحات ذكية" : "Quick Text with Auto-Suggestions"}
            </h3>
            <p className="text-xs text-stone-500 font-semibold">
              {isAr
                ? "اكتب أي كلمة مثل 'تنفس' أو 'صدر' أو 'دوخة' لتظهر اقتراحات الطوارئ الفورية:"
                : "Type simple words like 'breath', 'chest', 'dizzy' for instant completion:"}
            </p>
          </div>

          <div className="relative">
            <input
              id="input-smart-text"
              type="text"
              value={typedText}
              onChange={(e) => setTypedText(e.target.value)}
              placeholder={
                isAr
                  ? "مثال: ما اقدر اتنفس، ألم في الصدر، حادث..."
                  : "e.g. cannot breathe, chest pain, accident..."
              }
              className="w-full p-4 rounded-xl border-2 border-stone-300 focus:border-red-600 focus:ring-4 focus:ring-red-200 font-bold text-base sm:text-lg text-stone-900 placeholder:text-stone-400"
            />
          </div>

          {/* Suggestions Dropdown / Chips */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-stone-600 block">
              {isAr ? "اقتراحات الطوارئ المناسبة (اضغط للإرسال فوراً):" : "Matching Emergency Suggestions (Tap to send):"}
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(filteredSuggestions.length > 0 ? filteredSuggestions : SMART_SUGGESTIONS.slice(0, 6)).map(
                (item, idx) => (
                  <button
                    key={idx}
                    id={`btn-suggestion-${idx}`}
                    onClick={() => {
                      const text = isAr ? item.labelAr : item.labelEn;
                      setCurrentMessage(text);
                      setIsPlayingAudio(true);
                      speakText(
                        text,
                        language,
                        () => setIsPlayingAudio(false),
                        () => setIsPlayingAudio(false)
                      );
                    }}
                    className="p-3 rounded-xl border border-stone-200 hover:border-red-400 bg-stone-50 hover:bg-red-50 text-start flex items-center gap-3 transition-colors active:scale-98"
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <span className="font-extrabold text-xs sm:text-sm text-stone-900 block">
                        {isAr ? item.labelAr : item.labelEn}
                      </span>
                      <span className="text-[10px] text-stone-500 font-medium">
                        {isAr ? "جاهز للنطق والعرض" : "Ready for audio & display"}
                      </span>
                    </div>
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
