import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useMemo } from 'react';
import {
  FlatList,
  ListRenderItem,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ActiveBookingBanner } from '../components/ActiveBookingBanner';
import { ROOM_CARD_HEIGHT, RoomCard } from '../components/RoomCard';
import { RoomFilterBar } from '../components/RoomFilterBar';
import { RoomDetailNavProp } from '../navigation/types';
import { useBookingStore } from '../store/useBookingStore';
import { useFilterStore } from '../store/useFilterStore';
import { useUserStore } from '../store/useUserStore';
import { StudyRoom } from '../types';

export const RoomsScreen: React.FC = () => {
  const navigation = useNavigation<RoomDetailNavProp>();
  const { rooms, isRefreshing, refreshRooms, getActiveBooking } = useBookingStore();
  const { user } = useUserStore();
  const {
    searchQuery,
    selectedBuilding,
    minCapacity,
    selectedNoiseLevel,
    selectedAmenities,
    onlyAvailableNow,
  } = useFilterStore();

  const activeBooking = getActiveBooking(user.id);

  // Filter room list based on active filter store state
  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      // 1. Search query matching
      if (
        searchQuery.trim().length > 0 &&
        !room.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !room.building.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !room.description.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      // 2. Building location filter
      if (selectedBuilding !== 'All' && room.building !== selectedBuilding) {
        return false;
      }

      // 3. Capacity filter
      if (room.capacity < minCapacity) {
        return false;
      }

      // 4. Noise level filter
      if (selectedNoiseLevel !== 'All' && room.noiseLevel !== selectedNoiseLevel) {
        return false;
      }

      // 5. Amenities filter
      if (
        selectedAmenities.length > 0 &&
        !selectedAmenities.every((amenity) => room.amenities.includes(amenity))
      ) {
        return false;
      }

      // 6. Available now filter
      if (onlyAvailableNow) {
        const hasFreeSlot = room.slots.some((s) => !s.isBooked);
        if (!hasFreeSlot) return false;
      }

      return true;
    });
  }, [
    rooms,
    searchQuery,
    selectedBuilding,
    minCapacity,
    selectedNoiseLevel,
    selectedAmenities,
    onlyAvailableNow,
  ]);

  const handleRoomPress = useCallback(
    (room: StudyRoom) => {
      navigation.navigate('RoomDetail', { room });
    },
    [navigation]
  );

  // Memoized render item to prevent function re-creation on render
  const renderRoomItem: ListRenderItem<StudyRoom> = useCallback(
    ({ item }) => <RoomCard room={item} onPress={handleRoomPress} />,
    [handleRoomPress]
  );

  // getItemLayout calculates exact offset of items for instant 60fps scrolling
  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: ROOM_CARD_HEIGHT + 16,
      offset: (ROOM_CARD_HEIGHT + 16) * index,
      index,
    }),
    []
  );

  const keyExtractor = useCallback((item: StudyRoom) => item.id, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSub}>Campus Study Spaces</Text>
          <Text style={styles.headerTitle}>Find & Reserve Room</Text>
        </View>
        <View style={styles.userBadgeContainer}>
          <Text style={styles.userAvatarText}>{user.name.charAt(0)}</Text>
        </View>
      </View>

      {/* Filter Component */}
      <RoomFilterBar />

      {/* Active Booking Top Banner */}
      {activeBooking && (
        <ActiveBookingBanner
          booking={activeBooking}
          onPress={() => navigation.navigate('MainTabs' as any, { screen: 'MyBookings' })}
        />
      )}

      {/* Optimized FlatList */}
      <FlatList
        data={filteredRooms}
        renderItem={renderRoomItem}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        onRefresh={refreshRooms}
        refreshing={isRefreshing}
        initialNumToRender={5}
        maxToRenderPerBatch={8}
        windowSize={5}
        removeClippedSubviews={Platform.OS !== 'web'}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🏢</Text>
            <Text style={styles.emptyTitle}>No study rooms found</Text>
            <Text style={styles.emptySub}>
              Try adjusting your filter settings or search terms.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
  },
  headerSub: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },
  userBadgeContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userAvatarText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  listContainer: {
    paddingTop: 12,
    paddingBottom: 24,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#334155',
  },
  emptySub: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 6,
  },
});
