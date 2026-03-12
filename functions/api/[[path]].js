export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);

  // Construct the exact URL to your Droplet
  const targetUrl = `http://206.189.87.46${url.pathname}${url.search}`;

  // Clone the headers so we can modify them
  const headers = new Headers(request.headers);
  
  // TRICK: Tell Nginx we are talking directly to the Droplet, not the Cloudflare domain
  headers.set("Host", "206.189.87.46");

  // Determine if there is a body to send (GET/HEAD requests cannot have bodies)
  const hasBody = request.method !== 'GET' && request.method !== 'HEAD';

  // Forward the request to the backend
  const response = await fetch(targetUrl, {
    method: request.method,
    headers: headers,
    body: hasBody ? request.body : null
  });

  return response;
}