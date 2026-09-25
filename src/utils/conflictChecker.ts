import { Booking, TimeSlot } from '../types';

// Convert "HH:mm" to minutes since midnight for robust comparison
export const timeToMinutes = (timeStr: string): number => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

/**
 * Checks if two time intervals overlap.
 * Interval 1: [start1, end1]
 * Interval 2: [start2, end2]
 */
export const isTimeOverlapping = (
  start1: string,
  end1: string,
  start2: string,
  end2: string
): boolean => {
  const s1 = timeToMinutes(start1);
  const e1 = timeToMinutes(end1);
  const s2 = timeToMinutes(start2);
  const e2 = timeToMinutes(end2);

  return s1 < e2 && e1 > s2;
};

/**
 * Check if booking a specific slot on a date conflicts with user's existing bookings.
 */
export const checkUserConflict = (
  existingBookings: Booking[],
  date: string,
  startTime: string,
  endTime: string,
  excludeBookingId?: string
): { hasConflict: boolean; conflictingBooking?: Booking } => {
  const activeBookings = existingBookings.filter(
    (b) => (b.status === 'confirmed' || b.status === 'active') && b.date === date && b.id !== excludeBookingId
  );

  for (const booking of activeBookings) {
    if (isTimeOverlapping(startTime, endTime, booking.startTime, booking.endTime)) {
      return { hasConflict: true, conflictingBooking: booking };
    }
  }

  return { hasConflict: false };
};

/**
 * Check if room slot is already occupied
 */
export const checkSlotAvailability = (slot: TimeSlot): boolean => {
  return !slot.isBooked;
};
