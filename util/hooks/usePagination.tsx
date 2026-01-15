import { useState } from "react";

function usePagination(data: Array<any>, itemsPerPage: number) {
  const [currentPage, setCurrentPage] = useState(1);

  const maxPage = Math.ceil(data.length / itemsPerPage);

  function currentData() {
    const begin = 0;
    const end = currentPage * itemsPerPage;
    return data.slice(begin, end);
  }

  function next() {
    setCurrentPage((currentPage) => Math.min(currentPage + 1, maxPage));
  }

  function resetCurrentPage() {
    setCurrentPage(1)
  }

  return { next, currentData, currentPage, maxPage, resetCurrentPage };
}

export default usePagination;