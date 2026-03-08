import express from "express"
import request from "supertest"
import { error, notFound, unauthorized, forbidden } from "../src"

const app = express()

app.get("/test-error", (req, res) => {
  error(res, { message: "Server error", code: 500 })
})

app.get("/test-error-default", (req, res) => {
  error(res)
})

app.get("/test-404", (req, res) => {
  notFound(res, "User not found")
})

app.get("/test-401", (req, res) => {
  unauthorized(res)
})

app.get("/test-403", (req, res) => {
  forbidden(res)
})

describe("Error Responses", () => {
  it("should return standard error format", async () => {
    const res = await request(app).get("/test-error")

    expect(res.status).toBe(500)
    expect(res.body).toEqual({
      success: false,
      message: "Server error",
      data: null,
      errors: [],
      meta: {}
    })
  })

  it("should return default error when no options provided", async () => {
    const res = await request(app).get("/test-error-default")

    expect(res.status).toBe(500)
    expect(res.body.success).toBe(false)
    expect(res.body.message).toBe("Something went wrong")
  })

  it("should return 404 with custom message", async () => {
    const res = await request(app).get("/test-404")

    expect(res.status).toBe(404)
    expect(res.body.success).toBe(false)
    expect(res.body.message).toBe("User not found")
  })

  it("should return 401 unauthorized", async () => {
    const res = await request(app).get("/test-401")

    expect(res.status).toBe(401)
    expect(res.body.message).toBe("Unauthorized")
  })

  it("should return 403 forbidden", async () => {
    const res = await request(app).get("/test-403")

    expect(res.status).toBe(403)
    expect(res.body.message).toBe("Forbidden")
  })
})
