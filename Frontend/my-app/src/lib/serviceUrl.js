const FALLBACK_GATEWAY = import.meta.env.VITE_API_GATEWAY_URL || import.meta.env.VITE_BASE_URL || "http://localhost:5000";

export const SERVICE_URLS = {
  gateway: FALLBACK_GATEWAY,
  user: import.meta.env.VITE_USER_SERVICE_URL || FALLBACK_GATEWAY,
  captain: import.meta.env.VITE_CAPTAIN_SERVICE_URL || FALLBACK_GATEWAY,
  ride: import.meta.env.VITE_RIDE_SERVICE_URL || FALLBACK_GATEWAY,
  realtime: import.meta.env.VITE_REALTIME_SERVICE_URL || FALLBACK_GATEWAY,
};

export function resolveServiceFromPath(path = "") {
  if (path.startsWith("/user")) return "user";
  if (path.startsWith("/captain")) return "captain";
  if (path.startsWith("/ride") || path.startsWith("/maps")) return "ride";
  return "gateway";
}

export function buildServiceUrl(path = "") {
  const service = resolveServiceFromPath(path);
  const base = SERVICE_URLS[service] || SERVICE_URLS.gateway;
  return `${base}${path}`;
}
