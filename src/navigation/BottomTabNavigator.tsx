import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MyBookingsScreen } from '../screens/MyBookingsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { RoomsScreen } from '../screens/RoomsScreen';
import { BottomTabParamList } from './types';

const Tab = createBottomTabNavigator<BottomTabParamList>();

export const BottomTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#4F46E5',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E2E8F0',
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        tabBarIcon: ({ focused }) => {
          let icon = '🏢';
          if (route.name === 'ExploreRooms') icon = '🏢';
          else if (route.name === 'MyBookings') icon = '📅';
          else if (route.name === 'Profile') icon = '👤';

          return (
            <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
              <Text style={styles.iconText}>{icon}</Text>
            </View>
          );
        },
      })}
    >
      <Tab.Screen
        name="ExploreRooms"
        component={RoomsScreen}
        options={{ tabBarLabel: 'Explore Rooms' }}
      />
      <Tab.Screen
        name="MyBookings"
        component={MyBookingsScreen}
        options={{ tabBarLabel: 'My Bookings' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  iconWrapper: {
    padding: 4,
    borderRadius: 8,
  },
  iconWrapperActive: {
    backgroundColor: '#EEF2FF',
  },
  iconText: {
    fontSize: 16,
  },
});
