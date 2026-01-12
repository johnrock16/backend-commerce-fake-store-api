import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './shared/swagger/swagger';
import { rateLimitMiddleware } from './infra/http/rate-limit/rateLimitMiddleware';
import { abuseDetectionMiddleware } from './infra/http/abuse-detectition/abuseDetectitionMiddleware';
import { correlationMiddleware } from './shared/tracing/correlation';
import { productsRouter } from './modules/products/infra/http/ProductsController';
import { ordersRouter } from './modules/orders/infra/http/OrdersController';
import { metricsRouter } from './modules/metrics/infra/http/MetricsController';
import { webhooksRouter } from './modules/webhooks/infra/http/WebhooksController';
import { adminMetricsRouter } from './modules/admin/infra/http/MetricsController';
import { idempotencyMiddleware } from './shared/idempotency/middleware';
import { captureIdempotentResponse } from './shared/idempotency/responseCapture';

const app = express();
app.use(express.json());

app.use(correlationMiddleware);
app.use(idempotencyMiddleware);
app.use(captureIdempotentResponse);
app.use(rateLimitMiddleware);
app.use(abuseDetectionMiddleware);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/products', productsRouter);
app.use('/orders', ordersRouter);

app.get('/health', (_: any, res: any) => res.json({ status: 'ok' }));
app.use('/metrics', metricsRouter);

app.use('/webhooks', webhooksRouter);

app.use('/admin/metrics', adminMetricsRouter);

app.listen(3000, () => console.log('Fake Store API running on http://localhost:3000'));
