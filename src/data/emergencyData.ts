import { EmergencyType, BodyLocation, AbilityToSpeak, RequestedHelp, Language } from "../types";

export interface IconItem {
  id: string;
  icon: string;
  labelAr: string;
  labelEn: string;
  category: "emergency" | "symptom" | "action" | "quick";
  colorClass: string;
  fullMessageAr: string;
  fullMessageEn: string;
}

export const EMERGENCY_ICONS: IconItem[] = [
  {
    id: "ambulance",
    icon: "🚑",
    labelAr: "إسعاف طارئ",
    labelEn: "Ambulance",
    category: "emergency",
    colorClass: "bg-red-500 hover:bg-red-600 text-white border-red-600",
    fullMessageAr: "أحتاج إلى إسعاف فوري لنقلي إلى المستشفى.",
    fullMessageEn: "I need an immediate ambulance to take me to hospital.",
  },
  {
    id: "health",
    icon: "❤️",
    labelAr: "مشكلة صحية",
    labelEn: "Health Issue",
    category: "emergency",
    colorClass: "bg-rose-500 hover:bg-rose-600 text-white border-rose-600",
    fullMessageAr: "أعاني من وعكة صحية طارئة.",
    fullMessageEn: "I have an acute health emergency.",
  },
  {
    id: "injury",
    icon: "🤕",
    labelAr: "تعرضت لإصابة",
    labelEn: "Injured",
    category: "emergency",
    colorClass: "bg-amber-500 hover:bg-amber-600 text-white border-amber-600",
    fullMessageAr: "تعرضت لإصابة جسدية وأحتاج إلى فحص وتضميد.",
    fullMessageEn: "I am injured and need medical care.",
  },
  {
    id: "pain",
    icon: "😣",
    labelAr: "أشعر بألم",
    labelEn: "In Pain",
    category: "symptom",
    colorClass: "bg-orange-500 hover:bg-orange-600 text-white border-orange-600",
    fullMessageAr: "أشعر بألم شديد لا أستطيع تحمله.",
    fullMessageEn: "I am experiencing severe pain.",
  },
  {
    id: "bleeding",
    icon: "🩸",
    labelAr: "يوجد نزيف",
    labelEn: "Bleeding",
    category: "emergency",
    colorClass: "bg-red-700 hover:bg-red-800 text-white border-red-900",
    fullMessageAr: "يوجد نزيف دموي مستمر، أحتاج لمساعدة فورية لإيقافه.",
    fullMessageEn: "I am bleeding, need immediate assistance to stop it.",
  },
  {
    id: "breathing",
    icon: "🫁",
    labelAr: "صعوبة تنفس",
    labelEn: "Breathing Diff.",
    category: "emergency",
    colorClass: "bg-cyan-600 hover:bg-cyan-700 text-white border-cyan-700",
    fullMessageAr: "أعاني من ضيق شديد في التنفس ولا أستطيع أخذ نفسي.",
    fullMessageEn: "I have severe difficulty breathing.",
  },
  {
    id: "dizzy",
    icon: "😵",
    labelAr: "أشعر بالدوار",
    labelEn: "Dizziness",
    category: "symptom",
    colorClass: "bg-purple-600 hover:bg-purple-700 text-white border-purple-700",
    fullMessageAr: "أشعر بدوار شديد وعدم اتزان وقد أفقد الوعي.",
    fullMessageEn: "I feel very dizzy and may faint.",
  },
  {
    id: "nausea",
    icon: "🤢",
    labelAr: "أشعر بالغثيان",
    labelEn: "Nausea",
    category: "symptom",
    colorClass: "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-700",
    fullMessageAr: "أشعر بغثيان شديد ورغبة في القيء.",
    fullMessageEn: "I feel extreme nausea and need to vomit.",
  },
  {
    id: "location",
    icon: "📍",
    labelAr: "مساعدة هنا",
    labelEn: "Help Here",
    category: "quick",
    colorClass: "bg-blue-600 hover:bg-blue-700 text-white border-blue-700",
    fullMessageAr: "أحتاج إلى المساعدة في هذا الموقع الحالي الآن.",
    fullMessageEn: "I need help right here at this current location.",
  },
  {
    id: "police",
    icon: "🚔",
    labelAr: "أحتاج الشرطة",
    labelEn: "Police",
    category: "emergency",
    colorClass: "bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-700",
    fullMessageAr: "أنا في خطر أو حدث اعتداء، أحتاج الشرطة فوراً.",
    fullMessageEn: "I am in danger, I need the police urgently.",
  },
  {
    id: "fire",
    icon: "🚒",
    labelAr: "الدفاع المدني",
    labelEn: "Fire Brigade",
    category: "emergency",
    colorClass: "bg-red-600 hover:bg-red-700 text-white border-red-700",
    fullMessageAr: "يوجد حريق أو خطر يستدعي الدفاع المدني فوراً.",
    fullMessageEn: "There is a fire hazard, urgent fire brigade needed.",
  },
  {
    id: "doctor",
    icon: "👨‍⚕️",
    labelAr: "أحتاج طبيب",
    labelEn: "Need Doctor",
    category: "emergency",
    colorClass: "bg-teal-600 hover:bg-teal-700 text-white border-teal-700",
    fullMessageAr: "أحتاج استشارة طبيب أو ممرض في أقرب وقت.",
    fullMessageEn: "I need to see a doctor or nurse urgently.",
  },
  {
    id: "meds",
    icon: "💊",
    labelAr: "أحتاج دواء",
    labelEn: "Need Medicine",
    category: "action",
    colorClass: "bg-sky-600 hover:bg-sky-700 text-white border-sky-700",
    fullMessageAr: "أحتاج دوائي الخاص الآن، هل يمكنك مساعدتي؟",
    fullMessageEn: "I urgently need my medication, can you help me?",
  },
  {
    id: "call",
    icon: "📞",
    labelAr: "اتصل بشخص",
    labelEn: "Call Family",
    category: "action",
    colorClass: "bg-blue-500 hover:bg-blue-600 text-white border-blue-600",
    fullMessageAr: "أرجو الاتصال بجهة اتصالي المسجلة في هاتفي.",
    fullMessageEn: "Please call my designated emergency contact.",
  },
  {
    id: "home",
    icon: "🏠",
    labelAr: "أريد العودة",
    labelEn: "Go Home",
    category: "action",
    colorClass: "bg-stone-700 hover:bg-stone-800 text-white border-stone-800",
    fullMessageAr: "أنا تائه أو متعب وأحتاج العودة إلى منزلي.",
    fullMessageEn: "I am lost or exhausted and need to get home.",
  },
  {
    id: "not_understand",
    icon: "❓",
    labelAr: "لا أفهم",
    labelEn: "Don't Understand",
    category: "quick",
    colorClass: "bg-amber-600 hover:bg-amber-700 text-white border-amber-700",
    fullMessageAr: "أنا أصم/لا أسمعك جيداً، أرجو التوضيح أو الكتابة.",
    fullMessageEn: "I am deaf / cannot hear you. Please write or use text.",
  },
  {
    id: "stop",
    icon: "✋",
    labelAr: "توقف",
    labelEn: "Stop",
    category: "quick",
    colorClass: "bg-rose-600 hover:bg-rose-700 text-white border-rose-700",
    fullMessageAr: "توقف من فضلك! لا تفعل ذلك.",
    fullMessageEn: "Please stop! Do not do that.",
  },
  {
    id: "yes",
    icon: "✅",
    labelAr: "نعم",
    labelEn: "Yes",
    category: "quick",
    colorClass: "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-700",
    fullMessageAr: "نعم، هذا صحيح وموافق عليه.",
    fullMessageEn: "Yes, that is correct.",
  },
  {
    id: "no",
    icon: "❌",
    labelAr: "لا",
    labelEn: "No",
    category: "quick",
    colorClass: "bg-zinc-700 hover:bg-zinc-800 text-white border-zinc-800",
    fullMessageAr: "لا، هذا غير صحيح أو غير موافق.",
    fullMessageEn: "No, that is not correct.",
  },
];

