import React, { useState, useEffect } from "react";
import { Language, EmergencySession, UserProfile } from "../types";
import { speakText, stopSpeaking } from "../lib/speech";
import { generateQrDataUrl } from "../lib/qr";
import { getCurrentCoordinates, GeoLocationResult } from "../lib/location";
import {
  Volume2,
  VolumeX,
  Maximize2,
  QrCode,
  Copy,
  Check,
  MapPin,
  PhoneCall,
  MessageSquare,
  RefreshCw,
  FileText,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { EMERGENCY_NUMBERS } from "../data/emergencyData";

interface EmergencyCardProps {
  session: EmergencySession;
  language: Language;
  userProfile: UserProfile;
  onOpenBigDisplay: (text: string) => void;
  onContinueToChat: (initialMessage: string) => void;
  onReset: () => void;
  onRequestEmergencyCall: (service: "ambulance" | "police" | "fire" | "unified") => void;
}

export const EmergencyCard: React.FC<EmergencyCardProps> = ({
  session,
  language,
  userProfile,
  onOpenBigDisplay,
  onContinueToChat,
  onReset,
  onRequestEmergencyCall,
}) => {
  const isAr = language === "ar";
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [showQrModal, setShowQrModal] = useState<boolean>(false);
  const [showResponderSummary, setShowResponderSummary] = useState<boolean>(false);
  const [locationData, setLocationData] = useState<GeoLocationResult | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const countryConfig =
    EMERGENCY_NUMBERS[userProfile.countryCode] || EMERGENCY_NUMBERS.SA;

  const currentHeadline = isAr
    ? session.generatedMessage.headlineAr
    : session.generatedMessage.headlineEn;

  const currentMessage = isAr
    ? session.generatedMessage.ar
    : session.generatedMessage.en;

  const responderSummary = isAr
    ? session.generatedMessage.responderSummaryAr
    : session.generatedMessage.responderSummaryEn;

  // Generate QR Code on mount
  useEffect(() => {
    // We encode the full emergency text + session code + current coordinates if present
    const qrPayload = `[ISHARA EMERGENCY CARD]\nCode: ${session.sessionCode}\n${currentHeadline}\n\n${currentMessage}\n\nNeed Help: ${session.requestedHelp.toUpperCase()}\nPain: ${session.painLevel}/10`;
    generateQrDataUrl(qrPayload)
      .then((url) => setQrDataUrl(url))
      .catch((e) => console.error("QR Error:", e));
  }, [session, currentHeadline, currentMessage]);

  const handleToggleVoice = () => {
    if (isPlayingAudio) {
      stopSpeaking();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      speakText(
        currentMessage,
        language,
        () => setIsPlayingAudio(false),
        () => setIsPlayingAudio(false)
      );
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(
      `${currentHeadline}\n\n${currentMessage}\n\n[Ishara App - Emergency Bridge]`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFetchLocation = async () => {
    setIsLocating(true);
    setLocationError(null);
    try {
      const loc = await getCurrentCoordinates();
      setLocationData(loc);
    } catch (err: any) {
      setLocationError(err.message || "فشل الحصول على الموقع");
    } finally {
      setIsLocating(false);
    }
  };

  // Pain indicator color
  const getPainBadgeColor = (level: number) => {
    if (level >= 8) return "bg-red-600 text-white";
    if (level >= 6) return "bg-orange-500 text-white";
    if (level >= 4) return "bg-amber-500 text-stone-900";
    return "bg-emerald-500 text-white";
  };

  return (
    <div
      id="emergency-card-active"
      className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl border-4 border-red-600 overflow-hidden"
    >
      {/* Top Urgent Alert Bar */}
      <div className="bg-red-600 text-white p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="text-3xl animate-bounce">🚨</span>
          <div>
            <span className="text-xs uppercase tracking-wider font-extrabold bg-red-800 px-2 py-0.5 rounded">
              {isAr ? "بطاقة طوارئ رسمية" : "Official Emergency Card"}
            </span>
            <h1 className="text-lg sm:text-xl font-black mt-0.5 leading-tight">
              {currentHeadline}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs bg-red-700/80 px-2.5 py-1 rounded-md font-mono font-bold">
            #{session.sessionCode}
          </span>
          <button
            onClick={onReset}
            className="p-1.5 rounded-lg bg-red-700 hover:bg-red-800 text-white text-xs font-bold flex items-center gap-1 transition-colors"
            title={isAr ? "استبيان جديد" : "New Questionnaire"}
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Humanized Message Box */}
      <div className="p-4 sm:p-6 space-y-4">
        <div className="p-4 sm:p-5 bg-red-50 border-2 border-red-200 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-red-800 flex items-center gap-1">
              <span>📢</span>
              <span>{isAr ? "الرسالة الموجهة للطرف الآخر:" : "Message for Bystanders:"}</span>
            </span>
            <span className="text-[11px] text-stone-500">
              {isAr ? "اقرأ أو استمع للرسالة" : "Read or play audio"}
            </span>
          </div>

          <p className="text-lg sm:text-xl font-extrabold text-stone-900 leading-relaxed whitespace-pre-line">
            {currentMessage}
          </p>
        </div>

        {/* 4 Output Action Channels (Section 8) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          {/* 1. 🔊 Sound (Text to Speech) */}
          <button
            id="btn-card-tts"
            onClick={handleToggleVoice}
            className={`p-3 rounded-xl font-extrabold text-xs sm:text-sm flex flex-col items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95 border-2 ${
              isPlayingAudio
                ? "bg-amber-500 border-amber-600 text-white animate-pulse"
                : "bg-red-600 hover:bg-red-700 border-red-700 text-white"
            }`}
          >
            {isPlayingAudio ? (
              <>
                <VolumeX className="w-6 h-6" />
                <span>{isAr ? "إيقاف الصوت" : "Stop Audio"}</span>
              </>
            ) : (
              <>
                <Volume2 className="w-6 h-6" />
                <span>{isAr ? "تشغيل صوتياً" : "Play Aloud"}</span>
              </>
            )}
          </button>

          {/* 2. 📱 Big Text Mode */}
          <button
            id="btn-card-big-text"
            onClick={() => onOpenBigDisplay(currentMessage)}
            className="p-3 rounded-xl font-extrabold text-xs sm:text-sm flex flex-col items-center justify-center gap-1.5 bg-stone-900 hover:bg-black border-2 border-black text-white transition-all shadow-sm active:scale-95"
          >
            <Maximize2 className="w-6 h-6 text-yellow-400" />
            <span>{isAr ? "عرض شاشة كاملة" : "Big Display"}</span>
          </button>

          {/* 3. 📲 QR Code */}
          <button
            id="btn-card-qr"
            onClick={() => setShowQrModal(true)}
            className="p-3 rounded-xl font-extrabold text-xs sm:text-sm flex flex-col items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 border-2 border-blue-700 text-white transition-all shadow-sm active:scale-95"
          >
            <QrCode className="w-6 h-6" />
            <span>{isAr ? "رمز QR للمسح" : "Show QR"}</span>
          </button>

          {/* 4. 📋 Copy Message */}
          <button
            id="btn-card-copy"
            onClick={handleCopy}
            className="p-3 rounded-xl font-extrabold text-xs sm:text-sm flex flex-col items-center justify-center gap-1.5 bg-stone-100 hover:bg-stone-200 border-2 border-stone-300 text-stone-800 transition-all shadow-sm active:scale-95"
          >
            {copied ? (
              <>
                <Check className="w-6 h-6 text-emerald-600" />
                <span className="text-emerald-700">{isAr ? "تم النسخ!" : "Copied!"}</span>
              </>
            ) : (
              <>
                <Copy className="w-6 h-6 text-stone-600" />
                <span>{isAr ? "نسخ النص" : "Copy Text"}</span>
              </>
            )}
          </button>
        </div>

        {/* Visual Badges (Section 9) */}
        <div className="border border-stone-200 rounded-xl p-3.5 bg-stone-50">
          <div className="text-xs font-bold text-stone-600 mb-2.5">
            {isAr ? "تفاصيل الحالة السريعة:" : "Key Case Indicators:"}
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-bold">
            <span className="px-3 py-1.5 rounded-lg bg-stone-200 text-stone-900 flex items-center gap-1">
              <span>🚨</span>
              <span>{session.emergencyType}</span>
            </span>

            {session.bodyLocation && (
              <span className="px-3 py-1.5 rounded-lg bg-stone-200 text-stone-900 flex items-center gap-1">
                <span>📍</span>
                <span>{session.bodyLocation}</span>
              </span>
            )}

            <span
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1 ${getPainBadgeColor(
                session.painLevel
              )}`}
            >
              <span>😣</span>
              <span>
                {isAr ? `ألم: ${session.painLevel}/10` : `Pain: ${session.painLevel}/10`}
              </span>
            </span>

            <span className="px-3 py-1.5 rounded-lg bg-stone-200 text-stone-900 flex items-center gap-1">
              <span>🗣️</span>
              <span>
                {session.abilityToSpeak === "no"
                  ? isAr
                    ? "لا أستطيع الكلام"
                    : "Non-verbal"
                  : isAr
                  ? "كلام محدود"
                  : "Limited Speech"}
              </span>
            </span>

            <span className="px-3 py-1.5 rounded-lg bg-red-100 text-red-800 border border-red-300 flex items-center gap-1">
              <span>🚑</span>
              <span>{session.requestedHelp}</span>
            </span>
          </div>
        </div>

        {/* Location Module (Section 14) */}
        <div className="border border-stone-200 rounded-xl p-3.5 bg-stone-50 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-red-600" />
              <span>{isAr ? "موقعي الجغرافي للمسعفين" : "Geolocation for Responders"}</span>
            </span>

            {!locationData ? (
              <button
                id="btn-card-locate"
                onClick={handleFetchLocation}
                disabled={isLocating}
                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1 disabled:opacity-50"
              >
                {isLocating ? (
                  <span>{isAr ? "جارٍ التحديد..." : "Locating..."}</span>
                ) : (
                  <span>{isAr ? "مشاركة موقعي" : "Share My Location"}</span>
                )}
              </button>
            ) : (
              <a
                href={locationData.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
              >
                <span>{isAr ? "فتح في الخريطة" : "Open in Maps"}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          {locationError && (
            <p className="text-xs text-red-600 font-semibold">{locationError}</p>
          )}

          {locationData && (
            <div className="text-xs font-mono bg-white p-2 rounded border border-stone-200 text-stone-700 flex flex-wrap justify-between">
              <span>
                {locationData.latitude.toFixed(5)}, {locationData.longitude.toFixed(5)}
              </span>
              <span className="text-stone-500">
                {isAr ? `الدقة: ±${locationData.accuracy}م` : `Acc: ±${locationData.accuracy}m`}
              </span>
            </div>
          )}
        </div>

        {/* Emergency Call Button (Section 15) */}
        <div className="flex items-center gap-2">
          <button
            id="btn-card-call-sos"
            onClick={() => onRequestEmergencyCall("ambulance")}
            className="flex-1 p-3 bg-red-700 hover:bg-red-800 text-white rounded-xl font-black text-sm flex items-center justify-center gap-2 shadow transition-transform active:scale-95"
          >
            <PhoneCall className="w-4 h-4 text-amber-300" />
            <span>
              {isAr
                ? `طلب الإسعاف (${countryConfig.ambulance})`
                : `Call Ambulance (${countryConfig.ambulance})`}
            </span>
          </button>

          <button
            id="btn-card-call-police"
            onClick={() => onRequestEmergencyCall("police")}
            className="p-3 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl font-black text-sm flex items-center justify-center gap-1.5 shadow transition-transform active:scale-95 px-4"
            title={isAr ? "طلب الشرطة" : "Call Police"}
          >
            <PhoneCall className="w-4 h-4" />
            <span>{countryConfig.police}</span>
          </button>
        </div>

        {/* Doctor / Paramedic handoff summary toggle */}
        {responderSummary && (
          <div className="border-t border-stone-200 pt-3">
            <button
              onClick={() => setShowResponderSummary(!showResponderSummary)}
              className="text-xs font-bold text-stone-600 hover:text-stone-900 flex items-center gap-1"
            >
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              <span>
                {showResponderSummary
                  ? isAr
                    ? "إخفاء التقرير الفني للمسعف"
                    : "Hide Paramedic Handoff"
                  : isAr
                  ? "عرض التقرير الفني للمسعف والطبيب 📋"
                  : "View Paramedic / Doctor Technical Handoff 📋"}
              </span>
            </button>

            {showResponderSummary && (
              <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs sm:text-sm text-stone-800 whitespace-pre-line font-medium">
                {responderSummary}
              </div>
            )}
          </div>
        )}

        {/* Two-Way Chat Transition */}
        <div className="pt-2">
          <button
            id="btn-card-go-chat"
            onClick={() => onContinueToChat(currentMessage)}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95"
          >
            <MessageSquare className="w-5 h-5 text-amber-300" />
            <span>
              {isAr
                ? "متابعة التواصل ثنائي الاتجاه مع الشخص الآخر 💬"
                : "Continue to Two-Way Communication Bridge 💬"}
            </span>
          </button>
        </div>
      </div>

      {/* QR Code Modal (Section 8 #4) */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl border-4 border-stone-900">
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mx-auto mb-3">
              <QrCode className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-black text-stone-900 mb-1">
              {isAr ? "امسح الرمز بكاميرا هاتفك" : "Scan with Phone Camera"}
            </h3>
            <p className="text-xs text-stone-600 mb-4 font-semibold">
              {isAr
                ? "يستطيع أي شخص مسح هذا الكود لقراءة رسالة الطوارئ وسماعها فوراً دون تثبيت التطبيق."
                : "Anyone can scan this to immediately view and hear the emergency message on their own phone."}
            </p>

            {qrDataUrl ? (
              <div className="p-3 bg-white border-2 border-stone-300 rounded-xl inline-block shadow-inner mb-4">
                <img
                  src={qrDataUrl}
                  alt="Emergency QR Code"
                  className="w-60 h-60 mx-auto"
                />
              </div>
            ) : (
              <div className="w-60 h-60 bg-stone-100 animate-pulse rounded-xl mx-auto mb-4 flex items-center justify-center">
                <span>{isAr ? "جارٍ الإنشاء..." : "Generating..."}</span>
              </div>
            )}

            <button
              onClick={() => setShowQrModal(false)}
              className="w-full py-2.5 rounded-xl bg-stone-900 hover:bg-black text-white font-bold text-sm transition-colors"
            >
              {isAr ? "إغلاق" : "Close"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
