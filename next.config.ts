import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "gnkkpnlbhgewcemuwosn.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
