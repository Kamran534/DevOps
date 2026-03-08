import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler
} from "@nestjs/common"
import { Observable } from "rxjs"
import { map } from "rxjs/operators"
import { ApiResponse } from "../src/interfaces"

@Injectable()
export class ApiResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map(data => ({
        success: true,
        message: data?.message || "Success",
        data: data?.data ?? data,
        errors: [],
        meta: data?.meta || {}
      }))
    )
  }
}
