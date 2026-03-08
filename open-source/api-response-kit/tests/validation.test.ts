import express from "express"
import request from "supertest"
import { validationError } from "../src"

const app = express()

app.post("/test-validation", (req, res) => {
  validationError(res, [
    { field: "email", message: "Email is required" },
    { field: "password", message: "Password must be at least 8 characters" }
  ])
})

app.post("/test-validation-with-code", (req, res) => {
  validationError(res, [
    { field: "username", message: "Username already taken", code: "UNIQUE_CONSTRAINT" }
  ])
})

describe("Validation Responses", () => {
  it("should return 422 with field errors", async () => {
    const res = await request(app).post("/test-validation")

    expect(res.status).toBe(422)
    expect(res.body.success).toBe(false)
    expect(res.body.message).toBe("Validation failed")
    expect(res.body.data).toBeNull()
    expect(res.body.errors).toHaveLength(2)
    expect(res.body.errors[0]).toEqual({
      field: "email",
      message: "Email is required",
      code: "VALIDATION_ERROR"
    })
  })

  it("should use custom error code when provided", async () => {
    const res = await request(app).post("/test-validation-with-code")

    expect(res.status).toBe(422)
    expect(res.body.errors[0].code).toBe("UNIQUE_CONSTRAINT")
  })
})
