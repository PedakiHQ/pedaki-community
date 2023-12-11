import { generateDataURL } from '@pedaki/common/utils/circle-gradient.js';
import { hashPassword } from '@pedaki/common/utils/hash.js';
import { generateToken } from '@pedaki/common/utils/random.js';
import { prisma } from '@pedaki/db';
import { logger } from '@pedaki/logger';
import type { TokenType } from '@prisma/client';
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
        active: !options?.needResetPassword,
        image: generateDataURL(128),
      },
    });

    logger.info(`Created account for ${email}`);
  }

  async updatePassword(email: string, passwordRaw: string): Promise<void> {
    const password = hashPassword(passwordRaw, env.PASSWORD_SALT);

    await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        password: password,
        needResetPassword: false,
      },
    });

    logger.info(`Updated password for ${email}`);
  }

  async updateAccount(email: string, name: string): Promise<void> {
    await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        name: name,
      },
    });

    logger.info(`Updated account for ${email}`);
  }

  async deleteToken(token: string, type: TokenType): Promise<void> {
    // TODO: move this in a token service ?
    const result = await prisma.token.deleteMany({
      where: {
        token: token,
        type: type,
      },
    });
    logger.info(`Deleted ${result.count} ${type} tokens`);
  }

  async createToken(email: string, type: TokenType): Promise<string> {
    const token = generateToken();

    await prisma.token.create({
      data: {
        type: type,
        token: token,
        user: {
          connect: {
            email: email,
          },
        },
      },
    });

    logger.info(`Created ${type} token for ${email}`);

    return token;
  }

  async getAccountFromToken(
    token: string,
    type: TokenType,
  ): Promise<{ email: string; name: string }> {
    if (!token || !type) throw new Error('Token or type not found');

    const user = await prisma.token.findFirst({
      where: {
        token: token,
        type: type,
      },
      select: {
        user: {
          select: {
            email: true,
            name: true,
          },
        },
      },
    });

    if (!user?.user) {
      throw new Error('User not found');
    }

    return {
      email: user.user.email,
      name: user.user.name,
    };
  }

  // TODO: add rôle methods (update user, update rôle etc)
}

const authService = new AuthService();
export { authService };
