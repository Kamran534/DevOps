import express from "express"
import request from "supertest"
import { paginated } from "../src"

const app = express()

app.get("/test-paginated", (req, res) => {
  paginated(res, {
    data: [{ id: 1 }, { id: 2 }],
    page: 2,
    perPage: 10,
    total: 50
  })
})

app.get("/test-paginated-first", (req, res) => {
  paginated(res, {
    data: [{ id: 1 }],
    page: 1,
    perPage: 10,
    total: 25
  })
})

app.get("/test-paginated-last", (req, res) => {
  paginated(res, {
    data: [{ id: 5 }],
    page: 5,
    perPage: 10,
    total: 50
  })
})

app.get("/test-paginated-default-perpage", (req, res) => {
  paginated(res, {
    data: [],
    page: 1,
    total: 100
  })
})

describe("Pagination Responses", () => {
  it("should return paginated format with meta", async () => {
    const res = await request(app).get("/test-paginated")

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.data).toHaveLength(2)
    expect(res.body.meta.pagination).toEqual({
      page: 2,
      perPage: 10,
      total: 50,
      totalPages: 5,
      hasNextPage: true,
      hasPrevPage: true
    })
  })

  it("should set hasPrevPage to false on first page", async () => {
    const res = await request(app).get("/test-paginated-first")

    expect(res.body.meta.pagination.hasPrevPage).toBe(false)
    expect(res.body.meta.pagination.hasNextPage).toBe(true)
  })

  it("should set hasNextPage to false on last page", async () => {
    const res = await request(app).get("/test-paginated-last")

    expect(res.body.meta.pagination.hasNextPage).toBe(false)
    expect(res.body.meta.pagination.hasPrevPage).toBe(true)
  })

  it("should default perPage to 20", async () => {
    const res = await request(app).get("/test-paginated-default-perpage")

    expect(res.body.meta.pagination.perPage).toBe(20)
    expect(res.body.meta.pagination.totalPages).toBe(5)
  })
})
