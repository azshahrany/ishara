/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  Language,
  AccessibilitySettings,
  UserProfile,
  EmergencySession,
  ChatMessage,
  EmergencyType,
  BodyLocation,
  RequestedHelp,
} from "./types";
import {
  loadStoredLanguage,
  saveStoredLanguage,
  loadAccessibilitySettings,
  saveAccessibilitySettings,
  loadUserProfile,
  saveUserProfile,
  loadEmergencySessions,
  saveEmergencySession,
  loadChatMessages,
  saveChatMessages,
} from "./lib/storage";
import { getCurrentCoordinates } from "./lib/location";
import { Header } from "./components/Header";
import { EmergencyBanner } from "./components/EmergencyBanner";
import { QuickActions } from "./components/QuickActions";
import { EmergencyQuestionnaire } from "./components/EmergencyQuestionnaire";
import { EmergencyCard } from "./components/EmergencyCard";
import { IconBoard } from "./components/IconBoard";
import { TwoWayChat } from "./components/TwoWayChat";
import { BigDisplayModal } from "./components/BigDisplayModal";
import { EmergencyCallModal } from "./components/EmergencyCallModal";
import { AccessibilityModal } from "./components/AccessibilityModal";
import { SettingsModal } from "./components/SettingsModal";
import { DemoScenarioModal } from "./components/DemoScenarioModal";
import {
  AlertTriangle,
  MessageSquare,
  LayoutGrid,
  ShieldCheck,
  HeartHandshake,
  Clock,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Info,
} from "lucide-react";
import { EMERGENCY_NUMBERS } from "./data/emergencyData";