// 5-Step Questionnaire Data
export const QUESTIONNAIRE_STEPS = {
  ar: {
    step1: {
      title: "ماذا يحدث؟",
      subtitle: "اختر الحالة الأساسية فوراً",
      options: [
        { id: "health", icon: "❤️", label: "مشكلة صحية" },
        { id: "injury", icon: "🤕", label: "إصابة" },
        { id: "accident", icon: "🚗", label: "حادث" },
        { id: "unconscious", icon: "😵", label: "فقدان وعي/دوخة" },
        { id: "bleeding", icon: "🩸", label: "نزيف" },
        { id: "breathing", icon: "🫁", label: "صعوبة تنفس" },
        { id: "fire", icon: "🔥", label: "حريق" },
        { id: "danger", icon: "🚔", label: "خطر/تهديد" },
        { id: "other", icon: "❓", label: "شيء آخر" },
      ],
    },
    step2: {
      title: "أين المشكلة؟",
      subtitle: "حدد مكان الألم أو الإصابة في الجسم",
      options: [
        { id: "head", icon: "🧠", label: "الرأس" },
        { id: "chest", icon: "❤️", label: "الصدر" },
        { id: "abdomen", icon: "🫃", label: "البطن" },
        { id: "leg", icon: "🦵", label: "الساق" },
        { id: "arm", icon: "💪", label: "الذراع" },
        { id: "hand", icon: "🖐️", label: "اليد" },
        { id: "foot", icon: "🦶", label: "القدم" },
        { id: "other", icon: "🩹", label: "مكان آخر" },
      ],
    },
    step3: {
      title: "ما شدة الألم؟",
      subtitle: "مقياس الألم من 0 إلى 10",
      options: [
        { level: 0, icon: "😀", label: "0 - لا يوجد ألم" },
        { level: 2, icon: "🙂", label: "2 - ألم خفيف" },
        { level: 4, icon: "😐", label: "4 - ألم متوسط" },
        { level: 6, icon: "😣", label: "6 - ألم ملحوظ" },
        { level: 8, icon: "😭", label: "8 - ألم شديد جداً" },
        { level: 10, icon: "🚨", label: "10 - ألم لا يطاق" },
      ],
    },
    step4: {
      title: "هل تستطيع الكلام؟",
      subtitle: "لتحديد أسلوب التعامل معك",
      options: [
        { id: "no", icon: "❌", label: "لا أستطيع الكلام" },
        { id: "little", icon: "🤏", label: "قليلاً وبصعوبة" },
        { id: "yes", icon: "✅", label: "نعم أستطيع" },
      ],
    },
    step5: {
      title: "ما الذي تحتاجه الآن؟",
      subtitle: "طلب المساعدة الأهم في هذه اللحظة",
      options: [
        { id: "ambulance", icon: "🚑", label: "إسعاف" },
        { id: "doctor", icon: "👨‍⚕️", label: "طبيب" },
        { id: "police", icon: "🚔", label: "شرطة" },
        { id: "fire", icon: "🚒", label: "دفاع مدني" },
        { id: "family", icon: "👨‍👩‍👦", label: "شخص من العائلة" },
        { id: "call", icon: "📞", label: "اتصال هاتفي" },
        { id: "on_site_help", icon: "📍", label: "مساعدة في الموقع" },
      ],
    },
  },
  en: {
    step1: {
      title: "What is happening?",
      subtitle: "Select the primary situation immediately",
      options: [
        { id: "health", icon: "❤️", label: "Health Issue" },
        { id: "injury", icon: "🤕", label: "Injury" },
        { id: "accident", icon: "🚗", label: "Accident" },
        { id: "unconscious", icon: "😵", label: "Fainting/Dizzy" },
        { id: "bleeding", icon: "🩸", label: "Bleeding" },
        { id: "breathing", icon: "🫁", label: "Breathing Issue" },
        { id: "fire", icon: "🔥", label: "Fire Hazard" },
        { id: "danger", icon: "🚔", label: "Danger/Threat" },
        { id: "other", icon: "❓", label: "Other" },
      ],
    },
    step2: {
      title: "Where is the problem?",
      subtitle: "Select the body area affected",
      options: [
        { id: "head", icon: "🧠", label: "Head" },
        { id: "chest", icon: "❤️", label: "Chest" },
        { id: "abdomen", icon: "🫃", label: "Abdomen" },
        { id: "leg", icon: "🦵", label: "Leg" },
        { id: "arm", icon: "💪", label: "Arm" },
        { id: "hand", icon: "🖐️", label: "Hand" },
        { id: "foot", icon: "🦶", label: "Foot" },
        { id: "other", icon: "🩹", label: "Other Body Part" },
      ],
    },
    step3: {
      title: "Pain Severity?",
      subtitle: "Pain scale from 0 to 10",
      options: [
        { level: 0, icon: "😀", label: "0 - No pain" },
        { level: 2, icon: "🙂", label: "2 - Mild" },
        { level: 4, icon: "😐", label: "4 - Moderate" },
        { level: 6, icon: "😣", label: "6 - Significant" },
        { level: 8, icon: "😭", label: "8 - Very Severe" },
        { level: 10, icon: "🚨", label: "10 - Unbearable" },
      ],
    },
    step4: {
      title: "Can you speak?",
      subtitle: "So bystanders know how to communicate with you",
      options: [
        { id: "no", icon: "❌", label: "No, cannot speak" },
        { id: "little", icon: "🤏", label: "A little / Hard" },
        { id: "yes", icon: "✅", label: "Yes, I can" },
      ],
    },
    step5: {
      title: "What do you need right now?",
      subtitle: "Most urgent requirement",
      options: [
        { id: "ambulance", icon: "🚑", label: "Ambulance" },
        { id: "doctor", icon: "👨‍⚕️", label: "Doctor" },
        { id: "police", icon: "🚔", label: "Police" },
        { id: "fire", icon: "🚒", label: "Fire Service" },
        { id: "family", icon: "👨‍👩‍👦", label: "Family Member" },
        { id: "call", icon: "📞", label: "Phone Call" },
        { id: "on_site_help", icon: "📍", label: "On-site Assistance" },
      ],
    },
  },
};

