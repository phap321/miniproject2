import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StudyRoom } from '../types';

export type RootStackParamList = {
  MainTabs: undefined;
  RoomDetail: { room: StudyRoom };
  BookingSuccess: { bookingId: string };
};

export type BottomTabParamList = {
  ExploreRooms: undefined;
  MyBookings: undefined;
  Profile: undefined;
};

export type RoomDetailNavProp = NativeStackNavigationProp<RootStackParamList, 'RoomDetail'>;
