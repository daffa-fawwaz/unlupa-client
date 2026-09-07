const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string | undefined;

export function resolveAssetUrl(value: string | null | undefined): string | undefined {
  if (!value) return undefined;

  const trimmed = value.trim();
  if (!trimmed) return undefined;

  if (/^(https?:|blob:|data:)/i.test(trimmed)) return trimmed;
  if (/^\/\//.test(trimmed)) return `https:${trimmed}`;

  if (!API_BASE_URL) return trimmed;

  try {
    return new URL(trimmed, API_BASE_URL).toString();
  } catch {
    return trimmed;
  }
}