import z from "zod";

// Allow Schema to recursively reference itself in properties
const bastSchema = z.object({
  $ref: z.string().optional(),
  type: z.string().optional(), // Actually a set of known literals. Can probably do a discriminated union instead of making the types optional
  required: z.array(z.string()).optional(),
});

export type Schema = z.infer<typeof bastSchema> & {
  properties?: Record<string, Schema>;
};

const Schema: z.ZodType<Schema> = bastSchema.extend({
  properties: z.lazy(() => z.record(Schema).optional()),
});

export const OpenAPISpec = z.object({
  openapi: z.string(),
  info: z.object({
    title: z.string().optional(),
    version: z.string().optional(),
  }),
  paths: z.record(
    z.record(
      z.object({
        summary: z.string().optional(),
        operationId: z.string().optional(),
        parameters: z
          .array(
            z.object({
              name: z.string(),
              in: z.string(),
              required: z.boolean().optional(),
              schema: z.object({
                type: z.string(),
              }),
            }),
          )
          .optional(),
        requestBody: z
          .object({
            description: z.string().optional(),
            content: z.record(
              z.object({
                schema: Schema,
              }),
            ),
          })
          .optional(),
        responses: z.record(
          z.object({
            description: z.string().optional(),
            content: z
              .record(
                z.object({
                  schema: Schema,
                }),
              )
              .optional(),
          }),
        ),
      }),
    ),
  ),
});

export type OpenAPISpec = z.infer<typeof OpenAPISpec>;
