import { DOLLAR, execOrShowHelp, label } from '~/help.ts';
import type { Command } from '~/types.ts';
import meow from 'meow';

const commands = {
  generate: () => import('./generate.ts').then(mod => mod.default),
};

class EnvCommand implements Command {
  async handle() {
    const cli = meow(
      `
    ${label('Usage')}
        ${DOLLAR} pedaki env <command> [options]

    ${label('Commands')}
        generate      Generate .env.production.local file
`,
      {
        importMeta: import.meta,
      },
    );

    await execOrShowHelp(cli, 1, commands);
  }
}

const cmd = new EnvCommand();
export default cmd;
