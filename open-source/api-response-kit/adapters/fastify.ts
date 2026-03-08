import { FastifyInstance, FastifyReply } from "fastify"
import fp from "fastify-plugin"
import { ApiResponse, ResponseOptions, ErrorOptions } from "../src/interfaces"

declare module "fastify" {
  interface FastifyReply {
    apiSuccess: <T>(options?: ResponseOptions<T>) => FastifyReply
    apiError: (options?: ErrorOptions) => FastifyReply
  }
}

function apiResponsePlugin(fastify: FastifyInstance, opts: any, done: () => void) {
  fastify.decorateReply("apiSuccess", function (this: FastifyReply, options: any = {}) {
    const { message = "Success", data = null, statusCode = 200, meta = {} } = options
    const response: ApiResponse = { success: true, message, data, errors: [], meta }
    return this.status(statusCode).send(response)
  })

  fastify.decorateReply("apiError", function (this: FastifyReply, options: any = {}) {
    const { message = "Something went wrong", code = 500, errors = [] } = options
    const response: ApiResponse<null> = { success: false, message, data: null, errors, meta: {} }
    return this.status(code).send(response)
  })

  done()
}

export default fp(apiResponsePlugin, { name: "api-response-kit" })
