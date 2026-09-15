import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const PORT = 3000;
const app = express();

app.use(express.json());

// Lazy-initialize Gemini AI client
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Helper to call Gemini with model cascading and transient error handling
const CANDIDATE_MODELS = ["gemini-3.8-flash", "gemini-3.1-flash-lite", "gemini-flash-latest"];

async function generateContentResilient(
  ai: GoogleGenAI,
  options: {
    contents: string;
    systemInstruction?: string;
    responseMimeType?: string;
  }
): Promise<string> {
  let lastError: unknown = null;

  for (const modelName of CANDIDATE_MODELS) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: options.contents,
        config: {
          systemInstruction: options.systemInstruction,
          responseMimeType: options.responseMimeType,
        },
      });

      const text = response.text?.trim();
      if (text) {
        return text;
      }
    } catch (err: unknown) {
      lastError = err;
      const errMsg = err instanceof Error ? err.message : String(err);
      console.warn(`[Gemini Resilient] Model "${modelName}" busy or failed (${errMsg.substring(0, 100)}). Trying next candidate...`);
      // Brief pause to allow transient traffic spike to settle
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
  }

  throw lastError;
}

// Resilient server-side emergency message builder for offline/high-demand scenarios
function buildServerEmergencyMessage(params: {
  emergencyType?: string;
  bodyLocation?: string;
  painLevel?: number;
  abilityToSpeak?: string;
  requestedHelp?: string;
  language?: string;
}) {
  const isEn = params.language === "en";
  const typeMap: Record<string, { ar: string; en: string }> = {
    health: { ar: "وعكة صحية طارئة", en: "acute medical issue" },
    injury: { ar: "إصابة جسدية", en: "physical injury" },
    accident: { ar: "حادث مروري أو تصادم", en: "accident" },
    unconscious: { ar: "فقدان وعي أو دوخة حادة", en: "fainting or dizziness" },
    bleeding: { ar: "نزيف دموي نشط", en: "active bleeding" },
    breathing: { ar: "صعوبة وضيق في التنفس", en: "breathing difficulty" },
    fire: { ar: "خطر حريق", en: "fire hazard" },
    danger: { ar: "خطر أو تهديد داهم", en: "immediate danger" },
  };

  const locMap: Record<string, { ar: string; en: string }> = {
    head: { ar: "الرأس", en: "head" },
    chest: { ar: "الصدر", en: "chest" },
    abdomen: { ar: "البطن", en: "abdomen" },
    leg: { ar: "الساق", en: "leg" },
    arm: { ar: "الذراع", en: "arm" },
    hand: { ar: "اليد", en: "hand" },
    foot: { ar: "القدم", en: "foot" },
  };

  const helpMap: Record<string, { ar: string; en: string }> = {
    ambulance: { ar: "طلب سيارة إسعاف فوراً", en: "immediate ambulance" },
    doctor: { ar: "معاينة طبيب مختص", en: "doctor evaluation" },
    police: { ar: "حضور الشرطة فوراً", en: "police presence" },
    fire: { ar: "حضور الدفاع المدني والإطفاء", en: "fire rescue" },
    family: { ar: "الاتصال بالعائلة", en: "contacting family" },
    call: { ar: "إجراء اتصال هاتفي للمساعدة", en: "making an urgent call" },
    on_site_help: { ar: "مساعدة في هذا الموقع", en: "on-site assistance" },
  };

  const typeDesc = typeMap[params.emergencyType || ""] || {
    ar: params.emergencyType || "حالة طارئة",
    en: params.emergencyType || "emergency",
  };
  const locDesc = locMap[params.bodyLocation || ""] || {
    ar: params.bodyLocation || "منطقة بالجسم",
    en: params.bodyLocation || "affected area",
  };
  const helpDesc = helpMap[params.requestedHelp || ""] || {
    ar: params.requestedHelp || "طلب مساعدة عاجلة",
    en: params.requestedHelp || "urgent assistance",
  };
  const pain = params.painLevel ?? 5;

  if (isEn) {
    return {
      headline: `🚨 Emergency: ${typeDesc.en.toUpperCase()}`,
      publicMessage: `URGENT: I am deaf / non-verbal and experiencing an emergency: ${typeDesc.en} affecting my ${locDesc.en}. Pain severity is ${pain}/10. I urgently need ${helpDesc.en}. Please communicate with me in writing or by pointing.`,
      responderSummary: `• Type: ${typeDesc.en}\n• Location: ${locDesc.en}\n• Pain Level: ${pain}/10\n• Speech: Cannot speak clearly\n• Immediate Need: ${helpDesc.en}`,
    };
  }

  return {
    headline: `🚨 حالة طوارئ: ${typeDesc.ar}`,
    publicMessage: `عاجل: أنا شخص أصم / غير ناطق ولدي حالة طوارئ: ${typeDesc.ar} في منطقة ${locDesc.ar}. شدة الألم ${pain}/10. أحتاج إلى ${helpDesc.ar}. أرجو مساعدتي فوراً والتواصل معي عبر الكتابة أو الإشارة.`,
    responderSummary: `• نوع الحالة: ${typeDesc.ar}\n• المكان المصاب: ${locDesc.ar}\n• شدة الألم: ${pain}/10\n• النطق: لا أستطيع الكلام\n• المطلوب فوراً: ${helpDesc.ar}`,
  };
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", aiAvailable: Boolean(process.env.GEMINI_API_KEY) });
});

