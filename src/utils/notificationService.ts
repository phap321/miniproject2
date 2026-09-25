import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification behavior when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const requestNotificationPermissions = async (): Promise<boolean> => {
  if (Platform.OS === 'web') {
    return false;
  }

  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      return false;
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('booking-reminders', {
        name: 'Room Booking Reminders',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#4F46E5',
      });
    }

    return true;
  } catch (error) {
    console.warn('Error requesting notification permissions:', error);
    return false;
  }
};

/**
 * Schedule local notification reminder for a study room booking
 */
export const scheduleBookingReminder = async (
  roomName: string,
  building: string,
  startTime: string,
  leadMinutes: number = 15
): Promise<string | undefined> => {
  try {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      console.log('Notification permission not granted, skipping schedule');
      return undefined;
    }

    // Schedule notification trigger
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: '🔔 Campus Study Room Reminder',
        body: `Your reservation for ${roomName} (${building}) starts at ${startTime}!`,
        data: { roomName, building, startTime },
        sound: true,
      },
      trigger: {
        seconds: 5, // Instant mock trigger for immediate user testing feedback
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      },
    });

    return id;
  } catch (error) {
    console.warn('Failed to schedule notification:', error);
    return undefined;
  }
};

/**
 * Cancel scheduled notification
 */
export const cancelScheduledNotification = async (notificationId: string): Promise<void> => {
  try {
    if (notificationId) {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    }
  } catch (error) {
    console.warn('Failed to cancel notification:', error);
  }
};
