import fs from 'fs';
import {generateKey, parseKeySync} from '@47ng/cloak';
import {CHECK, CROSS, DOLLAR, handleBaseFlags, IS_CI, label} from '~/help.ts';
import type {Command} from '~/types.ts';
import chalk from 'chalk';
import inquirer from 'inquirer';
import meow from 'meow';
import {$} from 'execa';
import {packageJson} from "~/version.ts";
import ora from "ora";

const HIDE_VALUE_FOR = ['PRISMA_ENCRYPTION_KEY', 'PASSWORD_SALT'] as const;

class EnvGenerateCommand implements Command {
    #tag = 'latest';
    #domain = 'localhost';
    #key = '';
    #salt = '';

    async handle() {
        const cli = meow(
            `
    ${label('Usage')}
        ${DOLLAR} pedaki env generate [options]

    ${label('Options')}
        --domain, -d      Domain name
        --tag, -t         Image tag
        --key, -k         Encryption key
        
    ${label('Examples')}
        Generate env file with domain name and image tag
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
            console.log()
            this.#domain = await this.askForDomain(cli.flags);
            this.#key = await this.askForEncryptionKey(cli.flags);
            this.#salt = await this.askForPasswordSalt(cli.flags);

            env = this.buildEnvFile();
            confirm = await this.confirmEnvFile(env);
            if (!confirm) {
                console.log(CROSS + ' Try again');
                console.log();
            }
        } while (!confirm);

        this.writeEnvFile(env);
    }

    async askForTag(flags: Record<string, any>): Promise<string> {
        if (IS_CI) {
            return 'latest';
        }

        if (flags.tag) {
            console.log(CHECK + ' Using provided tag (' + flags.tag + ')');
            return flags.tag;
        }
        const localVersion = packageJson.packageJson.version;

        // use inquirer
        const question = {
            type: 'input',
            name: 'tag',
            message: 'Image tag',
            default: localVersion,
        };

        console.log(chalk.bold('What version do you want to install?'));
        const url = chalk.underline`https://github.com/PedakiHQ/pedaki/pkgs/container/pedaki/versions`;
        console.log(chalk.gray`You can find the list of available versions here: ${url}`);

        const answer = await inquirer.prompt([question]);

        return answer.tag;
    }

    async checkoutTag(tag: string) {
        if (IS_CI) {
            console.log(CHECK + ' CI environment, skipping checkout')
            return;
        }

        const spinner = ora('Checking out tag').start();

        const localVersion = packageJson.packageJson.version;
        if (tag === localVersion) {
            spinner.succeed(`Already on version ${tag}, skipping checkout`);
            return;
        }

        // git fetch to be sure
        spinner.info('Updating local repository...');
        await $`git fetch --all --tags --prune`;

        spinner.info('Checking out version...');

        // get current git branch
        const {stdout: currentBranch} = await $`git branch --show-current`;
        // check if we have stuff to pull
        const {stdout: hasChanges} = await $`git status --porcelain`;

        if (hasChanges) {
            spinner.warn('You have uncommitted changes. Please commit or stash them before continuing.');
            const question = {
                type: 'confirm',
                name: 'confirm',
                message: 'Do you want to reset your changes?',
                default: false,
            };
            const answer = await inquirer.prompt([question]);
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

        spinner.succeed("Please restart the install script to use the new version");
        process.exit(0);
    }

    async askForDomain(flags: Record<string, any>): Promise<string> {
        if (IS_CI) {
            return 'localhost';
        }

        if (flags.domain) {
            console.log(CHECK + ' Using provided domain (' + flags.domain + ')');
            return flags.domain;
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

        console.log(chalk.bold('What is your domain name?'));
        console.log(
            chalk.gray`This is used to generate the SSL certificate and to configure the web server.`,
        );
        console.log(
            chalk.gray`You must have a DNS record pointing to your server's IP address before running this command.`,
        );

        const answer = await inquirer.prompt([question]);
        console.log(); // empty line

        return answer.domain;
    }

    async askForEncryptionKey(flags: Record<string, any>): Promise<string> {
        if (IS_CI) {
            return generateKey();
        }

        if (flags.key) {
            console.log(CHECK + ' Using provided key');
            return flags.key;
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

        console.log(chalk.bold('Encryption key'));
        console.log(chalk.gray`This is used to encrypt your data.`);
        console.log(chalk.gray`If you don't provide a key, a random one will be generated.`);

        const answer = await inquirer.prompt([question]);
        console.log(); // empty line

        if (!answer.key) {
            // Generate a random key using @cloak/
            return generateKey();
        }

        return answer.key;
    }

    async askForPasswordSalt(flags: Record<string, any>): Promise<string> {
        if (IS_CI) {
            return generateKey();
        }

        if (flags.salt) {
            console.log(CHECK + ' Using provided salt');
            return flags.salt;
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

        console.log(chalk.bold('Password salt'));
        console.log(chalk.gray`This is used to hash your passwords.`);
        console.log(chalk.gray`If you don't provide a salt, a random one will be generated.`);

        const answer = await inquirer.prompt([question]);
        console.log(); // empty line

        if (!answer?.salt) {
            // Generate a random key using @cloak/
            return generateKey();
        }

        return answer.salt;
    }

    buildEnvFile() {
        const env = `
# Pedaki environment variables
# This file was generated by Pedaki CLI

PEDAKI_TAG=${this.#tag}
PEDAKI_DOMAIN=${this.#domain}

DATABASE_URL=mysql://pedaki:pedaki@db:3306/pedaki
PRISMA_ENCRYPTION_KEY=${this.#key}
PASSWORD_SALT=${this.#salt}
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

        console.log(chalk.bold('Here is your configuration:'));
        const prefix = chalk.gray('|  ');
        const lines = env.split('\n').map(line => {
            const [key] = line.split('=', 1);
            if (HIDE_VALUE_FOR.includes(key as (typeof HIDE_VALUE_FOR)[number])) {
                return `${key}=********`;
            }
            return line;
        });
        console.log(prefix + lines.join('\n' + prefix));
        console.log();

        const answer = await inquirer.prompt([question]);
        console.log(); // empty line

        return answer.confirm;
    }

    writeEnvFile(env: string) {
        fs.writeFileSync('.env.production.local', env);
        console.log(CHECK + ' Configuration saved to .env.production.local');
    }
}

const cmd = new EnvGenerateCommand();
export default cmd;
