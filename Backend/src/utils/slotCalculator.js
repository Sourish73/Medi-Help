
const generateAvailableSlots = (
  shiftStart,
  shiftEnd,
  bookedSlots = [],
  slotDurationMinutes = 30
) => {
  const slotDurationMs = slotDurationMinutes * 60 * 1000;
  const availableSlots = [];

  //  Sort booked slots chronologically by start time 
  const sortedBooked = [...bookedSlots].sort(
    (a, b) => new Date(a.startTime) - new Date(b.startTime)
  );

  let currentPointer = new Date(shiftStart).getTime();
  const shiftEndTime = new Date(shiftEnd).getTime();

  let bookedIdx = 0;

  //  Iterate through shift hours step-by-step
  while (currentPointer + slotDurationMs <= shiftEndTime) {
    const nextSlotEnd = currentPointer + slotDurationMs;
    let hasConflict = false;

    // Check overlap against existing booked slots
    while (bookedIdx < sortedBooked.length) {
      const bookedStart = new Date(sortedBooked[bookedIdx].startTime).getTime();
      const bookedEnd = new Date(sortedBooked[bookedIdx].endTime).getTime();

      // If current booked slot is in the past relative to pointer, skip it
      if (bookedEnd <= currentPointer) {
        bookedIdx++;
        continue;
      }

      
      if (currentPointer < bookedEnd && nextSlotEnd > bookedStart) {
        hasConflict = true;
        // Jump currentPointer past the booked slot to prevent redundant checks
        currentPointer = bookedEnd;
        break;
      }

      // If candidate slot finishes before next booked slot starts, stop checking
      if (nextSlotEnd <= bookedStart) {
        break;
      }
    }


    if (!hasConflict) {
      availableSlots.push({
        startTime: new Date(currentPointer),
        endTime: new Date(nextSlotEnd),
      });

      currentPointer += slotDurationMs;
    }
  }

  return availableSlots;
};

module.exports = { generateAvailableSlots };