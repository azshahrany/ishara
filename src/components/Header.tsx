import React from "react";
import { Language, AccessibilitySettings } from "../types";
import { Sliders, Globe, AlertTriangle, PlayCircle, Settings } from "lucide-react";

interface HeaderProps {
  language: Language;
  onToggleLanguage: () => void;
  onOpenAccessibility: () => void;
  onOpenSettings: () => void;
  onTriggerDemo: () => void;
  activeTab: "home" | "emergency" | "communicate" | "icons";
  onSelectTab: (tab: "home" | "emergency" | "communicate" | "icons") => void;
  currentMode: "deaf" | "hearing";
  onToggleMode: () => void;
  accessibility: AccessibilitySettings;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onToggleLanguage,
  onOpenAccessibility,
  onOpenSettings,
  onTriggerDemo,
  activeTab,
  onSelectTab,
  currentMode,
  onToggleMode,
  accessibility,
}) => {
  const isAr = language === "ar";

  return (
    <header
      id="app-header"
      className={`sticky top-0 z-40 border-b backdrop-blur-md transition-colors ${
        accessibility.highContrast
          ? "bg-black border-yellow-400 text-yellow-400"
          : "bg-white/95 border-stone-200 text-stone-900"
      }`}
    >
      <div className="max-w-5xl mx-auto px-4 py-2.5 flex items-center justify-between gap-2">
        {/* Brand */}
        <button
          id="btn-brand-home"
          onClick={() => onSelectTab("home")}
          className="flex items-center gap-2.5 focus:outline-none group text-start"
          aria-label={isAr ? "الرئيسية إشارة" : "Ishara Home"}
        >
          <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white font-black text-xl shadow-md group-hover:scale-105 transition-transform">
            إ
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight">
                {isAr ? "إشارة" : "Ishara"}
              </span>
              <span className="text-xs px-1.5 py-0.5 rounded-full bg-red-100 text-red-700 font-bold">
                {isAr ? "طوارئ وتواصل" : "Bridge"}
              </span>
            </div>
            <p className="text-[11px] text-stone-500 font-medium line-clamp-1">
              {isAr ? "تواصل. افهم. ساعد." : "Bridge for Deaf & Hearing"}
            </p>
          </div>
        </button>

        {/* Center Mode Switcher */}
        <div className="hidden sm:flex items-center bg-stone-100 rounded-full p-1 border border-stone-200">
          <button
            id="btn-mode-toggle"
            onClick={onToggleMode}
            className={`px-3 py-1 text-xs font-bold rounded-full transition-all flex items-center gap-1.5 ${
              currentMode === "deaf"
                ? "bg-red-600 text-white shadow-sm"
                : "bg-blue-600 text-white shadow-sm"
            }`}
          >
            <span>{currentMode === "deaf" ? "👤" : "👨"}</span>
            <span>
              {currentMode === "deaf"
                ? isAr
                  ? "أنا أحتاج للمساعدة"
                  : "I Need Help"
                : isAr
                ? "أنا أتحدث مع شخص أصم"
                : "Speaking with Deaf"}
            </span>
            <span className="text-[10px] opacity-80 underline ml-1">
              ({isAr ? "تبديل" : "switch"})
            </span>
          </button>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1.5">
          {/* Demo trigger button */}
          <button
            id="btn-quick-demo"
            onClick={onTriggerDemo}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 transition-colors"
            title={isAr ? "تشغيل سيناريو تجريبي" : "Run interactive demo scenario"}
          >
            <PlayCircle className="w-4 h-4 text-amber-700 animate-pulse" />
            <span className="hidden md:inline">{isAr ? "سيناريو تجريبي" : "Demo"}</span>
          </button>

          {/* Language Toggle */}
          <button
            id="btn-toggle-lang"
            onClick={onToggleLanguage}
            className="p-2 rounded-lg text-xs font-bold border border-stone-300 hover:bg-stone-100 transition-colors flex items-center gap-1"
            title={isAr ? "Switch to English" : "التحويل للعربية"}
            aria-label="Toggle language"
          >
            <Globe className="w-4 h-4" />
            <span>{language === "ar" ? "EN" : "عربي"}</span>
          </button>

          {/* Accessibility Settings */}
          <button
            id="btn-open-accessibility"
            onClick={onOpenAccessibility}
            className={`p-2 rounded-lg border transition-colors ${
              accessibility.highContrast
                ? "border-yellow-400 bg-yellow-400 text-black font-bold"
                : "border-stone-300 hover:bg-stone-100 text-stone-700"
            }`}
            title={isAr ? "إعدادات الوصول الشامل" : "Accessibility controls"}
            aria-label="Accessibility settings"
          >
            <Sliders className="w-4 h-4" />
          </button>

          {/* Settings */}
          <button
            id="btn-open-settings"
            onClick={onOpenSettings}
            className="p-2 rounded-lg border border-stone-300 hover:bg-stone-100 text-stone-700 transition-colors"
            title={isAr ? "الإعدادات العامة وجهات الاتصال" : "Settings and Contacts"}
            aria-label="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Mode Switcher Bar */}
      <div className="sm:hidden px-4 py-1.5 bg-stone-100 border-t border-stone-200 flex items-center justify-between">
        <span className="text-xs font-semibold text-stone-600">
          {isAr ? "الوضع الحالي:" : "Current Mode:"}
        </span>
        <button
          id="btn-mode-toggle-mobile"
          onClick={onToggleMode}
          className={`px-3 py-1 text-xs font-bold rounded-full transition-all flex items-center gap-1.5 ${
            currentMode === "deaf"
              ? "bg-red-600 text-white shadow-sm"
              : "bg-blue-600 text-white shadow-sm"
          }`}
        >
          <span>{currentMode === "deaf" ? "👤" : "👨"}</span>
          <span>
            {currentMode === "deaf"
              ? isAr
                ? "أنا أحتاج للمساعدة"
                : "I Need Help"
              : isAr
              ? "أنا أتحدث مع شخص أصم"
              : "Speaking with Deaf"}
          </span>
          <span className="text-[10px] opacity-80 underline">({isAr ? "تبديل" : "switch"})</span>
        </button>
      </div>
    </header>
  );
};
