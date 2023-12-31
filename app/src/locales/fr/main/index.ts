import demoBanner from '~/locales/fr/main/demo-banner.ts';
import sidebar from '~/locales/fr/main/sidebar.ts';

export default {
  metadata: {
    title: 'Titre',
    description: 'Lorem ipsum fr',
  },
  demoBanner: demoBanner,
  layout: {
    sidebar: sidebar,
  },
} as const;
