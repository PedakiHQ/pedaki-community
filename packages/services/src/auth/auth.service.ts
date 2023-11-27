import { generateDataURL } from '@pedaki/common/utils/circle-gradient.js';
import { hashPassword } from '@pedaki/common/utils/hash.js';
import { generateToken } from '@pedaki/common/utils/random.js';
import { prisma } from '@pedaki/db';
import { logger } from '@pedaki/logger';
import { env } from '~/env.ts';

class AuthService {
  async createAccount(
    name: string,
    email: string,
    passwordRaw: string | null,
    options?: {
      needResetPassword?: boolean;
    },
  ): Promise<void> {
    const password = passwordRaw == null ? undefined : hashPassword(passwordRaw, env.PASSWORD_SALT);

    await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: password,
        needResetPassword: options?.needResetPassword,
        image: generateDataURL(128),
      },
    });

    logger.info(`Created account for ${email}`);
  }

  async createActivateAccountToken(email: string): Promise<string> {
    const token = generateToken();

    await prisma.token.create({
      data: {
        type: 'ACTIVATE_ACCOUNT',
        token: token,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        user: {
          connect: {
            email: email,
          },
        },
      },
    });

    logger.info(`Created activation token for ${email}`);

    return token;
  }

  // TODO: add rôle methods (update user, update rôle etc)
}

const authService = new AuthService();
export { authService };
