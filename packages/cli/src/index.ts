#!/usr/bin/env node
import type { Command } from '~/types.ts';
import meow from 'meow';
import { DOLLAR, execOrShowHelp, label } from './help.ts';

const commands: Record<string, Promise<Command>> = {
  db: import('./db/index.ts').then(mod => mod.default),
  env: import('./env/index.ts').then(mod => mod.default),
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
    },
    importMeta: import.meta,
  },
);

await execOrShowHelp(cli, 0, commands);
