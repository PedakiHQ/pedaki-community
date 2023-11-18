import { prisma } from '@pedaki/db';

async function main() {
  await prisma.$connect();
  console.log('Hello, world!');
}

await main();
