import { matchPassword } from '@pedaki/common/utils/hash';
import { prisma } from '@pedaki/db';

export const getCurrentPassword = async (email: string) => {
  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: email,
    },
    select: {
      password: true,
    },
  });

  return user.password;
};

export const assertIsCurrentPassword = async (email: string, password: string) => {
  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: email,
    },
    select: {
      password: true,
    },
  });
  const passwordMatch = matchPassword(password, user.password!, process.env.PASSWORD_SALT!);

  if (!passwordMatch) {
    throw new Error('Invalid password');
  }
};
