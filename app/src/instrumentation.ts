export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { logger } = await import('@pedaki/logger');

    logger.info(`Starting pedaki app...`);

    const { initTelemetry } = await import('@pedaki/logger/telemetry');
    const { PrismaInstrumentation } = await import('@prisma/instrumentation');

    initTelemetry([new PrismaInstrumentation()]);

    logger.info(`Started pedaki app`);
  }
}
