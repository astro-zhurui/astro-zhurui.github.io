import type { APIRoute } from 'astro';
export const GET: APIRoute = () => {
  const paths = ['', 'research/', 'publications/', 'photography/', 'about/'];
  const urls = ['en', 'zh'].flatMap((lang) =>
    paths.map((path) => `<url><loc>https://astro-zhurui.github.io/${lang}/${path}</loc></url>`),
  );
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join('')}</urlset>`,
    { headers: { 'Content-Type': 'application/xml' } },
  );
};
