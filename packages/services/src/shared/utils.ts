import type { PaginationOutput } from '~/shared/pagination.model.ts';

export const preparePagination = (
  totalCount: number,
  page: number,
  limit: number,
): PaginationOutput => {
  const pageCount = Math.ceil(totalCount / limit);
  const previousPage = page > 1 ? page - 1 : null;
  const nextPage = page < pageCount ? page + 1 : null;

  return {
    isFirstPage: previousPage === null,
    isLastPage: nextPage === null,
    currentPage: page,
    previousPage,
    nextPage,
    pageCount,
    totalCount,
  };
};
