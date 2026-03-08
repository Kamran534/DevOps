# api-response-kit

> A TypeScript library that standardizes backend API responses across Node.js frameworks.

---

## Problem Statement

In most Node.js projects, API responses are inconsistent across endpoints:

```json
// Endpoint A
{ "status": true, "result": {} }

// Endpoint B
{ "success": true, "data": {} }

// Endpoint C
{ "ok": 1, "payload": {} }
```

This causes major headaches for:

- **Frontend developers** — can't write reusable response handlers
- **Mobile apps** — need custom parsing logic per endpoint
- **API integrations** — third-party consumers get confused
- **Team onboarding** — no single standard to follow

---

## Solution

A drop-in library that enforces a **single, consistent response format** across your entire API.

### Standard Response Format

```json
{
  "success": true,
  "message": "User created successfully",
  "data": {},
  "errors": [],
  "meta": {}
}
```

Every response — success, error, validation, paginated — follows this structure.

---

## Project Structure

```
api-response-kit/
│
├── src/
│   ├── index.ts                # Main entry point & exports
│   ├── success.ts              # Success response builder
│   ├── error.ts                # Error response builder
│   ├── validation.ts           # Validation error builder
│   ├── pagination.ts           # Paginated response builder
│   └── interfaces.ts           # TypeScript interfaces & types
│
├── adapters/
│   ├── express.ts              # Express.js middleware adapter
│   ├── fastify.ts              # Fastify plugin adapter
│   └── nestjs.ts               # NestJS interceptor adapter
│
├── types/
│   └── index.d.ts              # Type declarations
│
├── tests/
│   ├── success.test.ts
│   ├── error.test.ts
│   ├── validation.test.ts
│   ├── pagination.test.ts
│   └── adapters/
│       ├── express.test.ts
│       ├── fastify.test.ts
│       └── nestjs.test.ts
│
├── examples/
│   ├── express-example.ts
│   ├── fastify-example.ts
│   └── nestjs-example.ts
│
├── package.json
├── tsconfig.json
├── jest.config.ts
├── .eslintrc.json
├── .prettierrc
├── LICENSE
└── README.md
```

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| TypeScript | Type-safe core library |
| Node.js | Runtime |
| Jest | Unit & integration testing |
| Express | Primary adapter |
| Fastify | Plugin adapter |
| NestJS | Interceptor adapter |
| ESLint + Prettier | Code quality |
| GitHub Actions | CI/CD pipeline |
| npm | Package publishing |

---

## Step-by-Step Implementation Plan

### Phase 1 — Foundation (Core Library)

#### Step 1: Initialize the project

```bash
mkdir api-response-kit && cd api-response-kit
npm init -y
npm install -D typescript @types/node ts-node
npx tsc --init
```

- Set `tsconfig.json` target to `ES2020`, module to `CommonJS`
- Enable `declaration`, `outDir: ./dist`, `rootDir: ./src`
- Enable `strict` mode

#### Step 2: Define TypeScript interfaces

Create `src/interfaces.ts`:

```typescript
export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data: T | null
  errors: ApiError[]
  meta: Record<string, any>
}

export interface ApiError {
  field?: string
  message: string
  code?: string
}

export interface PaginationMeta {
  page: number
  perPage: number
  total: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export interface ResponseOptions<T = any> {
  message?: string
  data?: T
  statusCode?: number
  meta?: Record<string, any>
}

export interface ErrorOptions {
  message?: string
  code?: number
  errors?: ApiError[]
}

export interface ValidationErrorItem {
  field: string
  message: string
  code?: string
}

export interface PaginationOptions<T = any> {
  data: T[]
  page: number
  perPage?: number
  total: number
  message?: string
}
```

#### Step 3: Build the success response handler

Create `src/success.ts`:

```typescript
import { Response } from "express"
import { ApiResponse, ResponseOptions } from "./interfaces"

export function success<T>(res: Response, options: ResponseOptions<T> = {}): Response {
  const {
    message = "Success",
    data = null,
    statusCode = 200,
    meta = {}
  } = options

  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
    errors: [],
    meta
  }

  return res.status(statusCode).json(response)
}

export function created<T>(res: Response, options: ResponseOptions<T> = {}): Response {
  return success(res, { statusCode: 201, message: "Created", ...options })
}

export function noContent(res: Response): Response {
  return res.status(204).send()
}
```

#### Step 4: Build the error response handler

Create `src/error.ts`:

