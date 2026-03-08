# api-response-kit

> Standardize your Node.js API responses with a consistent, type-safe format.

[![CI](https://github.com/Kamran534/DevOps/actions/workflows/ci.yml/badge.svg)](https://github.com/Kamran534/DevOps/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## The Problem

Every endpoint returns a different format:

```json
{ "status": true, "result": {} }
{ "success": true, "data": {} }
{ "ok": 1, "payload": {} }
```

## The Solution

One standard format for every response:

```json
{
  "success": true,
  "message": "User created successfully",
  "data": {},
  "errors": [],
  "meta": {}
}
```

## Installation

```bash
npm install api-response-kit
```

## Quick Start

```typescript
import express from "express"
import { success, error, created, notFound, validationError, paginated } from "api-response-kit"

const app = express()

// Success
app.get("/users", async (req, res) => {
  const users = await User.find()
  success(res, { data: users })
})

// Created
app.post("/users", async (req, res) => {
  const user = await User.create(req.body)
  created(res, { data: user, message: "User created" })
})

// Not Found
app.get("/users/:id", async (req, res) => {
  const user = await User.findById(req.params.id)
  if (!user) return notFound(res, "User not found")
  success(res, { data: user })
})

// Validation Error
app.post("/login", async (req, res) => {
  validationError(res, [
    { field: "email", message: "Email is required" },
    { field: "password", message: "Minimum 8 characters" }
  ])
})

// Pagination
app.get("/posts", async (req, res) => {
  const page = parseInt(req.query.page as string) || 1
  paginated(res, { data: posts, page, perPage: 20, total: 100 })
})
```

## API Reference

### Success Responses

| Function | Status Code | Description |
|----------|------------|-------------|
| `success(res, options?)` | 200 | Standard success response |
| `created(res, options?)` | 201 | Resource created |
| `noContent(res)` | 204 | No content to return |

### Error Responses

| Function | Status Code | Description |
|----------|------------|-------------|
| `error(res, options?)` | 500 | Generic error |
| `notFound(res, message?)` | 404 | Resource not found |
| `unauthorized(res, message?)` | 401 | Authentication required |
| `forbidden(res, message?)` | 403 | Access denied |

### Validation

```typescript
validationError(res, [
  { field: "email", message: "Email is required" },
  { field: "age", message: "Must be 18+", code: "MIN_AGE" }
])
```

Response (422):
```json
{
  "success": false,
  "message": "Validation failed",
  "data": null,
  "errors": [
    { "field": "email", "message": "Email is required", "code": "VALIDATION_ERROR" },
    { "field": "age", "message": "Must be 18+", "code": "MIN_AGE" }
  ],
  "meta": {}
}
```

### Pagination

```typescript
paginated(res, {
  data: users,
  page: 2,
  perPage: 10,
  total: 50
})
```

Response:
```json
{
  "success": true,
  "message": "Success",
  "data": [...],
  "errors": [],
  "meta": {
    "pagination": {
      "page": 2,
      "perPage": 10,
      "total": 50,
      "totalPages": 5,
      "hasNextPage": true,
      "hasPrevPage": true
    }
  }
}
```

## Framework Adapters

### Express Middleware

```typescript
import { apiResponseMiddleware } from "api-response-kit/adapters/express"

app.use(apiResponseMiddleware())

app.get("/users", (req, res) => {
  res.apiSuccess({ data: users })
  res.apiNotFound("User not found")
  res.apiValidationError([{ field: "email", message: "Required" }])
  res.apiPaginated({ data: users, page: 1, total: 100 })
})
```

### NestJS Interceptor

```typescript
import { ApiResponseInterceptor } from "api-response-kit/adapters/nestjs"

@Module({
  providers: [
    { provide: APP_INTERCEPTOR, useClass: ApiResponseInterceptor }
  ]
})
export class AppModule {}
```

### Fastify Plugin

```typescript
import apiResponsePlugin from "api-response-kit/adapters/fastify"

fastify.register(apiResponsePlugin)

fastify.get("/users", async (req, reply) => {
  reply.apiSuccess({ data: users })
})
```

## TypeScript Support

All functions are fully typed with generics:

```typescript
interface User {
  id: number
  name: string
}

success<User>(res, { data: { id: 1, name: "Alice" } })
paginated<User>(res, { data: users, page: 1, total: 50 })
```

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Build
npm run build

# Lint
npm run lint
```

## License

MIT
