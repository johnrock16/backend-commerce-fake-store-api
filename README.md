# backend-commerce-fake-store-

This repository contains a **backend service** that simulates a e-commerce platform.
It was built to experiment with and practice **event-driven architectures**, **background workers**, **observability**, and **reliability patterns** in a realistic environment.

Products and orders are simplified (**no real payments or shipping**), but the surrounding infrastructure tries to reflects how production systems are typically structured.

## 🚀 Key Features

### Core Architecture
- **Express + TypeScript**
- **Event-driven design** with internal **Event Bus**
- **Workers** for async processing

### Data & Infrastructure
- **PostgreSQL + Prisma**
- **Redis** for queues and caching
- **Docker + Docker Compose**
- **Dead Letter Queues**
- **Queue retries**

### Reliability & Safety
- **Idempotency keys**
- **Rate limiting**
- **Abuse detection**
- **Retry policies**
- **Fault isolation via workers**

### Observability
- **Metrics**
- **Distributed tracing**
- **Structured logging**
- **Daily rotating log files (14 days retention)**
- **Basic Grafana setup**
- **System health (latency, queues, webhooks)**

### Integrations
- **Webhook system**
- **HMAC-signed webhook delivery**
- **Webhook retries & DLQ**

### Developer Experience
- **Swagger / OpenAPI**
- **Fully typed with TypeScript**
- **API and worker separation**

## 🧱 What “Fake Store” means
Products and Orders do not process real payments or shipping. However, the **entire platform infrastructure is real**:

- Orders emit events
- Workers process async workflows
- Webhooks notify external systems
- Failures go to DLQ
- Retries and idempotency guarantee consistency

This is how real commerce platforms work, only without charging money.

## Installation

### 1. Install dependencies
```bash
npm install
```

### 2. Start infrastructure
```bash
docker compose up
```
This will start:
- PostgreSQL
- Redis
- Supporting services

### 3. Generate Prisma client
```bash
npx prisma generate
```

### 4. Run database migrations
```bash
npx prisma migrate dev --name init
```

## ▶️ Running the project
You need **two terminals**.

### API Server
```bash
npm run dev
```

### Workers (event processors, queues, webhooks)
```bash
npm run workers
```
The system will now be fully operational.

## 📚 API Documentation (Swagger)

All endpoints are available via **Swagger**:

👉 http://localhost:3000/docs/

From there you can:

- Create products
- Place orders
- Add and test webhooks
- Inspect request / response models