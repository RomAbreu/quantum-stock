'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

type UseSearchQueryProps = {
	minLength?: number;
	debounceTime?: number;
	pageParam?: string;
};

export function useSearchQuery({
	minLength = 2,
	debounceTime = 500,
	pageParam = 'page',
}: UseSearchQueryProps = {}) {
	const searchParams = useSearchParams();
	const { replace } = useRouter();
	const pathname = usePathname();

	const currentQuery = searchParams.get('query') ?? '';

	const [inputValue, setInputValue] = useState(currentQuery);

	useEffect(() => {
		setInputValue(currentQuery);
	}, [currentQuery]);

	const handleSearch = useDebouncedCallback((searchText: string) => {
		const params = new URLSearchParams(searchParams.toString());

		params.set(pageParam, '1');

		if (searchText && searchText.length >= minLength) {
			params.set('query', searchText);
		} else {
			params.delete('query');
		}

		replace(`${pathname}?${params.toString()}`);
	}, debounceTime);

	const handleInputChange = useCallback(
		(value: string) => {
			setInputValue(value);
			handleSearch(value);
		},
		[handleSearch],
	);

	const clearSearch = useCallback(() => {
		setInputValue('');
		handleSearch('');
	}, [handleSearch]);

	const updateSearchParams = useCallback(
		(params: Record<string, string | null>) => {
			const urlParams = new URLSearchParams(searchParams.toString());

			for (const [key, value] of Object.entries(params)) {
				if (value !== null && value !== '') {
					urlParams.set(key, value);
				} else {
					urlParams.delete(key);
				}
			}

			replace(`${pathname}?${urlParams.toString()}`);
		},
		[searchParams, pathname, replace],
	);

	return {
		inputValue,
		handleInputChange,
		clearSearch,
		currentQuery,
		handleSearch,
		updateSearchParams,
	};
}
