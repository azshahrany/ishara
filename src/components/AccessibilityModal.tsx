import React from "react";
import { Language, AccessibilitySettings } from "../types";
import { X, Eye, Type, Bell, Volume2, ShieldCheck } from "lucide-react";

interface AccessibilityModalProps {
  language: Language;
  settings: AccessibilitySettings;
  onUpdateSettings: (newSettings: AccessibilitySettings) => void;
  onClose: () => void;
}

export const AccessibilityModal: React.FC<AccessibilityModalProps> = ({
  language,
  settings,
  onUpdateSettings,
  onClose,
}) => {
  const isAr = language === "ar";

  const handleToggleContrast = () => {
    onUpdateSettings({
      ...settings,
      highContrast: !settings.highContrast,
    });
  };

  const handleSetTextSize = (size: "normal" | "large" | "xlarge") => {
    onUpdateSettings({
      ...settings,
      textSize: size,
    });
  };

  const handleToggleVisualAlerts = () => {
    onUpdateSettings({
      ...settings,
      visualAlerts: !settings.visualAlerts,
    });
  };

  const handleToggleSound = () => {
    onUpdateSettings({
      ...settings,
      soundEnabled: !settings.soundEnabled,
    });
  };

  return (
    <div
      id="modal-accessibility"
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border-4 border-stone-900 text-stone-900">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-200">
          <div className="flex items-center gap-2">
            <span className="text-2xl">♿</span>
            <h2 className="text-lg sm:text-xl font-black">
              {isAr ? "إعدادات الوصول الشامل (Accessibility)" : "Accessibility Controls"}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* High Contrast Mode */}
          <div className="p-4 rounded-2xl bg-stone-50 border-2 border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-stone-900 text-yellow-400 rounded-xl">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-extrabold block">
                  {isAr ? "نمط التباين العالي (High Contrast)" : "High Contrast Mode"}
                </span>
                <span className="text-xs text-stone-500">
                  {isAr ? "خلفية داكنة مع نصوص صفراء حادة لسهولة القراءة" : "Sharp high-contrast colors"}
                </span>
              </div>
            </div>

            <button
              id="btn-toggle-high-contrast"
              onClick={handleToggleContrast}
              className={`w-14 h-8 rounded-full transition-colors relative p-1 ${
                settings.highContrast ? "bg-yellow-400" : "bg-stone-300"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full bg-stone-900 transition-transform ${
                  settings.highContrast ? "transform translate-x-6" : ""
                }`}
              />
            </button>
          </div>

          {/* Text Size */}
          <div className="p-4 rounded-2xl bg-stone-50 border-2 border-stone-200">
            <div className="flex items-center gap-2 mb-2.5">
              <Type className="w-5 h-5 text-stone-700" />
              <span className="text-sm font-extrabold">
                {isAr ? "حجم الخطوط والنصوص:" : "Text Scale:"}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "normal", labelAr: "عادي", labelEn: "Default" },
                { id: "large", labelAr: "كبير", labelEn: "Large" },
                { id: "xlarge", labelAr: "ضخم جداً", labelEn: "Extra Large" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSetTextSize(item.id as any)}
                  className={`py-2.5 px-3 rounded-xl border-2 font-black text-xs sm:text-sm transition-all ${
                    settings.textSize === item.id
                      ? "border-red-600 bg-red-600 text-white shadow"
                      : "border-stone-300 bg-white text-stone-700 hover:bg-stone-100"
                  }`}
                >
                  {isAr ? item.labelAr : item.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* Visual Alerts (Flash when receiving message or speech) */}
          <div className="p-4 rounded-2xl bg-stone-50 border-2 border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-100 text-amber-800 rounded-xl">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-extrabold block">
                  {isAr ? "التنبيهات البصرية (Visual Alerts)" : "Visual Flashes"}
                </span>
                <span className="text-xs text-stone-500">
                  {isAr ? "وميض لوني عند تحدث الطرف الآخر كبديل للصوت" : "Flash screen when other party speaks"}
                </span>
              </div>
            </div>

            <button
              onClick={handleToggleVisualAlerts}
              className={`w-14 h-8 rounded-full transition-colors relative p-1 ${
                settings.visualAlerts ? "bg-red-600" : "bg-stone-300"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full bg-white transition-transform ${
                  settings.visualAlerts ? "transform translate-x-6" : ""
                }`}
              />
            </button>
          </div>

          {/* Sound & Speech Synthesis */}
          <div className="p-4 rounded-2xl bg-stone-50 border-2 border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-100 text-blue-800 rounded-xl">
                <Volume2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-extrabold block">
                  {isAr ? "النطق الصوتي التلقائي" : "Text-To-Speech Synthesis"}
                </span>
                <span className="text-xs text-stone-500">
                  {isAr ? "تفعيل النطق الصوتي للسامعين عند إرسال بطاقة أو رد" : "Play audio aloud for hearing listeners"}
                </span>
              </div>
            </div>

            <button
              onClick={handleToggleSound}
              className={`w-14 h-8 rounded-full transition-colors relative p-1 ${
                settings.soundEnabled ? "bg-red-600" : "bg-stone-300"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full bg-white transition-transform ${
                  settings.soundEnabled ? "transform translate-x-6" : ""
                }`}
              />
            </button>
          </div>
        </div>

        <div className="mt-6 pt-3 border-t border-stone-200">
          <button
            onClick={onClose}
            className="w-full py-3 bg-stone-900 hover:bg-black text-white rounded-xl font-extrabold text-sm transition-colors"
          >
            {isAr ? "حفظ وإغلاق" : "Save & Close"}
          </button>
        </div>
      </div>
    </div>
  );
};
