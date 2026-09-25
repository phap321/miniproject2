import { create } from 'zustand';
import { Amenity, BuildingLocation, FilterState, NoiseLevel } from '../types';

interface FilterStoreState extends FilterState {
  setSearchQuery: (query: string) => void;
  setSelectedBuilding: (building: BuildingLocation | 'All') => void;
  setMinCapacity: (capacity: number) => void;
  setSelectedNoiseLevel: (noise: NoiseLevel | 'All') => void;
  toggleAmenity: (amenity: Amenity) => void;
  setOnlyAvailableNow: (val: boolean) => void;
  setSelectedDate: (date: string) => void;
  resetFilters: () => void;
}

const todayFormatted = new Date().toISOString().split('T')[0];

const INITIAL_STATE: FilterState = {
  searchQuery: '',
  selectedBuilding: 'All',
  minCapacity: 1,
  selectedNoiseLevel: 'All',
  selectedAmenities: [],
  onlyAvailableNow: false,
  selectedDate: todayFormatted,
};

export const useFilterStore = create<FilterStoreState>((set) => ({
  ...INITIAL_STATE,
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedBuilding: (building) => set({ selectedBuilding: building }),
  setMinCapacity: (capacity) => set({ minCapacity: capacity }),
  setSelectedNoiseLevel: (noise) => set({ selectedNoiseLevel: noise }),
  toggleAmenity: (amenity) =>
    set((state) => {
      const exists = state.selectedAmenities.includes(amenity);
      return {
        selectedAmenities: exists
          ? state.selectedAmenities.filter((a) => a !== amenity)
          : [...state.selectedAmenities, amenity],
      };
    }),
  setOnlyAvailableNow: (val) => set({ onlyAvailableNow: val }),
  setSelectedDate: (date) => set({ selectedDate: date }),
  resetFilters: () => set(INITIAL_STATE),
}));
