export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);

  // Re-route the request to your Droplet's raw IP
  const targetUrl = `http://206.189.87.46${url.pathname}${url.search}`;

  // Cloudflare fetches it server-side, bypassing browser security blocks
  return fetch(targetUrl, {
    method: request.method,
    headers: request.headers,
    body: request.body
  });
}