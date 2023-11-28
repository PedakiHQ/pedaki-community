import type { PageType } from '~/app/types';

export default function NotFound({ params }: PageType & { notFound: string[] }) {
  console.log(params);

  return <main>not found in [locale]</main>;
}
