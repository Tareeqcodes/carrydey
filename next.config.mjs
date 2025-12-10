/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // Redirect www to non-www
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.carrydey.tech' }],
        destination: 'https://carrydey.tech/:path*',
        permanent: true,
      },
      // Redirect HTTP to HTTPS
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'carrydey.tech' }],
        destination: 'https://carrydey.tech/:path*',
        permanent: true,
      },
    ];
  },
  // Add headers for robots.txt
  async headers() {
    return [
      {
        source: '/robots.txt',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, s-maxage=86400',
          },
        ],
      },
    ];
  },
};

export default nextConfig;