import React from "react";
import { Language } from "../types";

interface QuickActionsProps {
  language: Language;
  onSelectQuickAction: (actionId: string) => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  language,
  onSelectQuickAction,
}) => {
  const isAr = language === "ar";

  const actions = [
    {
      id: "ambulance",
      icon: "🚑",
      labelAr: "إسعاف",
      labelEn: "Ambulance",
      bgColor: "bg-red-600 hover:bg-red-700 text-white",
      border: "border-red-700",
    },
    {
      id: "police",
      icon: "🚔",
      labelAr: "شرطة",
      labelEn: "Police",
      bgColor: "bg-indigo-600 hover:bg-indigo-700 text-white",
      border: "border-indigo-700",
    },
    {
      id: "fire",
      icon: "🔥",
      labelAr: "حريق",
      labelEn: "Fire",
      bgColor: "bg-amber-600 hover:bg-amber-700 text-white",
      border: "border-amber-700",
    },
    {
      id: "pain",
      icon: "❤️",
      labelAr: "ألم بالصدر",
      labelEn: "Chest Pain",
      bgColor: "bg-rose-600 hover:bg-rose-700 text-white",
      border: "border-rose-700",
    },
    {
      id: "breathing",
      icon: "🫁",
      labelAr: "ضيق تنفس",
      labelEn: "Breathing",
      bgColor: "bg-cyan-700 hover:bg-cyan-800 text-white",
      border: "border-cyan-800",
    },
    {
      id: "location",
      icon: "📍",
      labelAr: "موقعي",
      labelEn: "Location",
      bgColor: "bg-emerald-600 hover:bg-emerald-700 text-white",
      border: "border-emerald-700",
    },
    {
      id: "call",
      icon: "📞",
      labelAr: "اتصال طوارئ",
      labelEn: "Call SOS",
      bgColor: "bg-blue-600 hover:bg-blue-700 text-white",
      border: "border-blue-700",
    },
  ];

  return (
    <section aria-labelledby="quick-actions-heading" className="w-full">
      <div className="flex items-center justify-between mb-2 px-1">
        <h2 id="quick-actions-heading" className="text-xs sm:text-sm font-bold text-stone-700 flex items-center gap-1.5">
          <span>⚡</span>
          <span>{isAr ? "الوصول السريع (ثوانٍ معدودة)" : "Quick SOS Actions (Instant)"}</span>
        </h2>
        <span className="text-[11px] text-stone-500 font-medium">
          {isAr ? "لمسة واحدة للمساعدة" : "One-touch urgent help"}
        </span>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-7 gap-2">
        {actions.map((act) => (
          <button
            key={act.id}
            id={`btn-quick-${act.id}`}
            onClick={() => onSelectQuickAction(act.id)}
            className={`flex flex-col items-center justify-center p-3 rounded-xl shadow-sm border ${act.border} ${act.bgColor} transition-all transform active:scale-95 text-center min-h-[76px] focus:ring-4 focus:ring-red-300`}
            aria-label={isAr ? act.labelAr : act.labelEn}
          >
            <span className="text-2xl mb-1 filter drop-shadow-sm">{act.icon}</span>
            <span className="text-xs font-bold leading-tight line-clamp-1">
              {isAr ? act.labelAr : act.labelEn}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
};
