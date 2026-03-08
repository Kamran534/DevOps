import { Response } from "express"
import { ApiResponse, PaginationMeta, PaginationOptions } from "./interfaces"

export function paginated<T>(res: Response, options: PaginationOptions<T>): Response {
  const {
    data,
    page,
    perPage = 20,
    total,
    message = "Success"
  } = options

  const totalPages = Math.ceil(total / perPage)

  const pagination: PaginationMeta = {
    page,
    perPage,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1
  }

  const response: ApiResponse<T[]> = {
    success: true,
    message,
    data,
    errors: [],
    meta: { pagination }
  }

  return res.status(200).json(response)
}
