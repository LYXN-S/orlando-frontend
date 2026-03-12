export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);

  // Construct the exact URL to your Droplet
  const targetUrl = `http://206.189.87.46${url.pathname}${url.search}`;

  // Clone headers but explicitly DELETE the Host header so Cloudflare doesn't block it
  const headers = new Headers(request.headers);
  headers.delete("Host");

  // Determine if there is a body to send
  const hasBody = request.method !== 'GET' && request.method !== 'HEAD';

  // Forward the request to the backend safely
  const response = await fetch(targetUrl, {
    method: request.method,
    headers: headers,
    body: hasBody ? request.body : null
  });

  return response;
}