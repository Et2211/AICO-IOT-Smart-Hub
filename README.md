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
  "type": "light",                 // light | thermostat | camera | lock | sensor (immutable after creation)
  "location": "Living Room",       // required, 1–100 chars
  "status": "online",              // online | offline (read-only, set by device)
  "isOn": true,                    // controllable via PATCH
  "config": { "brightness": 80 },  // arbitrary device-specific config (see note below)
  "createdAt": "2025-01-01T10:00:00.000Z",
  "updatedAt": "2025-01-01T10:00:00.000Z"
}
```

**`type` is immutable:** A device's type is set at registration and cannot be changed via PATCH. The update schema does not accept a `type` field.

**`config` is untyped:** The `config` field accepts any JSON object. In production, this would be replaced with discriminated config schemas per device type (e.g. a light has `brightness` and `colorTemp`, a thermostat has `targetTemp` and `mode`) to enforce type-safe configurations.

### Error responses

| Status | When                                              |
|--------|---------------------------------------------------|
| 400    | Malformed JSON in request body                    |
| 404    | Device ID not found                               |
| 422    | Validation failed (body includes `fields` object) |
| 500    | Unexpected server error                           |

## Architecture

```
app/
  api/devices/
    route.ts          <- GET /api/devices, POST /api/devices
    [id]/route.ts     <- GET, PATCH, DELETE /api/devices/:id
  page.tsx            <- Dashboard (client component)
  layout.tsx

lib/devices/
  device.types.ts     <- TypeScript interfaces + Zod schemas
  device.repository.ts<- In-memory Map, CRUD functions
  device.service.ts   <- Business logic, input validation, typed errors
  errors.ts           <- Error classes + toErrorResponse HTTP adapter

components/
  atoms/              <- Button, Badge, StatusDot, Input, Label, Select, Spinner
  molecules/          <- DeviceCard, FormField, ConfirmDialog, Modal
  organisms/          <- DeviceList, DeviceForm
```

**Layered architecture:** Route files handle Next.js wiring (verb matching, param extraction). Each route owns its HTTP concerns inline (body parsing, error → status code via `toErrorResponse`). The service owns business logic and throws typed `Error` subclasses (`DeviceNotFoundError`, `ValidationError`), caught with `instanceof` checks rather than duck-typing. The repository owns data access.

**Atomic design:** Components are organised into atoms, molecules, and organisms. Atoms are styled primitives, molecules compose atoms with behaviour, organisms compose molecules into full UI sections.

## Running tests

```bash
npm test           # run once
npm run test:watch # watch mode
```

36 tests cover the repository, service, and route layers:

- **Repository tests**: CRUD operations against the in-memory store, with `beforeEach` reset for isolation
- **Service tests**: business logic with mocked repository, verifying validation and error types via `instanceof`
- **Route tests**: HTTP status codes, JSON parsing, error mapping for every handler (201, 204, 400, 404, 422, 500)

## Pre-commit hooks

[Husky](https://typicode.github.io/husky/) is a Git hooks manager that runs automated checks before each commit is accepted. This project uses it with `lint-staged` to gate every commit behind two checks:

1. **ESLint** (zero warnings tolerance) to catch code quality and style issues
2. **`tsc --noEmit`** to catch type errors without producing build output

Only staged `.ts` and `.tsx` files are checked, so commits stay fast. If either check fails, the commit is rejected and you'll need to fix the issues before trying again.

## Assumptions

- **In-memory storage:** Device state lives in a module-level `Map` and resets on server restart. This is intentional for the demo; see the migration path below.
- **No authentication:** The API is open. A real deployment would add JWT/session auth in middleware.
- **`status` is device-reported:** `online`/`offline` is set by the device itself (via PATCH), not derived from connectivity. In production this would be driven by an MQTT heartbeat or similar.
- **No pagination:** `GET /api/devices` returns all devices. In production, this endpoint would accept `?page=` and `?limit=` query parameters and return paginated results with a `total` count, especially once the device count exceeds a few hundred.

## Deployment

### Vercel (recommended)

```bash
npx vercel
```

Zero configuration required. The app deploys as serverless functions.

### Migrating storage

The in-memory store is isolated to a single server process. To scale horizontally, replace `lib/devices/device.repository.ts` with a real data layer. Only the five exported functions (`findAll`, `findById`, `insert`, `patch`, `remove`) need to change; nothing else in the codebase touches storage directly.

Recommended path: **Prisma + Postgres** (Neon or Supabase for serverless-compatible connection pooling via PgBouncer).

When migrating to a real database, note that `updateDevice` and `deleteDevice` should use transactions to avoid TOCTOU races between validation and mutation. The current synchronous in-memory implementation doesn't have this issue, but it would surface under concurrent access with an external store.

### Scaling considerations

- Route Handlers are stateless, so horizontal scaling is free once storage is externalised
- Add Redis for ephemeral device state (last-seen, session tokens) separate from durable Postgres records
- Add `?page=` / `?limit=` pagination to the list endpoint before the device count grows large

### Real-time device communication

The current demo uses REST for everything: the dashboard polls `GET /api/devices` and devices would update their status via `PATCH`. In production, these are three separate communication channels:

1. Device to cloud (MQTT): Physical devices publish status updates to an MQTT broker (e.g. AWS IoT Core, HiveMQ) on topics like `home/living-room/light/status`. MQTT is a lightweight pub/sub protocol designed for constrained devices on unreliable networks. A backend subscriber listens for these messages and writes state changes to the database.

2. Cloud to dashboard (SSE or WebSocket): The dashboard subscribes to a Server-Sent Events endpoint or WebSocket connection to receive live updates as device state changes. This replaces polling and gives instant feedback when a device goes online/offline or changes state.

3. Dashboard to cloud (REST): User-initiated commands (turn on a light, change thermostat target) still go through the REST API. The API publishes a command to the MQTT broker on a device-specific topic (e.g. `home/living-room/light/command`), and the device picks it up.

This separation means the REST API acts as the control plane for user actions, while MQTT handles the high-frequency, low-latency device communication. The dashboard never talks to devices directly.
