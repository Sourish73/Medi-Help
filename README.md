<div align="center">

  <!-- Animated Header Banner -->
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=1,2,3&height=220&section=header&text=Medi-Help&fontSize=70&fontColor=fff&animation=twinkling&fontAlignY=38&desc=Next-Gen%20AI-Powered%20Healthcare%20Scheduling%20Platform&descAlignY=60&descFontSize=20" width="100%"/>

  <!-- Typing SVG Subtitle -->
  <a href="https://git.io/typing-svg">
    <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=20&duration=3000&pause=1000&color=F59E0B&center=true&vCenter=true&width=650&lines=Atomic+Double-Booking+Prevention;AI-Driven+Symptom+Assessments+(Groq+%2B+Qwen);Seamless+Google+Calendar+Sync;Smart+Leave+Conflict+Resolution;Automated+Recurring+Medication+Reminders" alt="Typing SVG" />
  </a>

  <br/><br/>

  <!-- Badges / Status -->
  <p align="center">
    <img src="https://img.shields.io/badge/UI-Light_Yellow_Glassmorphism-FFFBEB?style=for-the-badge&logo=css3&logoColor=D97706" alt="UI Theme"/>
    <img src="https://img.shields.io/badge/AI_Engine-Qwen_3.6_27B_(Groq)-F97316?style=for-the-badge&logo=openai&logoColor=white" alt="AI Engine"/>
    <img src="https://img.shields.io/badge/Database-MongoDB_Atlas-00ED64?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB"/>
    <img src="https://img.shields.io/badge/Integrations-Google_Calendar_OAuth2-4285F4?style=for-the-badge&logo=googlecalendar&logoColor=white" alt="Google Calendar"/>
    <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="License"/>
  </p>

  <p align="center">
    <a href="#-core-features">Features</a> •
    <a href="#-system-architecture">Architecture</a> •
    <a href="#-quickstart">Quickstart</a> •
    <a href="#-api-endpoints">API Docs</a> •
    <a href="#-contributing">Contributing</a>
  </p>
</div>

<hr/>

## 🌟 Highlights & Core Features

<table>
  <tr>
    <td width="50%">
      <h3 align="center">⚡ Concurrency & Booking Safety</h3>
      <p>Uses atomic <code>findOneAndUpdate</code> operations to guarantee <b>zero double-bookings</b> under high-traffic appointment rushes with temporary 15-minute reservation hold locks.</p>
    </td>
    <td width="50%">
      <h3 align="center">🤖 AI Pre & Post-Visit Analysis</h3>
      <p>Instant patient symptom intake triaged via <b>Groq (Qwen 3.6 27B)</b> to calculate urgency ratings, chief complaints, and patient-friendly post-consult summaries.</p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3 align="center">📅 Smart Leave Auto-Reallocation</h3>
      <p>Automated slot clearance, immediate patient email notifications, and cancellation pipelines when doctors request scheduled leave.</p>
    </td>
    <td width="50%">
      <h3 align="center">🔔 Medication & Calendar Sync</h3>
      <p>Background cron jobs scan prescriptions to dispatch dosage reminders, mapped directly to patient and doctor Google Calendars via OAuth 2.0.</p>
    </td>
  </tr>
</table>

---

## 🛠️ Tech Stack & Ecosystem

<div align="center">
  <img src="https://skillicons.dev/icons?i=nodejs,express,mongodb,react,tailwind,jwt,postman,git,github" alt="Tech Stack" />
</div>

<br/>

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React, Tailwind CSS (Custom Light-Yellow Glassmorphism) |
| **Backend API** | Node.js, Express.js, JWT Authentication |
| **Database & Cache** | MongoDB (Atomic Transactions & Locks) |
| **AI / LLM** | Groq Cloud API (`qwen-2.5-32b` / `qwen-3.6-27b`) |
| **Integrations** | Google Calendar API (OAuth 2.0), NodeMailer (SMTP) |

---

## 🚀 Quickstart Guide

### Prerequisites
- [Node.js (v16+)](https://nodejs.org/)
- [MongoDB Atlas](https://www.mongodb.com/atlas) cluster or local URI
- [Groq API Key](https://console.groq.com/)

### 1. Clone & Set Environment
```bash
git clone [https://github.com/Sourish73/Medi-Help.git](https://github.com/Sourish73/Medi-Help.git)
cd Medi-Help/Backend
cp .env.example .env