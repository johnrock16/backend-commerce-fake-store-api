import { Router } from 'express';
import { WebhookPrismaRepository } from '../prisma/WebhookPrismaRepository';

const repo = new WebhookPrismaRepository();
export const webhooksRouter = Router();

/**
 * @swagger
 * /webhooks:
 *   get:
 *     tags:
 *       - Webhooks
 *     summary: List all webhooks
 *     description: Returns all registered webhook subscriptions.
 *     responses:
 *       200:
 *         description: A list of webhooks.
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
 *                     example: bd08c19d-2816-4gg4-8712-b70f4asd64d3
 *                   url:
 *                     type: string
 *                     format: uri
 *                     example: https://myapp.com/webhook
 *                   event:
 *                     type: string
 *                     example: OrderCreated
 *                   secret:
 *                     type: string
 *                     description: Secret used to sign webhook payloads.
 *                     example: fd04b11c-4316-4ff4-8712-b70e3acd60d2
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 */
webhooksRouter.get('/', async (req, res) => {
  const webhooks = await repo.findAll();
  res.json(webhooks);
});

/**
 * @swagger
 * /webhooks:
 *   post:
 *     tags:
 *       - Webhooks
 *     summary: Register a webhook
 *     description: Subscribes a URL to receive platform events.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - url
 *               - event
 *             properties:
 *               url:
 *                 type: string
 *                 format: uri
 *                 description: The URL that will receive the webhook calls.
 *                 example: https://myapp.com/webhook
 *               event:
 *                 type: string
 *                 description: The event that will trigger the webhook.
 *                 example: OrderCreated
 *     responses:
 *       201:
 *         description: Webhook successfully created.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                   example: b21c0b75-4f9d-4d41-a6aa-9c8b2a41d9a1
 *                 url:
 *                   type: string
 *                   format: uri
 *                 event:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Missing or invalid data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: url and event required
 */
webhooksRouter.post('/', async (req, res) => {
  const { url, event } = req.body;
  if (!url || !event) return res.status(400).json({ error: 'url and event required' });

  const webhook = await repo.create(url, event);
  res.status(201).json(webhook);
});

/**
 * @swagger
 * /webhooks/{id}:
 *   delete:
 *     tags:
 *       - Webhooks
 *     summary: Delete a webhook
 *     description: Removes a webhook subscription by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Webhook ID.
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Webhook successfully deleted.
 *       404:
 *         description: Webhook not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Webhook not found
 */
webhooksRouter.delete('/:id', async (req, res) => {
  await repo.delete(req.params.id);
  res.status(204).send();
});
