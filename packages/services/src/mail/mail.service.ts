import { logger } from '@pedaki/logger';
import { sendEmail } from '@pedaki/mailer/send-email.js';
import { BASE_URL } from '~/constants.ts';
import InitializeWorkspaceMail from '~/mail/templates/InitializeWorkspaceMail.tsx';
import InviteAccountMail from '~/mail/templates/InviteAccountMail.tsx';

class MailService {
  async sendActivateWorkspaceEmail(email: string, name: string, token: string): Promise<void> {
    const url = BASE_URL + '/auth/activate?token=' + token;
    await sendEmail(email, InitializeWorkspaceMail, { name, url });
    logger.info(`Sent activation email to ${email}`);
  }

  async sendInviteEmail(email: string, token: string): Promise<void> {
    const url = BASE_URL + '/auth/join?token=' + token;
    await sendEmail(email, InviteAccountMail, { url });
    logger.info(`Sent invitation email to ${email}`);
  }
}

const mailService = new MailService();
export { mailService };
