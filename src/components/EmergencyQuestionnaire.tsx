import React, { useState } from "react";
import {
  Language,
  EmergencyType,
  BodyLocation,
  AbilityToSpeak,
  RequestedHelp,
  EmergencySession,
} from "../types";
import { QUESTIONNAIRE_STEPS, generateNaturalTemplateMessage } from "../data/emergencyData";
import { ArrowLeft, ArrowRight, X, AlertTriangle, Sparkles, Loader2 } from "lucide-react";

interface QuestionnaireProps {
  language: Language;
  onCancel: () => void;
  onComplete: (session: EmergencySession) => void;
  initialAnswers?: Partial<{
    emergencyType: EmergencyType;
    bodyLocation: BodyLocation;
    painLevel: number;
    abilityToSpeak: AbilityToSpeak;
    requestedHelp: RequestedHelp;
  }>;
}

export const EmergencyQuestionnaire: React.FC<QuestionnaireProps> = ({
  language,
  onCancel,
  onComplete,
  initialAnswers,
}) => {
  const isAr = language === "ar";
  const stepsData = QUESTIONNAIRE_STEPS[language] || QUESTIONNAIRE_STEPS.ar;

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Form states with sensible defaults or initial values
  const [emergencyType, setEmergencyType] = useState<EmergencyType>(
    initialAnswers?.emergencyType || "accident"
  );
  const [bodyLocation, setBodyLocation] = useState<BodyLocation>(
    initialAnswers?.bodyLocation || "chest"
  );
  const [painLevel, setPainLevel] = useState<number>(
    initialAnswers?.painLevel !== undefined ? initialAnswers.painLevel : 8
  );
  const [abilityToSpeak, setAbilityToSpeak] = useState<AbilityToSpeak>(
    initialAnswers?.abilityToSpeak || "no"
  );
  const [requestedHelp, setRequestedHelp] = useState<RequestedHelp>(
    initialAnswers?.requestedHelp || "ambulance"
  );

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep((prev) => prev + 1);
    } else {
      finishQuestionnaire();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    } else {
      onCancel();
    }
  };

  const finishQuestionnaire = async () => {
    setIsGenerating(true);

    // 1. First generate local immediate template as guarantee
    const localTemplates = generateNaturalTemplateMessage({
      emergencyType,
      bodyLocation,
      painLevel,
      abilityToSpeak,
      requestedHelp,
    });

    let finalHeadlineAr = localTemplates.headlineAr;
    let finalHeadlineEn = localTemplates.headlineEn;
    let finalMessageAr = localTemplates.ar;
    let finalMessageEn = localTemplates.en;
    let finalSummaryAr = localTemplates.responderAr;
    let finalSummaryEn = localTemplates.responderEn;

    // 2. Try server-side AI enhancement via Express endpoint
    try {
      const response = await fetch("/api/gemini/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emergencyType,
          bodyLocation,
          painLevel,
          abilityToSpeak,
          requestedHelp,
          language,
        }),
      });

      if (response.ok) {
        const json = await response.json();
        if (json?.data?.publicMessage) {
          if (language === "ar") {
            finalMessageAr = json.data.publicMessage;
            if (json.data.headline) finalHeadlineAr = json.data.headline;
            if (json.data.responderSummary) finalSummaryAr = json.data.responderSummary;
          } else {
            finalMessageEn = json.data.publicMessage;
            if (json.data.headline) finalHeadlineEn = json.data.headline;
            if (json.data.responderSummary) finalSummaryEn = json.data.responderSummary;
          }
        }
      }
    } catch (err) {
      console.warn("Using offline template fallback:", err);
    }

    const session: EmergencySession = {
      id: "session_" + Date.now(),
      sessionCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
      createdAt: new Date().toISOString(),
      emergencyType,
      bodyLocation,
      symptoms: [emergencyType, bodyLocation],
      painLevel,
      abilityToSpeak,
      requestedHelp,
      generatedMessage: {
        ar: finalMessageAr,
        en: finalMessageEn,
        headlineAr: finalHeadlineAr,
        headlineEn: finalHeadlineEn,
        responderSummaryAr: finalSummaryAr,
        responderSummaryEn: finalSummaryEn,
      },
    };

    setIsGenerating(false);
    onComplete(session);
  };

  return (
    <div
      id="emergency-questionnaire-container"
      className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl border-2 border-red-600 overflow-hidden"
    >
      {/* Header bar */}
      <div className="bg-red-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-red-700 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-amber-300 animate-pulse" />
          </div>
          <div>
            <h2 className="font-extrabold text-base sm:text-lg">
              {isAr ? "استبيان الطوارئ السريع" : "Quick Emergency Questionnaire"}
            </h2>
            <p className="text-xs text-red-100">
              {isAr
                ? `المرحلة ${currentStep} من 5: بدون كتابة طويلة`
                : `Step ${currentStep} of 5: Touch icons to answer`}
            </p>
          </div>
        </div>

        <button
          id="btn-close-questionnaire"
          onClick={onCancel}
          className="p-2 rounded-lg bg-red-700/60 hover:bg-red-800 text-white transition-colors"
          aria-label={isAr ? "إلغاء الاستبيان" : "Cancel questionnaire"}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Progress Dots */}
      <div className="bg-stone-100 px-4 py-2 flex items-center justify-between border-b border-stone-200">
        <div className="flex items-center gap-1.5 w-full">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all flex-1 ${
                s === currentStep
                  ? "bg-red-600"
                  : s < currentStep
                  ? "bg-emerald-600"
                  : "bg-stone-300"
              }`}
            />
          ))}
        </div>
        <span className="text-xs font-bold text-stone-600 ml-3 mr-3 whitespace-nowrap">
          {currentStep} / 5
        </span>
      </div>

      {/* Step Content */}
      <div className="p-4 sm:p-6 min-h-[380px] flex flex-col justify-between">
        {/* Step 1: What is happening? */}
        {currentStep === 1 && (
          <div>
            <div className="mb-4">
              <h3 className="text-xl sm:text-2xl font-black text-stone-900 mb-1">
                {stepsData.step1.title}
              </h3>
              <p className="text-sm font-semibold text-stone-500">
                {stepsData.step1.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {stepsData.step1.options.map((opt) => {
                const selected = emergencyType === opt.id;
                return (
                  <button
                    key={opt.id}
                    id={`opt-step1-${opt.id}`}
                    onClick={() => {
                      setEmergencyType(opt.id as EmergencyType);
                      // Auto advance on selection for speed under stress!
                      setTimeout(() => setCurrentStep(2), 150);
                    }}
                    className={`p-3.5 sm:p-4 rounded-xl border-2 text-start flex flex-col items-center justify-center gap-1.5 transition-all active:scale-95 ${
                      selected
                        ? "border-red-600 bg-red-50 text-red-900 shadow-md ring-2 ring-red-300"
                        : "border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-800"
                    }`}
                  >
                    <span className="text-3xl sm:text-4xl">{opt.icon}</span>
                    <span className="text-xs sm:text-sm font-black text-center">
                      {opt.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Where is the problem? */}
        {currentStep === 2 && (
          <div>
            <div className="mb-4">
              <h3 className="text-xl sm:text-2xl font-black text-stone-900 mb-1">
                {stepsData.step2.title}
              </h3>
              <p className="text-sm font-semibold text-stone-500">
                {stepsData.step2.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {stepsData.step2.options.map((opt) => {
                const selected = bodyLocation === opt.id;
                return (
                  <button
                    key={opt.id}
                    id={`opt-step2-${opt.id}`}
                    onClick={() => {
                      setBodyLocation(opt.id as BodyLocation);
                      setTimeout(() => setCurrentStep(3), 150);
                    }}
                    className={`p-3.5 sm:p-4 rounded-xl border-2 text-start flex flex-col items-center justify-center gap-1.5 transition-all active:scale-95 ${
                      selected
                        ? "border-red-600 bg-red-50 text-red-900 shadow-md ring-2 ring-red-300"
                        : "border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-800"
                    }`}
                  >
                    <span className="text-3xl sm:text-4xl">{opt.icon}</span>
                    <span className="text-xs sm:text-sm font-black text-center">
                      {opt.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Pain Severity? */}
        {currentStep === 3 && (
          <div>
            <div className="mb-4">
              <h3 className="text-xl sm:text-2xl font-black text-stone-900 mb-1">
                {stepsData.step3.title}
              </h3>
              <p className="text-sm font-semibold text-stone-500">
                {stepsData.step3.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {stepsData.step3.options.map((opt) => {
                const selected = painLevel === opt.level;
                const isHighPain = opt.level >= 8;
                return (
                  <button
                    key={opt.level}
                    id={`opt-step3-${opt.level}`}
                    onClick={() => {
                      setPainLevel(opt.level);
                      setTimeout(() => setCurrentStep(4), 150);
                    }}
                    className={`p-3.5 sm:p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-1.5 transition-all active:scale-95 ${
                      selected
                        ? isHighPain
                          ? "border-red-600 bg-red-600 text-white shadow-lg ring-4 ring-red-300 scale-105"
                          : "border-amber-600 bg-amber-50 text-amber-950 shadow-md ring-2 ring-amber-300"
                        : "border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-800"
                    }`}
                  >
                    <span className="text-3xl sm:text-4xl">{opt.icon}</span>
                    <span className="text-xs sm:text-sm font-extrabold text-center">
                      {opt.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 4: Can you speak? */}
        {currentStep === 4 && (
          <div>
            <div className="mb-4">
              <h3 className="text-xl sm:text-2xl font-black text-stone-900 mb-1">
                {stepsData.step4.title}
              </h3>
              <p className="text-sm font-semibold text-stone-500">
                {stepsData.step4.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {stepsData.step4.options.map((opt) => {
                const selected = abilityToSpeak === opt.id;
                return (
                  <button
                    key={opt.id}
                    id={`opt-step4-${opt.id}`}
                    onClick={() => {
                      setAbilityToSpeak(opt.id as AbilityToSpeak);
                      setTimeout(() => setCurrentStep(5), 150);
                    }}
                    className={`p-5 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all active:scale-95 min-h-[120px] ${
                      selected
                        ? "border-red-600 bg-red-50 text-red-950 shadow-md ring-2 ring-red-400"
                        : "border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-800"
                    }`}
                  >
                    <span className="text-4xl">{opt.icon}</span>
                    <span className="text-sm sm:text-base font-black text-center">
                      {opt.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 5: What do you need right now? */}
        {currentStep === 5 && (
          <div>
            <div className="mb-4">
              <h3 className="text-xl sm:text-2xl font-black text-stone-900 mb-1">
                {stepsData.step5.title}
              </h3>
              <p className="text-sm font-semibold text-stone-500">
                {stepsData.step5.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {stepsData.step5.options.map((opt) => {
                const selected = requestedHelp === opt.id;
                return (
                  <button
                    key={opt.id}
                    id={`opt-step5-${opt.id}`}
                    onClick={() => setRequestedHelp(opt.id as RequestedHelp)}
                    className={`p-3.5 sm:p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-1.5 transition-all active:scale-95 ${
                      selected
                        ? "border-red-600 bg-red-600 text-white shadow-lg ring-2 ring-red-300 font-black"
                        : "border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-800"
                    }`}
                  >
                    <span className="text-3xl">{opt.icon}</span>
                    <span className="text-xs sm:text-sm font-bold text-center">
                      {opt.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-6 pt-4 border-t border-stone-200 flex items-center justify-between gap-3">
          <button
            id="btn-questionnaire-back"
            onClick={handleBack}
            className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 font-bold hover:bg-stone-100 flex items-center gap-1.5 transition-colors"
          >
            {isAr ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            <span>{currentStep === 1 ? (isAr ? "إلغاء" : "Cancel") : (isAr ? "السابق" : "Back")}</span>
          </button>

          <button
            id="btn-questionnaire-next"
            disabled={isGenerating}
            onClick={handleNext}
            className="flex-1 max-w-xs px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold flex items-center justify-center gap-2 shadow-md transition-transform active:scale-95 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{isAr ? "جارٍ إعداد الرسالة..." : "Generating Card..."}</span>
              </>
            ) : currentStep === 5 ? (
              <>
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>{isAr ? "إنشاء بطاقة الطوارئ" : "Generate Emergency Card"}</span>
              </>
            ) : (
              <>
                <span>{isAr ? "التالي" : "Next"}</span>
                {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
