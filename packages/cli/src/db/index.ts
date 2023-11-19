import { CHECK, CROSS, DOLLAR, execOrShowHelp, label } from '~/help.ts';
import type { Command } from '~/types.ts';
import dotenv from 'dotenv';
import meow from 'meow';

const commands = {
  migrate: () => import('./migrate.ts').then(mod => mod.default),
  init: () => import('./init.ts').then(mod => mod.default),
    reset: () => import('./reset.ts').then(mod => mod.default),
};

const REQUIRED_ENV = [
  'DATABASE_URL',
  'RESEND_API_KEY',
  'PRISMA_ENCRYPTION_KEY',
  'PASSWORD_SALT',
] as const;

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

    this.checkEnvVariables();

    await execOrShowHelp(cli, 1, commands);
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
}

const cmd = new DbCommand();
export default cmd;
