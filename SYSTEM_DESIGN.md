# Healthcare Appointment Platform System Design

This document details the architectural design and problem-solving strategies implemented in the Medi-Help platform for managing concurrency, leave conflicts, slot locking, and notification reliability.

---

## 1. Concurrency Control & Double-Booking Prevention

Preventing multiple patients from booking the same doctor slot at the same time is critical for system integrity. To solve this, the platform utilizes atomic database operations and strict state validation.

### Problem
In high-concurrency environments, a classic race condition occurs when two patients query the available slots list, find the same slot open, and click book at nearly the exact same time. A naive check-then-act database query structure would allow both requests to proceed, resulting in double-booking.

### Solution
Instead of checking availability first and saving the booking second, the platform uses MongoDB's atomic `findOneAndUpdate` operation:
- **Atomic Operations:** The query strictly matches `{ doctor, startTime, endTime, status: { $ne: 'BOOKED' } }`. The update atomically changes the status to `'LOCKED'` and sets a lock time.
- **Race Condition Resolution:** Since MongoDB processes operations on a single document sequentially, the first thread locks the document. The subsequent thread's query fails to match `status: { $ne: 'BOOKED' }` because the state has already changed, returning a database conflict response.
- **Unique Indexes:** A compound unique index on `{ doctor: 1, startTime: 1 }` is defined. This acts as a secondary safety guard at the database driver level, rejecting any concurrent inserts.

---

## 2. Doctor Leave Conflict Handling

Doctor availability can change due to leave, requiring a reliable conflict resolution mechanism that ensures patients are refunded and notified.

### Problem
When an admin marks a doctor on leave for a particular date, there may already be confirmed or pending appointments scheduled for that date. The system must find, cancel, and clear these appointments without leaving the database in an inconsistent state.

### Solution
When leave is registered in the doctor's profile:
- **Conflict Query:** The system queries all slots for the doctor starting on the leave date. Using the matching slot IDs, it retrieves all active appointments (`PENDING` or `CONFIRMED`).
- **Cascading Updates:** The system performs a batch update setting the appointment status to `'CANCELLED'` and the payment status to `'REFUNDED'`.
- **Slot Release:** The corresponding slot documents are reset back to `'AVAILABLE'`.
- **External Cleanup:** The platform initiates automated refunds, deletes the associated Google Calendar events, and sends urgent cancellation emails to patients.

---

## 3. Temporary Slot Hold Mechanism

A temporary hold mechanism protects slot inventory during the checkout process without allowing abandoned carts to block doctor schedules permanently.

### Solution
- **Transaction Hold:** When a patient initiates the booking, the slot status changes to `'LOCKED'` and is assigned a `lockedUntil` timestamp set to 15 minutes in the future.
- **Auto-Release via TTL:** A MongoDB TTL index is placed on the `lockedUntil` field. If the patient closes their browser or fails to complete payment, Mongoose automatically clears the lock.
- **Dynamic Slot Generation:** When calculating slot availability, any slot marked `'LOCKED'` where the `lockedUntil` timestamp is in the past is treated as `'AVAILABLE'`.

---

## 4. Notification & Calendar Sync Reliability

Integrations with third-party services (such as SMTP/Nodemailer and Google Calendar API) are prone to intermittent network failures, rate-limiting, or downtime.

### Solution
- **Graceful Third-Party Fallbacks:** All calls to external APIs are wrapped inside isolated `try-catch` blocks. A failure in sending an email or creating a calendar event will never throw an exception that interrupts the core booking or checkout database transaction.
- **Offline Log Queue:** When an email fails to send, the error is caught, logged, and queued. The backend periodically attempts to re-send failed notifications.
- **OAuth Resiliency:** The Google Calendar API requests use silent credential checks. If the OAuth tokens are invalid or expired, the system logs a mock event ID, allows the checkout to finish successfully, and flags the sync for administrator review.
