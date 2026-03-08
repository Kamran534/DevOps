import express from "express"
import swaggerUi from "swagger-ui-express"
import { swaggerSpec } from "./swagger"
import {
  success,
  created,
  noContent,
  error,
  notFound,
  unauthorized,
  forbidden,
  validationError,
  paginated
} from "@kamran534055/api-response-kit"

const app = express()
app.use(express.json())

// ─── Swagger Docs ───
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: ".swagger-ui .topbar { display: none }",
  customSiteTitle: "api-res-kit API Docs"
}))

// Serve raw JSON spec
app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json")
  res.send(swaggerSpec)
})

// ─── Sample Data ───
const users = [
  { id: 1, name: "Alice", email: "alice@example.com", role: "admin" },
  { id: 2, name: "Bob", email: "bob@example.com", role: "user" },
  { id: 3, name: "Charlie", email: "charlie@example.com", role: "user" },
  { id: 4, name: "Diana", email: "diana@example.com", role: "moderator" },
  { id: 5, name: "Eve", email: "eve@example.com", role: "user" }
]

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get paginated list of users
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: perPage
 *         schema:
 *           type: integer
 *           default: 2
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Paginated list of users
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 */
app.get("/api/users", (req, res) => {
  const page = parseInt(req.query.page as string) || 1
  const perPage = parseInt(req.query.perPage as string) || 2
  const start = (page - 1) * perPage
  const pageData = users.slice(start, start + perPage)

  paginated(res, {
    data: pageData,
    page,
    perPage,
    total: users.length,
    message: "Users fetched successfully"
  })
})

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get a single user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - properties:
 *                     data:
 *                       $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
app.get("/api/users/:id", (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id))

  if (!user) {
    return notFound(res, "User not found")
  }

  success(res, { data: user, message: "User fetched" })
})

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserRequest'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - properties:
 *                     data:
 *                       $ref: '#/components/schemas/User'
 *       422:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 */
app.post("/api/users", (req, res) => {
  const { name, email } = req.body
  const errors = []

  if (!name) errors.push({ field: "name", message: "Name is required" })
  if (!email) errors.push({ field: "email", message: "Email is required" })
  if (email && !email.includes("@")) errors.push({ field: "email", message: "Invalid email format" })

  if (errors.length) {
    return validationError(res, errors)
  }

  const newUser = { id: users.length + 1, name, email, role: "user" }
  users.push(newUser)

  created(res, { data: newUser, message: "User created successfully" })
})

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       204:
 *         description: User deleted (no content)
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
app.delete("/api/users/:id", (req, res) => {
  const index = users.findIndex(u => u.id === parseInt(req.params.id))

  if (index === -1) {
    return notFound(res, "User not found")
  }

  users.splice(index, 1)
  noContent(res)
})

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Login with email and password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         token:
 *                           type: string
 *                           example: "fake-jwt-token-xyz"
 *                         user:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                               example: 1
 *                             name:
 *                               type: string
 *                               example: "Alice"
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       422:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 */
app.post("/api/login", (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return validationError(res, [
      ...(!email ? [{ field: "email", message: "Email is required" }] : []),
      ...(!password ? [{ field: "password", message: "Password is required" }] : [])
    ])
  }

  const user = users.find(u => u.email === email)

  if (!user || password !== "password123") {
    return unauthorized(res, "Invalid email or password")
  }

  success(res, {
    data: { token: "fake-jwt-token-xyz", user: { id: user.id, name: user.name } },
    message: "Login successful"
  })
})

/**
 * @swagger
 * /api/admin:
 *   get:
 *     summary: Admin-only endpoint (always returns 403)
 *     tags: [Auth]
 *     responses:
 *       403:
 *         description: Forbidden — admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
app.get("/api/admin", (req, res) => {
  forbidden(res, "Admin access required")
})

/**
 * @swagger
 * /api/crash:
 *   get:
 *     summary: Simulated server error (always returns 500)
 *     tags: [Errors]
 *     responses:
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
app.get("/api/crash", (req, res) => {
  error(res, { message: "Something went wrong on the server", code: 500 })
})

// ─── Start Server ───
const PORT = 3000
app.listen(PORT, () => {
  console.log(`\n  Test server running on http://localhost:${PORT}`)
  console.log(`  Swagger docs at    http://localhost:${PORT}/api-docs`)
  console.log(`\n  Available endpoints:`)
  console.log(`  GET    /api/users           — Paginated users list`)
  console.log(`  GET    /api/users/:id       — Get single user`)
  console.log(`  POST   /api/users           — Create user (body: name, email)`)
  console.log(`  DELETE /api/users/:id       — Delete user`)
  console.log(`  POST   /api/login           — Login (body: email, password)`)
  console.log(`  GET    /api/admin           — Forbidden example`)
  console.log(`  GET    /api/crash           — Server error example\n`)
})

export default app
