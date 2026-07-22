import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "elliesoats.com" }],
        destination: "https://elliesoats.co.uk/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.elliesoats.com" }],
        destination: "https://elliesoats.co.uk/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
