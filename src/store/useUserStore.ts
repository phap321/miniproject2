import { create } from 'zustand';
import { UserProfile } from '../types';

interface UserState {
  user: UserProfile;
  isLoggedIn: boolean;
  updateProfile: (updated: Partial<UserProfile>) => void;
  toggleNotifications: () => void;
  setReminderLeadMinutes: (mins: number) => void;
}

const DEFAULT_USER: UserProfile = {
  id: 'usr_2026_089',
  studentId: 'STU-2024-88912',
  name: 'Alex Rivera',
  email: 'alex.rivera@university.edu',
  department: 'Computer Science & Software Eng.',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  notificationsEnabled: true,
  reminderLeadMinutes: 15,
};

export const useUserStore = create<UserState>((set) => ({
  user: DEFAULT_USER,
  isLoggedIn: true,
  updateProfile: (updated) =>
    set((state) => ({
      user: { ...state.user, ...updated },
    })),
  toggleNotifications: () =>
    set((state) => ({
      user: { ...state.user, notificationsEnabled: !state.user.notificationsEnabled },
    })),
  setReminderLeadMinutes: (mins) =>
    set((state) => ({
      user: { ...state.user, reminderLeadMinutes: mins },
    })),
}));
