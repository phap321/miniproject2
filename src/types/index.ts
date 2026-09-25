export type NoiseLevel = 'Silent' | 'Quiet' | 'Collaborative';

export type Amenity = 
  | 'Whiteboard' 
  | 'Projector' 
  | 'Monitor / TV' 
  | 'Power Outlets' 
  | 'Air Conditioning' 
  | 'Ergonomic Chairs' 
  | 'Video Conf Kit';

export type BuildingLocation = 
  | 'Main Library' 
  | 'Tech Center (Building A)' 
  | 'Science Hub (Building B)' 
  | 'Student Union' 
  | 'Arts & Humanities';

export interface TimeSlot {
  id: string;
  startTime: string; // HH:mm format, e.g., "08:00"
  endTime: string;   // HH:mm format, e.g., "09:00"
  isBooked: boolean;
  bookedBy?: string;
}

export interface StudyRoom {
  id: string;
  name: string;
  building: BuildingLocation;
  floor: number;
  capacity: number;
  noiseLevel: NoiseLevel;
  amenities: Amenity[];
  rating: number;
  imageUrl: string;
  description: string;
  isAvailableNow: boolean;
  slots: TimeSlot[];
}

export interface Booking {
  id: string;
  roomId: string;
  roomName: string;
  building: BuildingLocation;
  floor: number;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  slotId: string;
  userId: string;
  userName: string;
  createdAt: string; // ISO string
  status: 'confirmed' | 'active' | 'completed' | 'cancelled';
  notificationId?: string;
}

export interface UserProfile {
  id: string;
  studentId: string;
  name: string;
  email: string;
  department: string;
  avatarUrl: string;
  notificationsEnabled: boolean;
  reminderLeadMinutes: number; // e.g. 15 mins before
}

export interface FilterState {
  searchQuery: string;
  selectedBuilding: BuildingLocation | 'All';
  minCapacity: number;
  selectedNoiseLevel: NoiseLevel | 'All';
  selectedAmenities: Amenity[];
  onlyAvailableNow: boolean;
  selectedDate: string; // YYYY-MM-DD
}
