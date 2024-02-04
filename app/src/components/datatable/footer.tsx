import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@pedaki/design/ui/select';
import type { PaginationOutput } from '@pedaki/services/shared/pagination.model';
import { PaginationElement } from '~/components/datatable/pagination';
import { possiblesPerPage } from '~/components/datatable/parameters';
import type { PossiblePerPage } from '~/components/datatable/parameters';
import { useScopedI18n } from '~/locales/client.ts';
import React from 'react';

interface GenerateUrlArgs {
  page: number;
  perPage: PossiblePerPage;
  sorting: { id: string; desc: boolean }[];
  columns: Record<string, boolean>;
}

const Footer = ({
  perPageLabel,
  isLoading,
  page,
  setPage,
  perPage,
  setPerPage,
  meta,
  sorting,
  columnVisibility,
  serialize,
}: {
  perPageLabel?: string;
  isLoading: boolean;
  page: number;
  perPage: PossiblePerPage;
  setPerPage: React.Dispatch<React.SetStateAction<PossiblePerPage>>;
  setPage: (page: number) => void;
  meta: PaginationOutput | undefined;
  sorting: { id: string; desc: boolean }[];
  columnVisibility: Record<string, boolean>;
  serialize: (data: GenerateUrlArgs) => string;
}) => {
  const t = useScopedI18n('components.datatable');

  const generateUrl = (data: Partial<GenerateUrlArgs>): string => {
    return serialize({
      page: data.page ?? page,
      perPage: data.perPage ?? perPage,
      sorting: data.sorting ?? sorting,
      columns: data.columns ?? columnVisibility,
    });
  };
  return (
    <div className="grid grid-cols-12 items-center justify-between gap-4">
      <span className="col-span-6 justify-start text-p-sm text-sub @3xl/main:col-span-3">
        {t('footer.showing', {
          from: isLoading ? '0' : Math.min((page - 1) * perPage + 1, meta?.totalCount ?? 0),
          to: isLoading ? '0' : Math.min(page * perPage, meta?.totalCount ?? 0),
          total: isLoading ? '0' : meta?.totalCount,
        })}
      </span>
      <div className="order-last col-span-12 flex justify-start @3xl/main:order-none @3xl/main:col-span-6">
        <PaginationElement
          page={page}
          setPage={setPage}
          totalPages={meta?.pageCount}
          generateUrl={generateUrl}
        />
      </div>
      <div className="col-span-6 flex items-center justify-end gap-2 @3xl/main:col-span-3 lg:mr-0">
        <span className="text-p-sm text-sub">{perPageLabel ?? t('footer.perPage')}</span>
        <Select
          onValueChange={value => {
            const newValue = Number(value) as PossiblePerPage;
            if (newValue === perPage) return;
            setPerPage(newValue);
          }}
        >
          <SelectTrigger className="w-[80px]">
            <SelectValue placeholder={perPage}>{perPage}</SelectValue>
          </SelectTrigger>
          <SelectContent side="left" align="start">
            {possiblesPerPage.map(value => (
              <SelectItem key={value} value={String(value)}>
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default Footer;