```typescript
import { Response } from "express"
import { ApiResponse, ErrorOptions } from "./interfaces"

export function error(res: Response, options: ErrorOptions = {}): Response {
  const {
    message = "Something went wrong",
    code = 500,
    errors = []
  } = options

  const response: ApiResponse<null> = {
    success: false,
    message,
    data: null,
    errors,
    meta: {}
  }

  return res.status(code).json(response)
}

export function notFound(res: Response, message = "Resource not found"): Response {
  return error(res, { message, code: 404 })
}

export function unauthorized(res: Response, message = "Unauthorized"): Response {
  return error(res, { message, code: 401 })
}

export function forbidden(res: Response, message = "Forbidden"): Response {
  return error(res, { message, code: 403 })
}
```

#### Step 5: Build the validation error handler

Create `src/validation.ts`:

```typescript
import { Response } from "express"
import { ApiResponse, ValidationErrorItem } from "./interfaces"

export function validationError(res: Response, errors: ValidationErrorItem[]): Response {
  const response: ApiResponse<null> = {
    success: false,
    message: "Validation failed",
    data: null,
    errors: errors.map(e => ({
      field: e.field,
      message: e.message,
      code: e.code || "VALIDATION_ERROR"
    })),
    meta: {}
  }

  return res.status(422).json(response)
}
```

#### Step 6: Build the pagination handler

Create `src/pagination.ts`:

```typescript
import { Response } from "express"
import { ApiResponse, PaginationMeta, PaginationOptions } from "./interfaces"

export function paginated<T>(res: Response, options: PaginationOptions<T>): Response {
  const {
    data,
    page,
    perPage = 20,
    total,
    message = "Success"
  } = options

  const totalPages = Math.ceil(total / perPage)

  const pagination: PaginationMeta = {
    page,
    perPage,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1
  }

  const response: ApiResponse<T[]> = {
    success: true,
    message,
    data,
    errors: [],
    meta: { pagination }
  }

  return res.status(200).json(response)
}
```

#### Step 7: Create the main entry point

Create `src/index.ts`:

```typescript
export { success, created, noContent } from "./success"
export { error, notFound, unauthorized, forbidden } from "./error"
export { validationError } from "./validation"
export { paginated } from "./pagination"

// Types
export type {
  ApiResponse,
  ApiError,
  PaginationMeta,
  ResponseOptions,
  ErrorOptions,
  ValidationErrorItem,
  PaginationOptions
} from "./interfaces"
```

---

### Phase 2 — Testing

#### Step 8: Set up Jest

```bash
npm install -D jest ts-jest @types/jest supertest @types/supertest @types/express express
```

Create `jest.config.ts`:

```typescript
export default {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.ts"],
  collectCoverageFrom: ["src/**/*.ts"]
}
```

#### Step 9: Write unit tests

Create `tests/success.test.ts`:

```typescript
import express from "express"
import request from "supertest"
import { success, created } from "../src"

const app = express()

app.get("/test-success", (req, res) => {
  success(res, { message: "It works", data: { id: 1 } })
})

app.post("/test-created", (req, res) => {
  created(res, { data: { id: 2, name: "Test" } })
})

describe("Success Responses", () => {
  it("should return standard success format", async () => {
    const res = await request(app).get("/test-success")

    expect(res.status).toBe(200)
    expect(res.body).toEqual({
      success: true,
      message: "It works",
      data: { id: 1 },
      errors: [],
      meta: {}
    })
  })

  it("should return 201 for created", async () => {
    const res = await request(app).post("/test-created")

    expect(res.status).toBe(201)
    expect(res.body.success).toBe(true)
    expect(res.body.data.name).toBe("Test")
  })
})
```

Create `tests/error.test.ts`:

```typescript
import express from "express"
import request from "supertest"
import { error, notFound, unauthorized } from "../src"

const app = express()

app.get("/test-error", (req, res) => {
  error(res, { message: "Server error", code: 500 })
})

app.get("/test-404", (req, res) => {
  notFound(res, "User not found")
})

app.get("/test-401", (req, res) => {
  unauthorized(res)
})

describe("Error Responses", () => {
  it("should return standard error format", async () => {
    const res = await request(app).get("/test-error")

    expect(res.status).toBe(500)
    expect(res.body.success).toBe(false)
    expect(res.body.data).toBeNull()
  })

  it("should return 404 with custom message", async () => {
    const res = await request(app).get("/test-404")

    expect(res.status).toBe(404)
    expect(res.body.message).toBe("User not found")
  })

  it("should return 401 unauthorized", async () => {
    const res = await request(app).get("/test-401")

    expect(res.status).toBe(401)
    expect(res.body.message).toBe("Unauthorized")
  })
})
```

Create `tests/validation.test.ts`:

```typescript
import express from "express"
import request from "supertest"
import { validationError } from "../src"

const app = express()

app.post("/test-validation", (req, res) => {
  validationError(res, [
    { field: "email", message: "Email is required" },
    { field: "password", message: "Password must be at least 8 characters" }
  ])
})

describe("Validation Responses", () => {
  it("should return 422 with field errors", async () => {
    const res = await request(app).post("/test-validation")

    expect(res.status).toBe(422)
    expect(res.body.success).toBe(false)
    expect(res.body.errors).toHaveLength(2)
    expect(res.body.errors[0].field).toBe("email")
  })
})
```

