// Server-side only: the browser never talks to the API directly, so no CORS setup is needed.
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";

export const ACCESS_COOKIE = "cm_access";
export const REFRESH_COOKIE = "cm_refresh";
// Short-lived marker that stops an endless refresh loop if the API keeps answering 401.
export const REFRESHED_FLAG = "cm_refreshed";
