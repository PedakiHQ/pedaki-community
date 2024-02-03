import type React from 'react';

export type PageType<Params extends {}> = Readonly<{
  params: {
    locale: string;
  } & Params;
}>;

export type LayoutType<Params extends {}> = Readonly<{
  children: React.ReactNode;
}> &
  PageType<Params>;
