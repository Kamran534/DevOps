import express from "express"
import { success, created, error, notFound, validationError, paginated } from "../src"

const app = express()
app.use(express.json())

// GET /users - List all users with pagination
app.get("/users", async (req, res) => {
  const page = parseInt(req.query.page as string) || 1
  const perPage = parseInt(req.query.perPage as string) || 20

  // Simulated database query
  const users = [
    { id: 1, name: "Alice", email: "alice@example.com" },
    { id: 2, name: "Bob", email: "bob@example.com" }
  ]

  paginated(res, {
    data: users,
    page,
    perPage,
    total: 50,
    message: "Users fetched successfully"
  })
})

// GET /users/:id - Get single user
app.get("/users/:id", async (req, res) => {
  const user = { id: req.params.id, name: "Alice" }

  if (!user) {
    return notFound(res, "User not found")
  }

  success(res, {
    data: user,
    message: "User fetched successfully"
  })
})

// POST /users - Create a new user
app.post("/users", async (req, res) => {
  const { name, email } = req.body
  const errors = []

  if (!name) errors.push({ field: "name", message: "Name is required" })
  if (!email) errors.push({ field: "email", message: "Email is required" })

  if (errors.length) {
    return validationError(res, errors)
  }

  const newUser = { id: 3, name, email }

  created(res, {
    data: newUser,
    message: "User created successfully"
  })
})

// Error handling
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  error(res, {
    message: err.message || "Internal server error",
    code: 500
  })
})

app.listen(3000, () => {
  console.log("Express example running on http://localhost:3000")
})
