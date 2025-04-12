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
    query: any;
    header: any;
    path: any;
    cookie: any;
  };
  requestBody: {
    mediaType: any;
    content: any;
  };
  contentType: string;
  req: any;
  res: any;
};

type HandlerResponse = {
  content?: {
    [key: string]: any;
  };
  headers?: {
    [name: string]: any;
  };
  status?: number;
};

export interface Route {
  path: string;
  method: Method;
  handler: (arg0: HandlerInput) => Promise<HandlerResponse>;
}
