import swaggerJsdoc from 'swagger-jsdoc';

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Fake Store Platform API',
      version: '1.0.0',
      description:
        'Event-driven e-commerce platform with queues, webhooks, tracing and idempotency',
    },
    servers: [{ url: 'http://localhost:3000' }],
    components: {
      securitySchemes: {
        IdempotencyKey: {
          type: 'apiKey',
          in: 'header',
          name: 'Idempotency-Key',
        },
        CorrelationId: {
          type: 'apiKey',
          in: 'header',
          name: 'X-Correlation-Id',
        },
      },
    },
  },
  apis: ['./src/modules/**/*.ts', './src/shared/**/*.ts'],
});
