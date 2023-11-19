import { generateDataURL } from '@pedaki/common/utils/circle-gradient.js';
import { hashPassword } from '@pedaki/common/utils/hash.js';
import { prisma } from '@pedaki/db';
import { env } from '~/env.ts';

class AuthService {
  async createAccount(
    name: string,
    email: string,
    passwordRaw: string,
    options?: {
      needResetPassword?: boolean;
    },
  ): Promise<void> {
    const password = hashPassword(passwordRaw, env.PASSWORD_SALT);

    await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: password,
        needResetPassword: options?.needResetPassword,
        image: generateDataURL(128),
      },
    });
  }

  // TODO: add rôle methods (update user, update rôle etc)
}

const authService = new AuthService();
export { authService };
