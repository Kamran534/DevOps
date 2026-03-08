import Fastify from "fastify"
import apiResponsePlugin from "../adapters/fastify"

const fastify = Fastify({ logger: true })

// Register the api-response-kit plugin
fastify.register(apiResponsePlugin)

// GET /users - Success response
fastify.get("/users", async (req, reply) => {
  const users = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" }
  ]

  return reply.apiSuccess({
    data: users,
    message: "Users fetched successfully"
  })
})

// GET /users/:id - Error response
fastify.get("/users/:id", async (req, reply) => {
  const { id } = req.params as { id: string }

  // Simulated not found
  if (id === "999") {
    return reply.apiError({
      message: "User not found",
      code: 404
    })
  }

  return reply.apiSuccess({
    data: { id, name: "Alice" },
    message: "User fetched"
  })
})

// Start server
fastify.listen({ port: 3001 }, (err) => {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  console.log("Fastify example running on http://localhost:3001")
})
