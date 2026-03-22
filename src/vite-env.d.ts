/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_CALENDAR_EMBED_URL?: string;
  /** SheetDB API base URL, e.g. https://sheetdb.io/api/v1/xxxx */
  readonly VITE_SHEETDB_API_URL?: string;
  /** SheetDB bearer token (optional). Exposed in client bundle — use SheetDB limits / rotate if needed. */
  readonly VITE_SHEETDB_BEARER_TOKEN?: string;
}
