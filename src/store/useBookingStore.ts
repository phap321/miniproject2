import { create } from 'zustand';
import { MOCK_ROOMS } from '../data/mockRooms';
import { Booking, StudyRoom, TimeSlot } from '../types';
import { checkUserConflict } from '../utils/conflictChecker';
import { cancelScheduledNotification, scheduleBookingReminder } from '../utils/notificationService';

interface BookingStoreState {
  rooms: StudyRoom[];
  bookings: Booking[];
  isRefreshing: boolean;
  
  // Actions
  bookRoomSlot: (
    room: StudyRoom,
    slot: TimeSlot,
    date: string,
    user: { id: string; name: string }
  ) => Promise<{ success: boolean; message: string; booking?: Booking }>;
  
  cancelBooking: (bookingId: string) => Promise<{ success: boolean; message: string }>;
  
  refreshRooms: () => Promise<void>;
  
  // Helpers
  getRoomById: (id: string) => StudyRoom | undefined;
  getUserBookings: (userId: string) => Booking[];
  getActiveBooking: (userId: string) => Booking | undefined;
}

export const useBookingStore = create<BookingStoreState>((set, get) => ({
  rooms: MOCK_ROOMS,
  bookings: [
    // Pre-populate with one active mock booking for immediate rich UI testing
    {
      id: 'book-sample-01',
      roomId: 'room-102',
      roomName: 'Collaborative Studio A',
      building: 'Main Library',
      floor: 2,
      date: new Date().toISOString().split('T')[0],
      startTime: '10:00',
      endTime: '11:00',
      slotId: 'slot-3',
      userId: 'usr_2026_089',
      userName: 'Alex Rivera',
      createdAt: new Date().toISOString(),
      status: 'confirmed',
    },
  ],
  isRefreshing: false,

  bookRoomSlot: async (room, slot, date, user) => {
    const { bookings, rooms } = get();

    // 1. Conflict Check: Check user schedule conflict
    const conflictResult = checkUserConflict(bookings, date, slot.startTime, slot.endTime);
    if (conflictResult.hasConflict && conflictResult.conflictingBooking) {
      return {
        success: false,
        message: `Conflict detected! You already have a reservation for ${conflictResult.conflictingBooking.roomName} at ${conflictResult.conflictingBooking.startTime} - ${conflictResult.conflictingBooking.endTime}.`,
      };
    }

    // 2. Room Slot Availability Check
    const currentRoom = rooms.find((r) => r.id === room.id);
    const targetSlot = currentRoom?.slots.find((s) => s.id === slot.id);

    if (!targetSlot || targetSlot.isBooked) {
      return {
        success: false,
        message: 'This time slot was just booked by another student. Please select another slot.',
      };
    }

    // 3. Schedule Local Notification Reminder
    const notificationId = await scheduleBookingReminder(
      room.name,
      room.building,
      slot.startTime
    );

    // 4. Create new booking record
    const newBooking: Booking = {
      id: `book-${Date.now()}`,
      roomId: room.id,
      roomName: room.name,
      building: room.building,
      floor: room.floor,
      date,
      startTime: slot.startTime,
      endTime: slot.endTime,
      slotId: slot.id,
      userId: user.id,
      userName: user.name,
      createdAt: new Date().toISOString(),
      status: 'confirmed',
      notificationId,
    };

    // 5. Update state atomically
    set((state) => ({
      bookings: [newBooking, ...state.bookings],
      rooms: state.rooms.map((r) => {
        if (r.id === room.id) {
          return {
            ...r,
            slots: r.slots.map((s) =>
              s.id === slot.id ? { ...s, isBooked: true, bookedBy: user.id } : s
            ),
          };
        }
        return r;
      }),
    }));

    return {
      success: true,
      message: `Reservation confirmed for ${room.name} from ${slot.startTime} to ${slot.endTime}!`,
      booking: newBooking,
    };
  },

  cancelBooking: async (bookingId) => {
    const { bookings } = get();
    const targetBooking = bookings.find((b) => b.id === bookingId);

    if (!targetBooking) {
      return { success: false, message: 'Booking not found.' };
    }

    // Cancel notification if scheduled
    if (targetBooking.notificationId) {
      await cancelScheduledNotification(targetBooking.notificationId);
    }

    set((state) => ({
      bookings: state.bookings.map((b) =>
        b.id === bookingId ? { ...b, status: 'cancelled' } : b
      ),
      rooms: state.rooms.map((r) => {
        if (r.id === targetBooking.roomId) {
          return {
            ...r,
            slots: r.slots.map((s) =>
              s.id === targetBooking.slotId
                ? { ...s, isBooked: false, bookedBy: undefined }
                : s
            ),
          };
        }
        return r;
      }),
    }));

    return { success: true, message: 'Booking cancelled successfully.' };
  },

  refreshRooms: async () => {
    set({ isRefreshing: true });
    // Simulate real-time mock data fetching delay (600ms)
    await new Promise((resolve) => setTimeout(resolve, 600));
    set({ isRefreshing: false });
  },

  getRoomById: (id) => get().rooms.find((r) => r.id === id),
  getUserBookings: (userId) => get().bookings.filter((b) => b.userId === userId),
  getActiveBooking: (userId) =>
    get().bookings.find(
      (b) => b.userId === userId && (b.status === 'confirmed' || b.status === 'active')
    ),
}));
