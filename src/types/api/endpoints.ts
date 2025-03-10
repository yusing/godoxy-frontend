import { toaster } from "@/components/ui/toaster";
import { StatusCodes } from "http-status-codes";

namespace Endpoints {
  export const FileContent = (fileType: ConfigFileType, filename: string) =>
    `/api/file/${fileType}/${encodeURIComponent(filename)}`;
  export const FileValidate = (fileType: ConfigFileType) =>
    `/api/file/validate/${fileType}`;
  export const Schema = (filename: string) => `/api/schema/${filename}`;
  export const FavIcon = (alias?: string, url?: string) =>
    `/api/favicon?alias=${encodeURIComponent(alias ?? "")}&url=${encodeURIComponent(
      url ?? "",
    )}`;
  export const SearchIcons = (keyword: string, limit: number) =>
    `/api/list/icons?keyword=${encodeURIComponent(keyword)}&limit=${limit}`;

  export const VERSION = "/api/version";
  export const AUTH = "/api/auth/callback";
  export const AUTH_CHECK = "/api/auth/check";
  export const AUTH_LOGOUT = "/api/auth/logout";
  export const AUTH_REDIRECT = "/api/auth/redirect";
  export const LIST_FILES = "/api/list/files";
  export const LIST_PROXIES = "/api/list/routes";
  export const LIST_HOMEPAGE_CATEGORIES = "/api/list/homepage_categories";
  export const LIST_ROUTE_PROVIDERS = "/api/list/route_providers";
  export const SEARCH_ICONS = "/api/list/icons";
  export const MATCH_DOMAINS = "/api/list/match_domains";
  export const HOMEPAGE_CFG = "/api/list/homepage_config";

  export const STATS = "/api/stats/ws";
  export const HEALTH = "/api/health/ws";
  export const LOGS = "/api/logs/ws";
  export const SET_HOMEPAGE = "/api/homepage/set";
}

export type ConfigFileType = "config" | "provider" | "middleware";

type FetchArguments = {
  query?: Record<string, any>;
  headers?: HeadersInit;
  body?: BodyInit;
  signal?: AbortSignal;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  noRedirectAuth?: boolean;
  toastAuthError?: boolean;
};

export class FetchError extends Error {
  status: number;
  statusText: string;

  constructor(status: number, statusText: string, message: string) {
    super(message);
    this.status = status;
    this.statusText = statusText;
  }
}

export function toastError<T>(error: T) {
  if (error instanceof FetchError) {
    toaster.error({
      title: `Fetch error ${error.status} - ${error.statusText}`,
      description: error.message,
    });
  } else if (error instanceof Error) {
    toaster.error({
      title: "Fetch error",
      description: error.message,
    });
  } else if (error instanceof Event) {
    toaster.error({ title: "Websocket error" });
  } else {
    console.error(error, `unknown error type ${typeof error}`);
  }
}

export async function fetchEndpoint(
  endpoint: string,
  args: FetchArguments = {},
): Promise<Response | null> {
  if (args.query) {
    endpoint += `?${new URLSearchParams(args.query)}`;
  }

  const resp = await fetch(endpoint, {
    signal: args.signal,
    headers: args.headers,
    method: args.method,
    body: args.body,
  });
  if (!resp.ok) {
    if (
      resp.status === StatusCodes.FORBIDDEN ||
      resp.status === StatusCodes.UNAUTHORIZED
    ) {
      if (args.toastAuthError) {
        toaster.error({
          title: "Unauthorized",
          description: await resp.text(),
        });
      }
      if (!args.noRedirectAuth) {
        window.location.href = Endpoints.AUTH_REDIRECT;
        return null;
      }
    }
    return Promise.reject(
      new FetchError(resp.status, resp.statusText, await resp.text()),
    );
  }
  return resp;
}

type loginProps = {
  username: string;
  password: string;
  toastAuthError?: boolean;
};

export async function login(credentials: loginProps) {
  const resp = await fetch(Endpoints.AUTH, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  if (!resp.ok) {
    const err = await resp.text();
    if (credentials.toastAuthError) {
      toaster.error({
        title: "Unauthorized",
        description: err,
      });
    }
    return Promise.reject(new FetchError(resp.status, resp.statusText, err));
  }
}

export default Endpoints;
