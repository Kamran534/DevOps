export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data: T | null
  errors: ApiError[]
  meta: Record<string, any>
}

export interface ApiError {
  field?: string
  message: string
  code?: string
}

export interface PaginationMeta {
  page: number
  perPage: number
  total: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export interface ResponseOptions<T = any> {
  message?: string
  data?: T
  statusCode?: number
  meta?: Record<string, any>
}

export interface ErrorOptions {
  message?: string
  code?: number
  errors?: ApiError[]
}

export interface ValidationErrorItem {
  field: string
  message: string
  code?: string
}

export interface PaginationOptions<T = any> {
  data: T[]
  page: number
  perPage?: number
  total: number
  message?: string
}
