'use client';

import { Navigation } from '~/components/HorizontalMenu/navigation.tsx';
import { useTutorialNextStep } from '~/components/tutorial/useTutorialNextStep.tsx';
import { SETTINGS_NAVIGATION, SETTINGS_NAVIGATION_USERS } from '~/store/tutorial/data/constants.ts';
import { TUTORIAL_ID as UserTutorialId } from '~/store/tutorial/data/users/constants.ts';
import React from 'react';

const items = [
  {
    labelKey: 'general.label',
    href: '/settings',
    segment: '(general)',
  },
  {
    labelKey: 'billing.label',
    href: '/settings/billing',
    segment: 'billing',
  },
  {
    labelKey: 'users.label',
    href: '/settings/users',
    segment: 'users',
    id: SETTINGS_NAVIGATION_USERS,
  },
  {
    labelKey: 'account.label',
    href: '/settings/account',
    segment: 'account',
  },
] as const;

export const SettingsNavigation = () => {
  useTutorialNextStep(UserTutorialId, 0);

  return (
    <Navigation items={items} tKey="settings.main.navigation.items" id={SETTINGS_NAVIGATION} />
  );
};
