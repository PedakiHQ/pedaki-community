import { prisma } from '@pedaki/db';
import { DEFAULT_LOGO_URL } from '@pedaki/services/workspace/constants.js';
import { checkEnvVariables, DOLLAR, handleBaseFlags, label } from '~/help.ts';
import type { Command } from '~/types.ts';
import meow from 'meow';
import ora from 'ora';

class DbInitSettingsCommand implements Command {
  async handle() {
    const cli = meow(
      `
    ${label('Usage')}
        ${DOLLAR} pedaki db init settings [options]
`,
      {
        importMeta: import.meta,
      },
    );

    handleBaseFlags(cli);

    checkEnvVariables(['DATABASE_URL', 'PRISMA_ENCRYPTION_KEY']);

    await this.seedSettings();
  }

  async seedSettings() {
    // Here we don't care if the database is already seeded, we only update null values (or create a row if it doesn't exist)
    const spinner = ora('Seeding settings').start();

    const currentSettings = await prisma.workspaceSetting.findFirst({
      where: { id: 1 },
    });

    const newSettings = {
      name: process.env.NEXT_PUBLIC_PEDAKI_NAME ?? 'Pedaki',
      logoUrl: DEFAULT_LOGO_URL,
      defaultLanguage: 'fr',
    };

    const settingsDiff = Object.keys(newSettings).reduce(
      (acc, key) => {
        if (!currentSettings || currentSettings[key] === null) {
          // @ts-expect-error: weird typing
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          acc[key] = newSettings[key];
        }
        return acc;
      },
      {} as Record<string, any>,
    );

    await prisma.workspaceSetting.upsert({
      where: { id: 1 }, // we only have one row
      update: settingsDiff,
      create: newSettings,
    });

    spinner.succeed('Settings seeded');
  }
}

const cmd = new DbInitSettingsCommand();
export default cmd;
