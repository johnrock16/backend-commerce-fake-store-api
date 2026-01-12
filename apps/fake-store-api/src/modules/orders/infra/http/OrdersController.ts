import { Router } from 'express';
import { OrderPrismaRepository } from '../prisma/OrderPrismaRepository';
import { eventBus } from '../../../../shared/event-bus/EventBus';

const repo = new OrderPrismaRepository();
export const ordersRouter = Router();

/**
 * @swagger
 * /orders:
 *   post:
 *     tags:
 *       - Orders
 *     summary: Create a new order
 *     description: Creates a new order and publishes an OrderCreated event.
 *     parameters:
 *       - in: header
 *         name: Idempotency-Key
 *         required: true
 *         description: A unique key used to ensure the request is processed only once.
 *         schema:
 *           type: string
 *           example: abc-123
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *             properties:
 *               items:
 *                 type: array
 *                 minItems: 1
 *                 description: List of products included in the order.
 *                 items:
 *                   type: object
 *                   required:
 *                     - productId
 *                     - quantity
 *                   properties:
 *                     productId:
 *                       type: string
 *                       format: uuid
 *                       description: ID of the product being ordered.
 *                       example: 400f9ec4-5e03-41b5-9cce-8545a242d775
 *                     quantity:
 *                       type: integer
 *                       minimum: 1
 *                       description: Quantity of the product.
 *                       example: 2
 *     responses:
 *       201:
 *         description: Order successfully created.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                   example: a960d649-db48-4b70-9783-102cb9ebd1b5
 *                 status:
 *                   type: string
 *                   example: CREATED
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                         example: 31e42d67-adbb-4a6b-ae84-d2ac06dd8b28
 *                       orderId:
 *                         type: string
 *                         format: uuid
 *                         example: a960d649-db48-4b70-9783-102cb9ebd1b5
 *                       productId:
 *                         type: string
 *                         format: uuid
 *                       quantity:
 *                         type: integer
 *                         example: 2
 *       400:
 *         description: Items are missing or invalid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Items required
 */
ordersRouter.post('/', async (req, res) => {
  const { items } = req.body;
  if (!items || !items.length) return res.status(400).json({ error: 'Items required' });

  const order = await repo.create(items);

  await eventBus.publish('OrderCreated', { orderId: order.id, items: order.items });

  res.status(201).json(order);
});

/**
 * @swagger
 * /orders:
 *   get:
 *     tags:
 *       - Orders
 *     summary: List all orders
 *     description: Returns all orders with their items and related product information.
 *     responses:
 *       200:
 *         description: A list of orders.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     format: uuid
 *                     example: 0d90c5ac-6c75-4e73-bdf3-fb38445f5c82
 *                   status:
 *                     type: string
 *                     example: CREATED
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                   items:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           format: uuid
 *                           example: fc23827d-3a8d-4160-bb7f-901d324ebe5e
 *                         orderId:
 *                           type: string
 *                           format: uuid
 *                         productId:
 *                           type: string
 *                           format: uuid
 *                         quantity:
 *                           type: integer
 *                           example: 2
 *                         product:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                               format: uuid
 *                               example: 14806c59-dec6-4f2e-a88f-51e4b278251d
 *                             name:
 *                               type: string
 *                               example: Tênis Fake 4
 *                             price:
 *                               type: number
 *                               format: float
 *                               example: 199.99
 *                             stock:
 *                               type: integer
 *                               example: 48
 *                             createdAt:
 *                               type: string
 *                               format: date-time
 *                             updatedAt:
 *                               type: string
 *                               format: date-time
 */
ordersRouter.get('/', async (req, res) => {
  const orders = await repo.findAll();
  res.json(orders);
});
