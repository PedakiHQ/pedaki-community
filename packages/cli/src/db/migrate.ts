import { DOLLAR, handleBaseFlags, label } from '~/help.ts';
import type { Command } from '~/types.ts';
import { $ } from 'execa';
import meow from 'meow';
import ora from 'ora';

class DbMigrateCommand implements Command {
  async handle() {
    const cli = meow(
      `
    ${label('Usage')}
        ${DOLLAR} pedaki db migrate [options]
`,
      {
        flags: {
          email: {
            type: 'string',
            shortFlag: 'e',
          },
        },
        importMeta: import.meta,
      },
    );

    handleBaseFlags(cli);

    await this.applyPrismaMigrations();
  }

  async applyPrismaMigrations() {
    const spinner = ora('Applying Database migrations').start();

    try {
      // install prisma deps
      await $`pnpm install --filter @pedaki/db --ignore-script -s --config.confirmModulesPurge=false`;
      spinner.info('Dependencies installed');

      // go in packages/db
      const cwd = process.cwd();
      const dbPath = cwd + '/packages/db';
      const $db = $({ cwd: dbPath });

      // generate prisma client
      await $db`pnpm prisma generate`;
      spinner.info('Client generated');

      await $db`pnpm prisma migrate deploy`;
      spinner.succeed('Database migrations applied');
    } catch (e) {
      spinner.fail('Database migrations failed');
      console.error(e);
      process.exit(1);
    }
  }
}

const cmd = new DbMigrateCommand();
export default cmd;
