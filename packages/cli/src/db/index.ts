import { DOLLAR, execOrShowHelp, label } from '~/help.ts';
import type { Command } from '~/types.ts';
import meow from 'meow';

const commands = {
  init: import('./init.ts').then(mod => mod.default),
};

class DbCommand implements Command {
  async handle() {
    const cli = meow(
      `
    ${label('Usage')}
        ${DOLLAR} pedaki db <command> [options]

    ${label('Commands')}
        init    Generate initial data for the database (admin user, etc.)    
`,
      {
        importMeta: import.meta,
      },
    );

    await execOrShowHelp(cli, 1, commands);
  }
}

const cmd = new DbCommand();
export default cmd;
