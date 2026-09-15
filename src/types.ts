export type Language = "ar" | "en";

export type TextSize = "normal" | "large" | "xlarge";

export interface AccessibilitySettings {
  highContrast: boolean;
  textSize: TextSize;
  visualAlerts: boolean;
  soundEnabled: boolean;
  screenReaderOptimized: boolean;
}

export type EmergencyType =
  | "health"
  | "injury"
  | "accident"
  | "unconscious"
  | "bleeding"
  | "breathing"
  | "fire"
  | "danger"
  | "other";

export type BodyLocation =
  | "head"
  | "chest"
  | "abdomen"
  | "leg"
  | "arm"
  | "hand"
  | "foot"
  | "other";

export type AbilityToSpeak = "yes" | "no" | "little";

export type RequestedHelp =
  | "ambulance"
  | "doctor"
  | "police"
  | "fire"
  | "family"
  | "call"
  | "on_site_help";

export interface EmergencySession {
  id: string;
  sessionCode: string;
  createdAt: string;
  emergencyType: EmergencyType;
  bodyLocation?: BodyLocation;
  symptoms: string[];
  painLevel: number;
  abilityToSpeak: AbilityToSpeak;
  requestedHelp: RequestedHelp;
  customNotes?: string;
  location?: {
    latitude: number;
    longitude: number;
    accuracy?: number;
    addressText?: string;
  };
  generatedMessage: {
    ar: string;
    en: string;
    headlineAr: string;
    headlineEn: string;
    responderSummaryAr?: string;
    responderSummaryEn?: string;
  };
}

export interface ChatMessage {
  id: string;
  sender: "deaf_user" | "hearing_person" | "system";
  text: string;
  timestamp: number;
  icon?: string;
  isEmergencyAlert?: boolean;
}

export interface EmergencyContact {
  name: string;
  phone: string;
  relation: string;
}

export interface UserProfile {
  id: string;
  name: string;
  language: Language;
  bloodType?: string;
  chronicConditions?: string;
  allergies?: string;
  emergencyContact?: EmergencyContact;
  countryCode: "SA" | "AE" | "KW" | "QA" | "EG" | "US" | "UK" | "INTL";
}
