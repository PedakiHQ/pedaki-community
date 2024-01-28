// import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
// import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import type { InstrumentationOption } from '@opentelemetry/instrumentation';
// import { Resource } from '@opentelemetry/resources';
import type { NodeSDK } from '@opentelemetry/sdk-node';
// import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-node';
// import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { env } from '~/env.ts';

// import { INSTANCE_ID } from '~/index.ts';
// import { VERSION } from '~/version.ts';

export const initTelemetry = (instrumentations: InstrumentationOption[]): NodeSDK | null => {
  if (!env.TRANSPORTERS.includes('otlp')) return null;

  if (!env.OTLP_ENDPOINT) {
    throw new Error('OTLP_ENDPOINT is not defined');
  }

  // const resource = new Resource({
  //   'service.instanceId': INSTANCE_ID,
  //   [SemanticResourceAttributes.SERVICE_NAME]: env.LOGGER_SERVICE_NAME,
  //   [SemanticResourceAttributes.SERVICE_NAMESPACE]: env.LOGGER_NAMESPACE,
  //   [SemanticResourceAttributes.SERVICE_VERSION]: VERSION,
  // });
  //
  // const exporter = new OTLPTraceExporter({
  //   url: env.OTLP_ENDPOINT,
  //   headers: env.OTLP_HEADERS,
  //   timeoutMillis: 1000,
  // });
  //
  // const spanProcessor = new BatchSpanProcessor(exporter, {
  //   maxQueueSize: 100,
  //   maxExportBatchSize: 5,
  // });
  //
  // const sdk = new NodeSDK({
  //   spanProcessor,
  //   resource,
  //   instrumentations: [...instrumentations, getNodeAutoInstrumentations()],
  // });
  //
  // sdk.start();

  // return sdk;
  return null;
};
