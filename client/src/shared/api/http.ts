const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api";

type RequestOptions = {
  method?: string;
  token?: string | null;
  body?: unknown;
  headers?: Record<string, string>;
};

export async function apiRequest<T>(
  path: string,
  { method = "GET", token, body, headers }: RequestOptions = {},
): Promise<T> {
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Error ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function apiRequestRaw(
  path: string,
  { method = "GET", token, body, headers }: RequestOptions = {},
) {
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Error ${response.status}`);
  }

  return response;
}

export { API_URL };
