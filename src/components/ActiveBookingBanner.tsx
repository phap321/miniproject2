import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Booking } from '../types';

interface ActiveBookingBannerProps {
  booking: Booking;
  onPress: () => void;
}

export const ActiveBookingBanner: React.FC<ActiveBookingBannerProps> = ({
  booking,
  onPress,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={styles.container}
    >
      <View style={styles.leftBadge}>
        <Text style={styles.pulseDot}>🟢</Text>
        <Text style={styles.badgeText}>Active Reservation</Text>
      </View>

      <View style={styles.detailsRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.roomTitle} numberOfLines={1}>
            {booking.roomName}
          </Text>
          <Text style={styles.timeSubtext}>
            {booking.building} • {booking.startTime} - {booking.endTime}
          </Text>
        </View>

        <View style={styles.viewPassButton}>
          <Text style={styles.viewPassText}>View Pass →</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#312E81',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    borderRadius: 14,
    padding: 14,
    shadowColor: '#312E81',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  leftBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  pulseDot: {
    fontSize: 10,
    marginRight: 6,
  },
  badgeText: {
    color: '#A5B4FC',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  roomTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  timeSubtext: {
    color: '#C7D2FE',
    fontSize: 12,
    marginTop: 2,
  },
  viewPassButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginLeft: 10,
  },
  viewPassText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
