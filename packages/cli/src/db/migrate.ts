import { prisma } from '@pedaki/db';
import { migrate } from '@pedaki/db/encryption/migrations/index.js';
import { logger } from '@pedaki/logger';
import { checkEnvVariables, DOLLAR, handleBaseFlags, label } from '~/help.ts';
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
        
    ${label('Options')}
        --skip-install, -s    Skip installing dependencies
`,
      {
        flags: {
          skipInstall: {
            type: 'boolean',
            shortFlag: 's',
            default: false,
          },
        },
        importMeta: import.meta,
      },
    );

    handleBaseFlags(cli);

    checkEnvVariables(['DATABASE_URL', 'PRISMA_ENCRYPTION_KEY']);

    await this.applyPrismaMigrations(cli.flags);
  }

  async applyPrismaMigrations(flags: { skipInstall: boolean }) {
    const spinner = ora('Applying Database migrations').start();

    try {
      if (!flags.skipInstall) {
        // install prisma deps
        spinner.info('Installing dependencies');
        await $`pnpm install --filter @pedaki/db --ignore-script -s --config.confirmModulesPurge=false`;
        spinner.info('Dependencies installed');
      } else {
        spinner.info('Skipping dependencies installation');
      }

      // go in packages/db
      const cwd = process.cwd();
      const dbPath = cwd + '/packages/db';
      const $db = $({ cwd: dbPath });

      // generate prisma client
      await $db`pnpm prisma generate`;
      spinner.info('Client generated');

      await $db`pnpm prisma migrate deploy`;
      spinner.info('Database tables deployed');

      if (process.env.PRISMA_DECRYPTION_KEY) {
        await migrate(prisma);
        spinner.succeed('Encryption keys migrated');
      } else {
        spinner.succeed('Skipped rotating encryption keys');
      }
    } catch (e) {
      spinner.fail('Database migrations failed');
      logger.error(e);
      process.exit(1);
    }
  }
}

const cmd = new DbMigrateCommand();
export default cmd;
