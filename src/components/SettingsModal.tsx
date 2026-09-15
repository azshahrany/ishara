import React, { useState } from "react";
import { Language, UserProfile } from "../types";
import { X, Globe, User, Phone, ShieldCheck, HeartPulse } from "lucide-react";
import { EMERGENCY_NUMBERS } from "../data/emergencyData";

interface SettingsModalProps {
  language: Language;
  userProfile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  language,
  userProfile,
  onSaveProfile,
  onClose,
}) => {
  const isAr = language === "ar";
  const [profile, setProfile] = useState<UserProfile>({ ...userProfile });

  const handleSave = () => {
    onSaveProfile(profile);
    onClose();
  };

  const countries = Object.entries(EMERGENCY_NUMBERS);

  return (
    <div
      id="modal-settings"
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border-4 border-stone-800 text-stone-900 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-200">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚙️</span>
            <h2 className="text-lg sm:text-xl font-black">
              {isAr ? "الإعدادات وبيانات الطوارئ" : "Emergency Profile & Settings"}
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
          {/* Country Selection for Emergency Numbers */}
          <div>
            <label className="block text-xs font-extrabold text-stone-700 mb-1.5 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-red-600" />
              <span>{isAr ? "الدولة (لتحديد أرقام الطوارئ السريعة):" : "Country (for Emergency Lines):"}</span>
            </label>
            <select
              value={profile.countryCode}
              onChange={(e) => setProfile({ ...profile, countryCode: e.target.value })}
              className="w-full p-3 rounded-xl border-2 border-stone-300 font-bold text-sm bg-stone-50 text-stone-900"
            >
              {countries.map(([code, info]) => (
                <option key={code} value={code}>
                  {info.flag} {isAr ? info.nameAr : info.nameEn} (الإسعاف: {info.ambulance})
                </option>
              ))}
            </select>
          </div>

          {/* User Name */}
          <div>
            <label className="block text-xs font-extrabold text-stone-700 mb-1.5 flex items-center gap-1.5">
              <User className="w-4 h-4 text-blue-600" />
              <span>{isAr ? "اسم المستخدم (اختياري للبطاقة):" : "User Name (Optional):"}</span>
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full p-3 rounded-xl border-2 border-stone-300 font-bold text-sm text-stone-900"
              placeholder={isAr ? "الاسم الكريم" : "Your name"}
            />
          </div>

          {/* Medical Profile: Blood Type & Allergies */}
          <div className="p-4 rounded-2xl bg-red-50 border-2 border-red-200 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-black text-red-800">
              <HeartPulse className="w-4 h-4 text-red-600" />
              <span>{isAr ? "المعلومات الطبية الحيوية للمسعفين:" : "Critical Medical Info for Responders:"}</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">
                  {isAr ? "فصيلة الدم:" : "Blood Type:"}
                </label>
                <select
                  value={profile.bloodType || "O+"}
                  onChange={(e) => setProfile({ ...profile, bloodType: e.target.value })}
                  className="w-full p-2.5 rounded-xl border-2 border-red-200 font-bold text-sm bg-white"
                >
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "غير معروف"].map((bt) => (
                    <option key={bt} value={bt}>
                      {bt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">
                  {isAr ? "حساسية الأدوية:" : "Allergies:"}
                </label>
                <input
                  type="text"
                  value={profile.allergies || ""}
                  onChange={(e) => setProfile({ ...profile, allergies: e.target.value })}
                  placeholder={isAr ? "مثل البنسلين" : "e.g. Penicillin"}
                  className="w-full p-2.5 rounded-xl border-2 border-red-200 font-bold text-sm bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-stone-700 mb-1">
                {isAr ? "أمراض مزمنة (سكري، ضغط، ربو):" : "Chronic Conditions (Diabetes, Asthma):"}
              </label>
              <input
                type="text"
                value={profile.chronicConditions || ""}
                onChange={(e) => setProfile({ ...profile, chronicConditions: e.target.value })}
                placeholder={isAr ? "مثل ربو حاد، سكري" : "e.g. Asthma, Diabetes"}
                className="w-full p-2.5 rounded-xl border-2 border-red-200 font-bold text-sm bg-white"
              />
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="p-4 rounded-2xl bg-stone-50 border-2 border-stone-200 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-black text-stone-800">
              <Phone className="w-4 h-4 text-emerald-600" />
              <span>{isAr ? "جهة اتصال الطوارئ الشخصية (شخص قريب):" : "Personal Emergency Contact:"}</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={profile.emergencyContact?.name || ""}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    emergencyContact: {
                      ...(profile.emergencyContact || { name: "", phone: "" }),
                      name: e.target.value,
                    },
                  })
                }
                placeholder={isAr ? "اسم القريب" : "Contact name"}
                className="p-2.5 rounded-xl border-2 border-stone-300 font-bold text-xs bg-white"
              />

              <input
                type="tel"
                value={profile.emergencyContact?.phone || ""}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    emergencyContact: {
                      ...(profile.emergencyContact || { name: "", phone: "" }),
                      phone: e.target.value,
                    },
                  })
                }
                placeholder={isAr ? "رقم الهاتف" : "Phone number"}
                className="p-2.5 rounded-xl border-2 border-stone-300 font-bold text-xs bg-white font-mono"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-stone-200 hover:bg-stone-300 font-bold text-xs text-stone-700"
          >
            {isAr ? "إلغاء" : "Cancel"}
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs shadow-md transition-colors"
          >
            {isAr ? "حفظ التغييرات" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};
