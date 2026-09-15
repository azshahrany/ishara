import { AccessibilitySettings, EmergencySession, ChatMessage, UserProfile, Language } from "../types";

const STORAGE_KEYS = {
  SETTINGS: "ishara_accessibility_settings",
  USER_PROFILE: "ishara_user_profile",
  EMERGENCY_SESSIONS: "ishara_emergency_sessions",
  CHAT_MESSAGES: "ishara_chat_messages",
  LANGUAGE: "ishara_language",
};

export const DEFAULT_ACCESSIBILITY: AccessibilitySettings = {
  highContrast: false,
  textSize: "normal",
  visualAlerts: true,
  soundEnabled: true,
  screenReaderOptimized: false,
};

export const DEFAULT_USER_PROFILE: UserProfile = {
  id: "user_default",
  name: "المستخدم",
  language: "ar",
  bloodType: "O+",
  chronicConditions: "",
  allergies: "",
  emergencyContact: {
    name: "جهة الاتصال في الطوارئ",
    phone: "997",
    relation: "العائلة",
  },
  countryCode: "SA",
};

export function loadStoredLanguage(): Language {
  if (typeof window === "undefined") return "ar";
  const val = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
  return val === "en" ? "en" : "ar";
}

export function saveStoredLanguage(lang: Language): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
}

export function loadAccessibilitySettings(): AccessibilitySettings {
  if (typeof window === "undefined") return DEFAULT_ACCESSIBILITY;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) return DEFAULT_ACCESSIBILITY;
    return { ...DEFAULT_ACCESSIBILITY, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_ACCESSIBILITY;
  }
}

export function saveAccessibilitySettings(settings: AccessibilitySettings): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

export function loadUserProfile(): UserProfile {
  if (typeof window === "undefined") return DEFAULT_USER_PROFILE;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    if (!raw) return DEFAULT_USER_PROFILE;
    return { ...DEFAULT_USER_PROFILE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_USER_PROFILE;
  }
}

export function saveUserProfile(profile: UserProfile): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
}

export function saveEmergencySession(session: EmergencySession): void {
  if (typeof window === "undefined") return;
  try {
    const sessions = loadEmergencySessions();
    const updated = [session, ...sessions.filter((s) => s.id !== session.id)].slice(0, 10);
    localStorage.setItem(STORAGE_KEYS.EMERGENCY_SESSIONS, JSON.stringify(updated));
  } catch (err) {
    console.warn("Error saving emergency session:", err);
  }
}

export function loadEmergencySessions(): EmergencySession[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EMERGENCY_SESSIONS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveChatMessages(messages: ChatMessage[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS.CHAT_MESSAGES, JSON.stringify(messages.slice(-50)));
  } catch (err) {
    console.warn("Error saving chat:", err);
  }
}

export function loadChatMessages(): ChatMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CHAT_MESSAGES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
