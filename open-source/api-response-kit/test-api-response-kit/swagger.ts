import swaggerJSDoc from "swagger-jsdoc"

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "api-res-kit Test API",
      version: "1.0.0",
      description:
        "Demo API showcasing @kamran534055/api-response-kit — a library that standardizes Node.js API responses.",
      contact: {
        name: "Kamran534",
        url: "https://github.com/Kamran534/DevOps"
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT"
      }
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local development server"
      }
    ],
    components: {
      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            name: { type: "string", example: "Alice" },
            email: { type: "string", example: "alice@example.com" },
            role: { type: "string", enum: ["admin", "user", "moderator"], example: "user" }
          }
        },
        SuccessResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Success" },
            data: { type: "object" },
            errors: { type: "array", items: {}, example: [] },
            meta: { type: "object", example: {} }
          }
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Something went wrong" },
            data: { type: "null", example: null },
            errors: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  field: { type: "string" },
                  message: { type: "string" },
                  code: { type: "string" }
                }
              },
              example: []
            },
            meta: { type: "object", example: {} }
          }
        },
        ValidationErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Validation failed" },
            data: { type: "null", example: null },
            errors: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  field: { type: "string", example: "email" },
                  message: { type: "string", example: "Email is required" },
                  code: { type: "string", example: "VALIDATION_ERROR" }
                }
              }
            },
            meta: { type: "object", example: {} }
          }
        },
        PaginatedResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Users fetched successfully" },
            data: { type: "array", items: { $ref: "#/components/schemas/User" } },
            errors: { type: "array", items: {}, example: [] },
            meta: {
              type: "object",
              properties: {
                pagination: {
                  type: "object",
                  properties: {
                    page: { type: "integer", example: 1 },
                    perPage: { type: "integer", example: 2 },
                    total: { type: "integer", example: 5 },
                    totalPages: { type: "integer", example: 3 },
                    hasNextPage: { type: "boolean", example: true },
                    hasPrevPage: { type: "boolean", example: false }
                  }
                }
              }
            }
          }
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", example: "alice@example.com" },
            password: { type: "string", example: "password123" }
          }
        },
        CreateUserRequest: {
          type: "object",
          required: ["name", "email"],
          properties: {
            name: { type: "string", example: "Frank" },
            email: { type: "string", example: "frank@example.com" }
          }
        }
      }
    }
  },
  apis: ["./app.ts"]
}

export const swaggerSpec = swaggerJSDoc(options)
