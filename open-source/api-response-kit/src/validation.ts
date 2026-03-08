import { Response } from "express"
import { ApiResponse, ValidationErrorItem } from "./interfaces"

export function validationError(res: Response, errors: ValidationErrorItem[]): Response {
  const response: ApiResponse<null> = {
    success: false,
    message: "Validation failed",
    data: null,
    errors: errors.map(e => ({
      field: e.field,
      message: e.message,
      code: e.code || "VALIDATION_ERROR"
    })),
    meta: {}
  }

  return res.status(422).json(response)
}
