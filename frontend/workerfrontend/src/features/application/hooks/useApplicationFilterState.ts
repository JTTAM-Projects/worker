import { useState, useCallback, useEffect } from "react";
import type { ApplicationFilters } from "../types";

export interface ApplicationFilterState{
  searchText: string,
  selectedCategories: string[];
  minPrice: string,
  maxPrice: string,
  minPriceSlider: number,
  maxPriceSlider: number
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

function toState(src?: Partial<ApplicationFilters>): ApplicationFilterState {
  return {
    searchText: src?.searchText ?? "",
    selectedCategories: src?.categories ?? [],
    minPrice: src?.minPrice != null ? String(src.minPrice) : "",
    maxPrice: src?.maxPrice != null ? String(src.maxPrice) : "",
    minPriceSlider: src?.minPrice ?? 0,
    maxPriceSlider: src?.maxPrice ?? 500
  };
}

export function useApplicationFilterState(initialFilters?: Partial<ApplicationFilters>): UseApplicationFilterStateReturn {
  const [state, setState] = useState<ApplicationFilterState>(() => toState(initialFilters));

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

  const syncWithFilters = useCallback((v?: Partial<ApplicationFilters>) => {
    setState(toState(v));
  }, []);

  const reset = useCallback(() => {
    setState({
      searchText: "",
      selectedCategories: [],
      minPrice: "",
      maxPrice: "",
      minPriceSlider: 0,
      maxPriceSlider: 500,
    });
  }, []);

  const buildFilters = useCallback((currentFilters?: Partial<ApplicationFilters>): ApplicationFilters => {
    const base = currentFilters ?? {};
    return {
      ...base,
      searchText: state.searchText.trim() || undefined,
      categories: state.selectedCategories.length > 0 ? state.selectedCategories : undefined,
      minPrice: state.minPrice ? parseInt(state.minPrice) : undefined,
      maxPrice: state.maxPrice ? parseInt(state.maxPrice) : undefined,
      applicationStatus: currentFilters?.applicationStatus
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