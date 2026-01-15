import { useState, useCallback, useMemo } from "react";

function usePagination(data: Array<any>, itemsPerPage: number) {
  const [currentPage, setCurrentPage] = useState(1);

  const maxPage = Math.ceil(data.length / itemsPerPage);

  const currentData = useCallback(() => {
    const begin = 0;
    const end = currentPage * itemsPerPage;
    return data.slice(begin, end);
  }, [data, currentPage, itemsPerPage]);

  const next = useCallback(() => {
    setCurrentPage((currentPage) => Math.min(currentPage + 1, maxPage));
  }, [maxPage]);

  const resetCurrentPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  return { next, currentData, currentPage, maxPage, resetCurrentPage };
}

export default usePagination;