Create `tests/pagination.test.ts`:

```typescript
import express from "express"
import request from "supertest"
import { paginated } from "../src"

const app = express()

app.get("/test-paginated", (req, res) => {
  paginated(res, {
    data: [{ id: 1 }, { id: 2 }],
    page: 2,
    perPage: 10,
    total: 50
  })
})

describe("Pagination Responses", () => {
  it("should return paginated format with meta", async () => {
    const res = await request(app).get("/test-paginated")

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.data).toHaveLength(2)
    expect(res.body.meta.pagination).toEqual({
      page: 2,
      perPage: 10,
      total: 50,
      totalPages: 5,
      hasNextPage: true,
      hasPrevPage: true
    })
  })
})
```

---

### Phase 3 — Framework Adapters

#### Step 10: Express middleware adapter

Create `adapters/express.ts`:

```typescript
import { Request, Response, NextFunction } from "express"
import { success, created, noContent } from "../src/success"
import { error, notFound, unauthorized, forbidden } from "../src/error"
import { validationError } from "../src/validation"
import { paginated } from "../src/pagination"

declare global {
  namespace Express {
    interface Response {
      apiSuccess: typeof success
      apiError: typeof error
      apiCreated: typeof created
      apiNotFound: typeof notFound
      apiUnauthorized: typeof unauthorized
      apiForbidden: typeof forbidden
      apiValidationError: typeof validationError
      apiPaginated: typeof paginated
    }
  }
}

export function apiResponseMiddleware() {
  return (req: Request, res: Response, next: NextFunction) => {
    res.apiSuccess = (options) => success(res, options)
    res.apiError = (options) => error(res, options)
    res.apiCreated = (options) => created(res, options)
    res.apiNotFound = (message) => notFound(res, message)
    res.apiUnauthorized = (message) => unauthorized(res, message)
    res.apiForbidden = (message) => forbidden(res, message)
    res.apiValidationError = (errors) => validationError(res, errors)
    res.apiPaginated = (options) => paginated(res, options)
    next()
  }
}
```

**Usage with Express middleware:**

```typescript
import express from "express"
import { apiResponseMiddleware } from "api-response-kit/adapters/express"

const app = express()
app.use(apiResponseMiddleware())

app.get("/users", async (req, res) => {
  const users = await User.find()
  res.apiSuccess({ data: users })
})

app.get("/users/:id", async (req, res) => {
  const user = await User.findById(req.params.id)
  if (!user) return res.apiNotFound("User not found")
  res.apiSuccess({ data: user })
})
```

#### Step 11: NestJS interceptor adapter

Create `adapters/nestjs.ts`:

```typescript
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler
} from "@nestjs/common"
import { Observable } from "rxjs"
import { map } from "rxjs/operators"
import { ApiResponse } from "../src/interfaces"

@Injectable()
export class ApiResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map(data => ({
        success: true,
        message: data?.message || "Success",
        data: data?.data ?? data,
        errors: [],
        meta: data?.meta || {}
      }))
    )
  }
}
```

**Usage with NestJS:**

```typescript
import { ApiResponseInterceptor } from "api-response-kit/adapters/nestjs"

@Module({
  providers: [
    { provide: APP_INTERCEPTOR, useClass: ApiResponseInterceptor }
  ]
})
export class AppModule {}
```

#### Step 12: Fastify plugin adapter

Create `adapters/fastify.ts`:

```typescript
import { FastifyInstance, FastifyReply } from "fastify"
import fp from "fastify-plugin"
import { ApiResponse } from "../src/interfaces"

function apiResponsePlugin(fastify: FastifyInstance, opts: any, done: () => void) {
  fastify.decorateReply("apiSuccess", function (this: FastifyReply, options: any) {
    const { message = "Success", data = null, statusCode = 200, meta = {} } = options
    const response: ApiResponse = { success: true, message, data, errors: [], meta }
    return this.status(statusCode).send(response)
  })

  fastify.decorateReply("apiError", function (this: FastifyReply, options: any) {
    const { message = "Something went wrong", code = 500, errors = [] } = options
    const response: ApiResponse<null> = { success: false, message, data: null, errors, meta: {} }
    return this.status(code).send(response)
  })

  done()
}

export default fp(apiResponsePlugin, { name: "api-response-kit" })
```

---

### Phase 4 — Advanced Features

#### Step 13: Auto request ID