// AI Emergency message summarization & paramedic handoff
app.post("/api/gemini/summarize", async (req, res) => {
  const { emergencyType, bodyLocation, painLevel, symptoms, requestedHelp, abilityToSpeak, language = "ar" } = req.body;

  try {
    const ai = getAI();
    if (!ai) {
      const fallbackData = buildServerEmergencyMessage({
        emergencyType,
        bodyLocation,
        painLevel,
        abilityToSpeak,
        requestedHelp,
        language,
      });
      return res.status(200).json({
        success: true,
        fallback: true,
        data: fallbackData,
        message: "Gemini API key not configured, standard emergency message generated.",
      });
    }

    const systemInstruction = `You are a certified emergency triage communication assistant for deaf, hard-of-hearing, and non-verbal patients.
Your role: Convert structured emergency symptoms into an urgent, calm, highly readable, objective natural statement for bystanders, paramedics, and emergency responders.
Language: Provide the response in the requested language: "${language === "en" ? "English" : "Arabic"}".
STRICT MEDICAL RULE: DO NOT provide medical diagnoses or claim diseases (e.g. do not say "The patient is having a heart attack"). Instead state symptoms objectively: e.g. "The person is experiencing severe chest discomfort and difficulty breathing, requiring immediate medical evaluation."
Return a clean JSON object with:
- "headline": Short urgent title (e.g., "🚨 طوارئ: ألم شديد في الصدر")
- "publicMessage": Direct, respectful text for bystanders or hearing people nearby explaining the urgent need.
- "responderSummary": Quick technical bullet summary for paramedic/doctor handoff (e.g., location, pain severity, symptoms, requested service).`;

    const prompt = `Patient reported emergency:
- Emergency Type: ${emergencyType || "General Emergency"}
- Body Location: ${bodyLocation || "Not specified"}
- Symptoms: ${Array.isArray(symptoms) ? symptoms.join(", ") : symptoms || "Not specified"}
- Pain Level: ${painLevel ?? "Unknown"}/10
- Requested Immediate Help: ${requestedHelp || "Ambulance"}

Generate the JSON response.`;

    const rawText = await generateContentResilient(ai, {
      contents: prompt,
      systemInstruction,
      responseMimeType: "application/json",
    });

    try {
      const parsed = JSON.parse(rawText || "{}");
      if (parsed.publicMessage) {
        return res.json({ success: true, data: parsed });
      }
    } catch {
      // Fall through to fallback
    }

    // If parsing didn't return publicMessage, return built message
    const built = buildServerEmergencyMessage({ emergencyType, bodyLocation, painLevel, abilityToSpeak, requestedHelp, language });
    return res.json({ success: true, data: built });
  } catch (error) {
    console.warn("Notice: AI service currently under heavy load (503/temporary spike). Employing guaranteed template fallback.");
    const fallbackData = buildServerEmergencyMessage({
      emergencyType,
      bodyLocation,
      painLevel,
      abilityToSpeak,
      requestedHelp,
      language,
    });
    return res.status(200).json({
      success: true,
      fallback: true,
      data: fallbackData,
      note: "High AI traffic. Instant emergency template used safely.",
    });
  }
});

// AI text assistant / speech simplifier / quick suggestions
app.post("/api/gemini/assist", async (req, res) => {
  const { action, text, language = "ar" } = req.body;
  if (!text) {
    return res.status(200).json({ fallback: true, result: "" });
  }

  try {
    const ai = getAI();
    if (!ai) {
      return res.status(200).json({
        fallback: true,
        result: text.trim(),
        suggestions: ["نعم", "لا", "أحتاج مساعدة", "شكراً لك"],
      });
    }

    let systemInstruction = "";
    if (action === "simplify_speech") {
      systemInstruction = `A hearing person spoke to a deaf individual: "${text}".
Simplify their spoken phrase into clear, concise, easy-to-read bullet points or 1 direct sentence suitable for a person who cannot hear. Eliminate conversational filler.
Language: ${language === "en" ? "English" : "Arabic"}.`;
    } else if (action === "suggest_phrases") {
      systemInstruction = `The deaf user typed: "${text}".
Suggest 3-4 quick, urgent, or helpful completion phrases or matching icon tags.
Language: ${language === "en" ? "English" : "Arabic"}.
Return JSON array of strings: ["suggestion 1", "suggestion 2", ...]`;
    } else {
      systemInstruction = `Translate or polish this communication for maximum clarity: "${text}".
Language: ${language === "en" ? "English" : "Arabic"}.`;
    }

    const rawText = await generateContentResilient(ai, {
      contents: text,
      systemInstruction,
      responseMimeType: action === "suggest_phrases" ? "application/json" : "text/plain",
    });

    if (action === "suggest_phrases") {
      try {
        const suggestions = JSON.parse(rawText || "[]");
        return res.json({ success: true, suggestions });
      } catch {
        return res.json({
          success: true,
          suggestions: language === "en" ? ["Yes", "No", "Need help now", "Thank you"] : ["نعم", "لا", "أحتاج مساعدة فوراً", "شكراً لك"],
        });
      }
    }

    return res.json({ success: true, result: rawText });
  } catch (err) {
    console.warn("Notice: AI assist temporarily unavailable under load, returning simplified text.");
    // Return clean fallback
    if (action === "suggest_phrases") {
      return res.status(200).json({
        fallback: true,
        suggestions: language === "en" ? ["Yes", "No", "Please write it down", "Thank you"] : ["نعم", "لا", "أرجو أن تكتب لي", "شكراً لك"],
      });
    }
    return res.status(200).json({ fallback: true, result: text.trim() });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