// Emergency Phone numbers by country
export const EMERGENCY_NUMBERS: Record<
  string,
  { nameAr: string; nameEn: string; ambulance: string; police: string; fire: string; unified: string; flag: string }
> = {
  SA: { nameAr: "المملكة العربية السعودية", nameEn: "Saudi Arabia", ambulance: "997", police: "999", fire: "998", unified: "911", flag: "🇸🇦" },
  AE: { nameAr: "الإمارات العربية المتحدة", nameEn: "UAE", ambulance: "998", police: "999", fire: "997", unified: "999", flag: "🇦🇪" },
  KW: { nameAr: "الكويت", nameEn: "Kuwait", ambulance: "112", police: "112", fire: "112", unified: "112", flag: "🇰🇼" },
  QA: { nameAr: "قطر", nameEn: "Qatar", ambulance: "999", police: "999", fire: "999", unified: "999", flag: "🇶🇦" },
  EG: { nameAr: "مصر", nameEn: "Egypt", ambulance: "123", police: "122", fire: "180", unified: "123", flag: "🇪🇬" },
  US: { nameAr: "الولايات المتحدة", nameEn: "United States", ambulance: "911", police: "911", fire: "911", unified: "911", flag: "🇺🇸" },
  UK: { nameAr: "المملكة المتحدة", nameEn: "United Kingdom", ambulance: "999", police: "999", fire: "999", unified: "999", flag: "🇬🇧" },
  INTL: { nameAr: "دولي / موحد", nameEn: "International", ambulance: "112", police: "112", fire: "112", unified: "112", flag: "🌐" },
};

