import { Response } from "express"
import { ApiResponse, ResponseOptions } from "./interfaces"

export function success<T>(res: Response, options: ResponseOptions<T> = {}): Response {
  const {
    message = "Success",
    data = null,
    statusCode = 200,
    meta = {}
  } = options

  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
    errors: [],
    meta
  }

  return res.status(statusCode).json(response)
}

export function created<T>(res: Response, options: ResponseOptions<T> = {}): Response {
  return success(res, { statusCode: 201, message: "Created", ...options })
}

export function noContent(res: Response): Response {
  return res.status(204).send()
}
