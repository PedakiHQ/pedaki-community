import { logger } from '@pedaki/logger';
import type { BaseOptions, Command } from '~/types.ts';
import chalk from 'chalk';
import dotenv from 'dotenv';
import type { Result } from 'meow';

export const label = (value: string) => chalk.blue.bold(value);
export const DOLLAR = chalk.gray.bold('$');
export const CHECK = chalk.green.bold('✔');
export const CROSS = chalk.red.bold('✘');

export let IS_CI = process.env.CI === 'true';

export const execOrShowHelp = async (
  cli: Result<any>,
  position: number,
  commands: Record<string, () => Promise<Command>>,
) => {
  const command = cli.input[position];
  const options = cli.flags as BaseOptions;

  if (!command) {
    cli.showHelp();
    process.exit(1);
  }

  if (command in commands) {
    const cmd = commands[command]!();
    await cmd.then(async mod => {
      await mod.handle(options);
    });
  } else {
    logger.warn({ message: `${CROSS} Unknown command "${cli.input.join(' ')}"` });
    cli.showHelp();
  }
};

export const handleBaseFlags = (cli: Result<any>) => {
  const options = cli.flags as BaseOptions;

  if (options.help ?? cli.flags.h) {
    cli.showHelp();
    process.exit(0);
  }

  if (options.version ?? cli.flags.v) {
    logger.info(cli.pkg?.version);
    process.exit(0);
  }

  if ((options.ci ?? cli.flags.ci) && !IS_CI) {
    logger.debug(`${CHECK} CI mode enabled`);
    IS_CI = true;
  }
};

export const checkEnvVariables = (required_env: readonly string[]) => {
  if (required_env.some(envVariable => !process.env[envVariable])) {
    logger.error({
      message: `${CHECK} Missing environment variables. Please check your .env.production.local file.\nRun \`pedaki env generate\` to generate a new .env.production.local file. \n   Required environment variables: ${required_env.join(
        ', ',
      )}`,
    });
    process.exit(1);
  }
};

export const loadEnvVariables = (path: string) => {
  // Check if .env.production.local exists
  dotenv.config({ path });
  logger.debug({ message: `${CHECK} Environment variables loaded from ${path}` });
};
