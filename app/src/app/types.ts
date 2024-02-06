import type React from 'react';

export type PageType<Params extends Record<string, string> = {}> = Readonly<{
  params: Params & {
    locale: string;
  };
}>;

export type LayoutType<Params extends Record<string, string> = {}> = Readonly<{
  children: React.ReactNode;
}> &
  PageType<Params>;
