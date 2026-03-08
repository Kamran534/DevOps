import express from "express"
import request from "supertest"
import { apiResponseMiddleware } from "../../adapters/express"

const app = express()
app.use(apiResponseMiddleware())

app.get("/success", (req, res) => {
  res.apiSuccess({ data: { id: 1 }, message: "Fetched" })
})

app.post("/created", (req, res) => {
  res.apiCreated({ data: { id: 2 } })
})

app.get("/not-found", (req, res) => {
  res.apiNotFound("Item not found")
})

app.get("/unauthorized", (req, res) => {
  res.apiUnauthorized()
})

app.get("/forbidden", (req, res) => {
  res.apiForbidden()
})

app.post("/validation", (req, res) => {
  res.apiValidationError([
    { field: "email", message: "Required" }
  ])
})

app.get("/paginated", (req, res) => {
  res.apiPaginated({
    data: [{ id: 1 }],
    page: 1,
    total: 10,
    perPage: 5
  })
})

describe("Express Adapter Middleware", () => {
  it("should attach apiSuccess to response", async () => {
    const res = await request(app).get("/success")

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.message).toBe("Fetched")
    expect(res.body.data).toEqual({ id: 1 })
  })

  it("should attach apiCreated to response", async () => {
    const res = await request(app).post("/created")

    expect(res.status).toBe(201)
    expect(res.body.success).toBe(true)
  })

  it("should attach apiNotFound to response", async () => {
    const res = await request(app).get("/not-found")

    expect(res.status).toBe(404)
    expect(res.body.message).toBe("Item not found")
  })

  it("should attach apiUnauthorized to response", async () => {
    const res = await request(app).get("/unauthorized")

    expect(res.status).toBe(401)
  })

  it("should attach apiForbidden to response", async () => {
    const res = await request(app).get("/forbidden")

    expect(res.status).toBe(403)
  })

  it("should attach apiValidationError to response", async () => {
    const res = await request(app).post("/validation")

    expect(res.status).toBe(422)
    expect(res.body.errors).toHaveLength(1)
  })

  it("should attach apiPaginated to response", async () => {
    const res = await request(app).get("/paginated")

    expect(res.status).toBe(200)
    expect(res.body.meta.pagination.totalPages).toBe(2)
  })
})
