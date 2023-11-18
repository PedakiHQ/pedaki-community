// template method: use with label`...`

import type { BaseOptions, Command } from '~/types.ts';
import chalk from 'chalk';
import type { Result } from 'meow';

export const label = (value: string) => chalk.blue.bold(value);
export const DOLLAR = chalk.gray.bold('$');
export const CHECK = chalk.green.bold('✔');
export const CROSS = chalk.red.bold('✘');

export let IS_CI = process.env.CI === 'true';

export const execOrShowHelp = async (
  cli: Result<any>,
  position: number,
  commands: Record<string, Promise<Command>>,
) => {
  const command = cli.input[position];
  const options = cli.flags as BaseOptions;

  if (!command) {
    cli.showHelp();
    process.exit(1);
  }

  if (command in commands) {
    const cmd = commands[command]!;
    await cmd.then(async mod => {
      await mod.handle(options);
    });
  } else {
    console.log(`${CROSS} Unknown command "${cli.input.join(' ')}"`);
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
    console.log(cli.pkg?.version);
    process.exit(0);
  }

  if (options.ci ?? cli.flags.ci) {
    console.log(`${CHECK} CI mode enabled`);
    IS_CI = true;
  }
};
