import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { StudyRoom } from '../types';

export const ROOM_CARD_HEIGHT = 280; // Fixed height for FlatList getItemLayout optimization

interface RoomCardProps {
  room: StudyRoom;
  onPress: (room: StudyRoom) => void;
}

const RoomCardComponent: React.FC<RoomCardProps> = ({ room, onPress }) => {
  const availableSlotsCount = room.slots.filter((s) => !s.isBooked).length;

  const getNoiseBadgeColor = (noiseLevel: string) => {
    switch (noiseLevel) {
      case 'Silent':
        return { bg: '#DEF7EC', text: '#03543F' };
      case 'Quiet':
        return { bg: '#E1EFFE', text: '#1E40AF' };
      case 'Collaborative':
      default:
        return { bg: '#FCE8F3', text: '#99154B' };
    }
  };

  const noiseColors = getNoiseBadgeColor(room.noiseLevel);

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={() => onPress(room)}
      style={styles.cardContainer}
    >
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: room.imageUrl }}
          style={styles.roomImage}
          resizeMode="cover"
        />
        <View style={styles.buildingBadge}>
          <Text style={styles.buildingText}>{room.building}</Text>
        </View>
        <View style={styles.ratingBadge}>
          <Text style={styles.ratingStar}>★</Text>
          <Text style={styles.ratingText}>{room.rating.toFixed(1)}</Text>
        </View>
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.roomName} numberOfLines={1}>
            {room.name}
          </Text>
          <View style={[styles.noiseBadge, { backgroundColor: noiseColors.bg }]}>
            <Text style={[styles.noiseText, { color: noiseColors.text }]}>
              {room.noiseLevel}
            </Text>
          </View>
        </View>

        <Text style={styles.detailsRow} numberOfLines={1}>
          Floor {room.floor} • Capacity: {room.capacity} seats
        </Text>

        <View style={styles.amenitiesContainer}>
          {room.amenities.slice(0, 3).map((amenity, idx) => (
            <View key={idx} style={styles.amenityChip}>
              <Text style={styles.amenityText}>{amenity}</Text>
            </View>
          ))}
          {room.amenities.length > 3 && (
            <Text style={styles.moreAmenitiesText}>+{room.amenities.length - 3}</Text>
          )}
        </View>

        <View style={styles.footerRow}>
          <View style={styles.availabilityWrapper}>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: availableSlotsCount > 0 ? '#10B981' : '#EF4444' },
              ]}
            />
            <Text style={styles.availabilityText}>
              {availableSlotsCount > 0
                ? `${availableSlotsCount} slots available today`
                : 'Fully booked'}
            </Text>
          </View>

          <View style={styles.bookButtonChip}>
            <Text style={styles.bookButtonText}>Book Slot →</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Memoize RoomCard to prevent redundant re-renders during high-speed FlatList scrolling (60fps target)
export const RoomCard = React.memo(RoomCardComponent, (prevProps, nextProps) => {
  return (
    prevProps.room.id === nextProps.room.id &&
    prevProps.room.rating === nextProps.room.rating &&
    prevProps.room.isAvailableNow === nextProps.room.isAvailableNow &&
    prevProps.room.slots.filter((s) => !s.isBooked).length ===
      nextProps.room.slots.filter((s) => !s.isBooked).length
  );
});

const styles = StyleSheet.create({
  cardContainer: {
    height: ROOM_CARD_HEIGHT,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    overflow: 'hidden',
  },
  imageWrapper: {
    height: 130,
    width: '100%',
    position: 'relative',
    backgroundColor: '#E2E8F0',
  },
  roomImage: {
    width: '100%',
    height: '100%',
  },
  buildingBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  buildingText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  ratingBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingStar: {
    color: '#F59E0B',
    fontSize: 12,
    marginRight: 4,
  },
  ratingText: {
    color: '#0F172A',
    fontSize: 12,
    fontWeight: '700',
  },
  contentContainer: {
    padding: 14,
    flex: 1,
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  roomName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
    marginRight: 8,
  },
  noiseBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  noiseText: {
    fontSize: 11,
    fontWeight: '700',
  },
  detailsRow: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
    flexWrap: 'nowrap',
  },
  amenityChip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginRight: 6,
  },
  amenityText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '500',
  },
  moreAmenitiesText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  availabilityWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  availabilityText: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '600',
  },
  bookButtonChip: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
