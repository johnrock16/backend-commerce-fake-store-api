import { Router } from 'express';
import { ProductPrismaRepository } from '../prisma/ProductPrismaRepository';
import { eventBus } from '../../../../shared/event-bus/EventBus';

export const productsRouter = Router();
const repository = new ProductPrismaRepository();

/**
 * @swagger
 * /products:
 *   post:
 *     tags:
 *       - Products
 *     summary: Create a new product
 *     description: Creates a product and publishes a ProductCreated event.
 *     parameters:
 *       - in: header
 *         name: Idempotency-Key
 *         required: true
 *         description: A unique key used to guarantee idempotent product creation.
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
 *               - name
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *                 description: Product name.
 *                 example: Fake Hat
 *               price:
 *                 type: number
 *                 format: float
 *                 description: Product price.
 *                 example: 199.99
 *               stock:
 *                 type: integer
 *                 description: Initial available stock.
 *                 example: 100
 *     responses:
 *       201:
 *         description: Product successfully created.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                   example: fd04b11c-4316-4ff4-8712-b70e3acd60d2
 *                 name:
 *                   type: string
 *                   example: Fake Hat
 *                 price:
 *                   type: number
 *                   format: float
 *                   example: 199.99
 *                 stock:
 *                   type: integer
 *                   example: 100
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Missing or invalid input.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: name and price required
 */
productsRouter.post('/', async (req, res) => {
  const { name, price } = req.body;
  if (!name || price == null) return res.status(400).json({ error: 'name and price required' });

  const product = await repository.create(name, price);

  await eventBus.publish('ProductCreated', { productId: product.id, name: product.name });

  return res.status(201).json(product);
});

/**
 * @swagger
 * /products:
 *   get:
 *     tags:
 *       - Products
 *     summary: List all products
 *     description: Returns all available products.
 *     responses:
 *       200:
 *         description: A list of products.
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
 *                     example: 7e0d383f-e450-48ab-9293-87dc9b9cf130
 *                   name:
 *                     type: string
 *                     example: Fake Hat
 *                   price:
 *                     type: number
 *                     format: float
 *                     example: 199.99
 *                   stock:
 *                     type: integer
 *                     example: 100
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 */
productsRouter.get('/', async (req, res) => {
  const products = await repository.findAll();

  return res.status(200).json(products);
});
