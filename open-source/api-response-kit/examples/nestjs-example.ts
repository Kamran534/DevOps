/**
 * NestJS Example Usage
 *
 * 1. Register the interceptor globally in your AppModule:
 *
 * import { Module } from "@nestjs/common"
 * import { APP_INTERCEPTOR } from "@nestjs/core"
 * import { ApiResponseInterceptor } from "api-response-kit/adapters/nestjs"
 *
 * @Module({
 *   providers: [
 *     {
 *       provide: APP_INTERCEPTOR,
 *       useClass: ApiResponseInterceptor
 *     }
 *   ]
 * })
 * export class AppModule {}
 *
 *
 * 2. Return data from your controllers — the interceptor wraps it automatically:
 *
 * @Controller("users")
 * export class UsersController {
 *
 *   @Get()
 *   findAll() {
 *     // Automatically wrapped: { success: true, message: "Success", data: [...], errors: [], meta: {} }
 *     return [
 *       { id: 1, name: "Alice" },
 *       { id: 2, name: "Bob" }
 *     ]
 *   }
 *
 *   @Get(":id")
 *   findOne(@Param("id") id: string) {
 *     // Return with custom message
 *     return {
 *       message: "User fetched successfully",
 *       data: { id, name: "Alice" }
 *     }
 *   }
 *
 *   @Post()
 *   create(@Body() body: any) {
 *     return {
 *       message: "User created",
 *       data: { id: 3, ...body }
 *     }
 *   }
 *
 *   @Get("paginated")
 *   findPaginated() {
 *     return {
 *       message: "Users fetched",
 *       data: [{ id: 1 }, { id: 2 }],
 *       meta: {
 *         pagination: {
 *           page: 1,
 *           perPage: 20,
 *           total: 100,
 *           totalPages: 5
 *         }
 *       }
 *     }
 *   }
 * }
 */

export {}
