import Fastify from "fastify"
import apiResponsePlugin from "../../adapters/fastify"

describe("Fastify Adapter Plugin", () => {
  it("should decorate reply with apiSuccess", async () => {
    const fastify = Fastify()
    await fastify.register(apiResponsePlugin)

    fastify.get("/test", async (req, reply) => {
      return reply.apiSuccess({ data: { id: 1 }, message: "OK" })
    })

    const res = await fastify.inject({ method: "GET", url: "/test" })
    const body = JSON.parse(res.body)

    expect(res.statusCode).toBe(200)
    expect(body.success).toBe(true)
    expect(body.message).toBe("OK")
    expect(body.data).toEqual({ id: 1 })
  })

  it("should decorate reply with apiError", async () => {
    const fastify = Fastify()
    await fastify.register(apiResponsePlugin)

    fastify.get("/error", async (req, reply) => {
      return reply.apiError({ message: "Not found", code: 404 })
    })

    const res = await fastify.inject({ method: "GET", url: "/error" })
    const body = JSON.parse(res.body)

    expect(res.statusCode).toBe(404)
    expect(body.success).toBe(false)
    expect(body.message).toBe("Not found")
  })
})
