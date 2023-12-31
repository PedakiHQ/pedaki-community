import { checkEnvVariables, DOLLAR, handleBaseFlags, label } from '~/help.ts';
import type { Command } from '~/types.ts';
import { $ } from 'execa';
import meow from 'meow';
import ora from 'ora';

class DbResetCommand implements Command {
  async handle() {
    const cli = meow(
      `
    ${label('Usage')}
        ${DOLLAR} pedaki db reset [options]
`,
      {
        flags: {},
        importMeta: import.meta,
      },
    );

    handleBaseFlags(cli);

    checkEnvVariables(['DATABASE_URL', 'PRISMA_ENCRYPTION_KEY']);

    await this.applyPrismaReset();
  }

  async applyPrismaReset() {
    const spinner = ora('Resetting Database').start();

    const dropAllTables = `
    DROP DATABASE IF EXISTS pedaki;
    CREATE DATABASE pedaki;
    `;

    const cwd = process.cwd();
    const dbPath = cwd + '/packages/db';
    const $db = $({ cwd: dbPath });

    await $db({ input: dropAllTables })`pnpm prisma db execute --stdin`;

    spinner.succeed('Database reset, run pedaki db migrate to apply migrations');
  }
}

const cmd = new DbResetCommand();
export default cmd;
