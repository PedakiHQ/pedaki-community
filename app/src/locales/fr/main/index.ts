import demoBanner from '~/locales/fr/main/demo-banner.ts';
import sidebar from '~/locales/fr/main/sidebar.ts';

export default {
  metadata: {
    title: 'Accueil',
  },
  demoBanner: demoBanner,
  layout: {
    sidebar: sidebar,
  },
} as const;
