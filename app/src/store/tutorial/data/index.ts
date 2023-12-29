import { appearanceTutorial } from '~/store/tutorial/data/appearance/appearance.tutorial.ts';
import { generateClassesTutorial } from '~/store/tutorial/data/generate-classes/generate-classes.tutorial.ts';
import { schemaStudentTutorial } from '~/store/tutorial/data/schema-student/schema-student.tutorial.ts';
import { uploadStudentsTutorial } from '~/store/tutorial/data/upload-students/upload-students.tutorial.ts';
import { usersTutorial } from '~/store/tutorial/data/users/users.tutorial.ts';

export const tutorials = [
  appearanceTutorial,
  usersTutorial,
  schemaStudentTutorial,
  uploadStudentsTutorial,
  generateClassesTutorial,
];
