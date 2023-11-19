import {readPackageUp} from 'read-package-up';

export const packageJson = (await readPackageUp())!;