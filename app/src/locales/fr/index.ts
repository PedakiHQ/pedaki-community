import auth from '~/locales/fr/auth';
import classes from '~/locales/fr/classes';
import main from '~/locales/fr/main';
import settings from '~/locales/fr/settings';
import students from '~/locales/fr/students';
import teachers from '~/locales/fr/teachers';
import tutorial from '~/locales/fr/tutorial';
import zod from '~/locales/fr/zod';

export default {
  auth: auth,
  tutorial: tutorial,
  classes: classes,
  main: main,
  settings: settings,
  students: students,
  teachers: teachers,
  zod: zod,
} as const;
