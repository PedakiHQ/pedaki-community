import {z} from "zod"
import {ClassesSchema, } from "~/classes/class.model.ts";
import {AcademicYearSchema} from "~/academic-year/academic-year.model.ts";
import {ClassLevelSchema} from "~/classes/level.model.ts";
import {ClassBranchSchema} from "~/classes/branch.model.ts";

export const ClassesCreateInputSchema = ClassesSchema
  .omit({
    id: true,
    academicYear: true,
    level: true,
    branches: true,
    }
  )
  .merge(
  z.object({
    students: z.number().array(),
    academicYear: AcademicYearSchema.pick({id: true}),
    level: ClassLevelSchema.pick({id: true}),
    branches: ClassBranchSchema.pick({id: true}).array()
  }),
).array()