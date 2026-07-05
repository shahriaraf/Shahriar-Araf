import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/files/**",
      },
    ],
    // Serve modern, smaller image formats where the browser supports them.
    formats: ["image/avif", "image/webp"],
  },
  // Smaller response headers.
  poweredByHeader: false,
  // Gzip/Brotli-compress responses (also the default, kept explicit).
  compress: true,
  experimental: {
    // Only import the specific icons/components actually used from these
    // large libraries instead of bundling the whole package — meaningfully
    // shrinks the client JS that has to be downloaded and parsed.
    optimizePackageImports: ["react-icons", "lucide-react", "framer-motion"],
  },
};

export default nextConfig;
