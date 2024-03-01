import type { PageType } from '~/app/types.ts';
import { setStaticParamsLocale } from '~/locales/utils.ts';
import React from 'react';

export default function StudentsEditPage({ params }: PageType<{ id: string }>) {
  setStaticParamsLocale(params.locale);

  // TODO
  return <div className="relative flex h-full flex-col gap-4 @4xl:flex-row">{/* TODO */}</div>;
}
