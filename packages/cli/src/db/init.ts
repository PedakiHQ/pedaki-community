import { prisma } from '@pedaki/db';
import { logger } from '@pedaki/logger';
import { authService } from '@pedaki/services/auth/auth.service.js';
import { mailService } from '@pedaki/services/mail/mail.service.js';
import { CHECK, checkEnvVariables, CROSS, DOLLAR, handleBaseFlags, IS_CI, label } from '~/help.ts';
import type { Command } from '~/types.ts';
import chalk from 'chalk';
import inquirer from 'inquirer';
import meow from 'meow';
import ora from 'ora';
import z from 'zod';

class DbInitCommand implements Command {
  #email = '';
  #name = '';

  #activationToken = '';

  async handle() {
    const cli = meow(
      `
    ${label('Usage')}
        ${DOLLAR} pedaki db init [options]
        
    ${label('Options')}
        --email, -e       Email address for the admin user
        --name, -n        Name for the admin user
        --password, -p    Password for the admin user (if not provided, an activation email will be sent)
        --force, -f       Force initialization even if database is not empty
`,
      {
        flags: {
          email: {
            type: 'string',
            shortFlag: 'e',
          },
          name: {
            type: 'string',
            shortFlag: 'n',
          },
          password: {
            type: 'string',
            shortFlag: 'p',
          },
          force: {
            type: 'boolean',
            shortFlag: 'f',
          },
        },
        importMeta: import.meta,
      },
    );

    handleBaseFlags(cli);

    checkEnvVariables(['DATABASE_URL', 'RESEND_API_KEY', 'PRISMA_ENCRYPTION_KEY', 'PASSWORD_SALT']);

    await this.checkEmptyDatabase(cli.flags);

    let confirm = false;

    do {
      this.#email = await this.askForEmail(cli.flags);
      this.#name = await this.askForName(cli.flags);

      confirm = await this.confirmCreation();
      if (!confirm) {
        logger.info(CROSS + ' Try again');
        console.log();
      }
    } while (!confirm);

    await this.createAdminUser(cli.flags);
    await this.sendMail();
  }

  async checkEmptyDatabase(flags: Record<string, any>) {
    const spinner = ora('Checking database').start();

    try {
      const count = await prisma.user.count();
      if (count > 0) {
        if (flags.force) {
          spinner.warn('Database is not empty, but --force flag is set, continuing anyway');
          return;
        }
        spinner.fail(
          'Database is not empty, aborting. You can use `pedaki db reset` to reset your database or use the --force flag to force initialization.',
        );
        process.exit(1);
      }

      spinner.succeed('Database is empty');
    } catch (e) {
      spinner.fail('Database check failed');
      logger.error(e);
      process.exit(1);
    }
  }

  async askForEmail(flags: Record<string, any>): Promise<string> {
    if (flags.email) {
      logger.info(CHECK + ' Using provided email (' + flags.email + ')');
      return flags.email as string;
    }

    const schema = z.string().email();

    // use inquirer
    const question = {
      type: 'input',
      name: 'email',
      message: 'Admin email address',
      validate: (value: string) => {
        try {
          schema.parse(value);
          return true;
        } catch (error) {
          return 'Please enter a valid email address';
        }
      },
    };

    logger.info(chalk.bold('We need an admin email address to create your account.'));
    logger.info(chalk.gray`This account will be used to manage your Pedaki workspace.`);
    logger.info(chalk.gray`We will send you a temporary password to this email address.`);

    const answer = await inquirer.prompt<{ email: string }>([question]);
    console.log();

    return answer.email;
  }

  async askForName(flags: Record<string, any>): Promise<string> {
    if (flags.name) {
      logger.info(CHECK + ' Using provided name (' + flags.name + ')');
      return flags.name as string;
    }

    // use inquirer
    const question = {
      type: 'input',
      name: 'name',
      message: 'Admin name',
      validate: (value: string) => {
        if (!value) return 'Please enter a name';
        return true;
      },
    };

    logger.info(chalk.bold('How should we call you?'));

    const answer = await inquirer.prompt<{ name: string }>([question]);
    console.log();

    return answer.name;
  }

  async confirmCreation() {
    if (IS_CI) {
      logger.info(CHECK + ' Skipping confirmation in CI');
      return true;
    }

    const question = {
      type: 'confirm',
      name: 'confirm',
      message: 'Confirm creation?',
      default: true,
    };

    const answer = await inquirer.prompt<{ confirm: boolean }>([question]);

    return answer.confirm;
  }

  async createAdminUser(flags: Record<string, any>) {
    const spinner = ora('Creating admin user').start();

    try {
      const password = (flags.password as string) || null;
      await authService.createAccount(this.#name, this.#email, password, {
        needResetPassword: !password,
      });
      if (!password) {
        this.#activationToken = await authService.createToken(this.#email, 'ACTIVATE_ACCOUNT');
      }

      spinner.succeed(`Admin user created`);
    } catch (e) {
      if ((e as { code: string }).code === 'P2002') {
        spinner.fail('A user with this email address already exists');
      } else {
        spinner.fail('Admin user creation failed');
        logger.error(e);
      }
      process.exit(1);
    }
  }

  async sendMail() {
    if (!this.#activationToken) {
      logger.info(CHECK + ' Password provided, not sending email');
      return;
    }
    const spinner = ora('Sending email').start();

    try {
      await mailService.sendActivateWorkspaceEmail(this.#email, this.#name, this.#activationToken);
      spinner.succeed(`Email sent`);
    } catch (e) {
      spinner.fail('Email sending failed');
      logger.error(e);
      process.exit(1);
    }
  }
}

const cmd = new DbInitCommand();
export default cmd;
