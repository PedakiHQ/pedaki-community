export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { logger } = await import('@pedaki/logger');

    logger.info(`Starting pedaki app...`);
  }
}