// Smart auto-complete suggestions based on keywords
export const SMART_SUGGESTIONS: Array<{ keyword: string; labelAr: string; labelEn: string; icon: string }> = [
  { keyword: "تنفس", labelAr: "صعوبة شديدة في التنفس", labelEn: "Severe breathing difficulty", icon: "🫁" },
  { keyword: "صدر", labelAr: "ألم ضاغط في الصدر", labelEn: "Crushing chest pain", icon: "❤️" },
  { keyword: "اسعاف", labelAr: "أحتاج إسعاف فوري لنقلي", labelEn: "Need urgent ambulance", icon: "🚑" },
  { keyword: "دوخة", labelAr: "أشعر بدوار وقد أسقط", labelEn: "Severe dizziness", icon: "😵" },
  { keyword: "دم", labelAr: "يوجد نزيف دموي", labelEn: "Bleeding wound", icon: "🩸" },
  { keyword: "حادث", labelAr: "تعرضت لحادث مروري", labelEn: "Vehicle accident", icon: "🚗" },
  { keyword: "شرطة", labelAr: "أحتاج تواجد الشرطة", labelEn: "Need police officer", icon: "🚔" },
  { keyword: "طبيب", labelAr: "أحتاج معاينة طبيب", labelEn: "Need medical doctor", icon: "👨‍⚕️" },
  { keyword: "دواء", labelAr: "أحتاج دوائي الخاص", labelEn: "Need my medication", icon: "💊" },
  { keyword: "اهلي", labelAr: "اتصل بأحد أفراد عائلتي", labelEn: "Call my family", icon: "👨‍👩‍👦" },
];

