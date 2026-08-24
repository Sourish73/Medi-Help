# 🏥 Medi-Help

<p align="center">
  <img src="https://img.shields.io/badge/status-active-success.svg" alt="Status" />
  <img src="https://img.shields.io/badge/platform-node--js-orange.svg" alt="Platform" />
  <img src="https://img.shields.io/badge/frontend-react--vite-yellow.svg" alt="Frontend" />
  <img src="https://img.shields.io/badge/database-mongodb-green.svg" alt="Database" />
  <img src="https://img.shields.io/badge/ai--integration-groq-blue.svg" alt="AI Integration" />
</p>

---

### 🔗 Live Hosted Application: [https://medi-help-frontend.onrender.com](https://medi-help-frontend.onrender.com)
### 🔗 Live API Backend: [https://medi-help-backend.onrender.com](https://medi-help-backend.onrender.com)

A next-generation healthcare scheduling platform featuring patient symptom intake, AI-driven pre-visit assessments, doctor leave conflict resolution, automated email notifications, and Google Calendar integration. Built with a sleek, light-yellow glassmorphism UI.

---

## ⚡ Core Highlights

*   **Double-Booking Prevention:** Atomic locking mechanism using MongoDB `findOneAndUpdate` to prevent slot conflicts under high concurrency.
*   **Leave Management:** Automated cancellation, slot release, and patient email alerts when doctors register leave.
*   **AI-Intake Summaries:** Pre-visit symptom assessments (determining urgency levels and chief complaints) and post-visit patient-friendly summaries powered by Groq (Qwen 3.6 27B).
*   **Medication Reminders:** Background cron utility scanning completed prescriptions to issue recurring emails.
*   **Google Calendar Sync:** Automated event mapping via OAuth 2.0.

---

## 🛠️ Getting Started & Setup

### ⚙️ Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas cluster (or local MongoDB community server)
- Groq API Key (for Qwen 3.6 27B model)

### 📂 Installation Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Sourish73/Medi-Help.git
   cd Medi-Help
   ```

2. **Configure backend environment:**
   ```bash
   cd Backend
   cp .env.example .env
   ```
   Provide your specific database strings and API keys inside the newly created `.env` file.

3. **Install dependencies and start servers:**
   ```bash
   # In Backend directory
   npm install
   npm run dev

   # In Frontend directory (new terminal window)
   cd ../Frontend
   npm install
   npm run dev
   ```

4. **Seed default data:**
   ```bash
   # In Backend directory
   node src/seedDoctors.js
   node src/seedAdmin.js
   ```

---

## 📅 Google Calendar API OAuth Setup

To link appointments to Google Calendar events for both doctors and patients, follow these steps:

1. **Create developer project:** Go to the [Google Cloud Console](https://console.cloud.google.com/) and create a new project.
2. **Enable APIs:** Search for and enable the **Google Calendar API**.
3. **Configure OAuth Consent Screen:**
   * Select User Type: **External**.
   * Add test user email addresses (only added emails can authorize under developer test status).
   * Request scopes: `../auth/calendar` and `../auth/calendar.events`.
4. **Create OAuth 2.0 Credentials:**
   * Create Credentials -> **OAuth Client ID**.
   * Set Application Type: **Web Application**.
   * Add Authorized Redirect URI: `https://developers.google.com/oauthplayground`.
   * Save Client ID and Client Secret.
5. **Generate Refresh Token:**
   * Open the [Google OAuth Playground](https://developers.google.com/oauthplayground).
   * Enter your Client ID and Client Secret in Settings.
   * Authorize Google Calendar scopes.
   * Exchange the authorization code to retrieve your permanent `GOOGLE_REFRESH_TOKEN`.
6. **Populate `.env` file:** Copy values to `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `GOOGLE_REFRESH_TOKEN` variables.

---

## 🧩 Database Schema

The platform uses four MongoDB collections with strict Mongoose validation:

| Collection | Key Fields | Purpose |
| :--- | :--- | :--- |
| **User** | `name`, `email`, `password`, `role`, `phone` | Authentication & role-based profiles |
| **DoctorProfile** | `user`, `specialization`, `fees`, `experienceYears`, `workingHours`, `slotDurationMinutes`, `leaveDays`, `isAvailable` | Stores scheduling metrics & leaves |
| **Slot** | `doctor`, `startTime`, `endTime`, `status`, `lockedBy`, `lockedUntil` | Coordinates atomicity & lock states |
| **Appointment** | `patient`, `doctor`, `slot`, `amount`, `status`, `paymentStatus`, `symptoms`, `preVisitSummary`, `postVisitSummary`, `clinicalNotes`, `prescription`, `calendarEventId` | Connects bookings and AI-summaries |

---

## 🤖 LLM Prompts Configuration

The platform utilizes Groq's open model infrastructure to handle natural language processing:

### Pre-Visit Symptom Summary Prompt
- **Trigger:** Initiated during the check-out transaction.
- **Model:** `qwen/qwen3.6-27b`
- **Prompt Structure:**
  > "Analyse these symptoms and return a JSON object with: urgency level (Low / Medium / High), chief complaint, and three suggested questions for the doctor. Symptoms: `<symptoms>`"

### Post-Visit Patient-Friendly Summary Prompt
- **Trigger:** Submitted when a doctor completes a session.
- **Model:** `qwen/qwen3.6-27b`
- **Prompt Structure:**
  > "Convert these clinical notes into a patient-friendly summary with medication schedule and follow-up steps: `<notes>`"

---

## 📡 API Documentation

| Module | Method & Endpoint | Description |
| :--- | :--- | :--- |
| **Auth** | `POST /api/auth/register` | Create user or doctor account profiles |
| **Auth** | `POST /api/auth/login` | Authenticate account & retrieve JWT token |
| **Scheduling** | `GET /api/appointments/available-slots/:doctorId?date=YYYY-MM-DD` | Query list of unbooked doctor slots |
| **Scheduling** | `POST /api/appointments/book` | Place a 15-minute lock hold on slot and register booking |
| **Scheduling** | `GET /api/appointments/patient` | Retrieve logged-in patient bookings |
| **Scheduling** | `GET /api/appointments/doctor` | Retrieve logged-in doctor appointments |
| **Scheduling** | `PATCH /api/appointments/:id/cancel` | Cancel booking and release the slot |
| **Scheduling** | `PATCH /api/appointments/:id/complete` | Close appointment, write prescriptions & trigger AI post-summary |
| **Admin** | `POST /api/doctors/admin` | Register a new doctor account |
| **Admin** | `PUT /api/doctors/admin/:id` | Update doctor specialties, slot details & leaves |
| **Admin** | `GET /api/doctors/admin/list` | List all doctors in system |
| **Admin** | `DELETE /api/doctors/admin/:id` | Remove doctor profile |