const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.command-center.web.id",
        pathname: "/**",
      },
    ],
    localPatterns: [
      // public images
      {
        pathname: "/images/**",
      },

      // image proxy API (INI YANG PENTING)
      {
        pathname: "/api/image-proxy",
        search: "?filename=*",
      },

      // snapshot proxy
      {
        pathname: "/api/snapshot-proxy/**",
      },
    ],
  },
  async rewrites() {
    if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
      throw new Error("API environment variable is not defined");
    }
    return [
      {
        source: "/api/capture-intercome/:path*",
        destination: "/api/capture-intercome/:path*",
      },
      {
        source: "/api/snapshot-proxy/:path*",
        destination: "/api/snapshot-proxy/:path*",
      },
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
