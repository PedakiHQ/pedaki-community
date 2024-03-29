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
    <div className="grid grid-cols-12 items-center justify-between gap-4 pb-1">
      <ShowInPage meta={meta} page={page} perPage={perPage} />
      <div className="order-last col-span-12 flex justify-start @3xl:order-none @3xl:col-span-6">
        <PaginationElement
          page={page}
          setPage={setPage}
          totalPages={meta?.pageCount}
          generateUrl={generateUrl}
        />
      </div>
      <div className="col-span-6 flex items-center justify-end gap-2 @3xl:col-span-3 lg:mr-1">
        <span className="text-p-sm text-sub">{perPageLabel ?? t('footer.perPage')}</span>
        <Select
          onValueChange={value => {
            const newValue = Number(value) as PossiblePerPage;
            if (newValue === perPage) return;
            setPerPage(newValue);
          }}
          value={String(perPage)}
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

const ShowInPage = ({
  meta,
  page,
  perPage,
}: {
  meta: PaginationOutput | undefined;
  page: number;
  perPage: number;
}) => {
  const t = useScopedI18n('components.datatable');

  const from = Math.min((page - 1) * perPage + 1, meta?.totalCount ?? 0);
  const to = Math.min(page * perPage, meta?.totalCount ?? 0);
  const total = meta?.totalCount;

  const totalRef = React.useRef(0);
  if (total && totalRef.current !== total) {
    totalRef.current = total;
  }

  return (
    <span className="col-span-6 justify-start text-p-sm text-sub @3xl:col-span-3">
      {t('footer.showing', {
        from,
        to,
        total: totalRef.current,
      })}
    </span>
  );
};

export default Footer;
