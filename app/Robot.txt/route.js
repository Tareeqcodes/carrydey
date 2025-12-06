
export function GET() {
  const robots = `
User-agent: *
Allow: /

# Disallow sensitive areas
Disallow: /pendingVerification/
Disallow: /dashboard/
Disallow: /onboarding/

# Sitemap
Sitemap: https://carrydey.tech/sitemap.xml
  `.trim();

  return new Response(robots, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}