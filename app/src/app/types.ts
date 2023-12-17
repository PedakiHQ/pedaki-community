import type React from 'react';

export type PageType = Readonly<{
  params: {
    locale: string;
  };
}>;

export type LayoutType = Readonly<{
  children: React.ReactNode;
}> &
  PageType;
