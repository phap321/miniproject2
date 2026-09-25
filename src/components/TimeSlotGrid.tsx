import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { TimeSlot } from '../types';

interface TimeSlotGridProps {
  slots: TimeSlot[];
  selectedSlotId: string | null;
  onSelectSlot: (slot: TimeSlot) => void;
  userConflictSlotIds?: string[]; // Slot IDs that would conflict with student's active schedule
}

export const TimeSlotGrid: React.FC<TimeSlotGridProps> = ({
  slots,
  selectedSlotId,
  onSelectSlot,
  userConflictSlotIds = [],
}) => {
  return (
    <View style={styles.gridContainer}>
      {slots.map((slot) => {
        const isSelected = selectedSlotId === slot.id;
        const isBooked = slot.isBooked;
        const hasUserScheduleConflict = userConflictSlotIds.includes(slot.id);

        let slotStyle = styles.slotAvailable;
        let textStyle = styles.textAvailable;
        let statusBadge = 'Available';

        if (isBooked) {
          slotStyle = styles.slotBooked;
          textStyle = styles.textBooked;
          statusBadge = 'Taken';
        } else if (hasUserScheduleConflict) {
          slotStyle = styles.slotConflict;
          textStyle = styles.textConflict;
          statusBadge = 'Schedule Conflict';
        } else if (isSelected) {
          slotStyle = styles.slotSelected;
          textStyle = styles.textSelected;
          statusBadge = 'Selected';
        }

        return (
          <TouchableOpacity
            key={slot.id}
            disabled={isBooked || hasUserScheduleConflict}
            activeOpacity={0.7}
            onPress={() => onSelectSlot(slot)}
            style={[styles.slotCard, slotStyle]}
          >
            <Text style={[styles.timeText, textStyle]}>
              {slot.startTime} - {slot.endTime}
            </Text>
            <Text style={[styles.statusText, textStyle]}>{statusBadge}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  slotCard: {
    width: '48%',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotAvailable: {
    backgroundColor: '#F8FAFC',
    borderColor: '#CBD5E1',
  },
  slotSelected: {
    backgroundColor: '#4F46E5',
    borderColor: '#4338CA',
  },
  slotBooked: {
    backgroundColor: '#F1F5F9',
    borderColor: '#E2E8F0',
    opacity: 0.6,
  },
  slotConflict: {
    backgroundColor: '#FFF1F2',
    borderColor: '#FECDD3',
  },
  timeText: {
    fontSize: 14,
    fontWeight: '700',
  },
  textAvailable: {
    color: '#1E293B',
  },
  textSelected: {
    color: '#FFFFFF',
  },
  textBooked: {
    color: '#94A3B8',
    textDecorationLine: 'line-through',
  },
  textConflict: {
    color: '#E11D48',
  },
  statusText: {
    fontSize: 11,
    marginTop: 2,
    fontWeight: '500',
  },
});
