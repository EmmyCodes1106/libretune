export default async function handler(request, response) {
  const segments = Array.isArray(request.query.path)
    ? request.query.path
    : [request.query.path].filter(Boolean);
  const endpoint = segments.map((segment) => encodeURIComponent(segment)).join('/');
  const query = new URLSearchParams();

  Object.entries(request.query).forEach(([key, value]) => {
    if (key === 'path') return;
    (Array.isArray(value) ? value : [value]).forEach((item) => {
      if (item !== undefined) query.append(key, String(item));
    });
  });

  const target = new URL(`https://api.deezer.com/${endpoint}`);
  target.search = query.toString();
  const upstream = await fetch(target);
  const body = await upstream.text();

  response.status(upstream.status);
  response.setHeader('Content-Type', upstream.headers.get('content-type') || 'application/json');
  response.setHeader('Cache-Control', 'no-store');
  response.send(body);
}
