# Ishara (إشارة) | Emergency & Daily Communication Platform for the Deaf and Hard of Hearing

An ultra-responsive Progressive Web App (PWA) designed to facilitate immediate, accessible communication for deaf, hard of hearing, and non-verbal individuals during critical emergencies and everyday interactions.

---

## 👥 Project Information

### 👥 Group
**Group 5**

### 👩‍💻 Team Members
- **Shahad Khalid**
- **Amal Al-Zahrani**
- **Bashayer Al-Sheibani**
- **Asayil Al-qahtani**
- **Abdulaziz Al-Shahrani**
- **Raghad Al-Otaibi**
- **Raghad Al-Anazi**

### 🎓 Training Program
**Vibe Coding Training Program**

### 🏫 Organization
**SDAIA Academy**

### 🔗 GitHub
[SDAIA Academy on GitHub](https://github.com/sdaia-academy)

---

## 🌟 Key Features

1. **Smart 5-Second Emergency Questionnaire:**
   - Rapidly communicates emergency type, affected body location, pain scale (0–10), speech ability, and requested assistance without typing.
2. **Official Emergency SOS Card with 4 Output Channels:**
   - **Text-to-Speech (TTS):** Clear, spoken audio broadcast in Arabic and English for responders and bystanders.
   - **Full-Screen Big Display Mode:** High-contrast, large-typography view readable from a distance.
   - **Live QR Code Generator:** Allows paramedics and first responders to scan the code with their smartphone camera to review the patient's condition on their own device.
   - **Paramedic Handoff Summary:** Structured clinical briefing for rapid triage and vital sign evaluation.
3. **Two-Way Communication Bridge:**
   - Split-screen interface: Deaf user panel (1-tap quick replies + text input) and Hearing person panel (Voice-to-Text mic 🎤).
   - Clear speaker turns and visual flash alerts for deaf users.
4. **Giant Visual Icon Board & Expression Builder:**
   - Large, high-contrast symbols for panic situations.
   - Compound condition builder (e.g., Chest + Pressure Pain + 8/10 + Left side) that constructs precise, grammatically sound emergency sentences.
5. **Direct Country Emergency Line Routing:**
   - Integrated hotlines for Saudi Arabia, UAE, Kuwait, Qatar, Egypt, United States, United Kingdom, and International lines.
6. **Adaptive AI Intelligence (Google Gemini 3.8 Flash):**
   - Natural language summarization and phrase simplification with guaranteed offline/high-demand template fallbacks.

---

## 🛠️ Tech Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Motion (`motion/react`), Lucide React.
- **Backend:** Express, Node.js, `@google/genai` SDK (Google Gemini 3.8 Flash & resilient fallback models).
- **Accessibility Standards:** WCAG AA compliance, High Contrast Mode, Dynamic Text Scaling, Visual Alerts, Progressive Web App (PWA) readiness, Web Speech API (Synthesis & Recognition).

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js (v18 or higher)
- npm, bun, or pnpm

### Installation and Setup

```bash
# 1. Clone the repository
git clone https://github.com/azshahrany/ishara-emergency-app.git
cd ishara-emergency-app

# 2. Install dependencies
npm install

# 3. Setup environment configuration
cp .env.example .env

# (Optional) Add your Gemini API key in .env:
# GEMINI_API_KEY=your_key_here

# 4. Start the development server
npm run dev
```

The application will be accessible at: `http://localhost:3000`

---

## 📦 Production Build

```bash
# Compile and package for production
npm run build

# Start the production server
npm start
```
