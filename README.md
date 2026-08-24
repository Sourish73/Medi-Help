# Medi-Help

A next-generation healthcare scheduling platform featuring patient symptom intake, AI-driven pre-visit assessments, doctor leave conflict resolution, automated email notifications, and Google Calendar integration. Built with a sleek, light-yellow glassmorphism UI.

## Project Deliverables Reference
- **Hosted Frontend:** [https://medi-help-frontend.onrender.com](https://medi-help-frontend.onrender.com)
- **Hosted Backend API:** [https://medi-help-backend.onrender.com](https://medi-help-backend.onrender.com)
- **System Design Write-Up:** Available in [`SYSTEM_DESIGN.md`](./SYSTEM_DESIGN.md).
- **Environment Template:** Available in [`Backend/.env.example`](./Backend/.env.example).
- **Source Code Archive:** Built at `C:\Users\sinha\OneDrive\Documents\Desktop\Medi-Help.zip`.

---

## 1. Setup & Installation Guide

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas cluster (or local MongoDB community server)
- Groq API Key (for Qwen 3.6 27B model)

### Installation Steps

1. Clone the repository and navigate to the project directory:
   ```bash
   git clone https://github.com/Sourish73/Medi-Help.git
   cd Medi-Help
   ```

2. Configure backend environment:
   ```bash
   cd Backend
   cp .env.example .env
   ```
   Provide your specific database strings and API keys inside the newly created `.env` file.

3. Install dependencies and start servers:
   ```bash
   # In Backend directory
   npm install
   npm run dev

   # In Frontend directory (new terminal window)
   cd ../Frontend
   npm install
   npm run dev
   ```

4. Seed default doctor profiles and administrator credentials:
   ```bash
   # In Backend directory
   node src/seedDoctors.js
   node src/seedAdmin.js
   ```

---

## 2. Database Schema

The platform uses four MongoDB collections with strict Mongoose validation:

### User Collection
- `name` (String, required): Profile name.
- `email` (String, required, unique, lowercase): User email index.
- `password` (String, required, select: false): Bcrypt hashed password.
- `role` (String, enum: ['patient', 'doctor', 'admin']): User access control level.
- `phone` (String, required): Validated 10-digit number.

### DoctorProfile Collection
- `user` (ObjectId, ref: 'User', required): Links to user collection.
- `specialization` (String, required): Medical specialty area.
- `fees` (Number, required): Consultation fee amount.
- `experienceYears` (Number, required): Years of expertise.
- `workingHours` (Object): `{ start: "09:00", end: "17:00" }` format.
- `slotDurationMinutes` (Number, default: 30): Appointment block length.
- `leaveDays` (Array of Strings): Dates in YYYY-MM-DD format.
- `isAvailable` (Boolean, default: true): Temporary online/offline status flag.

### Slot Collection
- `doctor` (ObjectId, ref: 'User', required): Associated provider.
- `startTime` (Date, required): Beginning of appointment.
- `endTime` (Date, required): End of appointment.
- `status` (String, enum: ['AVAILABLE', 'LOCKED', 'BOOKED']): Scheduling states.
- `lockedBy` (ObjectId, ref: 'User'): Lock owner user reference.
- `lockedUntil` (Date): Timestamp when temporary hold expires.

### Appointment Collection
- `patient` (ObjectId, ref: 'User', required)
- `doctor` (ObjectId, ref: 'User', required)
- `slot` (ObjectId, ref: 'Slot', required)
- `amount` (Number, required): Booking cost value.
- `status` (String, enum: ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'])
- `paymentStatus` (String, enum: ['UNPAID', 'PAID'])
- `symptoms` (String): Intake symptoms text.
- `preVisitSummary` (Object): `{ urgency, chiefComplaint, suggestedQuestions }`
- `postVisitSummary` (String): Patient-friendly clinical breakdown.
- `clinicalNotes` (String): Professional notes from the doctor.
- `prescription` (String): Medication guidelines.
- `calendarEventId` (String): Google Calendar tracking ID reference.

---

## 3. LLM Prompts Configuration

The platform utilizes Groq's open model infrastructure to handle natural language processing:

### Pre-Visit Symptom Summary Prompt
- **Trigger:** Initiated during the check-out transaction.
- **Model:** `qwen/qwen3.6-27b`
- **System Prompt:**
  ```text
  Analyse these symptoms and return a JSON object with: urgency level (Low / Medium / High), chief complaint, and three suggested questions for the doctor. Symptoms: <symptoms>
  ```

### Post-Visit Patient-Friendly Summary Prompt
- **Trigger:** Submitted when a doctor completes a session.
- **Model:** `qwen/qwen3.6-27b`
- **System Prompt:**
  ```text
  Convert these clinical notes into a patient-friendly summary with medication schedule and follow-up steps: <notes>
  ```

---

## 4. Google Calendar API OAuth Setup Steps

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

## 5. API Documentation

### Auth Module
- `POST /api/auth/register` - Create user / doctor profiles.
- `POST /api/auth/login` - Authenticate account and retrieve JWT tokens.

### Scheduling Module
- `GET /api/appointments/available-slots/:doctorId?date=YYYY-MM-DD` - Query unbooked slots.
- `POST /api/appointments/book` - Place a 15-minute lock hold on a slot.
- `GET /api/appointments/patient` - List patient appointments.
- `GET /api/appointments/doctor` - List doctor appointments.
- `PATCH /api/appointments/:id/cancel` - Cancel appointment and release the slot.
- `PATCH /api/appointments/:id/complete` - Mark complete, add clinical notes, and generate AI patient summaries.

### Admin Module
- `POST /api/doctors/admin` - Register a new doctor.
- `PUT /api/doctors/admin/:id` - Update working hours, slot durations, and leave dates.
- `GET /api/doctors/admin/list` - List registered doctors.
- `DELETE /api/doctors/admin/:id` - Delete doctor profile.