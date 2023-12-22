import fs from 'fs';
import { generateKey, parseKeySync } from '@47ng/cloak';
import { logger } from '@pedaki/logger';
import { CHECK, CROSS, DOLLAR, handleBaseFlags, IS_CI, label } from '~/help.ts';
import type { Command } from '~/types.ts';
import { VERSION } from '~/version.ts';
import chalk from 'chalk';
import { $ } from 'execa';
import inquirer from 'inquirer';
import meow from 'meow';
import ora from 'ora';

const HIDE_VALUE_FOR = ['PRISMA_ENCRYPTION_KEY', 'PASSWORD_SALT', 'RESEND_API_KEY'] as const;

class EnvGenerateCommand implements Command {
  #tag = 'latest';
  #domain = 'localhost';
  #emailDomain = '';
  #key = '';
  #salt = '';
  #authSecret = '';
  #resendApiKey = '';

  async handle() {
    const cli = meow(
      `
    ${label('Usage')}
        ${DOLLAR} pedaki env generate [options]

    ${label('Options')}
        --domain, -d      Domain name
        --tag, -t         Image tag
        --key, -k         Encryption key
        --salt, -s        Password salt
        --auth-secret     Auth secret
        --resend-api-key  Resend API key
        --email-domain    Email domain
        
    ${label('Examples')}
        Generate env file with predefined domain name and image tag
        ${DOLLAR} pedaki env generate --domain example.com --tag latest
`,
      {
        flags: {
          domain: {
            type: 'string',
            shortFlag: 'd',
          },
          tag: {
            type: 'string',
            shortFlag: 't',
          },
          key: {
            type: 'string',
            shortFlag: 'k',
          },
          salt: {
            type: 'string',
            shortFlag: 's',
          },
          authSecret: {
            type: 'string',
          },
          resendApiKey: {
            type: 'string',
          },
          emailDomain: {
            type: 'string',
          },
        },
        importMeta: import.meta,
      },
    );

    handleBaseFlags(cli);

    let confirm = false;
    let env: string;
    do {
      this.#tag = await this.askForTag(cli.flags);
      await this.checkoutTag(this.#tag);
      console.log();
      this.#domain = await this.askForDomain(cli.flags);
      this.#key = await this.askForEncryptionKey(cli.flags);
      this.#salt = await this.askForPasswordSalt(cli.flags);
      this.#authSecret = await this.askForAuthSecret(cli.flags);
      this.#resendApiKey = await this.askForResendApiKey(cli.flags);
      this.#emailDomain = await this.askForEmailDomain(cli.flags);

      env = this.buildEnvFile();
      confirm = await this.confirmEnvFile(env);
      if (!confirm) {
        logger.warn(CROSS + ' Try again');
        console.log();
      }
    } while (!confirm);

    this.writeEnvFile(env);
  }

  async askForTag(flags: Record<string, any>): Promise<string> {
    if (flags.tag) {
      logger.info(CHECK + ' Using provided tag (' + flags.tag + ')');
      return flags.tag as string;
    }

    // use inquirer
    const question = {
      type: 'input',
      name: 'tag',
      message: 'Image tag',
      default: VERSION,
    };

    logger.info(chalk.bold('What version do you want to install?'));
    const url = chalk.underline`https://github.com/PedakiHQ/pedaki/pkgs/container/pedaki/versions`;
    logger.info(chalk.gray('You can find the list of available versions here: ' + url));

    const answer = await inquirer.prompt<{ tag: string }>([question]);

    return answer.tag;
  }

  async checkoutTag(tag: string) {
    if (IS_CI) {
      logger.info(CHECK + ' CI environment, skipping checkout');
      return;
    }

    const spinner = ora('Checking out tag').start();

    if (tag === VERSION) {
      spinner.succeed(`Already on version ${tag}, skipping checkout`);
      return;
    }

    // git fetch to be sure
    spinner.info('Updating local repository...');
    await $`git fetch --all --tags --prune`;

    spinner.info('Checking out version...');

    // get current git branch
    const { stdout: currentBranch } = await $`git branch --show-current`;
    // check if we have stuff to pull
    const { stdout: hasChanges } = await $`git status --porcelain`;

    if (hasChanges) {
      spinner.warn('You have uncommitted changes. Please commit or stash them before continuing.');
      const question = {
        type: 'confirm',
        name: 'confirm',
        message: 'Do you want to reset your changes?',
        default: false,
      };
      const answer = await inquirer.prompt<{ confirm: boolean }>([question]);
      if (answer.confirm) {
        await $`git reset --hard`;
      } else {
        spinner.fail('Aborted');
        process.exit(1);
      }
    }

    // if tag is latest and we are not on main, checkout main
    if (tag === 'latest' && currentBranch !== 'main') {
      spinner.info('Checking out latest branch...');
      await $`git checkout main`;
      await $`git pull`;
    } else if (tag !== 'latest') {
      await $`git checkout ${tag}`;
      await $`git pull`;
    }

    spinner.info(`Checked out version ${tag}`);

    spinner.succeed('Please restart the install script to use the new version');
    process.exit(0);
  }

  async askForDomain(flags: Record<string, any>): Promise<string> {
    if (flags.domain) {
      logger.info(CHECK + ' Using provided domain (' + flags.domain + ')');
      return flags.domain as string;
    }

    const question = {
      type: 'input',
      name: 'domain',
      message: 'Domain name',
      default: 'localhost',
      validate: (value: string) => {
        try {
          new URL(`https://${value}`);
          return true;
        } catch (e) {
          return 'Please enter a valid domain name';
        }
      },
    };

    logger.info(chalk.bold('What is your domain name?'));
    logger.info(
      chalk.gray`This is used to generate the SSL certificate and to configure the web server.`,
    );
    logger.info(
      chalk.gray`You must have a DNS record pointing to your server's IP address before running this command.`,
    );

    const answer = await inquirer.prompt<{ domain: string }>([question]);
    console.log(); // empty line

    return answer.domain;
  }

  async askForEncryptionKey(flags: Record<string, any>): Promise<string> {
    if (flags.key) {
      logger.info(CHECK + ' Using provided encryption key');
      return flags.key as string;
    }

    if (IS_CI) {
      return generateKey();
    }

    const question = {
      type: 'password',
      name: 'key',
      message: 'Encryption key',
      mask: '*',
      isRequired: false,
      validate: (value: string) => {
        if (!value) return true; // optional

        // spaces are not allowed
        if (value.includes(' ')) {
          return 'The encryption key must not contain spaces';
        }

        try {
          parseKeySync(value);
          return true;
        } catch (e) {
          return 'The encryption key is not valid';
        }
      },
    };

    logger.info(chalk.bold('Encryption key'));
    logger.info(chalk.gray`This is used to encrypt your data.`);
    logger.info(chalk.gray`If you don't provide a key, a random one will be generated.`);

    const answer = await inquirer.prompt<{ key: string }>([question]);
    console.log(); // empty line

    if (!answer.key) {
      // Generate a random key using @cloak/
      return generateKey();
    }

    return answer.key;
  }

  async askForPasswordSalt(flags: Record<string, any>): Promise<string> {
    if (flags.salt) {
      logger.info(CHECK + ' Using provided salt');
      return flags.salt as string;
    }

    if (IS_CI) {
      return generateKey();
    }

    const question = {
      type: 'password',
      name: 'salt',
      mask: '*',
      message: 'Password salt',
      validate: (value: string) => {
        if (!value) return true; // optional

        // spaces are not allowed
        if (value.includes(' ')) {
          return 'The password salt must not contain spaces';
        }

        if (value.length < 20) {
          return 'The salt must be at least 20 characters long';
        }
        return true;
      },
    };

    logger.info(chalk.bold('Password salt'));
    logger.info(chalk.gray`This is used to hash your passwords.`);
    logger.info(chalk.gray`If you don't provide a salt, a random one will be generated.`);

    const answer = await inquirer.prompt<{ salt: string }>([question]);
    console.log(); // empty line

    if (!answer?.salt) {
      // Generate a random key using @cloak/
      return generateKey();
    }

    return answer.salt;
  }

  async askForAuthSecret(flags: Record<string, any>): Promise<string> {
    if (flags.authSecret) {
      logger.info(CHECK + ' Using provided auth secret');
      return flags.authSecret as string;
    }

    if (IS_CI) {
      return generateKey();
    }

    const question = {
      type: 'password',
      name: 'authSecret',
      mask: '*',
      message: 'Auth secret',
    };

    logger.info(chalk.bold('Auth secret'));
    logger.info(chalk.gray`This is used to sign your auth sessions.`);
    logger.info(chalk.gray`If you don't provide it, a random one will be generated.`);

    const answer = await inquirer.prompt<{ authSecret: string }>([question]);
    console.log(); // empty line

    if (!answer?.authSecret) {
      // Generate a random key using @cloak/
      return generateKey();
    }

    return answer.authSecret;
  }

  async askForResendApiKey(flags: Record<string, any>): Promise<string> {
    if (flags.resendApiKey) {
      logger.info(CHECK + ' Using provided Resend API key');
      return flags.resendApiKey as string;
    }

    if (IS_CI) {
      return 'null';
    }

    // Resend API is used to send emails
    // https://resend.com/

    logger.info(chalk.bold('Resend API key'));
    const url = chalk.underline`https://resend.com`;
    logger.info(chalk.gray('To send emails, we are using Resend. ' + url));
    logger.info(chalk.gray`You can create an account for free and get an API key.`);

    const question = {
      type: 'password',
      name: 'resendApiKey',
      mask: '*',
      message: 'Resend API key',
      validate: (value: string) => {
        // should start with re_
        if (!value.startsWith('re_')) {
          return 'The Resend API key must start with re_';
        }
        // spaces are not allowed
        if (value.includes(' ')) {
          return 'The Resend API key must not contain spaces';
        }

        return true;
      },
    };

    const answer = await inquirer.prompt<{ resendApiKey: string }>([question]);
    console.log(); // empty line

    return answer.resendApiKey;
  }

  async askForEmailDomain(flags: Record<string, any>): Promise<string> {
    if (flags.emailDomain) {
      logger.info(CHECK + ' Using provided email domain (' + flags.emailDomain + ')');
      return flags.emailDomain as string;
    }

    // Resend API is used to send emails
    // https://resend.com/

    const question = {
      name: 'emailDomain',
      message: 'Email domain',
      validate: (value: string) => {
        // no space
        if (value.includes(' ')) {
          return 'The email domain must not contain spaces';
        }

        return true;
      },
    };

    logger.info(
      chalk.gray`The email domain will be shown in the "from" field of the emails sent by Pedaki.`,
    );
    logger.info(
      chalk.gray`for example, if you enter "example.com", emails will be sent from "no-reply@example.com".`,
    );
    logger.info(chalk.gray`Note that you must have registered this domain with Resend.`);

    const answer = await inquirer.prompt<{ emailDomain: string }>([question]);
    console.log(); // empty line

    return answer.emailDomain;
  }

  buildEnvFile() {
    const env = `
# Pedaki environment variables
# This file was generated by Pedaki CLI

PEDAKI_TAG=${this.#tag}
PEDAKI_DOMAIN=${this.#domain}

DATABASE_URL=mysql://pedaki:pedaki@127.0.0.1:3306/pedaki
PRISMA_ENCRYPTION_KEY=${this.#key}

PASSWORD_SALT=${this.#salt}
AUTH_SECRET=${this.#authSecret}

RESEND_API_KEY=${this.#resendApiKey}
RESEND_EMAIL_DOMAIN=${this.#emailDomain}
`;

    // remove first and last line
    const lines = env.split('\n');
    lines.pop();
    lines.shift();
    return lines.join('\n');
  }

  async confirmEnvFile(env: string): Promise<boolean> {
    if (IS_CI) {
      return true;
    }

    const question = {
      type: 'confirm',
      name: 'confirm',
      message: 'Do you want to use this configuration?',
      default: true,
    };

    logger.info(chalk.bold('Here is your configuration:'));
    const prefix = chalk.gray('|  ');
    const lines = env.split('\n').map(line => {
      const [key] = line.split('=', 1);
      if (HIDE_VALUE_FOR.includes(key as (typeof HIDE_VALUE_FOR)[number])) {
        return `${key}=********`;
      }
      return line;
    });
    logger.info(prefix + lines.join('\n' + prefix));
    console.log(); // Empty line

    const answer = await inquirer.prompt<{ confirm: boolean }>([question]);
    console.log(); // Empty line

    return answer.confirm;
  }

  writeEnvFile(env: string) {
    fs.writeFileSync('.env.production.local', env);
    logger.info(CHECK + ' Configuration saved to .env.production.local');
  }
}

const cmd = new EnvGenerateCommand();
export default cmd;
