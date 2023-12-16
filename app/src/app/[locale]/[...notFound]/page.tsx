import type { PageType } from '~/app/types';
import { setStaticParamsLocale } from '~/locales/utils';

export default function NotFound({ params }: PageType & { notFound: string[] }) {
  setStaticParamsLocale(params.locale);

  console.log(params);
  return <main>not found in [locale]</main>;
}
