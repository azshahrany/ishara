import React from "react";
import { Language, UserProfile } from "../types";
import { PhoneCall, AlertTriangle, X, ShieldAlert } from "lucide-react";
import { EMERGENCY_NUMBERS } from "../data/emergencyData";

interface EmergencyCallModalProps {
  language: Language;
  userProfile: UserProfile;
  serviceType: "ambulance" | "police" | "fire" | "unified";
  onClose: () => void;
}

export const EmergencyCallModal: React.FC<EmergencyCallModalProps> = ({
  language,
  userProfile,
  serviceType,
  onClose,
}) => {
  const isAr = language === "ar";
  const country = EMERGENCY_NUMBERS[userProfile.countryCode] || EMERGENCY_NUMBERS.SA;

  let serviceNameAr = "الإسعاف";
  let serviceNameEn = "Ambulance";
  let phoneNumber = country.ambulance;

  if (serviceType === "police") {
    serviceNameAr = "الشرطة والأمن";
    serviceNameEn = "Police Department";
    phoneNumber = country.police;
  } else if (serviceType === "fire") {
    serviceNameAr = "الدفاع المدني والإطفاء";
    serviceNameEn = "Fire & Rescue Brigade";
    phoneNumber = country.fire;
  } else if (serviceType === "unified") {
    serviceNameAr = "الرقم الموحد للطوارئ";
    serviceNameEn = "Unified Emergency Line";
    phoneNumber = country.unified;
  }

  const handleConfirmCall = () => {
    // Open tel: URI for user's phone dialer
    window.location.href = `tel:${phoneNumber}`;
    onClose();
  };

  return (
    <div
      id="modal-emergency-call"
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border-4 border-red-600 text-center animate-scale-in">
        <div className="w-16 h-16 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center mx-auto mb-4 border-2 border-red-300">
          <PhoneCall className="w-8 h-8 animate-bounce" />
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-stone-900 mb-1">
          {isAr ? `تأكيد الاتصال بـ ${serviceNameAr}` : `Confirm Call to ${serviceNameEn}`}
        </h2>

        <div className="my-4 p-4 bg-red-50 rounded-2xl border-2 border-red-200">
          <span className="text-xs font-bold text-red-700 uppercase tracking-widest block mb-1">
            {country.nameAr}
          </span>
          <span className="text-4xl font-black text-red-600 font-mono tracking-wider block">
            {phoneNumber}
          </span>
        </div>

        <p className="text-xs sm:text-sm text-stone-600 mb-6 font-semibold leading-relaxed">
          {isAr
            ? "حرصاً على سلامتك، لن يتم الاتصال تلقائياً بدون موافقتك. سيتم فتح لوحة الاتصال في هاتفك بالرقم المحدد."
            : "For safety, calls are not triggered automatically. Clicking confirm will open your device's native dialer with this official emergency number."}
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-2.5">
          <button
            id="btn-confirm-call-sos"
            onClick={handleConfirmCall}
            className="w-full sm:flex-1 py-3.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95"
          >
            <PhoneCall className="w-4 h-4 text-amber-300" />
            <span>{isAr ? "نعم، اتصل الآن 📞" : "Yes, Dial Now 📞"}</span>
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto py-3.5 px-5 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-extrabold text-sm transition-colors"
          >
            {isAr ? "إلغاء" : "Cancel"}
          </button>
        </div>
      </div>
    </div>
  );
};
