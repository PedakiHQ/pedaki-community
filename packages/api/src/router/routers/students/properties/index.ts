import {
  CreatePropertySchema,
  GetManyPropertiesSchema,
  PropertyWithId,
} from '@pedaki/services/students/properties/properties.model.js';
import { studentPropertiesService } from '@pedaki/services/students/properties/properties.service.js';
import { privateProcedure, router } from '~api/router/trpc.ts';

export const studentPropertiesRouter = router({
  getMany: privateProcedure.output(GetManyPropertiesSchema).query(() => {
    return studentPropertiesService.getProperties();
  }),

  create: privateProcedure
    .input(CreatePropertySchema)
    .output(PropertyWithId)
    .mutation(async ({ input }) => {
      return await studentPropertiesService.addNewProperty(input);
    }),

  delete: privateProcedure
    .input(PropertyWithId.pick({ id: true }))
    .output(PropertyWithId.pick({ id: true }))
    .mutation(async ({ input }) => {
      return await studentPropertiesService.deleteProperty(input);
    }),
});
