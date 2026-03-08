import express from "express"
import request from "supertest"
import { success, created, noContent } from "../src"

const app = express()

app.get("/test-success", (req, res) => {
  success(res, { message: "It works", data: { id: 1 } })
})

app.get("/test-success-default", (req, res) => {
  success(res)
})

app.post("/test-created", (req, res) => {
  created(res, { data: { id: 2, name: "Test" } })
})

app.delete("/test-no-content", (req, res) => {
  noContent(res)
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

  it("should return default success when no options provided", async () => {
    const res = await request(app).get("/test-success-default")

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.message).toBe("Success")
    expect(res.body.data).toBeNull()
  })

  it("should return 201 for created", async () => {
    const res = await request(app).post("/test-created")

    expect(res.status).toBe(201)
    expect(res.body.success).toBe(true)
    expect(res.body.message).toBe("Created")
    expect(res.body.data.name).toBe("Test")
  })

  it("should return 204 for no content", async () => {
    const res = await request(app).delete("/test-no-content")

    expect(res.status).toBe(204)
    expect(res.body).toEqual({})
  })
})
