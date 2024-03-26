import { loggerLink } from '@trpc/client';
import { experimental_nextCacheLink } from '@trpc/next/app-dir/links/nextCache';
import { experimental_createTRPCNextAppDirServer } from '@trpc/next/app-dir/server';
import { env } from '~/env.ts';
import { appRouter } from '~api/router/router';
import { internalData } from '~api/tests/helpers/base-user.ts';
import SuperJSON from 'superjson';

const INTERNAL_HEADERS = new Headers();
INTERNAL_HEADERS.set('x-pedaki-secret', env.API_INTERNAL_SECRET);

/**
 * This client invokes procedures directly on the server without fetching over HTTP.
 */
export const api = experimental_createTRPCNextAppDirServer<typeof appRouter>({
  config() {
    return {
      links: [
        loggerLink({
          enabled: () => false,
        }),
        experimental_nextCacheLink({
          transformer: SuperJSON,
          revalidate: 1, // todo cache ? cpt il faut actualiser deux fois pour que le cache parte
          router: appRouter,
          // eslint-disable-next-line @typescript-eslint/require-await
          createContext: async () => {
            return {
              session: {
                user: internalData,
                expires: new Date().toISOString(), // TODO: need to add time ?
              },
              headers: INTERNAL_HEADERS,
            };
          },
        }),
      ],
    };
  },
});