export default function App() {
  // Global App States
  const [language, setLanguage] = useState<Language>(loadStoredLanguage);
  const [accessibility, setAccessibility] = useState<AccessibilitySettings>(
    loadAccessibilitySettings
  );
  const [userProfile, setUserProfile] = useState<UserProfile>(loadUserProfile);
  const [activeTab, setActiveTab] = useState<"home" | "emergency" | "communicate" | "icons">("home");
  const [currentMode, setCurrentMode] = useState<"deaf" | "hearing">("deaf");

  // Emergency & Chat
  const [activeSession, setActiveSession] = useState<EmergencySession | null>(null);
  const [isQuestionnaireOpen, setIsQuestionnaireOpen] = useState<boolean>(false);
  const [questionnairePresets, setQuestionnairePresets] = useState<any>({});
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(loadChatMessages);
  const [recentSessions, setRecentSessions] = useState<EmergencySession[]>(loadEmergencySessions);

  // Modals
  const [bigDisplayText, setBigDisplayText] = useState<string | null>(null);
  const [callModalService, setCallModalService] = useState<
    "ambulance" | "police" | "fire" | "unified" | null
  >(null);
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isDemoOpen, setIsDemoOpen] = useState<boolean>(false);

  const isAr = language === "ar";
  const countryConfig =
    EMERGENCY_NUMBERS[userProfile.countryCode] || EMERGENCY_NUMBERS.SA;

  // Persist language changes
  const handleToggleLanguage = () => {
    const next = language === "ar" ? "en" : "ar";
    setLanguage(next);
    saveStoredLanguage(next);
  };

  // Persist accessibility
  const handleUpdateAccessibility = (newSettings: AccessibilitySettings) => {
    setAccessibility(newSettings);
    saveAccessibilitySettings(newSettings);
  };

  // Persist user profile
  const handleSaveProfile = (newProfile: UserProfile) => {
    setUserProfile(newProfile);
    saveUserProfile(newProfile);
  };

  // Switch between "Deaf" mode and "Hearing person speaking to deaf" mode
  const handleToggleMode = () => {
    const nextMode = currentMode === "deaf" ? "hearing" : "deaf";
    setCurrentMode(nextMode);
    if (nextMode === "hearing") {
      setActiveTab("communicate");
    }
  };

  // Quick Action Handler
  const handleSelectQuickAction = (actionId: string) => {
    if (actionId === "ambulance") {
      setQuestionnairePresets({
        emergencyType: "medical" as EmergencyType,
        bodyLocation: "chest" as BodyLocation,
        painLevel: 8,
        requestedHelp: "ambulance" as RequestedHelp,
      });
      setIsQuestionnaireOpen(true);
      setActiveTab("emergency");
    } else if (actionId === "police") {
      setQuestionnairePresets({
        emergencyType: "danger" as EmergencyType,
        painLevel: 6,
        requestedHelp: "police" as RequestedHelp,
      });
      setIsQuestionnaireOpen(true);
      setActiveTab("emergency");
    } else if (actionId === "fire") {
      setQuestionnairePresets({
        emergencyType: "fire" as EmergencyType,
        painLevel: 6,
        requestedHelp: "civil_defense" as RequestedHelp,
      });
      setIsQuestionnaireOpen(true);
      setActiveTab("emergency");
    } else if (actionId === "pain") {
      setQuestionnairePresets({
        emergencyType: "medical" as EmergencyType,
        bodyLocation: "chest" as BodyLocation,
        painLevel: 8,
      });
      setIsQuestionnaireOpen(true);
      setActiveTab("emergency");
    } else if (actionId === "breathing") {
      setQuestionnairePresets({
        emergencyType: "breathing" as EmergencyType,
        bodyLocation: "chest" as BodyLocation,
        painLevel: 8,
        requestedHelp: "ambulance" as RequestedHelp,
      });
      setIsQuestionnaireOpen(true);
      setActiveTab("emergency");
    } else if (actionId === "location") {
      getCurrentCoordinates()
        .then((loc) => {
          const locText = isAr
            ? `موقعي الحالي في الطوارئ:\n${loc.mapsUrl}\nإحداثيات: (${loc.latitude.toFixed(5)}, ${loc.longitude.toFixed(5)})`
            : `My Emergency Coordinates:\n${loc.mapsUrl}\nLat/Lng: (${loc.latitude.toFixed(5)}, ${loc.longitude.toFixed(5)})`;
          setBigDisplayText(locText);
        })
        .catch((err) => {
          alert(err.message || "تعذر تحديد الموقع الجغرافي.");
        });
    } else if (actionId === "call") {
      setCallModalService("ambulance");
    }
  };

  // Complete Emergency Flow
  const handleCompleteQuestionnaire = (session: EmergencySession) => {
    setActiveSession(session);
    setIsQuestionnaireOpen(false);
    saveEmergencySession(session);
    setRecentSessions(loadEmergencySessions());
    setActiveTab("emergency");
  };

  // Transition from Emergency Card to Two-Way Chat
  const handleContinueToChat = (initialMessage: string) => {
    const newMsg: ChatMessage = {
      id: "msg_" + Date.now(),
      sender: "deaf_user",
      text: initialMessage,
      timestamp: Date.now(),
      icon: "🚨",
    };
    const updated = [...chatMessages, newMsg];
    setChatMessages(updated);
    saveChatMessages(updated);
    setActiveTab("communicate");
  };

  // Chat message send handler
  const handleSendMessage = (
    sender: "deaf_user" | "hearing_person",
    text: string,
    icon?: string
  ) => {
    const newMsg: ChatMessage = {
      id: "msg_" + Date.now(),
      sender,
      text,
      timestamp: Date.now(),
      icon,
    };
    const updated = [...chatMessages, newMsg];
    setChatMessages(updated);
    saveChatMessages(updated);
  };

  const handleClearChat = () => {
    setChatMessages([]);
    saveChatMessages([]);
  };

  // Apply Demo Scenario directly
  const handleApplyDemoScenario = (demoSession: EmergencySession) => {
    setActiveSession(demoSession);
    setIsQuestionnaireOpen(false);
    saveEmergencySession(demoSession);
    setRecentSessions(loadEmergencySessions());

    // Prepopulate chat conversation to reflect the scenario in Section 22
    const scenarioMessages: ChatMessage[] = [
      {
        id: "demo_1",
        sender: "deaf_user",
        text: isAr ? demoSession.generatedMessage.ar : demoSession.generatedMessage.en,
        timestamp: Date.now() - 30000,
        icon: "🚨",
      },
      {
        id: "demo_2",
        sender: "hearing_person",
        text: isAr ? "هل تستطيع المشي أو الوقوف؟" : "Can you walk or stand up?",
        timestamp: Date.now() - 15000,
        icon: "🎤",
      },
      {
        id: "demo_3",
        sender: "deaf_user",
        text: isAr ? "لا، لا أستطيع الوقوف أو المشي." : "No, I cannot stand or walk.",
        timestamp: Date.now(),
        icon: "❌",
      },
    ];
    setChatMessages(scenarioMessages);
    saveChatMessages(scenarioMessages);

    setActiveTab("emergency");
  };

  // Font sizing styles based on accessibility
  const getTextSizeClass = () => {
    if (accessibility.textSize === "xlarge") return "text-lg";
    if (accessibility.textSize === "large") return "text-base";
    return "text-sm";
  };

  return (
    <div
      id="ishara-app-root"
      dir={isAr ? "rtl" : "ltr"}
      className={`min-h-screen flex flex-col font-cairo transition-colors duration-200 ${getTextSizeClass()} ${
        accessibility.highContrast
          ? "bg-[#0a0a0a] text-yellow-400"
          : "bg-stone-50 text-stone-900"
      }`}
    >
      {/* 1. Header with branding, switchers and accessibility toggles */}
      <Header
        language={language}
        onToggleLanguage={handleToggleLanguage}
        onOpenAccessibility={() => setIsAccessibilityOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onTriggerDemo={() => setIsDemoOpen(true)}
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          if (tab === "emergency" && !activeSession) {
            setIsQuestionnaireOpen(true);
          }
        }}
        currentMode={currentMode}
        onToggleMode={handleToggleMode}
        accessibility={accessibility}
      />

      {/* 2. Top Emergency Hotline & Instant SOS Strip */}
      <EmergencyBanner
        language={language}
        userProfile={userProfile}
        onTriggerEmergency={() => {
          setQuestionnairePresets({});
          setIsQuestionnaireOpen(true);
          setActiveTab("emergency");
        }}
        onRequestCallModal={(svc) => setCallModalService(svc)}
        onRequestLocation={() => handleSelectQuickAction("location")}
      />

      {/* 3. Main Navigation Tab Pills */}
      <nav
        id="main-nav-tabs"
        className={`border-b sticky top-[57px] z-30 transition-colors ${
          accessibility.highContrast
            ? "bg-black border-yellow-400/50"
            : "bg-white border-stone-200 shadow-sm"
        }`}
      >
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-between overflow-x-auto no-scrollbar gap-1 py-1.5">
          {[
            {
              id: "home",
              labelAr: "الرئيسية",
              labelEn: "Home",
              icon: "🏠",
            },
            {
              id: "emergency",
              labelAr: "طوارئ (استبيان وبطاقة)",
              labelEn: "Emergency SOS",
              icon: "🚨",
            },
            {
              id: "icons",
              labelAr: "لوحة الأيقونات والتعبير",
              labelEn: "Icon & Expression",
              icon: "🚑",
            },
            {
              id: "communicate",
              labelAr: "التواصل الثنائي المباشر",
              labelEn: "Two-Way Bridge",
              icon: "🤝",
            },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`nav-tab-${tab.id}`}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  if (tab.id === "emergency" && !activeSession) {
                    setIsQuestionnaireOpen(true);
                  }
                }}
                className={`py-2 px-3 sm:px-4 rounded-xl font-extrabold text-xs sm:text-sm whitespace-nowrap flex items-center gap-1.5 transition-all ${
                  isActive
                    ? accessibility.highContrast
                      ? "bg-yellow-400 text-black shadow"
                      : tab.id === "emergency"
                      ? "bg-red-600 text-white shadow-md"
                      : "bg-stone-900 text-white shadow"
                    : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{isAr ? tab.labelAr : tab.labelEn}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* 4. Main Dynamic Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* TAB 1: HOME VIEW */}
        {activeTab === "home" && (
          <div className="space-y-6 animate-fade-in">
            {/* Urgent Alert Hero Box for Panicked User */}
            <div
              className={`p-5 sm:p-7 rounded-3xl border-4 shadow-xl flex flex-col md:flex-row items-center justify-between gap-5 text-start ${
                accessibility.highContrast
                  ? "bg-stone-900 border-yellow-400 text-white"
                  : "bg-gradient-to-br from-red-600 to-rose-700 border-red-700 text-white"
              }`}
            >
              <div className="space-y-2 max-w-xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-black backdrop-blur-sm">
                  <span className="animate-ping w-2 h-2 rounded-full bg-amber-300"></span>
                  <span>{isAr ? "مساعد الطوارئ السريع" : "Quick Emergency Assistant"}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black leading-tight">
                  {isAr
                    ? "هل أنت في حالة طارئة؟ اشرح حالتك في 5 ثوانٍ"
                    : "In an Emergency? Explain your condition in 5 seconds"}
                </h1>
                <p className="text-xs sm:text-sm text-red-100 font-semibold leading-relaxed">
                  {isAr
                    ? "اختر الأيقونات المعبرة عن مشكلتك وسيقوم التطبيق بإنشاء رسالة واضحة، نطقها بصوت عالٍ، وتوليد رمز QR يقرأه أي مسعف أو مارة فوراً."
                    : "Touch icons to describe your problem. Ishara synthesizes a humanized message, plays clear voice audio, and produces a scannable QR card."}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 w-full md:w-auto">
                <button
                  id="btn-hero-start-sos"
                  onClick={() => {
                    setQuestionnairePresets({});
                    setIsQuestionnaireOpen(true);
                    setActiveTab("emergency");
                  }}
                  className="w-full py-4 px-6 rounded-2xl bg-amber-400 hover:bg-amber-300 text-red-950 font-black text-base sm:text-lg flex items-center justify-center gap-2 shadow-2xl transition-transform active:scale-95"
                >
                  <AlertTriangle className="w-6 h-6 text-red-700" />
                  <span>{isAr ? "بدء استبيان الطوارئ 🚨" : "Start Emergency Flow 🚨"}</span>
                </button>

                <button
                  id="btn-hero-open-bridge"
                  onClick={() => setActiveTab("communicate")}
                  className="w-full py-3 px-5 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-extrabold text-sm flex items-center justify-center gap-2 backdrop-blur-sm transition-colors"
                >
                  <MessageSquare className="w-5 h-5 text-amber-300" />
                  <span>{isAr ? "فتح جسر التواصل الثنائي" : "Open Two-Way Bridge"}</span>
                </button>
              </div>
            </div>

            {/* Quick Actions Bar (Section 13) */}
            <QuickActions
              language={language}
              onSelectQuickAction={handleSelectQuickAction}
            />

            {/* Active Card Notification if one exists */}
            {activeSession && (
              <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">📋</span>
                  <div>
                    <span className="text-xs font-bold text-amber-800">
                      {isAr ? "لديك بطاقة طوارئ نشطة حالياً:" : "Active Emergency Card ready:"}
                    </span>
                    <p className="font-extrabold text-sm text-stone-900">
                      {isAr
                        ? activeSession.generatedMessage.headlineAr
                        : activeSession.generatedMessage.headlineEn}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab("emergency")}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs transition-colors flex items-center gap-1 shadow"
                >
                  <span>{isAr ? "عرض البطاقة" : "View Card"}</span>
                  {isAr ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                </button>
              </div>
            )}

            {/* 3 Main Capability Pillars Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Pillar 1: Smart Questionnaire */}
              <div
                onClick={() => {
                  setQuestionnairePresets({});
                  setIsQuestionnaireOpen(true);
                  setActiveTab("emergency");
                }}
                className="p-5 rounded-2xl border-2 border-stone-200 bg-white hover:border-red-500 shadow-sm hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform">
                  🚨
                </div>
                <h2 className="font-black text-base text-stone-900 mb-1">
                  {isAr ? "استبيان الـ 5 خطوات السريع" : "5-Step Fast SOS"}
                </h2>
                <p className="text-xs text-stone-600 font-semibold leading-relaxed">
                  {isAr
                    ? "ماذا يحدث؟ أين المشكلة؟ شدة الألم؟ هل تتكلم؟ ما تحتاجه؟ يتحول تلقائياً لرسالة منقذة للحياة."
                    : "What is happening, location, pain scale, and immediate need converted into natural emergency speech."}
                </p>
              </div>

              {/* Pillar 2: Giant Icon Board */}
              <div
                onClick={() => setActiveTab("icons")}
                className="p-5 rounded-2xl border-2 border-stone-200 bg-white hover:border-blue-500 shadow-sm hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform">
                  🚑
                </div>
                <h2 className="font-black text-base text-stone-900 mb-1">
                  {isAr ? "لوحة الأيقونات ومركّب الحالة" : "Giant Icon Board & Builder"}
                </h2>
                <p className="text-xs text-stone-600 font-semibold leading-relaxed">
                  {isAr
                    ? "أزرار عملاقة ذات تباين عالٍ بنقرة واحدة، بالإضافة لمركّب الحالة (قلب + ألم + 8/10 + يسار)."
                    : "Huge high-contrast symbols, plus expressive compound builder (Chest + Pain + 8/10 + Left)."}
                </p>
              </div>

              {/* Pillar 3: Two-Way Bridge */}
              <div
                onClick={() => setActiveTab("communicate")}
                className="p-5 rounded-2xl border-2 border-stone-200 bg-white hover:border-indigo-500 shadow-sm hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform">
                  🤝
                </div>
                <h2 className="font-black text-base text-stone-900 mb-1">
                  {isAr ? "جسر التواصل الثنائي (صوت ونصوص)" : "Two-Way Speech & Text Bridge"}
                </h2>
                <p className="text-xs text-stone-600 font-semibold leading-relaxed">
                  {isAr
                    ? "السامع يضغط 🎤 ويتحدث بصوته لتظهر نصوص مكبرة، والأصم يجيب بنقرة سريعة واحدة."
                    : "Hearing person speaks aloud into the mic; deaf person responds with instant 1-tap options."}
                </p>
              </div>
            </div>

            {/* Recent Emergency Cards History (if any) */}
            {recentSessions.length > 0 && (
              <div className="border border-stone-200 rounded-2xl p-4 bg-white space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs sm:text-sm font-black text-stone-800 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-stone-500" />
                    <span>{isAr ? "سجل بطاقات الطوارئ الأخيرة:" : "Recent Emergency Sessions:"}</span>
                  </h3>
                  <span className="text-xs text-stone-400 font-mono">
                    {recentSessions.length} {isAr ? "جلسات" : "sessions"}
                  </span>
                </div>

                <div className="space-y-2">
                  {recentSessions.slice(0, 3).map((sess) => (
                    <div
                      key={sess.id}
                      onClick={() => {
                        setActiveSession(sess);
                        setIsQuestionnaireOpen(false);
                        setActiveTab("emergency");
                      }}
                      className="p-3 rounded-xl border border-stone-200 hover:border-red-400 hover:bg-red-50/50 cursor-pointer flex items-center justify-between gap-2 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🚨</span>
                        <div>
                          <p className="text-xs sm:text-sm font-extrabold text-stone-900 line-clamp-1">
                            {isAr ? sess.generatedMessage.headlineAr : sess.generatedMessage.headlineEn}
                          </p>
                          <span className="text-[10px] text-stone-500">
                            {new Date(sess.createdAt).toLocaleString(isAr ? "ar-SA" : "en-US")} • #{sess.sessionCode}
                          </span>
                        </div>
                      </div>

                      <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded-lg">
                        {isAr ? "عرض" : "Open"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: EMERGENCY SOS FLOW / ACTIVE CARD */}
        {activeTab === "emergency" && (
          <div className="space-y-4 animate-fade-in">
            {isQuestionnaireOpen || !activeSession ? (
              <EmergencyQuestionnaire
                language={language}
                onCancel={() => {
                  setIsQuestionnaireOpen(false);
                  if (!activeSession) setActiveTab("home");
                }}
                onComplete={handleCompleteQuestionnaire}
                initialAnswers={questionnairePresets}
              />
            ) : (
              <EmergencyCard
                session={activeSession}
                language={language}
                userProfile={userProfile}
                onOpenBigDisplay={(txt) => setBigDisplayText(txt)}
                onContinueToChat={handleContinueToChat}
                onReset={() => {
                  setQuestionnairePresets({});
                  setIsQuestionnaireOpen(true);
                }}
                onRequestEmergencyCall={(svc) => setCallModalService(svc)}
              />
            )}
          </div>
        )}

        {/* TAB 3: ICON BOARD & EXPRESSION BUILDER */}
        {activeTab === "icons" && (
          <div className="animate-fade-in">
            <IconBoard
              language={language}
              onOpenBigDisplay={(txt) => setBigDisplayText(txt)}
              onSendToChat={(txt) => {
                handleSendMessage("deaf_user", txt, "📢");
                setActiveTab("communicate");
              }}
            />
          </div>
        )}

        {/* TAB 4: TWO-WAY DIRECT COMMUNICATION BRIDGE */}
        {activeTab === "communicate" && (
          <div className="animate-fade-in">
            <TwoWayChat
              language={language}
              messages={chatMessages}
              onSendMessage={handleSendMessage}
              onClearChat={handleClearChat}
              onOpenBigDisplay={(txt) => setBigDisplayText(txt)}
              accessibility={accessibility}
            />
          </div>
        )}
      </main>

      {/* 5. Minimal Accessible Footer */}
      <footer
        className={`mt-auto border-t py-4 text-center transition-colors ${
          accessibility.highContrast
            ? "bg-black border-yellow-400 text-stone-300"
            : "bg-white border-stone-200 text-stone-500"
        }`}
      >
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-stone-900">
              {isAr ? "إشارة — Ishara" : "Ishara Bridge"}
            </span>
            <span>•</span>
            <span>{isAr ? "الوصول الشامل للصم وضعاف السمع" : "Universal Accessibility for Deaf"}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsDemoOpen(true)}
              className="text-amber-700 hover:underline font-bold"
            >
              {isAr ? "تجربة السيناريو 🧪" : "Interactive Demo 🧪"}
            </button>
            <span>•</span>
            <button
              onClick={() => setIsAccessibilityOpen(true)}
              className="hover:underline"
            >
              {isAr ? "الوصول الشامل ♿" : "Accessibility ♿"}
            </button>
            <span>•</span>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="hover:underline"
            >
              {isAr ? "الإعدادات ⚙️" : "Settings ⚙️"}
            </button>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {/* 1. Big Display Full-Screen Modal */}
      {bigDisplayText && (
        <BigDisplayModal
          text={bigDisplayText}
          language={language}
          onClose={() => setBigDisplayText(null)}
        />
      )}

      {/* 2. Emergency Call Modal with Safety Confirmation */}
      {callModalService && (
        <EmergencyCallModal
          language={language}
          userProfile={userProfile}
          serviceType={callModalService}
          onClose={() => setCallModalService(null)}
        />
      )}

      {/* 3. Accessibility Settings Modal */}
      {isAccessibilityOpen && (
        <AccessibilityModal
          language={language}
          settings={accessibility}
          onUpdateSettings={handleUpdateAccessibility}
          onClose={() => setIsAccessibilityOpen(false)}
        />
      )}

      {/* 4. Settings & Medical Profile Modal */}
      {isSettingsOpen && (
        <SettingsModal
          language={language}
          userProfile={userProfile}
          onSaveProfile={handleSaveProfile}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}

      {/* 5. 1-Click Interactive Demo Scenario Modal (Section 22) */}
      {isDemoOpen && (
        <DemoScenarioModal
          language={language}
          onApplyDemoToApp={handleApplyDemoScenario}
          onClose={() => setIsDemoOpen(false)}
        />
      )}
    </div>
  );
}
