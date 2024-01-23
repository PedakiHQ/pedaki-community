import { z } from 'zod';

export const PaginationInputSchema = z.object({
  page: z.number().default(1), // the first page is 1
  limit: z.number().default(30),
});

export type PaginationInput = z.infer<typeof PaginationInputSchema>;

export const PaginationOutputSchema = z.object({
  currentPage: z.number(),
  isFirstPage: z.boolean(),
  isLastPage: z.boolean(),
  previousPage: z.number().nullable(),
  nextPage: z.number().nullable(),
  pageCount: z.number(), // total number of pages
  totalCount: z.number(), // total number of elements
});

export type PaginationOutput = z.infer<typeof PaginationOutputSchema>;
