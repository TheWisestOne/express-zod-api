type GetV1UserRetrieveInput = {} & {
  /** a numeric string containing the id of the user */
  id: string;
};

type GetV1UserRetrieveResponse =
  | {
      status: "success";
      data: {
        id: number;
        name: string;
      };
    }
  | {
      status: "error";
      error: {
        message: string;
      };
    };

type PostV1UserIdInput = {
  key: string;
} & {
  id: string;
  name: string;
  birthday: string;
};

type PostV1UserIdResponse =
  | {
      status: "success";
      data: {
        name: string;
        createdAt: string;
      };
    }
  | {
      status: "error";
      error: {
        message: string;
      };
    };

type GetV1AvatarSendInput = {
  userId: string;
};

type GetV1AvatarSendResponse = string | string;

type GetV1AvatarStreamInput = {
  userId: string;
};

type GetV1AvatarStreamResponse = string | string;

type PostV1AvatarUploadInput = {
  avatar: any;
};

type PostV1AvatarUploadResponse =
  | {
      status: "success";
      data: {
        name: string;
        size: number;
        mime: string;
        hash: string;
        otherInputs: Record<string, any>;
      };
    }
  | {
      status: "error";
      error: {
        message: string;
      };
    };

export type Path =
  | "/v1/user/retrieve"
  | "/v1/user/:id"
  | "/v1/avatar/send"
  | "/v1/avatar/stream"
  | "/v1/avatar/upload";

export type Method = "get" | "post" | "put" | "delete" | "patch";

export type MethodPath = `${Method} ${Path}`;

export interface Input extends Record<MethodPath, any> {
  "get /v1/user/retrieve": GetV1UserRetrieveInput;
  "post /v1/user/:id": PostV1UserIdInput;
  "get /v1/avatar/send": GetV1AvatarSendInput;
  "get /v1/avatar/stream": GetV1AvatarStreamInput;
  "post /v1/avatar/upload": PostV1AvatarUploadInput;
}

export interface Response extends Record<MethodPath, any> {
  "get /v1/user/retrieve": GetV1UserRetrieveResponse;
  "post /v1/user/:id": PostV1UserIdResponse;
  "get /v1/avatar/send": GetV1AvatarSendResponse;
  "get /v1/avatar/stream": GetV1AvatarStreamResponse;
  "post /v1/avatar/upload": PostV1AvatarUploadResponse;
}

export const jsonEndpoints = {
  "get /v1/user/retrieve": true,
  "post /v1/user/:id": true,
  "post /v1/avatar/upload": true,
};

export type Provider = <M extends Method, P extends Path>(
  method: M,
  path: P,
  params: Input[`${M} ${P}`]
) => Promise<Response[`${M} ${P}`]>;

export type Implementation = (
  method: Method,
  path: string,
  params: Record<string, any>
) => Promise<any>;

/*
export const exampleImplementation: Implementation = async (
  method,
  path,
  params
) => {
  const searchParams =
    method === "get" ? `?${new URLSearchParams(params)}` : "";
  const response = await fetch(`https://example.com${path}${searchParams}`, {
    method: method.toUpperCase(),
    headers:
      method === "get" ? undefined : { "Content-Type": "application/json" },
    body: method === "get" ? undefined : JSON.stringify(params),
  });
  if (`${method} ${path}` in jsonEndpoints) {
    return response.json();
  }
  return response.text();
};

const client = new ExpressZodAPIClient(exampleImplementation);
client.provide("get", "/v1/user/retrieve", { id: "10" });
*/
export class ExpressZodAPIClient {
  constructor(protected readonly implementation: Implementation) {}
  public readonly provide: Provider = (method, path, params) =>
    this.implementation(
      method,
      Object.keys(params).reduce(
        (acc, key) => acc.replace(`:${key}`, params[key]),
        path
      ),
      Object.keys(params).reduce(
        (acc, key) =>
          path.indexOf(`:${key}`) >= 0 ? acc : { ...acc, [key]: params[key] },
        {}
      )
    );
}
