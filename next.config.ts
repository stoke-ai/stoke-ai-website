import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/western',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow, noarchive',
          },
        ],
      },
      {
        source: '/western/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow, noarchive',
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/western',
        destination: '/western-site/index.html',
      },
      {
        source: '/western/',
        destination: '/western-site/index.html',
      },
      {
        source: '/western/:path*',
        destination: '/western-site/:path*',
      },
    ];
  },
};

export default nextConfig;
