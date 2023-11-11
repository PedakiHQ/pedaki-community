import { t } from './init.ts';
import { isLogged } from './middleware/session.middleware.ts';

export const router = t.router;
export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(isLogged);
