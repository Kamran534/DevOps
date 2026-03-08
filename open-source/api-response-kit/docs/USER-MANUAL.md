# api-response-kit — User Manual

> Complete guide to using api-response-kit in your Node.js projects.

---

## Table of Contents

1. [Installation](#1-installation)
2. [Quick Start](#2-quick-start)
3. [Core Functions](#3-core-functions)
   - [success()](#31-success)
   - [created()](#32-created)
   - [noContent()](#33-nocontent)
   - [error()](#34-error)
   - [notFound()](#35-notfound)
   - [unauthorized()](#36-unauthorized)
   - [forbidden()](#37-forbidden)
   - [validationError()](#38-validationerror)
   - [paginated()](#39-paginated)
4. [Framework Adapters](#4-framework-adapters)
   - [Express Middleware](#41-express-middleware)
   - [Fastify Plugin](#42-fastify-plugin)
   - [NestJS Interceptor](#43-nestjs-interceptor)
5. [TypeScript Support](#5-typescript-support)
6. [Response Format Reference](#6-response-format-reference)
7. [Real-World Examples](#7-real-world-examples)
   - [REST API CRUD](#71-rest-api-crud)
   - [Authentication Flow](#72-authentication-flow)
   - [File Upload](#73-file-upload)
   - [Search with Pagination](#74-search-with-pagination)
8. [Error Handling Patterns](#8-error-handling-patterns)
9. [Migration Guide](#9-migration-guide)
10. [FAQ](#10-faq)

---

## 1. Installation

```bash
# npm
npm install api-response-kit

# yarn
yarn add api-response-kit

# pnpm
pnpm add api-response-kit
```

### Requirements

- Node.js >= 18
- TypeScript >= 5.0 (optional but recommended)
- Express >= 4.0 (for Express adapter)

---

## 2. Quick Start

### Step 1: Import the functions

```typescript
import { success, error, created, notFound, validationError, paginated } from "api-response-kit"
```

### Step 2: Use in your routes

```typescript
import express from "express"
import { success, notFound } from "api-response-kit"

const app = express()

app.get("/api/users/:id", async (req, res) => {
  const user = await db.users.findById(req.params.id)

  if (!user) {
    return notFound(res, "User not found")
  }

  return success(res, {
    message: "User fetched successfully",
    data: user
  })
})
```

### Step 3: Every response follows the same format

```json
{
  "success": true,
  "message": "User fetched successfully",
  "data": { "id": 1, "name": "Alice", "email": "alice@example.com" },
  "errors": [],
  "meta": {}
}
```

---

## 3. Core Functions

### 3.1 success()

Returns a **200 OK** response with data.

```typescript
success(res, options?)
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `res` | `Response` | — | Express response object |
| `options.message` | `string` | `"Success"` | Response message |
| `options.data` | `any` | `null` | Response payload |
| `options.statusCode` | `number` | `200` | HTTP status code |
| `options.meta` | `object` | `{}` | Additional metadata |

**Examples:**

```typescript
// Basic
success(res, { data: users })

// With message
success(res, { message: "Users fetched", data: users })

// With custom status code
success(res, { statusCode: 202, message: "Request accepted", data: { jobId: "abc123" } })

// With metadata
success(res, {
  data: users,
  meta: { cached: true, ttl: 300 }
})

// Empty success (no options)
success(res)
// → { success: true, message: "Success", data: null, errors: [], meta: {} }
```

---

### 3.2 created()

Returns a **201 Created** response. Used after creating a resource.

```typescript
created(res, options?)
```

**Examples:**

```typescript
// Basic
created(res, { data: newUser })

// With message
created(res, {
  message: "Account registered successfully",
  data: { id: 5, email: "bob@example.com" }
})
```

**Output:**

```json
{
  "success": true,
  "message": "Account registered successfully",
  "data": { "id": 5, "email": "bob@example.com" },
  "errors": [],
  "meta": {}
}
```

---

### 3.3 noContent()

Returns a **204 No Content** response. Used after deleting a resource.

```typescript
noContent(res)
```

**Example:**

```typescript
app.delete("/api/users/:id", async (req, res) => {
  await db.users.delete(req.params.id)
  return noContent(res)
})
```

---

### 3.4 error()

Returns an error response with a configurable status code.

```typescript
error(res, options?)
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `res` | `Response` | — | Express response object |
| `options.message` | `string` | `"Something went wrong"` | Error message |
| `options.code` | `number` | `500` | HTTP status code |
| `options.errors` | `ApiError[]` | `[]` | Array of error details |

**Examples:**

```typescript
// Basic server error
error(res, { message: "Database connection failed" })

// With status code
error(res, { message: "Service unavailable", code: 503 })

// With detailed errors
error(res, {
  message: "Processing failed",
  code: 422,
  errors: [
    { message: "File too large", code: "FILE_SIZE_EXCEEDED" },
    { message: "Unsupported format", code: "INVALID_FORMAT" }
  ]
})
```

---

### 3.5 notFound()

Returns a **404 Not Found** response.

```typescript
notFound(res, message?)
```

**Examples:**

```typescript
// Default message
notFound(res)
// → message: "Resource not found"

// Custom message
notFound(res, "User not found")
notFound(res, "Order #12345 does not exist")
```

---

### 3.6 unauthorized()

Returns a **401 Unauthorized** response.

```typescript
unauthorized(res, message?)
```

**Examples:**

```typescript
// Default
unauthorized(res)
// → message: "Unauthorized"

// Custom
unauthorized(res, "Invalid or expired token")
unauthorized(res, "Please login to continue")
```

---

### 3.7 forbidden()

Returns a **403 Forbidden** response.

```typescript
forbidden(res, message?)
```

**Examples:**

```typescript
// Default
forbidden(res)
// → message: "Forbidden"

// Custom
forbidden(res, "Admin access required")
forbidden(res, "You don't have permission to delete this resource")
```

---

### 3.8 validationError()

Returns a **422 Unprocessable Entity** response with field-level errors.

```typescript
validationError(res, errors)
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `errors` | `ValidationErrorItem[]` | Array of validation errors |
| `errors[].field` | `string` | Field name that failed validation |
| `errors[].message` | `string` | Human-readable error message |
| `errors[].code` | `string?` | Optional error code (default: `"VALIDATION_ERROR"`) |

**Examples:**

```typescript
// Basic validation
validationError(res, [
  { field: "email", message: "Email is required" },
  { field: "password", message: "Password must be at least 8 characters" }
])

// With custom error codes
validationError(res, [
  { field: "username", message: "Username already taken", code: "UNIQUE_CONSTRAINT" },
  { field: "age", message: "Must be at least 18", code: "MIN_VALUE" }
])
```

**Output:**

```json
{
  "success": false,
  "message": "Validation failed",
  "data": null,
  "errors": [
    { "field": "email", "message": "Email is required", "code": "VALIDATION_ERROR" },
    { "field": "password", "message": "Password must be at least 8 characters", "code": "VALIDATION_ERROR" }
  ],
  "meta": {}
}
```

---

### 3.9 paginated()

Returns a **200 OK** response with pagination metadata.

```typescript
paginated(res, options)
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `options.data` | `T[]` | — | Array of items for current page |
| `options.page` | `number` | — | Current page number |
| `options.perPage` | `number` | `20` | Items per page |
| `options.total` | `number` | — | Total number of items |
| `options.message` | `string` | `"Success"` | Response message |

**Auto-calculated fields in `meta.pagination`:**

| Field | Type | Description |
|-------|------|-------------|
| `totalPages` | `number` | `Math.ceil(total / perPage)` |
| `hasNextPage` | `boolean` | `page < totalPages` |
| `hasPrevPage` | `boolean` | `page > 1` |

**Example:**

```typescript
app.get("/api/posts", async (req, res) => {
  const page = parseInt(req.query.page as string) || 1
  const perPage = parseInt(req.query.perPage as string) || 20
  const skip = (page - 1) * perPage

  const [posts, total] = await Promise.all([
    db.posts.find().skip(skip).limit(perPage),
    db.posts.count()
  ])

  return paginated(res, { data: posts, page, perPage, total })
})
```

**Output:**

```json
{
  "success": true,
  "message": "Success",
  "data": [
    { "id": 21, "title": "Post 21" },
    { "id": 22, "title": "Post 22" }
  ],
  "errors": [],
  "meta": {
    "pagination": {
      "page": 2,
      "perPage": 20,
      "total": 100,
      "totalPages": 5,
      "hasNextPage": true,
      "hasPrevPage": true
    }
  }
}
```

---

## 4. Framework Adapters

### 4.1 Express Middleware

Attaches all response helpers directly to the `res` object.

```typescript
import express from "express"
import { apiResponseMiddleware } from "api-response-kit/adapters/express"

const app = express()
app.use(apiResponseMiddleware())

// Now use res.apiSuccess, res.apiError, etc.
app.get("/users", async (req, res) => {
  const users = await db.users.findAll()
  res.apiSuccess({ data: users })
})

app.get("/users/:id", async (req, res) => {
  const user = await db.users.findById(req.params.id)
  if (!user) return res.apiNotFound("User not found")
  res.apiSuccess({ data: user })
})

app.post("/users", async (req, res) => {
  const errors = validateUser(req.body)
  if (errors.length) return res.apiValidationError(errors)

  const user = await db.users.create(req.body)
  res.apiCreated({ data: user })
})
```

**Available methods on `res`:**

| Method | Maps to |
|--------|---------|
| `res.apiSuccess(options?)` | `success(res, options)` |
| `res.apiCreated(options?)` | `created(res, options)` |
| `res.apiError(options?)` | `error(res, options)` |
| `res.apiNotFound(message?)` | `notFound(res, message)` |
| `res.apiUnauthorized(message?)` | `unauthorized(res, message)` |
| `res.apiForbidden(message?)` | `forbidden(res, message)` |
| `res.apiValidationError(errors)` | `validationError(res, errors)` |
| `res.apiPaginated(options)` | `paginated(res, options)` |

---

### 4.2 Fastify Plugin

```typescript
import Fastify from "fastify"
import apiResponsePlugin from "api-response-kit/adapters/fastify"

const fastify = Fastify()
await fastify.register(apiResponsePlugin)

fastify.get("/users", async (req, reply) => {
  const users = await db.users.findAll()
  return reply.apiSuccess({ data: users, message: "Users fetched" })
})

fastify.get("/users/:id", async (req, reply) => {
  const { id } = req.params as { id: string }
  const user = await db.users.findById(id)

  if (!user) {
    return reply.apiError({ message: "User not found", code: 404 })
  }

  return reply.apiSuccess({ data: user })
})
```

**Available methods on `reply`:**

| Method | Description |
|--------|-------------|
| `reply.apiSuccess(options?)` | Success response |
| `reply.apiError(options?)` | Error response |

---

### 4.3 NestJS Interceptor

The interceptor automatically wraps all controller return values in the standard format.

**Step 1: Register globally**

```typescript
// app.module.ts
import { Module } from "@nestjs/common"
import { APP_INTERCEPTOR } from "@nestjs/core"
import { ApiResponseInterceptor } from "api-response-kit/adapters/nestjs"

@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ApiResponseInterceptor
    }
  ]
})
export class AppModule {}
```

**Step 2: Return data from controllers**

```typescript
// users.controller.ts
@Controller("users")
export class UsersController {

  @Get()
  async findAll() {
    const users = await this.usersService.findAll()
    // Automatically wrapped in standard format
    return users
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    const user = await this.usersService.findOne(id)
    // Return with custom message
    return {
      message: "User fetched successfully",
      data: user
    }
  }

  @Post()
  async create(@Body() body: CreateUserDto) {
    const user = await this.usersService.create(body)
    return {
      message: "User created",
      data: user,
      meta: { welcomeEmailSent: true }
    }
  }
}
```

**How it wraps:**

| You return | Interceptor produces |
|------------|---------------------|
| `{ id: 1, name: "Alice" }` | `{ success: true, message: "Success", data: { id: 1, name: "Alice" }, ... }` |
| `{ message: "Created", data: user }` | `{ success: true, message: "Created", data: user, ... }` |
| `{ data: [], meta: { total: 0 } }` | `{ success: true, message: "Success", data: [], meta: { total: 0 }, ... }` |

---

## 5. TypeScript Support

All functions support generics for type-safe responses.

```typescript
interface User {
  id: number
  name: string
  email: string
}

// Type-checked data
success<User>(res, {
  data: { id: 1, name: "Alice", email: "alice@example.com" }
})

// Paginated with type
paginated<User>(res, {
  data: users, // User[] is enforced
  page: 1,
  total: 50
})
```

### Importing Types

```typescript
import type {
  ApiResponse,
  ApiError,
  PaginationMeta,
  ResponseOptions,
  ErrorOptions,
  ValidationErrorItem,
  PaginationOptions
} from "api-response-kit"
```

### Type Definitions

```typescript
// Use in your own code
function handleResponse(response: ApiResponse<User>) {
  if (response.success) {
    console.log(response.data?.name)
  } else {
    console.log(response.errors)
  }
}
```

---

## 6. Response Format Reference

### Success Response

```
Status: 200 | 201 | 204
```

```json
{
  "success": true,
  "message": "string",
  "data": "T | null",
  "errors": [],
  "meta": {}
}
```

### Error Response

```
Status: 400 | 401 | 403 | 404 | 422 | 500 | 503
```

```json
{
  "success": false,
  "message": "string",
  "data": null,
  "errors": [
    {
      "field": "string (optional)",
      "message": "string",
      "code": "string (optional)"
    }
  ],
  "meta": {}
}
```

### Paginated Response

```
Status: 200
```

```json
{
  "success": true,
  "message": "string",
  "data": [],
  "errors": [],
  "meta": {
    "pagination": {
      "page": "number",
      "perPage": "number",
      "total": "number",
      "totalPages": "number",
      "hasNextPage": "boolean",
      "hasPrevPage": "boolean"
    }
  }
}
```

---

## 7. Real-World Examples

### 7.1 REST API CRUD

```typescript
import express from "express"
import { success, created, noContent, notFound, validationError, error } from "api-response-kit"

const router = express.Router()

// CREATE
router.post("/products", async (req, res) => {
  const { name, price } = req.body
  const errors = []

  if (!name) errors.push({ field: "name", message: "Product name is required" })
  if (!price || price <= 0) errors.push({ field: "price", message: "Price must be greater than 0" })

  if (errors.length) return validationError(res, errors)

  try {
    const product = await Product.create({ name, price })
    return created(res, { data: product, message: "Product created" })
  } catch (err) {
    return error(res, { message: "Failed to create product" })
  }
})

// READ ALL
router.get("/products", async (req, res) => {
  const products = await Product.findAll()
  return success(res, { data: products })
})

// READ ONE
router.get("/products/:id", async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (!product) return notFound(res, "Product not found")
  return success(res, { data: product })
})

// UPDATE
router.put("/products/:id", async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
  if (!product) return notFound(res, "Product not found")
  return success(res, { data: product, message: "Product updated" })
})

// DELETE
router.delete("/products/:id", async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id)
  if (!product) return notFound(res, "Product not found")
  return noContent(res)
})
```

---

### 7.2 Authentication Flow

```typescript
import { success, error, unauthorized, validationError } from "api-response-kit"

// LOGIN
router.post("/auth/login", async (req, res) => {
  const { email, password } = req.body
  const errors = []

  if (!email) errors.push({ field: "email", message: "Email is required" })
  if (!password) errors.push({ field: "password", message: "Password is required" })
  if (errors.length) return validationError(res, errors)

  const user = await User.findByEmail(email)
  if (!user || !await user.comparePassword(password)) {
    return unauthorized(res, "Invalid email or password")
  }

  const token = generateToken(user)

  return success(res, {
    message: "Login successful",
    data: { token, user: { id: user.id, name: user.name, email: user.email } }
  })
})

// PROTECTED ROUTE MIDDLEWARE
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.replace("Bearer ", "")

  if (!token) {
    return unauthorized(res, "No token provided")
  }

  try {
    const decoded = verifyToken(token)
    req.user = decoded
    next()
  } catch (err) {
    return unauthorized(res, "Invalid or expired token")
  }
}

// GET PROFILE
router.get("/auth/profile", authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id)
  return success(res, { data: user })
})
```

---

### 7.3 File Upload

```typescript
import { success, error, validationError } from "api-response-kit"
import multer from "multer"

const upload = multer({ limits: { fileSize: 5 * 1024 * 1024 } }) // 5MB

router.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return validationError(res, [
      { field: "file", message: "File is required" }
    ])
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"]
  if (!allowedTypes.includes(req.file.mimetype)) {
    return validationError(res, [
      { field: "file", message: "Only JPEG, PNG, and WebP are allowed", code: "INVALID_FILE_TYPE" }
    ])
  }

  const url = await uploadToStorage(req.file)

  return success(res, {
    message: "File uploaded successfully",
    data: { url, size: req.file.size, type: req.file.mimetype }
  })
})
```

---

### 7.4 Search with Pagination

```typescript
import { paginated, validationError } from "api-response-kit"

router.get("/search", async (req, res) => {
  const { q, page = "1", perPage = "20", sort = "createdAt", order = "desc" } = req.query

  if (!q) {
    return validationError(res, [
      { field: "q", message: "Search query is required" }
    ])
  }

  const pageNum = Math.max(1, parseInt(page as string))
  const limit = Math.min(100, Math.max(1, parseInt(perPage as string)))
  const skip = (pageNum - 1) * limit

  const [results, total] = await Promise.all([
    Product.find({ $text: { $search: q as string } })
      .sort({ [sort as string]: order === "asc" ? 1 : -1 })
      .skip(skip)
      .limit(limit),
    Product.countDocuments({ $text: { $search: q as string } })
  ])

  return paginated(res, {
    data: results,
    page: pageNum,
    perPage: limit,
    total,
    message: `Found ${total} results for "${q}"`
  })
})
```

---

## 8. Error Handling Patterns

### Global Error Handler with api-response-kit

```typescript
import { error, validationError } from "api-response-kit"

// Place after all routes
app.use((err, req, res, next) => {
  // Mongoose validation error
  if (err.name === "ValidationError") {
    const errors = Object.keys(err.errors).map(field => ({
      field,
      message: err.errors[field].message
    }))
    return validationError(res, errors)
  }

  // JWT error
  if (err.name === "JsonWebTokenError") {
    return error(res, { message: "Invalid token", code: 401 })
  }

  // Duplicate key error (MongoDB)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0]
    return validationError(res, [
      { field, message: `${field} already exists`, code: "DUPLICATE_KEY" }
    ])
  }

  // Default server error
  return error(res, {
    message: process.env.NODE_ENV === "production"
      ? "Internal server error"
      : err.message,
    code: 500
  })
})
```

---

## 9. Migration Guide

### Migrating from custom response format

**Before:**

```typescript
// Inconsistent responses everywhere
res.json({ status: true, result: users })
res.status(404).json({ status: false, error: "Not found" })
res.json({ ok: true, data: user, total: 100 })
```

**After:**

```typescript
import { success, notFound, paginated } from "api-response-kit"

success(res, { data: users })
notFound(res)
paginated(res, { data: users, page: 1, total: 100 })
```

### Step-by-step migration

1. Install the package: `npm install api-response-kit`
2. Start with new routes — use api-response-kit for all new endpoints
3. Gradually replace old `res.json()` calls in existing routes
4. Update frontend to use the standard format (`response.data.success`, `response.data.data`, etc.)
5. Remove old custom response helpers

---

## 10. FAQ

### Can I use this without TypeScript?

Yes. The package ships with compiled JavaScript in `dist/`. Works with plain JavaScript:

```javascript
const { success, error } = require("api-response-kit")
```

### Can I use multiple adapters at once?

No. Use one adapter per project. Pick the one matching your framework.

### How do I add custom fields to the response?

Use the `meta` field:

```typescript
success(res, {
  data: user,
  meta: { requestId: "abc-123", apiVersion: "v2", cached: true }
})
```

### How do I handle async errors?

Wrap your route handlers in try/catch:

```typescript
app.get("/users", async (req, res) => {
  try {
    const users = await db.users.findAll()
    return success(res, { data: users })
  } catch (err) {
    return error(res, { message: "Failed to fetch users" })
  }
})
```

### Does it work with Express 5?

Yes. The library uses standard `res.status().json()` which is compatible with Express 4 and 5.

### Can I override the default status codes?

Yes, use the `statusCode` option in `success()` or `code` option in `error()`:

```typescript
success(res, { statusCode: 202, data: { jobId: "123" } })
error(res, { code: 503, message: "Service temporarily unavailable" })
```
