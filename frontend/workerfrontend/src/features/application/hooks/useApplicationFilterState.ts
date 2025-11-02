import { useState, useCallback, useEffect } from "react";
import type { ApplicationFilters } from "../types";

export interface ApplicationFilterState{
  searchText: string,
  selectedCategories: string[];
  minPrice: string,
  maxPrice: string,
  minPriceSlider: number,
  maxPriceSlider: number,
}

export interface UseApplicationFilterStateReturn{
  state: ApplicationFilterState;
  setSearchText: (v: string) => void;
  setSelectedCategories: (v: string[]) => void;
  toggleCategory: (v: string) => void;
  setMinPrice: (v: string) => void;
  setMaxPrice: (v: string) => void;
  setMinPriceSlider: (v: number) => void;
  setMaxPriceSlider: (v: number) => void;
  syncWithFilters: (v: ApplicationFilters) => void;
  reset: () => void;
  buildFilters: (filters: ApplicationFilters) => ApplicationFilters;
}

const DEFAULT_STATE: ApplicationFilterState = {
  searchText: '',
  selectedCategories: [],
  minPrice: '',
  maxPrice: '',
  minPriceSlider: 0,
  maxPriceSlider: 200
};

export function useApplicationFilterState(initialFilters: ApplicationFilters): UseApplicationFilterStateReturn {
  const [state, setState] = useState<ApplicationFilterState>(() => ({
    searchText: initialFilters.searchText || '',
    selectedCategories: initialFilters.categories || [],
    minPrice: initialFilters.minPrice?.toString() || '',
    maxPrice: initialFilters.maxPrice?.toString() || '',
    minPriceSlider: initialFilters.minPrice || 0,
    maxPriceSlider: initialFilters.maxPrice || 200
  }));

  const setSearchText = useCallback((value: string) => {
    setState(prev => ({ ...prev, searchText: value}));
  }, []);

  const setSelectedCategories = useCallback((value: string[]) => {
    setState(prev => ({ ...prev, selectedCategories: value}))
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

  const syncWithFilters = useCallback((filters: ApplicationFilters) => {
    const isReset = !filters.searchText && !filters.categories?.length &&
                      !filters.minPrice && !filters.maxPrice;
    
    setState(prev => ({
      searchText: isReset ? '' : prev.searchText,
      selectedCategories: filters.categories || [],
      minPrice: filters.minPrice?.toString() || '',
      maxPrice: filters.maxPrice?.toString() || '',
      minPriceSlider: filters.minPrice || 0,
      maxPriceSlider: filters.maxPrice || 200
    }));
  }, []);

  const reset = useCallback(() => {
    setState(DEFAULT_STATE);
  }, []);

  const buildFilters = useCallback((currentFilters: ApplicationFilters): ApplicationFilters => {
    return {
      ...currentFilters,
      searchText: state.searchText.trim() || undefined,
      categories: state.selectedCategories.length > 0 ? state.selectedCategories : undefined,
      minPrice: state.minPrice ? parseInt(state.minPrice) : undefined,
      maxPrice: state.maxPrice ? parseInt(state.maxPrice) : undefined,
    };
  }, [state]);

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
    syncWithFilters,
    reset,
    buildFilters,
  };
}