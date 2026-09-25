import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useBookingStore } from '../store/useBookingStore';
import { useUserStore } from '../store/useUserStore';
import { Booking } from '../types';

export const MyBookingsScreen: React.FC = () => {
  const { user } = useUserStore();
  const { getUserBookings, cancelBooking } = useBookingStore();
  const bookings = getUserBookings(user.id);

  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
  const [selectedPass, setSelectedPass] = useState<Booking | null>(null);

  const activeBookings = bookings.filter((b) => b.status === 'confirmed' || b.status === 'active');
  const historyBookings = bookings.filter((b) => b.status === 'completed' || b.status === 'cancelled');

  const displayedList = activeTab === 'active' ? activeBookings : historyBookings;

  const handleCancel = (booking: Booking) => {
    Alert.alert(
      'Cancel Reservation?',
      `Are you sure you want to cancel your reservation for ${booking.roomName} on ${booking.date} (${booking.startTime} - ${booking.endTime})?`,
      [
        { text: 'Keep Reservation', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            const res = await cancelBooking(booking.id);
            if (res.success) {
              Alert.alert('Cancelled', res.message);
            }
          },
        },
      ]
    );
  };

  const renderBookingItem = ({ item }: { item: Booking }) => {
    const isCancelled = item.status === 'cancelled';

    return (
      <View style={styles.cardContainer}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.roomName}>{item.roomName}</Text>
            <Text style={styles.buildingSub}>
              {item.building} • Floor {item.floor}
            </Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              isCancelled ? styles.statusCancelled : styles.statusActive,
            ]}
          >
            <Text
              style={[
                styles.statusBadgeText,
                isCancelled ? styles.statusTextCancelled : styles.statusTextActive,
              ]}
            >
              {item.status.toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.cardBody}>
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>📅</Text>
            <Text style={styles.infoText}>Date: {item.date}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>⏰</Text>
            <Text style={styles.infoText}>
              Time Slot: {item.startTime} - {item.endTime}
            </Text>
          </View>
        </View>

        {!isCancelled && (
          <View style={styles.cardFooter}>
            <TouchableOpacity
              style={styles.passButton}
              onPress={() => setSelectedPass(item)}
            >
              <Text style={styles.passButtonText}>🎫 Digital Pass</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => handleCancel(item)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Reservations</Text>
      </View>

      {/* Segmented Control Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'active' && styles.tabItemActive]}
          onPress={() => setActiveTab('active')}
        >
          <Text style={[styles.tabText, activeTab === 'active' && styles.tabTextActive]}>
            Upcoming & Active ({activeBookings.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'history' && styles.tabItemActive]}
          onPress={() => setActiveTab('history')}
        >
          <Text style={[styles.tabText, activeTab === 'history' && styles.tabTextActive]}>
            History ({historyBookings.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Bookings List */}
      <FlatList
        data={displayedList}
        renderItem={renderBookingItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📅</Text>
            <Text style={styles.emptyTitle}>No reservations found</Text>
            <Text style={styles.emptySub}>
              {activeTab === 'active'
                ? 'You do not have any active room bookings at the moment.'
                : 'No past or cancelled booking history.'}
            </Text>
          </View>
        }
      />

      {/* Digital Access Pass Modal */}
      <Modal visible={!!selectedPass} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.passCard}>
            <Text style={styles.passHeaderTag}>STUDY ROOM DIGITAL ACCESS PASS</Text>
            <Text style={styles.passRoomTitle}>{selectedPass?.roomName}</Text>
            <Text style={styles.passBuilding}>{selectedPass?.building}</Text>

            <View style={styles.passDivider} />

            <View style={styles.passDetailsGrid}>
              <View>
                <Text style={styles.passLabel}>STUDENT</Text>
                <Text style={styles.passVal}>{user.name}</Text>
              </View>
              <View>
                <Text style={styles.passLabel}>ID</Text>
                <Text style={styles.passVal}>{user.studentId}</Text>
              </View>
            </View>

            <View style={[styles.passDetailsGrid, { marginTop: 12 }]}>
              <View>
                <Text style={styles.passLabel}>DATE</Text>
                <Text style={styles.passVal}>{selectedPass?.date}</Text>
              </View>
              <View>
                <Text style={styles.passLabel}>TIME</Text>
                <Text style={styles.passVal}>
                  {selectedPass?.startTime} - {selectedPass?.endTime}
                </Text>
              </View>
            </View>

            {/* Simulated QR Code Graphic */}
            <View style={styles.qrContainer}>
              <View style={styles.qrGraphic}>
                <Text style={styles.qrMockText}>[ SCAN AT DOOR SENSOR ]</Text>
                <Text style={styles.qrCodeHash}>PASS-{selectedPass?.id.slice(-6).toUpperCase()}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.closeModalBtn}
              onPress={() => setSelectedPass(null)}
            >
              <Text style={styles.closeModalText}>Close Pass</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingBottom: 10,
    gap: 8,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  tabItemActive: {
    backgroundColor: '#4F46E5',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  listContainer: {
    padding: 16,
  },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  roomName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },
  buildingSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusActive: {
    backgroundColor: '#DCFCE7',
  },
  statusCancelled: {
    backgroundColor: '#FEE2E2',
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  statusTextActive: {
    color: '#15803D',
  },
  statusTextCancelled: {
    color: '#B91C1C',
  },
  cardBody: {
    marginVertical: 6,
    gap: 6,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    marginRight: 8,
    fontSize: 14,
  },
  infoText: {
    fontSize: 13,
    color: '#334155',
    fontWeight: '500',
  },
  cardFooter: {
    flexDirection: 'row',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 10,
  },
  passButton: {
    flex: 1,
    backgroundColor: '#EEF2FF',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  passButtonText: {
    color: '#4F46E5',
    fontSize: 13,
    fontWeight: '700',
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFF1F2',
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#E11D48',
    fontSize: 13,
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
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

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  passCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  passHeaderTag: {
    fontSize: 10,
    fontWeight: '800',
    color: '#6366F1',
    letterSpacing: 1,
  },
  passRoomTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 6,
    textAlign: 'center',
  },
  passBuilding: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
  },
  passDivider: {
    height: 1,
    width: '100%',
    backgroundColor: '#E2E8F0',
    marginVertical: 16,
  },
  passDetailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  passLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
  },
  passVal: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 2,
  },
  qrContainer: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 20,
    marginVertical: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  qrGraphic: {
    alignItems: 'center',
  },
  qrMockText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    letterSpacing: 1,
  },
  qrCodeHash: {
    fontSize: 16,
    fontWeight: '800',
    color: '#4F46E5',
    marginTop: 8,
  },
  closeModalBtn: {
    backgroundColor: '#0F172A',
    width: '100%',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeModalText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
});
