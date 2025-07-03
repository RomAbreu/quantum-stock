'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { useState, useEffect } from 'react';

type UseSearchQueryProps = {
  minLength?: number;
  debounceTime?: number;
};

export function useSearchQuery({ minLength = 2, debounceTime = 500 }: UseSearchQueryProps = {}) {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  // Get current query from URL
  const currentQuery = searchParams.get('query') || '';
  
  // Local state to track input value
  const [inputValue, setInputValue] = useState(currentQuery);
  
  // Update local state when URL changes
  useEffect(() => {
    setInputValue(currentQuery);
  }, [currentQuery]);

  // Debounced function to update URL
  const handleSearch = useDebouncedCallback((searchText: string) => {
    const params = new URLSearchParams(searchParams.toString());

    // Reset to page 1 when search changes
    params.set('page', '1');

    if (searchText && searchText.length >= minLength) {
      params.set('query', searchText);
    } else {
      params.delete('query');
    }

    replace(`${pathname}?${params.toString()}`);
  }, debounceTime);

  // Function to handle input change
  const handleInputChange = (value: string) => {
    setInputValue(value);
    handleSearch(value);
  };

  // Function to clear search
  const clearSearch = () => {
    setInputValue('');
    handleSearch('');
  };

  return {
    inputValue,
    handleInputChange,
    clearSearch,
    currentQuery,
  };
}