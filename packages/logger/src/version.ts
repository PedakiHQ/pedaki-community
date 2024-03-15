// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import packageJson from '../package.json' assert { type: 'json' };

export const VERSION = packageJson.version;
