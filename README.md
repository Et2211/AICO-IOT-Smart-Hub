# AICO Smart Hub

A RESTful IoT device management system built with Next.js 16 (App Router). Register, monitor, and control smart home devices through a clean REST API and a live React dashboard.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the dashboard, or hit the API directly:

```bash
# List all devices (4 pre-seeded on startup)
curl http://localhost:3000/api/devices

# Register a new device
curl -X POST http://localhost:3000/api/devices \
  -H "Content-Type: application/json" \
  -d '{"name":"Bedroom Light","type":"light","location":"Bedroom"}'

# Toggle a device on/off
curl -X PATCH http://localhost:3000/api/devices/<id> \
  -H "Content-Type: application/json" \
  -d '{"isOn":true}'

# Delete a device
curl -X DELETE http://localhost:3000/api/devices/<id>
```

## API Reference

| Method   | Endpoint                | Description                        |
|----------|-------------------------|------------------------------------|
| `GET`    | `/api/devices`          | List all registered devices        |
| `POST`   | `/api/devices`          | Register a new device              |
| `GET`    | `/api/devices/:id`      | Get a single device by ID          |
| `PATCH`  | `/api/devices/:id`      | Update status/config of a device   |
| `DELETE` | `/api/devices/:id`      | Remove a device                    |

### Device schema

```jsonc
{
  "id": "uuid",
  "name": "Living Room Light",     // required, 1–100 chars
  "type": "light",                 // light | thermostat | camera | lock | sensor
  "location": "Living Room",       // required, 1–100 chars
  "status": "online",              // online | offline (read-only — set by device)
  "isOn": true,                    // controllable via PATCH
  "config": { "brightness": 80 },  // arbitrary device-specific config
  "createdAt": "2026-01-01T10:00:00.000Z",
  "updatedAt": "2026-01-01T10:00:00.000Z"
}
```

### Error responses

| Status | When                                              |
|--------|---------------------------------------------------|
| 404    | Device ID not found                               |
| 422    | Validation failed — body includes `fields` object |
| 500    | Unexpected server error                           |

## Architecture

```
app/
  api/devices/
    route.ts          ← GET /api/devices, POST /api/devices
    [id]/route.ts     ← GET, PATCH, DELETE /api/devices/:id
  page.tsx            ← Dashboard (client component)
  layout.tsx

lib/devices/
  device.types.ts     ← TypeScript interfaces + Zod schemas
  device.repository.ts← In-memory Map, CRUD functions
  device.service.ts   ← Business logic, input validation, typed errors
  device.controller.ts← HTTP parsing, error → status code mapping

components/
  atoms/              ← Button, Badge, StatusDot, Input, Label, Spinner
  molecules/          ← DeviceCard, FormField, ConfirmDialog
  organisms/          ← DeviceList, DeviceForm
```

**Controller/domain pattern:** Route files stay thin (one line per HTTP verb). The controller handles HTTP concerns. The service owns business logic and throws typed errors (`DeviceNotFoundError`, `ValidationError`). The repository owns data access.

**Atomic design:** Components are organised into atoms → molecules → organisms. Atoms are unstyled primitives, molecules compose atoms with behaviour, organisms compose molecules into full UI sections.

## Running tests

```bash
npm test           # run once
npm run test:watch # watch mode
```

12 unit tests cover the service layer using Vitest module mocking — no HTTP involved.

## Pre-commit hooks

Husky runs `lint-staged` on every commit: ESLint (zero warnings) + `tsc --noEmit`. There is no way to skip this — use `git commit` normally.

## Assumptions

- **In-memory storage:** Device state lives in a module-level `Map` and resets on server restart. This is intentional for the demo — see the migration path below.
- **No authentication:** The API is open. A real deployment would add JWT/session auth in middleware.
- **`status` is device-reported:** `online`/`offline` is set by the device itself (via PATCH), not derived from connectivity — in production this would be driven by an MQTT heartbeat or similar.

## Deployment

### Vercel (recommended)

```bash
npx vercel
```

Zero configuration required. The app deploys as serverless functions.

### Migrating storage

The in-memory store is isolated to a single server process. To scale horizontally, replace `lib/devices/device.repository.ts` with a real data layer — only the five exported functions (`findAll`, `findById`, `insert`, `patch`, `remove`) need to change; nothing else in the codebase touches storage directly.

Recommended path: **Prisma + Postgres** (Neon or Supabase for serverless-compatible connection pooling via PgBouncer).

### Scaling considerations

- Route Handlers are stateless — horizontal scaling is free once storage is externalised
- Add Redis for ephemeral device state (last-seen, session tokens) separate from durable Postgres records
- For real-time device status updates, replace polling with Server-Sent Events or a managed WebSocket service (Pusher, Ably)
- An MQTT broker (AWS IoT Core, HiveMQ) would be the standard choice for device-to-cloud communication at scale
