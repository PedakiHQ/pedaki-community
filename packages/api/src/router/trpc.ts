import { isInternal } from '~api/router/middleware/internal.middleware.ts';
import { withTelemetry } from '~api/router/middleware/telemetry.middleware.ts';
import { t } from './init.ts';
import { isLogged } from './middleware/session.middleware.ts';

export const router = t.router;
export const publicProcedure = t.procedure.use(withTelemetry);
export const privateProcedure = publicProcedure.use(isLogged);
export const internalProcedure = publicProcedure.use(isInternal);
