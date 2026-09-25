import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useMemo, useState } from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { TimeSlotGrid } from '../components/TimeSlotGrid';
import { RootStackParamList } from '../navigation/types';
import { useBookingStore } from '../store/useBookingStore';
import { useFilterStore } from '../store/useFilterStore';
import { useUserStore } from '../store/useUserStore';
import { TimeSlot } from '../types';
import { checkUserConflict } from '../utils/conflictChecker';

type RoomDetailRouteProp = RouteProp<RootStackParamList, 'RoomDetail'>;

export const RoomDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RoomDetailRouteProp>();
  const { room } = route.params;

  const { selectedDate } = useFilterStore();
  const { user } = useUserStore();
  const { bookings, bookRoomSlot, getRoomById } = useBookingStore();

  const currentRoom = getRoomById(room.id) || room;
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Compute which slots in this room conflict with student's active schedule on selectedDate
  const userConflictSlotIds = useMemo(() => {
    return currentRoom.slots
      .filter((slot) => !slot.isBooked)
      .filter((slot) => {
        const { hasConflict } = checkUserConflict(
          bookings,
          selectedDate,
          slot.startTime,
          slot.endTime
        );
        return hasConflict;
      })
      .map((slot) => slot.id);
  }, [currentRoom.slots, bookings, selectedDate]);

  const handleBookSlot = async () => {
    if (!selectedSlot) {
      Alert.alert('Select Time Slot', 'Please select an available time slot to continue.');
      return;
    }

    setIsSubmitting(true);
    const result = await bookRoomSlot(currentRoom, selectedSlot, selectedDate, {
      id: user.id,
      name: user.name,
    });
    setIsSubmitting(false);

    if (result.success) {
      Alert.alert('🎉 Reservation Confirmed!', result.message, [
        {
          text: 'View My Bookings',
          onPress: () => {
            navigation.navigate('MainTabs' as never);
          },
        },
      ]);
    } else {
      Alert.alert('⚠️ Cannot Book Slot', result.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {currentRoom.name}
        </Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Hero Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: currentRoom.imageUrl }} style={styles.heroImage} />
          <View style={styles.ratingFloatingBadge}>
            <Text style={styles.starText}>★</Text>
            <Text style={styles.ratingNumber}>{currentRoom.rating.toFixed(1)}</Text>
          </View>
        </View>

        {/* Room Header Info */}
        <View style={styles.section}>
          <Text style={styles.buildingTag}>{currentRoom.building} • Floor {currentRoom.floor}</Text>
          <Text style={styles.titleText}>{currentRoom.name}</Text>
          <Text style={styles.descriptionText}>{currentRoom.description}</Text>

          {/* Quick Info Grid */}
          <View style={styles.quickInfoGrid}>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Capacity</Text>
              <Text style={styles.infoValue}>👥 {currentRoom.capacity} People</Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Noise Level</Text>
              <Text style={styles.infoValue}>🔊 {currentRoom.noiseLevel}</Text>
            </View>
          </View>
        </View>

        {/* Amenities Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Room Amenities</Text>
          <View style={styles.amenitiesWrap}>
            {currentRoom.amenities.map((amenity, idx) => (
              <View key={idx} style={styles.amenityBadge}>
                <Text style={styles.amenityBadgeText}>✓ {amenity}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Time Slot Picker Section */}
        <View style={styles.section}>
          <View style={styles.slotHeaderRow}>
            <Text style={styles.sectionTitle}>Select Time Slot</Text>
            <Text style={styles.dateLabel}>Date: {selectedDate}</Text>
          </View>

          {userConflictSlotIds.length > 0 && (
            <View style={styles.conflictAlertBox}>
              <Text style={styles.conflictAlertText}>
                ⚠️ Slots highlighted in red conflict with your existing active bookings.
              </Text>
            </View>
          )}

          <TimeSlotGrid
            slots={currentRoom.slots}
            selectedSlotId={selectedSlot?.id || null}
            onSelectSlot={setSelectedSlot}
            userConflictSlotIds={userConflictSlotIds}
          />
        </View>
      </ScrollView>

      {/* Bottom Sticky Action Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.selectedSlotSummary}>
          <Text style={styles.summaryLabel}>Selected Slot:</Text>
          <Text style={styles.summaryTime}>
            {selectedSlot ? `${selectedSlot.startTime} - ${selectedSlot.endTime}` : 'None'}
          </Text>
        </View>

        <TouchableOpacity
          disabled={!selectedSlot || isSubmitting}
          style={[styles.confirmButton, (!selectedSlot || isSubmitting) && styles.disabledButton]}
          onPress={handleBookSlot}
        >
          <Text style={styles.confirmButtonText}>
            {isSubmitting ? 'Confirming...' : 'Confirm Booking'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backButton: {
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  backButtonText: {
    color: '#4F46E5',
    fontSize: 15,
    fontWeight: '700',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
    textAlign: 'center',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  imageContainer: {
    height: 220,
    width: '100%',
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  ratingFloatingBadge: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  starText: {
    color: '#F59E0B',
    fontSize: 14,
    marginRight: 4,
  },
  ratingNumber: {
    fontWeight: '700',
    fontSize: 14,
    color: '#0F172A',
  },
  section: {
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  buildingTag: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6366F1',
    textTransform: 'uppercase',
  },
  titleText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 2,
  },
  descriptionText: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 8,
    lineHeight: 20,
  },
  quickInfoGrid: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 12,
  },
  infoBox: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  infoLabel: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  amenitiesWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  amenityBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  amenityBadgeText: {
    color: '#4338CA',
    fontSize: 13,
    fontWeight: '600',
  },
  slotHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  dateLabel: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
  },
  conflictAlertBox: {
    backgroundColor: '#FFF1F2',
    borderColor: '#FECDD3',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },
  conflictAlertText: {
    color: '#9F1239',
    fontSize: 12,
    lineHeight: 16,
  },
  bottomBar: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedSlotSummary: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 11,
    color: '#64748B',
  },
  summaryTime: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  confirmButton: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 12,
  },
  disabledButton: {
    backgroundColor: '#94A3B8',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
});
