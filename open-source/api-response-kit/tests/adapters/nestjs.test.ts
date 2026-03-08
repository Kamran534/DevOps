import { ApiResponseInterceptor } from "../../adapters/nestjs"
import { of } from "rxjs"
import { CallHandler, ExecutionContext } from "@nestjs/common"

describe("NestJS Adapter Interceptor", () => {
  let interceptor: ApiResponseInterceptor<any>

  beforeEach(() => {
    interceptor = new ApiResponseInterceptor()
  })

  const mockExecutionContext = {} as ExecutionContext

  it("should wrap raw data in standard format", (done) => {
    const mockHandler: CallHandler = {
      handle: () => of({ id: 1, name: "Test" })
    }

    interceptor.intercept(mockExecutionContext, mockHandler).subscribe(result => {
      expect(result.success).toBe(true)
      expect(result.message).toBe("Success")
      expect(result.data).toEqual({ id: 1, name: "Test" })
      expect(result.errors).toEqual([])
      expect(result.meta).toEqual({})
      done()
    })
  })

  it("should use message from data if provided", (done) => {
    const mockHandler: CallHandler = {
      handle: () => of({ message: "User created", data: { id: 1 } })
    }

    interceptor.intercept(mockExecutionContext, mockHandler).subscribe(result => {
      expect(result.message).toBe("User created")
      expect(result.data).toEqual({ id: 1 })
      done()
    })
  })

  it("should use meta from data if provided", (done) => {
    const mockHandler: CallHandler = {
      handle: () => of({ data: [], meta: { total: 10 } })
    }

    interceptor.intercept(mockExecutionContext, mockHandler).subscribe(result => {
      expect(result.meta).toEqual({ total: 10 })
      done()
    })
  })
})
