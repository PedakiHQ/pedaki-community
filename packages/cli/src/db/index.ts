import { DOLLAR, execOrShowHelp, handleBaseFlags, label } from '~/help.ts';
import type { Command } from '~/types.ts';
import meow from 'meow';

const commands = {
  migrate: () => import('./migrate.ts').then(mod => mod.default),
  init: () => import('./init.ts').then(mod => mod.default),
  reset: () => import('./reset.ts').then(mod => mod.default),
};

class DbCommand implements Command {
  async handle() {
    const cli = meow(
      `
    ${label('Usage')}
        ${DOLLAR} pedaki db <command> [options]

    ${label('Commands')}
        migrate  Apply pending migrations to the database    
        init     Generate initial data for the database (admin user, etc.)    
        reset    Reset the database (drop all tables)
`,
      {
        importMeta: import.meta,
      },
    );
    handleBaseFlags(cli);

    await execOrShowHelp(cli, 1, commands);
  }
}

const cmd = new DbCommand();
export default cmd;
