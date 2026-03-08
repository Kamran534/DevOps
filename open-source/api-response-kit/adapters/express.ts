import { Request, Response, NextFunction } from "express"
import { success, created } from "../src/success"
import { error, notFound, unauthorized, forbidden } from "../src/error"
import { validationError } from "../src/validation"
import { paginated } from "../src/pagination"
import { ResponseOptions, ErrorOptions, ValidationErrorItem, PaginationOptions } from "../src/interfaces"

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Response {
      apiSuccess: <T>(options?: ResponseOptions<T>) => Response
      apiError: (options?: ErrorOptions) => Response
      apiCreated: <T>(options?: ResponseOptions<T>) => Response
      apiNotFound: (message?: string) => Response
      apiUnauthorized: (message?: string) => Response
      apiForbidden: (message?: string) => Response
      apiValidationError: (errors: ValidationErrorItem[]) => Response
      apiPaginated: <T>(options: PaginationOptions<T>) => Response
    }
  }
}

export function apiResponseMiddleware() {
  return (req: Request, res: Response, next: NextFunction) => {
    res.apiSuccess = (options) => success(res, options)
    res.apiError = (options) => error(res, options)
    res.apiCreated = (options) => created(res, options)
    res.apiNotFound = (message) => notFound(res, message)
    res.apiUnauthorized = (message) => unauthorized(res, message)
    res.apiForbidden = (message) => forbidden(res, message)
    res.apiValidationError = (errors) => validationError(res, errors)
    res.apiPaginated = (options) => paginated(res, options)
    next()
  }
}
