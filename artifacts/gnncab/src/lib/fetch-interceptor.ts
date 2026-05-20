// Intercept fetch calls to include the HttpOnly auth cookie and handle 401s.
const originalFetch = window.fetch;

function getCookieValue(name: string): string | null {
  const cookie = document.cookie
    .split(";")
    .map((entry) => entry.trim())
    .find((entry) => entry.startsWith(`${name}=`));

  return cookie ? decodeURIComponent(cookie.slice(name.length + 1)) : null;
}

window.fetch = async (resource: RequestInfo | URL, config?: RequestInit) => {
  const headers = new Headers(config?.headers);
  const method = (config?.method ?? (resource instanceof Request ? resource.method : "GET")).toUpperCase();
  const csrfToken = getCookieValue("gnncab_csrf");

  if (csrfToken && !["GET", "HEAD", "OPTIONS"].includes(method)) {
    headers.set("X-CSRF-Token", csrfToken);
  }

  config = {
    ...config,
    headers,
    credentials: config?.credentials ?? "include",
  };

  try {
    const response = await originalFetch(resource, config);
    if (response.status === 401) {
      // Prevent redirect loop if already on login
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return response;
  } catch (error) {
    throw error;
  }
};
