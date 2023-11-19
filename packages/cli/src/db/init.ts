import { CHECK, CROSS, DOLLAR, handleBaseFlags, label } from '~/help.ts';
import type { Command } from '~/types.ts';
import dotenv from 'dotenv';
import { $ } from 'execa';
import meow from 'meow';
import ora from 'ora';

const REQUIRED_ENV = [
  'DATABASE_URL',
  'RESEND_API_KEY',
  'PRISMA_ENCRYPTION_KEY',
  'PASSWORD_SALT',
] as const;

class DbInitCommand implements Command {
  async handle() {
    const cli = meow(
      `
    ${label('Usage')}
        ${DOLLAR} pedaki db init [options]
        
    ${label('Options')}
        --email, -e       Email address for the admin user
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
    this.checkEnvVariables();

    await this.applyPrismaMigrations();
  }

  checkEnvVariables() {
    dotenv.config({ path: './.env.production.local' });

    if (REQUIRED_ENV.some(envVariable => !process.env[envVariable])) {
      console.error(
        CROSS,
        'Missing environment variables. Please check your .env.production.local file.\nRun `pedaki env generate` to generate a new .env.production.local file.',
      );
      process.exit(1);
    }

    console.log(CHECK, 'Environment variables loaded from .env.production.local');
  }

  async applyPrismaMigrations() {
    const spinner = ora('Applying Database migrations').start();

    try {
      // install prisma and generate client
      await $`pnpm install --filter @pedaki/db --production --frozen-lockfile --ignore-script -s`;
      // go in packages/db
      const cwd = process.cwd();
      const dbPath = cwd + '/packages/db';
      const $db = $({ cwd: dbPath });

      // generate prisma client
      await $db`pnpm prisma generate`;

      await $db`pnpm prisma migrate deploy`;
      spinner.succeed('Database migrations applied');
    } catch (e) {
      spinner.fail('Database migrations failed');
      console.error(e);
      process.exit(1);
    }
  }
}

const cmd = new DbInitCommand();
export default cmd;
