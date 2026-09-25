import React from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useBookingStore } from '../store/useBookingStore';
import { useUserStore } from '../store/useUserStore';

export const ProfileScreen: React.FC = () => {
  const { user, toggleNotifications, setReminderLeadMinutes } = useUserStore();
  const { bookings } = useBookingStore();

  const activeCount = bookings.filter(
    (b) => b.userId === user.id && (b.status === 'confirmed' || b.status === 'active')
  ).length;

  const totalCount = bookings.filter((b) => b.userId === user.id).length;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.screenTitle}>Student Profile</Text>

        {/* Student ID Pass Card */}
        <View style={styles.idCard}>
          <View style={styles.idHeader}>
            <Text style={styles.uniName}>CAMPUS STUDY NETWORK</Text>
            <Text style={styles.cardType}>STUDENT IDENTIFICATION</Text>
          </View>

          <View style={styles.userRow}>
            <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
            <View style={styles.userMeta}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userDept}>{user.department}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
            </View>
          </View>

          <View style={styles.idFooter}>
            <View>
              <Text style={styles.idLabel}>STUDENT ID</Text>
              <Text style={styles.idValue}>{user.studentId}</Text>
            </View>
            <View style={styles.statusPill}>
              <Text style={styles.statusPillText}>ACTIVE SESSION</Text>
            </View>
          </View>
        </View>

        {/* Statistics Overview */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>{activeCount}</Text>
            <Text style={styles.statLabel}>Active Passes</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNum}>{totalCount}</Text>
            <Text style={styles.statLabel}>Total Bookings</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNum}>{totalCount * 2}h</Text>
            <Text style={styles.statLabel}>Study Hours</Text>
          </View>
        </View>

        {/* Local Notification Settings */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Notification Preferences</Text>

          <View style={styles.settingRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingTitle}>Booking Reminders</Text>
              <Text style={styles.settingDesc}>
                Receive local push notification before your time slot begins
              </Text>
            </View>
            <Switch
              value={user.notificationsEnabled}
              onValueChange={toggleNotifications}
              trackColor={{ false: '#CBD5E1', true: '#818CF8' }}
              thumbColor={user.notificationsEnabled ? '#4F46E5' : '#F1F5F9'}
            />
          </View>

          {user.notificationsEnabled && (
            <View style={{ marginTop: 14 }}>
              <Text style={styles.subSettingTitle}>Remind Me Before Slot:</Text>
              <View style={styles.leadTimeRow}>
                {[5, 15, 30].map((mins) => {
                  const isSelected = user.reminderLeadMinutes === mins;
                  return (
                    <TouchableOpacity
                      key={mins}
                      style={[styles.leadChip, isSelected && styles.leadChipSelected]}
                      onPress={() => setReminderLeadMinutes(mins)}
                    >
                      <Text
                        style={[
                          styles.leadChipText,
                          isSelected && styles.leadChipTextSelected,
                        ]}
                      >
                        {mins} minutes
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}
        </View>

        {/* App Info Footer */}
        <View style={styles.appFooter}>
          <Text style={styles.appVersionText}>Campus Study Room Booking App v1.0.0</Text>
          <Text style={styles.appSubText}>Built with React Native & Expo SDK • Zustand State</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 16,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 16,
  },
  idCard: {
    backgroundColor: '#1E1B4B',
    borderRadius: 18,
    padding: 20,
    shadowColor: '#1E1B4B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  idHeader: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.15)',
    paddingBottom: 10,
    marginBottom: 14,
  },
  uniName: {
    color: '#818CF8',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  cardType: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 2,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#6366F1',
    marginRight: 14,
  },
  userMeta: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  userDept: {
    fontSize: 12,
    color: '#C7D2FE',
    marginTop: 2,
  },
  userEmail: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  idFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.15)',
    paddingTop: 12,
  },
  idLabel: {
    fontSize: 9,
    color: '#818CF8',
    fontWeight: '700',
  },
  idValue: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '700',
    marginTop: 2,
  },
  statusPill: {
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusPillText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginVertical: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statNum: {
    fontSize: 20,
    fontWeight: '800',
    color: '#4F46E5',
  },
  statLabel: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 4,
    fontWeight: '600',
  },
  sectionContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  settingDesc: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    paddingRight: 10,
  },
  subSettingTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
  },
  leadTimeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  leadChip: {
    flex: 1,
    paddingVertical: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    alignItems: 'center',
  },
  leadChipSelected: {
    backgroundColor: '#4F46E5',
  },
  leadChipText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
  },
  leadChipTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  appFooter: {
    alignItems: 'center',
    marginTop: 10,
    paddingBottom: 20,
  },
  appVersionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
  },
  appSubText: {
    fontSize: 11,
    color: '#CBD5E1',
    marginTop: 2,
  },
});
