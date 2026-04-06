const serverBase = process.env.BACKEND_API_URL;
const publicBase = process.env.NEXT_PUBLIC_BACKEND_URL;

export function getBackendBaseUrl(): string {
  const base = serverBase || publicBase || "http://localhost:4000";
  return base.replace(/\/$/, "");
}

export function buildBackendUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getBackendBaseUrl()}${normalizedPath}`;
}

export async function fetchBackendJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(buildBackendUrl(path), {
    ...init,
    cache: init?.cache ?? "no-store",
  });

  const payload = await response.json();

  if (!response.ok) {
    const message =
      payload && typeof payload === "object" && "message" in payload
        ? String((payload as { message?: string }).message || "Request failed.")
        : "Request failed.";
    throw new Error(message);
  }

  return payload as T;
}