// Helper to generate natural language humanized text without AI if offline
export function generateNaturalTemplateMessage(params: {
  emergencyType: EmergencyType;
  bodyLocation?: BodyLocation;
  painLevel: number;
  abilityToSpeak: AbilityToSpeak;
  requestedHelp: RequestedHelp;
  symptoms?: string[];
}): { ar: string; en: string; headlineAr: string; headlineEn: string; responderAr: string; responderEn: string } {
  const typeMapAr: Record<EmergencyType, string> = {
    health: "وعكة صحية طارئة",
    injury: "إصابة جسدية",
    accident: "حادث مروري أو تصادم",
    unconscious: "فقدان وعي أو دوخة حادة",
    bleeding: "نزيف دموي",
    breathing: "صعوبة في التنفس",
    fire: "خطر حريق",
    danger: "تهديد أمني أو خطر داهم",
    other: "حالة طارئة غير محددة",
  };

  const typeMapEn: Record<EmergencyType, string> = {
    health: "an acute medical issue",
    injury: "a traumatic physical injury",
    accident: "an accident/collision",
    unconscious: "fainting or severe dizziness",
    bleeding: "active bleeding",
    breathing: "breathing distress",
    fire: "a fire emergency",
    danger: "a safety hazard / danger",
    other: "an urgent emergency",
  };

  const locationMapAr: Record<BodyLocation, string> = {
    head: "الرأس",
    chest: "منطقة الصدر",
    abdomen: "البطن",
    leg: "الساق",
    arm: "الذراع",
    hand: "اليد",
    foot: "القدم",
    other: "منطقة محددة من الجسم",
  };

  const locationMapEn: Record<BodyLocation, string> = {
    head: "the head",
    chest: "the chest area",
    abdomen: "the abdomen",
    leg: "the leg",
    arm: "the arm",
    hand: "the hand",
    foot: "the foot",
    other: "a specific body region",
  };

  const helpMapAr: Record<RequestedHelp, string> = {
    ambulance: "طلب سيارة إسعاف عاجلة فوراً",
    doctor: "معاينة طبيب مختص فوراً",
    police: "حضور الشرطة فوراً",
    fire: "حضور الدفاع المدني والإطفاء",
    family: "التواصل مع أحد أفراد العائلة المسجلين",
    call: "إجراء اتصال هاتفي لمساعدته",
    on_site_help: "مساعدة مباشرة في هذا الموقع",
  };

  const helpMapEn: Record<RequestedHelp, string> = {
    ambulance: "an immediate ambulance",
    doctor: "immediate evaluation by a medical doctor",
    police: "urgent police presence",
    fire: "fire rescue service",
    family: "contacting their designated emergency contact",
    call: "making an urgent phone call for them",
    on_site_help: "immediate assistance at this location",
  };

  const painDescAr =
    params.painLevel >= 8
      ? "ألم شديد جداً لا يطاق"
      : params.painLevel >= 6
      ? "ألم حاد ملحوظ"
      : params.painLevel >= 4
      ? "ألم متوسط"
      : params.painLevel > 0
      ? "ألم خفيف"
      : "بدون ألم مصاحب";

  const painDescEn =
    params.painLevel >= 8
      ? "extremely severe pain"
      : params.painLevel >= 6
      ? "sharp significant pain"
      : params.painLevel >= 4
      ? "moderate pain"
      : params.painLevel > 0
      ? "mild discomfort"
      : "no active pain reported";

  const speakDescAr =
    params.abilityToSpeak === "no"
      ? "الشخص أصم ولا يستطيع الكلام صوتياً، أرجو التواصل معه عبر هذه الشاشة أو الإشارة."
      : params.abilityToSpeak === "little"
      ? "الشخص يعاني من صعوبة بالغة في الكلام الصوتي."
      : "";

  const speakDescEn =
    params.abilityToSpeak === "no"
      ? "The person is deaf / non-verbal and cannot speak out loud; please interact using this screen or clear visual gestures."
      : params.abilityToSpeak === "little"
      ? "The person has significant difficulty speaking out loud."
      : "";

  const locTextAr = params.bodyLocation ? ` في ${locationMapAr[params.bodyLocation]}` : "";
  const locTextEn = params.bodyLocation ? ` affecting ${locationMapEn[params.bodyLocation]}` : "";

  const headlineAr = `🚨 حالة طارئة: ${typeMapAr[params.emergencyType]}`;
  const headlineEn = `🚨 Emergency: ${typeMapEn[params.emergencyType].toUpperCase()}`;

  const messageAr = `هذا الشخص يعاني من ${typeMapAr[params.emergencyType]}${locTextAr}، مع ${painDescAr} (مقياس ${params.painLevel}/10).
يحتاج إلى ${helpMapAr[params.requestedHelp]}.
${speakDescAr ? "\n" + speakDescAr : ""}`;

  const messageEn = `This individual is experiencing ${typeMapEn[params.emergencyType]}${locTextEn}, reporting ${painDescEn} (${params.painLevel}/10 on the pain scale).
Immediate requirement: ${helpMapEn[params.requestedHelp]}.
${speakDescEn ? "\n" + speakDescEn : ""}`;

  const responderAr = `• نوع الحالة: ${typeMapAr[params.emergencyType]}
• موضع الألم: ${params.bodyLocation ? locationMapAr[params.bodyLocation] : "غير محدد"}
• شدة الألم: ${params.painLevel}/10 (${painDescAr})
• القدرة على النطق: ${params.abilityToSpeak === "no" ? "غير قادر على الكلام (أصم/أبكم)" : params.abilityToSpeak === "little" ? "صعوبة في النطق" : "قادر"}
• التدخل المطلوب: ${helpMapAr[params.requestedHelp]}`;

  const responderEn = `• Incident: ${typeMapEn[params.emergencyType]}
• Anatomical site: ${params.bodyLocation ? locationMapEn[params.bodyLocation] : "Unspecified"}
• Pain intensity: ${params.painLevel}/10 (${painDescEn})
• Verbal capacity: ${params.abilityToSpeak === "no" ? "Non-verbal (Deaf/mute)" : params.abilityToSpeak === "little" ? "Limited" : "Verbal"}
• Requested intervention: ${helpMapEn[params.requestedHelp]}`;

  return {
    ar: messageAr,
    en: messageEn,
    headlineAr,
    headlineEn,
    responderAr,
    responderEn,
  };
}
