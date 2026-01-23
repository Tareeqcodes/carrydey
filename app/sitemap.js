export const dynamic = 'force-dynamic'; // Ensures fresh data
export default function sitemap() {
  const baseUrl = 'https://carrydey.tech';

  return [
    {
      url: baseUrl,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/send`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];
}
