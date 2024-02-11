import { generatePagination } from '@pedaki/common/utils/generatePagination';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@pedaki/design/ui/pagination';
import type { PossiblePerPage } from '~/components/datatable/parameters';
import React, { useMemo, useRef } from 'react';

export const PaginationElement = ({
  page,
  setPage: _setPage,
  totalPages,
  generateUrl,
}: {
  page: number;
  setPage: (page: number) => void;
  totalPages: number | undefined;
  generateUrl: (
    data: Partial<{
      page: number;
      perPage: PossiblePerPage;
      sorting: { id: string; desc: boolean }[];
      columns: Record<string, boolean>;
    }>,
  ) => string;
}) => {
  const cacheTotalPage = useRef<number>();
  const shownTotalPages = useMemo(() => {
    if (totalPages === undefined || cacheTotalPage.current === totalPages)
      return cacheTotalPage.current;
    cacheTotalPage.current = totalPages;
    return cacheTotalPage.current;
  }, [totalPages]);

  const pageUrl = (page: number) => {
    if (!shownTotalPages || page > shownTotalPages) return '#';
    return generateUrl({ page: Math.min(Math.max(1, page), shownTotalPages) });
  };
  const pagination = shownTotalPages ? generatePagination(page, shownTotalPages) : undefined;
  const setPage = (page: number) => {
    if (!shownTotalPages) return;
    if (page > shownTotalPages) return;
    _setPage(Math.min(Math.max(1, page), shownTotalPages));
  };

  if (!pagination) return null;

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={pageUrl(page - 1)}
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          />
        </PaginationItem>

        {pagination.map(newPage => {
          return (
            <PaginationItem key={newPage}>
              {newPage === 'ellipsis_l' || newPage === 'ellipsis_r' ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  href={pageUrl(newPage)}
                  isActive={newPage === page}
                  onClick={() => setPage(newPage)}
                >
                  {newPage}
                </PaginationLink>
              )}
            </PaginationItem>
          );
        })}
        <PaginationItem>
          <PaginationNext
            href={pageUrl(page + 1)}
            onClick={() => setPage(page + 1)}
            disabled={page === shownTotalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
