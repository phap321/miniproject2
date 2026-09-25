import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFilterStore } from '../store/useFilterStore';
import { BuildingLocation, NoiseLevel } from '../types';

const BUILDINGS: (BuildingLocation | 'All')[] = [
  'All',
  'Main Library',
  'Tech Center (Building A)',
  'Science Hub (Building B)',
  'Student Union',
  'Arts & Humanities',
];

const NOISE_LEVELS: (NoiseLevel | 'All')[] = ['All', 'Silent', 'Quiet', 'Collaborative'];

export const RoomFilterBar: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    selectedBuilding,
    setSelectedBuilding,
    selectedNoiseLevel,
    setSelectedNoiseLevel,
    minCapacity,
    setMinCapacity,
    resetFilters,
  } = useFilterStore();

  return (
    <View style={styles.container}>
      {/* Search Input Bar */}
      <View style={styles.searchRow}>
        <View style={styles.searchInputContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search room name or features..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearSearchIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {(selectedBuilding !== 'All' ||
          selectedNoiseLevel !== 'All' ||
          minCapacity > 1 ||
          searchQuery.length > 0) && (
          <TouchableOpacity style={styles.resetButton} onPress={resetFilters}>
            <Text style={styles.resetText}>Reset</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Buildings Filter Horizontal Scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        <Text style={styles.filterSectionLabel}>Building:</Text>
        {BUILDINGS.map((building) => {
          const isSelected = selectedBuilding === building;
          return (
            <TouchableOpacity
              key={building}
              style={[styles.filterChip, isSelected && styles.filterChipSelected]}
              onPress={() => setSelectedBuilding(building)}
            >
              <Text style={[styles.filterChipText, isSelected && styles.filterChipTextSelected]}>
                {building}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Noise Level Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        <Text style={styles.filterSectionLabel}>Noise:</Text>
        {NOISE_LEVELS.map((noise) => {
          const isSelected = selectedNoiseLevel === noise;
          return (
            <TouchableOpacity
              key={noise}
              style={[styles.filterChip, isSelected && styles.filterChipSelected]}
              onPress={() => setSelectedNoiseLevel(noise)}
            >
              <Text style={[styles.filterChipText, isSelected && styles.filterChipTextSelected]}>
                {noise === 'All' ? 'Any Noise' : noise}
              </Text>
            </TouchableOpacity>
          );
        })}

        <Text style={[styles.filterSectionLabel, { marginLeft: 12 }]}>Min Seats:</Text>
        {[1, 2, 4, 8].map((cap) => {
          const isSelected = minCapacity === cap;
          return (
            <TouchableOpacity
              key={cap}
              style={[styles.filterChip, isSelected && styles.filterChipSelected]}
              onPress={() => setMinCapacity(cap)}
            >
              <Text style={[styles.filterChipText, isSelected && styles.filterChipTextSelected]}>
                {cap}+
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingTop: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  searchRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 10,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 42,
  },
  searchIcon: {
    marginRight: 8,
    fontSize: 14,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
  },
  clearSearchIcon: {
    fontSize: 14,
    color: '#94A3B8',
    padding: 4,
  },
  resetButton: {
    marginLeft: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
  },
  resetText: {
    fontSize: 13,
    color: '#E11D48',
    fontWeight: '600',
  },
  scrollContainer: {
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 6,
  },
  filterSectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    marginRight: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  filterChipSelected: {
    backgroundColor: '#EEF2FF',
    borderColor: '#6366F1',
  },
  filterChipText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
  },
  filterChipTextSelected: {
    color: '#4F46E5',
    fontWeight: '700',
  },
});
