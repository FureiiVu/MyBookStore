import { useState, useMemo } from "react";

interface UsePaginationProps<T> {
  items: T[];
  itemsPerPage: number;
}

export const usePagination = <T>({
  items,
  itemsPerPage,
}: UsePaginationProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1);

  const paginatedItems = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return items.slice(indexOfFirstItem, indexOfLastItem);
  }, [items, currentPage, itemsPerPage]);

  return {
    currentPage,
    setCurrentPage,
    paginatedItems,
    totalItems: items.length,
  };
};
