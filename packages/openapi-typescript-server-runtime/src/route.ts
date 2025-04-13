type Method =
  | "get"
  | "post"
  | "put"
  | "delete"
  | "options"
  | "head"
  | "patch"
  | "trace";

type HandlerInput = {
  parameters: {
    query: unknown;
    header: unknown;
    path: unknown;
    cookie: unknown;
  };
  requestBody: {
    mediaType: unknown;
    content: unknown;
  };
  contentType: string;
  req: unknown;
  res: unknown;
};

type HandlerResponse = {
  content?: {
    // Response variant
    [key: string]:
      | {
          // Content type
          [key: string]: unknown;
        }
      | undefined;
  };
  headers?: {
    [name: string]: string | number | readonly string[] | undefined;
  };
  status?: number;
};

export interface Route {
  path: string;
  method: Method;
  handler: (arg0: HandlerInput) => Promise<HandlerResponse>;
}
