import type { OutputType } from '~api/router/router.ts';

type SettingKey = keyof OutputType['workspace']['getSettings'];

export const dictToSettings = (
  dict: Record<SettingKey, string>,
): { key: SettingKey; value: string }[] => {
  return Object.entries(dict).map(([key, value]) => {
    return { key: key as SettingKey, value };
  });
};