```typescript
// src/middleware/requestId.ts
import { v4 as uuidv4 } from "uuid"
import { Request, Response, NextFunction } from "express"

export function requestIdMiddleware() {
  return (req: Request, res: Response, next: NextFunction) => {
    const requestId = req.headers["x-request-id"] as string || uuidv4()
    req.headers["x-request-id"] = requestId
    res.setHeader("X-Request-Id", requestId)
    next()
  }
}
```

Auto-injected into every response `meta`:

```json
{
  "success": true,
  "message": "Success",
  "data": {},
  "errors": [],
  "meta": {
    "requestId": "550e8400-e29b-41d4-a716-446655440000",
    "timestamp": "2026-03-08T12:00:00.000Z"
  }
}
```

#### Step 14: Timestamp injection

```typescript
// Add to response builder
meta: {
  ...options.meta,
  timestamp: new Date().toISOString()
}
```

#### Step 15: API versioning support

```typescript
// src/middleware/apiVersion.ts
export function apiVersionMiddleware(version: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    res.setHeader("X-API-Version", version)
    next()
  }
}
```

Response includes:

```json
{
  "meta": {
    "apiVersion": "v1",
    "timestamp": "2026-03-08T12:00:00.000Z"
  }
}
```

#### Step 16: i18n message support

```typescript
// src/i18n/messages.ts
const messages: Record<string, Record<string, string>> = {
  en: {
    "user.created": "User created successfully",
    "auth.unauthorized": "You are not authorized",
    "validation.failed": "Validation failed"
  },
  es: {
    "user.created": "Usuario creado exitosamente",
    "auth.unauthorized": "No estás autorizado",
    "validation.failed": "Validación fallida"
  }
}

export function getMessage(key: string, locale = "en"): string {
  return messages[locale]?.[key] || messages["en"][key] || key
}
```

**Usage:**

```typescript
success(res, {
  message: getMessage("user.created", req.locale),
  data: user
})
```

---

### Phase 5 — Publishing & CI/CD

#### Step 17: Configure package.json

```json
{
  "name": "api-response-kit",
  "version": "1.0.0",
  "description": "Standardize your Node.js API responses",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "test": "jest",
    "test:coverage": "jest --coverage",
    "lint": "eslint src/ --ext .ts",
    "prepublishOnly": "npm run build"
  },
  "keywords": ["api", "response", "express", "nestjs", "fastify", "rest"],
  "license": "MIT",
  "files": ["dist", "adapters"]
}
```

#### Step 18: GitHub Actions CI

Create `.github/workflows/ci.yml`:

```yaml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18, 20, 22]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
      - run: npm ci
      - run: npm test
      - run: npm run build
```

#### Step 19: Publish to npm

```bash
npm login
npm publish
```

---

## Complete Usage Example

```typescript
import express from "express"
import { apiResponseMiddleware } from "api-response-kit/adapters/express"
import { requestIdMiddleware } from "api-response-kit/middleware"

const app = express()
app.use(express.json())
app.use(requestIdMiddleware())
app.use(apiResponseMiddleware())

// Success
app.get("/users", async (req, res) => {
  const users = await User.find()
  res.apiSuccess({ data: users, message: "Users fetched" })
})

// Created
app.post("/users", async (req, res) => {
  const user = await User.create(req.body)
  res.apiCreated({ data: user, message: "User created" })
})

// Not Found
app.get("/users/:id", async (req, res) => {
  const user = await User.findById(req.params.id)
  if (!user) return res.apiNotFound("User not found")
  res.apiSuccess({ data: user })
})

// Validation Error
app.post("/login", async (req, res) => {
  const errors = validate(req.body)
  if (errors.length) return res.apiValidationError(errors)
  // ...login logic
})

// Paginated
app.get("/posts", async (req, res) => {
  const page = parseInt(req.query.page as string) || 1
  const posts = await Post.find().skip((page - 1) * 20).limit(20)
  const total = await Post.countDocuments()

  res.apiPaginated({ data: posts, page, perPage: 20, total })
})

app.listen(3000)
```

---

## Development Roadmap

| Phase | Task | Status |
|-------|------|--------|
| 1 | Core response builders (success, error, validation, pagination) | Planned |
| 2 | Unit tests with Jest + Supertest | Planned |
| 3 | Express, NestJS, Fastify adapters | Planned |
| 4 | Request ID, timestamps, API versioning, i18n | Planned |
| 5 | npm publish + GitHub Actions CI | Planned |

---

## Why Developers Will Use It

- **Zero config** — works out of the box with Express
- **Consistent format** — one standard for every endpoint
- **Type-safe** — full TypeScript support with generics
- **Framework agnostic** — adapters for Express, NestJS, Fastify
- **Lightweight** — no heavy dependencies
- **Battle-tested patterns** — pagination, validation errors, request IDs built-in
