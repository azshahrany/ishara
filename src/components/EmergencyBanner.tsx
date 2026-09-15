import React from "react";
import { Language, UserProfile } from "../types";
import { PhoneCall, MapPin, AlertOctagon } from "lucide-react";
import { EMERGENCY_NUMBERS } from "../data/emergencyData";

interface EmergencyBannerProps {
  language: Language;
  userProfile: UserProfile;
  onTriggerEmergency: () => void;
  onRequestCallModal: (serviceType: "ambulance" | "police" | "fire" | "unified") => void;
  onRequestLocation: () => void;
}

export const EmergencyBanner: React.FC<EmergencyBannerProps> = ({
  language,
  userProfile,
  onTriggerEmergency,
  onRequestCallModal,
  onRequestLocation,
}) => {
  const isAr = language === "ar";
  const countryConfig =
    EMERGENCY_NUMBERS[userProfile.countryCode] || EMERGENCY_NUMBERS.SA;

  return (
    <div
      id="emergency-top-banner"
      className="bg-red-700 text-white shadow-md border-b-2 border-red-800"
    >
      <div className="max-w-5xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-400"></span>
          </span>
          <span className="text-xs sm:text-sm font-bold tracking-wide">
            {isAr
              ? `طوارئ ${countryConfig.nameAr}: الإسعاف ${countryConfig.ambulance} | الشرطة ${countryConfig.police}`
              : `Emergency ${countryConfig.nameEn}: Amb ${countryConfig.ambulance} | Police ${countryConfig.police}`}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-banner-call-ambulance"
            onClick={() => onRequestCallModal("ambulance")}
            className="px-2.5 py-1 rounded bg-red-900/80 hover:bg-red-950 text-xs font-bold flex items-center gap-1 transition-colors border border-red-500/40"
            title={isAr ? "طلب الإسعاف" : "Call Ambulance"}
          >
            <PhoneCall className="w-3.5 h-3.5 text-amber-300" />
            <span>{countryConfig.ambulance}</span>
          </button>

          <button
            id="btn-banner-location"
            onClick={onRequestLocation}
            className="px-2.5 py-1 rounded bg-red-900/80 hover:bg-red-950 text-xs font-bold flex items-center gap-1 transition-colors border border-red-500/40"
            title={isAr ? "موقعي الجغرافي" : "My Geolocation"}
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-300" />
            <span>{isAr ? "موقعي" : "Location"}</span>
          </button>

          <button
            id="btn-banner-panic"
            onClick={onTriggerEmergency}
            className="px-3 py-1 rounded bg-amber-400 hover:bg-amber-300 text-red-950 font-black text-xs flex items-center gap-1 shadow transition-transform active:scale-95"
          >
            <AlertOctagon className="w-3.5 h-3.5 text-red-800" />
            <span>{isAr ? "بدء استبيان الطوارئ" : "Emergency Flow"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
