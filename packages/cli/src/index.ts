#!/usr/bin/env node
import meow from 'meow';
import { DOLLAR, execOrShowHelp, label, loadEnvVariables } from './help.ts';

const commands = {
  db: () => import('./db/index.ts').then(mod => mod.default),
  env: () => import('./env/index.ts').then(mod => mod.default),
};

const cli = meow(
  `
    ${label('Usage')}
        ${DOLLAR} pedaki <command> [options]
    
    ${label('Commands')}
        db      Database tools
        env     Environment tools
        
    ${label('Options')}
        --help, -h      Show help
        --version, -v   Show version
        --env-file       Path to .env file
        --ci            Force CI mode (no interactive prompts)
`,
  {
    flags: {
      help: {
        type: 'boolean',
        shortFlag: 'h',
      },
      version: {
        type: 'boolean',
        shortFlag: 'v',
      },
      ci: {
        type: 'boolean',
        default: false,
      },
      envFile: {
        type: 'string',
        default: '.env.production.local',
      },
    },
    importMeta: import.meta,
  },
);

loadEnvVariables(cli.flags.envFile);

await execOrShowHelp(cli, 0, commands);
