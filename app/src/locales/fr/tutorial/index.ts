import appearance from '~/locales/fr/tutorial/appearance';
import generateClasses from '~/locales/fr/tutorial/generate-classes';
import schemaStudent from '~/locales/fr/tutorial/schema-student';
import uploadStudents from '~/locales/fr/tutorial/upload-students';
import users from '~/locales/fr/tutorial/users';
import { TUTORIAL_ID as appearanceTutorialId } from '~/store/tutorial/data/appearance/constants';
import { TUTORIAL_ID as generateClassesTutorialId } from '~/store/tutorial/data/generate-classes/constants';
import { TUTORIAL_ID as schemaStudentTutorialId } from '~/store/tutorial/data/schema-student/constants';
import { TUTORIAL_ID as uploadStudentsTutorialId } from '~/store/tutorial/data/upload-students/constants';
import { TUTORIAL_ID as usersTutorialId } from '~/store/tutorial/data/users/constants';

export default {
  main: {
    title: "Besoin d'aide ?",
    unavailableOnMobile: "Le tutoriel n'est pas disponible sur mobile",
    locales: {
      back: 'Retour',
      close: 'Fermer',
      last: 'Terminer',
      next: 'Suivant',
      open: 'Ouvrir',
      skip: 'Passer',
    },
  },
  [appearanceTutorialId]: appearance,
  [usersTutorialId]: users,
  [generateClassesTutorialId]: generateClasses,
  [schemaStudentTutorialId]: schemaStudent,
  [uploadStudentsTutorialId]: uploadStudents,
} as const;
