import { DOLLAR, execOrShowHelp, handleBaseFlags, label } from '~/help.ts';
import type { Command } from '~/types.ts';
import meow from 'meow';

const commands = {
  settings: () => import('./settings.ts').then(mod => mod.default),
  admin: () => import('./admin.ts').then(mod => mod.default),
};

class DbInitCommand implements Command {
  async handle() {
    const cli = meow(
      `
    ${label('Usage')}
        ${DOLLAR} pedaki db init <command> [options]

    ${label('Commands')}
        admin    Create the admin user
        settings Initialize the settings
`,
      {
        importMeta: import.meta,
      },
    );
    handleBaseFlags(cli);

    await execOrShowHelp(cli, 2, commands);
  }
}

const cmd = new DbInitCommand();
export default cmd;
