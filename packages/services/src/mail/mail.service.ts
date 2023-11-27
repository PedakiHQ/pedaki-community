import { logger } from '@pedaki/logger';
import { sendEmail } from '@pedaki/mailer/send-email.js';
import { BASE_URL } from '~/constants.ts';
import InitializeAccountMail from '~/mail/templates/InitializeAccountMail.tsx';

class MailService {
  async sendActivateAccountEmail(email: string, name: string, token: string): Promise<void> {
    const url = BASE_URL + '/auth/activate-account?token=' + token;
    await sendEmail(email, InitializeAccountMail, { name, url });
    logger.info(`Sent activation email to ${email}`);
  }
}

const mailService = new MailService();
export { mailService };
