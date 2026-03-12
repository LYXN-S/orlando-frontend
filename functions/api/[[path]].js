export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);

  // By using .nip.io, Cloudflare sees a "domain name" and allows the fetch to execute
  const targetUrl = `http://206.189.87.46.nip.io${url.pathname}${url.search}`;

  const newHeaders = new Headers(request.headers);

  const hasBody = request.method !== 'GET' && request.method !== 'HEAD';

  return fetch(targetUrl, {
    method: request.method,
    headers: newHeaders,
    body: hasBody ? request.body : null
  });
}