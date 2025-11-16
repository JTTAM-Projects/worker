import { useState, useCallback, useEffect } from 'react';
import type { TaskFilters } from '../types';

export interface FilterState {
  searchText: string;
  selectedCategories: string[];
  minPrice: string;
  maxPrice: string;
  minPriceSlider: number;
  maxPriceSlider: number;
  locationSearch: string;
  radiusKm: number;
}

export interface UseFilterStateReturn {
  state: FilterState;
  setSearchText: (value: string) => void;
  setSelectedCategories: (value: string[]) => void;
  toggleCategory: (category: string) => void;
  setMinPrice: (value: string) => void;
  setMaxPrice: (value: string) => void;
  setMinPriceSlider: (value: number) => void;
  setMaxPriceSlider: (value: number) => void;
  setLocationSearch: (value: string) => void;
  setRadiusKm: (value: number) => void;
  syncWithFilters: (filters: TaskFilters) => void;
  reset: () => void;
  buildFilters: (filters: TaskFilters) => TaskFilters;
}

const DEFAULT_STATE: FilterState = {
  searchText: '',
  selectedCategories: [],
  minPrice: '',
  maxPrice: '',
  minPriceSlider: 0,
  maxPriceSlider: 200,
  locationSearch: '',
  radiusKm: 10,
};

/**
 * Hook for managing filter panel local state
 * Handles synchronization between form inputs and parent filter state
 */
export function useFilterState(initialFilters: TaskFilters): UseFilterStateReturn {
  const [state, setState] = useState<FilterState>(() => ({
    searchText: initialFilters.searchText || '',
    selectedCategories: initialFilters.categories || [],
    minPrice: initialFilters.minPrice?.toString() || '',
    maxPrice: initialFilters.maxPrice?.toString() || '',
    minPriceSlider: initialFilters.minPrice || 0,
    maxPriceSlider: initialFilters.maxPrice || 200,
    locationSearch: '',
    radiusKm: initialFilters.radiusKm || 10,
  }));

  const setSearchText = useCallback((value: string) => {
    setState(prev => ({ ...prev, searchText: value }));
  }, []);

  const setSelectedCategories = useCallback((value: string[]) => {
    setState(prev => ({ ...prev, selectedCategories: value }));
  }, []);

  const toggleCategory = useCallback((category: string) => {
    setState(prev => ({
      ...prev,
      selectedCategories: prev.selectedCategories.includes(category)
        ? prev.selectedCategories.filter(c => c !== category)
        : [...prev.selectedCategories, category]
    }));
  }, []);

  const setMinPrice = useCallback((value: string) => {
    // Allow empty string for clearing
    if (value === '') {
      setState(prev => ({
        ...prev,
        minPrice: '',
        minPriceSlider: 0
      }));
      return;
    }
    
    const numValue = parseInt(value);
    // Clamp between 0 and 500
    const clampedValue = Math.max(0, Math.min(500, numValue));
    setState(prev => ({
      ...prev,
      minPrice: value, // Keep original input for UX
      minPriceSlider: clampedValue // But clamp slider position
    }));
  }, []);

  const setMaxPrice = useCallback((value: string) => {
    // Allow empty string for clearing
    if (value === '') {
      setState(prev => ({
        ...prev,
        maxPrice: '',
        maxPriceSlider: 500
      }));
      return;
    }
    
    const numValue = parseInt(value);
    // Clamp between 0 and 500
    const clampedValue = Math.max(0, Math.min(500, numValue));
    setState(prev => ({
      ...prev,
      maxPrice: value, // Keep original input for UX
      maxPriceSlider: clampedValue // But clamp slider position
    }));
  }, []);

  const setMinPriceSlider = useCallback((value: number) => {
    setState(prev => ({
      ...prev,
      minPriceSlider: value,
      minPrice: value.toString()
    }));
  }, []);

  const setMaxPriceSlider = useCallback((value: number) => {
    setState(prev => ({
      ...prev,
      maxPriceSlider: value,
      maxPrice: value.toString()
    }));
  }, []);

  const setLocationSearch = useCallback((value: string) => {
    setState(prev => ({ ...prev, locationSearch: value }));
  }, []);

  const setRadiusKm = useCallback((value: number) => {
    setState(prev => ({ ...prev, radiusKm: value }));
  }, []);

  const syncWithFilters = useCallback((filters: TaskFilters) => {
    // Only sync when explicitly reset (all filters empty)
    const isReset = !filters.searchText && !filters.categories?.length && 
                     !filters.minPrice && !filters.maxPrice && !filters.latitude;
    
    setState(prev => ({
      searchText: isReset ? '' : prev.searchText,
      selectedCategories: filters.categories || [],
      minPrice: filters.minPrice?.toString() || '',
      maxPrice: filters.maxPrice?.toString() || '',
      minPriceSlider: filters.minPrice || 0,
      maxPriceSlider: filters.maxPrice || 200,
      locationSearch: isReset ? '' : prev.locationSearch,
      radiusKm: filters.radiusKm || 10,
    }));
  }, []);

  const reset = useCallback(() => {
    setState(DEFAULT_STATE);
  }, []);

  const buildFilters = useCallback((currentFilters: TaskFilters): TaskFilters => {
    return {
      ...currentFilters,
      searchText: state.searchText.trim() || undefined,
      categories: state.selectedCategories.length > 0 ? state.selectedCategories : undefined,
      minPrice: state.minPrice ? parseInt(state.minPrice) : undefined,
      maxPrice: state.maxPrice ? parseInt(state.maxPrice) : undefined,
      // Keep location data if it exists
      latitude: currentFilters.latitude,
      longitude: currentFilters.longitude,
      radiusKm: currentFilters.latitude && currentFilters.longitude ? state.radiusKm : undefined,
    };
  }, [state]);

  // Sync local state with parent filters when they change externally
  useEffect(() => {
    syncWithFilters(initialFilters);
  }, [initialFilters, syncWithFilters]);

  return {
    state,
    setSearchText,
    setSelectedCategories,
    toggleCategory,
    setMinPrice,
    setMaxPrice,
    setMinPriceSlider,
    setMaxPriceSlider,
    setLocationSearch,
    setRadiusKm,
    syncWithFilters,
    reset,
    buildFilters,
  };
}
