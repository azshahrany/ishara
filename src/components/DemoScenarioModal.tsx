import React, { useState, useEffect } from "react";
import { Language, EmergencySession } from "../types";
import { X, Play, CheckCircle2, Volume2, QrCode, MessageSquare, ArrowRight, ArrowLeft } from "lucide-react";
import { speakText, stopSpeaking } from "../lib/speech";

interface DemoScenarioModalProps {
  language: Language;
  onApplyDemoToApp: (session: EmergencySession) => void;
  onClose: () => void;
}

export const DemoScenarioModal: React.FC<DemoScenarioModalProps> = ({
  language,
  onApplyDemoToApp,
  onClose,
}) => {
  const isAr = language === "ar";
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Demo generated session
  const demoSession: EmergencySession = {
    id: "demo_accident_session",
    sessionCode: "EMG-911",
    createdAt: new Date().toISOString(),
    emergencyType: "accident",
    bodyLocation: "chest",
    symptoms: ["accident", "chest", "difficulty_breathing"],
    painLevel: 8,
    abilityToSpeak: "no",
    requestedHelp: "ambulance",
    generatedMessage: {
      ar: "أنا شخص أصم ولا أستطيع الكلام. تعرضت لحادث ولدي ألم شديد جداً في منطقة الصدر مع صعوبة في التنفس (شدة الألم 8/10). أرجو الاتصال بالإسعاف فوراً.",
      en: "I am deaf and cannot speak. I was in an accident and have severe chest pain with difficulty breathing (Pain severity 8/10). Please call an ambulance immediately.",
      headlineAr: "🚨 طوارئ حرجة: تعرض لحادث وألم شديد بالصدر",
      headlineEn: "🚨 CRITICAL EMERGENCY: Accident & Severe Chest Pain",
      responderSummaryAr: "المريض أصم وغير ناطق. تاريخ الحالة: تعرض لحادث سير/إصابة حديثة. الأعراض الحالية: ألم صدري حاد ومستمر (8/10) مصحوب بضيق تنفس. المطلوب: تقييم علامات حيوية ونقل عاجل بسيارة إسعاف.",
      responderSummaryEn: "Patient is deaf and non-verbal. History: Recent trauma/accident. Presentation: Severe persistent chest pain (8/10) with dyspnea. Requirement: Immediate vitals triage and emergency ambulance dispatch.",
    },
  };

  const steps = [
    {
      num: 1,
      titleAr: "1. وقوع حادث وإصابة",
      titleEn: "1. Trauma / Accident Incident",
      descAr: "المستخدم اختار رمز الحادث 🚗 بدون كتابة حرف واحد.",
      descEn: "User tapped Accident 🚗 without typing a single letter.",
      icon: "🚗",
    },
    {
      num: 2,
      titleAr: "2. موضع الألم: الصدر",
      titleEn: "2. Body Location: Chest",
      descAr: "حدد منطقة الصدر ❤️ مع صعوبة بالتنفس 🫁.",
      descEn: "Identified Chest area ❤️ with breathing distress 🫁.",
      icon: "❤️",
    },
    {
      num: 3,
      titleAr: "3. شدة الألم 8/10 وغير ناطق",
      titleEn: "3. Pain 8/10 & Non-verbal",
      descAr: "حدد ألم 8/10 😭 ولا يستطيع الكلام ❌.",
      descEn: "Reported 8/10 pain 😭 and unable to speak ❌.",
      icon: "😣",
    },
    {
      num: 4,
      titleAr: "4. طلب الإسعاف وتوليد البطاقة",
      titleEn: "4. Call Ambulance & Card Gen",
      descAr: "تم إنشاء رسالة طبيعية إنسانية فصيحة بصوت واضح ورمز QR.",
      descEn: "Generated natural emergency message with speech and QR.",
      icon: "🚑",
    },
    {
      num: 5,
      titleAr: "5. المحادثة الثنائية مع السامع",
      titleEn: "5. Two-Way Conversation Bridge",
      descAr: "السامع قال: 'هل تستطيع المشي؟' -> المستخدم أجاب بنقرة: '❌ لا'",
      descEn: "Bystander asked: 'Can you walk?' -> Deaf user 1-tapped: '❌ No'",
      icon: "🤝",
    },
  ];

  const handlePlayVoice = () => {
    setIsSpeaking(true);
    speakText(
      isAr ? demoSession.generatedMessage.ar : demoSession.generatedMessage.en,
      language,
      () => setIsSpeaking(false),
      () => setIsSpeaking(false)
    );
  };

  const handleLaunchFullDemoInApp = () => {
    stopSpeaking();
    onApplyDemoToApp(demoSession);
    onClose();
  };

  return (
    <div
      id="modal-demo-scenario"
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border-4 border-amber-500 text-stone-900 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-200">
          <div className="flex items-center gap-2">
            <span className="text-2xl animate-spin">🧪</span>
            <div>
              <h2 className="text-lg sm:text-xl font-black">
                {isAr ? "سيناريو الطوارئ التجريبي السريع" : "Quick Emergency Scenario Demo"}
              </h2>
              <span className="text-xs text-amber-700 font-bold">
                {isAr ? "محاكاة واقعية من البداية حتى وصول المساعدة" : "Real-world walkthrough from incident to response"}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progression Visual */}
        <div className="space-y-3 mb-5">
          {steps.map((st) => (
            <div
              key={st.num}
              className={`p-3 rounded-2xl border-2 flex items-start gap-3 transition-all ${
                currentStep === st.num
                  ? "border-amber-500 bg-amber-50 shadow-md ring-2 ring-amber-300"
                  : currentStep > st.num
                  ? "border-emerald-300 bg-emerald-50 text-emerald-950"
                  : "border-stone-200 bg-stone-50 opacity-60"
              }`}
            >
              <div className="text-2xl p-1 bg-white rounded-xl shadow-sm border border-stone-200">
                {st.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-sm sm:text-base">
                    {isAr ? st.titleAr : st.titleEn}
                  </h3>
                  {currentStep > st.num && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  )}
                </div>
                <p className="text-xs text-stone-600 font-semibold mt-0.5">
                  {isAr ? st.descAr : st.descEn}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Highlighted Result Card Preview */}
        <div className="p-4 bg-red-50 rounded-2xl border-2 border-red-300 mb-5">
          <span className="text-xs font-black text-red-700 uppercase tracking-wider block mb-1">
            {isAr ? "الرسالة الناتجة في السيناريو:" : "Generated Emergency Result:"}
          </span>
          <p className="text-sm sm:text-base font-bold text-stone-900 leading-relaxed">
            {isAr ? demoSession.generatedMessage.ar : demoSession.generatedMessage.en}
          </p>

          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={handlePlayVoice}
              className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition-colors"
            >
              <Volume2 className="w-4 h-4" />
              <span>{isSpeaking ? (isAr ? "جارٍ النطق..." : "Speaking...") : (isAr ? "استماع للنطق التجريبي 🔊" : "Play Voice Demo 🔊")}</span>
            </button>
          </div>
        </div>

        {/* Action button to load this directly into active app! */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5">
          <button
            id="btn-apply-demo-scenario"
            onClick={handleLaunchFullDemoInApp}
            className="w-full sm:flex-1 py-3.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>{isAr ? "تطبيق السيناريو وفتح البطاقة والمحادثة فوراً 🚀" : "Apply to App & Open Bridge Now 🚀"}</span>
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto py-3 px-4 rounded-xl bg-stone-200 hover:bg-stone-300 font-extrabold text-xs text-stone-700"
          >
            {isAr ? "إغلاق" : "Close"}
          </button>
        </div>
      </div>
    </div>
  );
};
