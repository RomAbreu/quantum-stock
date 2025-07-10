'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

type Options = {
  totalRegisters: number;
  registersPerPage?: number;
  siblingsCount?: number;
  pageParam?: string;
  debounceTime?: number;
};

type Pagination = {
  totalPages: number;
  registersPerPage: number;
  currentPage: number;
  nextPages: number[];
  previousPages: number[];
  siblingsCount: number;
  goToPage: (page: number) => void;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
};

function generatePagesArray(from: number, to: number): number[] {
  return [...new Array(to - from)]
    .map((_, index) => from + index + 1)
    .filter((page) => page > 0);
}

export function usePagination({
  totalRegisters,
  registersPerPage = 10,
  siblingsCount = 1,
  pageParam = 'page',
  debounceTime = 300,
}: Options): Pagination {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const pageFromUrl = searchParams.get(pageParam);
  const initialPage = pageFromUrl ? Number.parseInt(pageFromUrl, 10) : 1;

  const [currentPage, setCurrentPage] = useState(initialPage);

  const totalPagesRef = useRef(
    Math.max(Math.ceil(totalRegisters / registersPerPage), 1),
  );
  totalPagesRef.current = Math.max(
    Math.ceil(totalRegisters / registersPerPage),
    1,
  );

  const updateUrlWithDebounce = useDebouncedCallback((page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set(pageParam, page.toString());
    replace(`${pathname}?${params.toString()}`);
  }, debounceTime);

  const goToPage = useCallback(
    (page: number) => {
      const validPage = Math.max(1, Math.min(page, totalPagesRef.current));
      setCurrentPage(validPage);
      updateUrlWithDebounce(validPage);
    },
    [updateUrlWithDebounce],
  );

  const goToNextPage = useCallback(() => {
    if (currentPage < totalPagesRef.current) {
      goToPage(currentPage + 1);
    }
  }, [currentPage, goToPage]);

  const goToPreviousPage = useCallback(() => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  }, [currentPage, goToPage]);

  useEffect(() => {
    const pageFromUrl = searchParams.get(pageParam);
    if (pageFromUrl) {
      const parsedPage = Number.parseInt(pageFromUrl, 10);
      if (!Number.isNaN(parsedPage) && parsedPage !== currentPage) {
        setCurrentPage(parsedPage);
      }
    } else if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [searchParams, pageParam]);

  useEffect(() => {
    if (currentPage > totalPagesRef.current && totalPagesRef.current > 0) {
      goToPage(totalPagesRef.current);
    }
  }, [goToPage]);

  const previousPages =
    currentPage > 1
      ? generatePagesArray(currentPage - 1 - siblingsCount, currentPage - 1)
      : [];

  const nextPages =
    currentPage < totalPagesRef.current
      ? generatePagesArray(
          currentPage,
          Math.min(currentPage + siblingsCount, totalPagesRef.current),
        )
      : [];

  return {
    currentPage,
    totalPages: totalPagesRef.current,
    nextPages,
    previousPages,
    registersPerPage,
    siblingsCount,
    goToPage,
    goToNextPage,
    goToPreviousPage,
  };
}