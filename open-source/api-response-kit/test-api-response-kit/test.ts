import {
  success,
  created,
  error,
  notFound,
  unauthorized,
  forbidden,
  validationError,
  paginated,
  noContent
} from "@kamran534055/api-response-kit"

// ─── Mock Express Response ───
function createMockRes() {
  let statusCode = 200
  let body: any = null

  const res: any = {
    status(code: number) {
      statusCode = code
      return res
    },
    json(data: any) {
      body = data
      return res
    },
    send() {
      return res
    },
    getStatusCode: () => statusCode,
    getBody: () => body
  }

  return res
}

// ─── Test Runner ───
let passed = 0
let failed = 0

function test(name: string, fn: () => void) {
  try {
    fn()
    passed++
    console.log(`  PASS  ${name}`)
  } catch (err: any) {
    failed++
    console.log(`  FAIL  ${name}`)
    console.log(`        ${err.message}`)
  }
}

function expect(actual: any) {
  return {
    toBe(expected: any) {
      if (actual !== expected) {
        throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`)
      }
    },
    toEqual(expected: any) {
      const a = JSON.stringify(actual)
      const e = JSON.stringify(expected)
      if (a !== e) {
        throw new Error(`Expected ${e}, got ${a}`)
      }
    },
    toBeNull() {
      if (actual !== null) {
        throw new Error(`Expected null, got ${JSON.stringify(actual)}`)
      }
    }
  }
}

// ═══════════════════════════════════════════
console.log("\n  @kamran534055/api-response-kit — Test Suite\n")
console.log("  ──────────────────────────────────────────\n")

// ─── 1. SUCCESS ───
console.log("  Success Responses\n")

test("success() returns 200 with standard format", () => {
  const res = createMockRes()
  success(res, { message: "It works", data: { id: 1 } })

  expect(res.getStatusCode()).toBe(200)
  expect(res.getBody().success).toBe(true)
  expect(res.getBody().message).toBe("It works")
  expect(res.getBody().data).toEqual({ id: 1 })
  expect(res.getBody().errors).toEqual([])
  expect(res.getBody().meta).toEqual({})
})

test("success() with no options returns defaults", () => {
  const res = createMockRes()
  success(res)

  expect(res.getStatusCode()).toBe(200)
  expect(res.getBody().success).toBe(true)
  expect(res.getBody().message).toBe("Success")
  expect(res.getBody().data).toBeNull()
})

test("success() with custom status code", () => {
  const res = createMockRes()
  success(res, { statusCode: 202, message: "Accepted" })

  expect(res.getStatusCode()).toBe(202)
  expect(res.getBody().message).toBe("Accepted")
})

test("success() with meta data", () => {
  const res = createMockRes()
  success(res, { data: { id: 1 }, meta: { cached: true, ttl: 300 } })

  expect(res.getBody().meta).toEqual({ cached: true, ttl: 300 })
})

// ─── 2. CREATED ───
console.log("\n  Created Responses\n")

test("created() returns 201", () => {
  const res = createMockRes()
  created(res, { data: { id: 5, name: "New User" } })

  expect(res.getStatusCode()).toBe(201)
  expect(res.getBody().success).toBe(true)
  expect(res.getBody().message).toBe("Created")
  expect(res.getBody().data).toEqual({ id: 5, name: "New User" })
})

test("created() with custom message", () => {
  const res = createMockRes()
  created(res, { message: "User registered", data: { id: 10 } })

  expect(res.getStatusCode()).toBe(201)
  expect(res.getBody().message).toBe("User registered")
})

// ─── 3. NO CONTENT ───
console.log("\n  No Content Responses\n")

test("noContent() returns 204 with empty body", () => {
  const res = createMockRes()
  noContent(res)

  expect(res.getStatusCode()).toBe(204)
  expect(res.getBody()).toBeNull()
})

// ─── 4. ERROR ───
console.log("\n  Error Responses\n")

test("error() returns 500 with standard format", () => {
  const res = createMockRes()
  error(res, { message: "Database connection failed" })

  expect(res.getStatusCode()).toBe(500)
  expect(res.getBody().success).toBe(false)
  expect(res.getBody().message).toBe("Database connection failed")
  expect(res.getBody().data).toBeNull()
})

test("error() with default message", () => {
  const res = createMockRes()
  error(res)

  expect(res.getStatusCode()).toBe(500)
  expect(res.getBody().message).toBe("Something went wrong")
})

test("error() with custom status code", () => {
  const res = createMockRes()
  error(res, { message: "Service unavailable", code: 503 })

  expect(res.getStatusCode()).toBe(503)
  expect(res.getBody().message).toBe("Service unavailable")
})

// ─── 5. NOT FOUND ───
console.log("\n  Not Found Responses\n")

test("notFound() returns 404", () => {
  const res = createMockRes()
  notFound(res)

  expect(res.getStatusCode()).toBe(404)
  expect(res.getBody().success).toBe(false)
  expect(res.getBody().message).toBe("Resource not found")
})

test("notFound() with custom message", () => {
  const res = createMockRes()
  notFound(res, "User not found")

  expect(res.getStatusCode()).toBe(404)
  expect(res.getBody().message).toBe("User not found")
})

// ─── 6. UNAUTHORIZED ───
console.log("\n  Unauthorized Responses\n")

test("unauthorized() returns 401", () => {
  const res = createMockRes()
  unauthorized(res)

  expect(res.getStatusCode()).toBe(401)
  expect(res.getBody().success).toBe(false)
  expect(res.getBody().message).toBe("Unauthorized")
})

test("unauthorized() with custom message", () => {
  const res = createMockRes()
  unauthorized(res, "Token expired")

  expect(res.getBody().message).toBe("Token expired")
})

// ─── 7. FORBIDDEN ───
console.log("\n  Forbidden Responses\n")

test("forbidden() returns 403", () => {
  const res = createMockRes()
  forbidden(res)

  expect(res.getStatusCode()).toBe(403)
  expect(res.getBody().success).toBe(false)
  expect(res.getBody().message).toBe("Forbidden")
})

test("forbidden() with custom message", () => {
  const res = createMockRes()
  forbidden(res, "Admin access required")

  expect(res.getBody().message).toBe("Admin access required")
})

// ─── 8. VALIDATION ERROR ───
console.log("\n  Validation Error Responses\n")

test("validationError() returns 422 with field errors", () => {
  const res = createMockRes()
  validationError(res, [
    { field: "email", message: "Email is required" },
    { field: "password", message: "Must be at least 8 characters" }
  ])

  expect(res.getStatusCode()).toBe(422)
  expect(res.getBody().success).toBe(false)
  expect(res.getBody().message).toBe("Validation failed")
  expect(res.getBody().data).toBeNull()
  expect(res.getBody().errors.length).toBe(2)
  expect(res.getBody().errors[0].field).toBe("email")
  expect(res.getBody().errors[0].code).toBe("VALIDATION_ERROR")
})

test("validationError() with custom error code", () => {
  const res = createMockRes()
  validationError(res, [
    { field: "username", message: "Already taken", code: "UNIQUE" }
  ])

  expect(res.getBody().errors[0].code).toBe("UNIQUE")
})

// ─── 9. PAGINATION ───
console.log("\n  Paginated Responses\n")

test("paginated() returns correct pagination meta", () => {
  const res = createMockRes()
  paginated(res, {
    data: [{ id: 1 }, { id: 2 }],
    page: 2,
    perPage: 10,
    total: 50
  })

  expect(res.getStatusCode()).toBe(200)
  expect(res.getBody().success).toBe(true)
  expect(res.getBody().data.length).toBe(2)

  const pagination = res.getBody().meta.pagination
  expect(pagination.page).toBe(2)
  expect(pagination.perPage).toBe(10)
  expect(pagination.total).toBe(50)
  expect(pagination.totalPages).toBe(5)
  expect(pagination.hasNextPage).toBe(true)
  expect(pagination.hasPrevPage).toBe(true)
})

test("paginated() first page has no previous", () => {
  const res = createMockRes()
  paginated(res, { data: [], page: 1, perPage: 10, total: 30 })

  expect(res.getBody().meta.pagination.hasPrevPage).toBe(false)
  expect(res.getBody().meta.pagination.hasNextPage).toBe(true)
})

test("paginated() last page has no next", () => {
  const res = createMockRes()
  paginated(res, { data: [], page: 3, perPage: 10, total: 30 })

  expect(res.getBody().meta.pagination.hasNextPage).toBe(false)
  expect(res.getBody().meta.pagination.hasPrevPage).toBe(true)
})

test("paginated() defaults perPage to 20", () => {
  const res = createMockRes()
  paginated(res, { data: [], page: 1, total: 100 })

  expect(res.getBody().meta.pagination.perPage).toBe(20)
  expect(res.getBody().meta.pagination.totalPages).toBe(5)
})

// ─── Results ───
console.log("\n  ──────────────────────────────────────────")
console.log(`\n  Results: ${passed} passed, ${failed} failed, ${passed + failed} total\n`)

if (failed > 0) {
  process.exit(1)
}
