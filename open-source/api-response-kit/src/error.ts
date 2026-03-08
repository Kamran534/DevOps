import { Response } from "express"
import { ApiResponse, ErrorOptions } from "./interfaces"

export function error(res: Response, options: ErrorOptions = {}): Response {
  const {
    message = "Something went wrong",
    code = 500,
    errors = []
  } = options

  const response: ApiResponse<null> = {
    success: false,
    message,
    data: null,
    errors,
    meta: {}
  }

  return res.status(code).json(response)
}

export function notFound(res: Response, message = "Resource not found"): Response {
  return error(res, { message, code: 404 })
}

export function unauthorized(res: Response, message = "Unauthorized"): Response {
  return error(res, { message, code: 401 })
}

export function forbidden(res: Response, message = "Forbidden"): Response {
  return error(res, { message, code: 403 })
}
