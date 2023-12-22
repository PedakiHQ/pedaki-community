import { auth } from '@pedaki/auth/server';
import { loggerLink } from '@trpc/client';
import { experimental_nextCacheLink } from '@trpc/next/app-dir/links/nextCache';
import { experimental_createTRPCNextAppDirServer } from '@trpc/next/app-dir/server';
import { appRouter } from '~api/router/router';
import SuperJSON from 'superjson';

/**
 * This client invokes procedures directly on the server without fetching over HTTP.
 */
export const api = experimental_createTRPCNextAppDirServer<typeof appRouter>({
  config() {
    return {
      transformer: SuperJSON,
      links: [
        loggerLink({
          enabled: () => false,
        }),
        experimental_nextCacheLink({
          revalidate: 1, // todo cache ? cpt il faut actualiser deux fois pour que le cache parte
          router: appRouter,
          createContext: async () => {
            return {
              session: null, // todo INTERNAL
            };
          },
        }),
      ],
    };
  },
});
