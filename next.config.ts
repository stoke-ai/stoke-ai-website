import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/careers/:path*",
        has: [{ type: "host", value: "portal.goffwelding.com" }],
        destination: "/goff-recruiting/:path*",
      },
      {
        source: "/apply/:path*",
        has: [{ type: "host", value: "portal.goffwelding.com" }],
        destination: "/goff-recruiting/:path*",
      },
      {
        source: "/candidate/:path*",
        has: [{ type: "host", value: "portal.goffwelding.com" }],
        destination: "/goff-recruiting/:path*",
      },
      {
        source: "/onboarding/:path*",
        has: [{ type: "host", value: "portal.goffwelding.com" }],
        destination: "/goff-employee/:path*",
      },
      {
        source: "/employee/:path*",
        has: [{ type: "host", value: "portal.goffwelding.com" }],
        destination: "/goff-employee/:path*",
      },
      {
        source: "/admin/:path*",
        has: [{ type: "host", value: "portal.goffwelding.com" }],
        destination: "/goff-employee/:path*",
      },
      {
        source: "/",
        has: [{ type: "host", value: "portal.goffwelding.com" }],
        destination: "/goff-employee/",
      },
    ];
  },
};

export default nextConfig;
