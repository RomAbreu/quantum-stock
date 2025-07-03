'use client';

import type { StockItem } from '@/components/tables/StockTable';
import { formatCategory } from '@/lib/utils/category.utils';
import { useMemo, useState } from 'react';

export default function useStockFilter(stockItems: StockItem[]) {
	const [searchTerm, setSearchTerm] = useState('');
	const [filterCategory, setFilterCategory] = useState<string>('all');

	const filteredItems = useMemo(() => {
		return stockItems.filter((item) => {
			// Normalize search term to lowercase for case-insensitive comparison
			const search = searchTerm.toLowerCase().trim();

			// Filter by category first (this is more efficient)
			const matchesCategory =
				filterCategory === 'all' ||
				item.category.toLowerCase() === filterCategory.toLowerCase();

			if (!matchesCategory) return false;

			// If there's no search term, just return the category match
			if (!search) return true;

			// Search in name, description and category
			const matchesName = item.name.toLowerCase().includes(search);
			const matchesDescription = item.description
				.toLowerCase()
				.includes(search);
			const matchesCategoryName = formatCategory(item.category)
				.toLowerCase()
				.includes(search);

			// Return true if any field matches the search term
			return matchesName || matchesDescription || matchesCategoryName;
		});
	}, [stockItems, searchTerm, filterCategory]);

	const categories = useMemo(() => {
		return Array.from(new Set(stockItems.map((item) => item.category)));
	}, [stockItems]);

	return {
		searchTerm,
		setSearchTerm,
		filterCategory,
		setFilterCategory,
		filteredItems,
		categories,
	};
}
