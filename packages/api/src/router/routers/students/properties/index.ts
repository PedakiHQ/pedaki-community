import { GetManyPropertiesSchema } from '@pedaki/services/students/properties/properties.model.js';
import { studentPropertiesService } from '@pedaki/services/students/properties/properties.service.js';
import { privateProcedure, router } from '~api/router/trpc.ts';

export const studentPropertiesRouter = router({
  getMany: privateProcedure.output(GetManyPropertiesSchema).query(() => {
    return studentPropertiesService.getProperties();
  }),
});
