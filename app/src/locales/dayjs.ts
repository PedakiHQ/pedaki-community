import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.extend(localizedFormat);

export const setDayjsLocale = async (code: string) => {
  await import(`dayjs/locale/${code}.js`).then(locale => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
    dayjs.locale(locale.default);
  });
};

export default dayjs;
