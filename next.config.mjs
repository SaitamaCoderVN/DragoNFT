import { createRequire } from 'module';
const require = createRequire(import.meta.url);

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['cdn.discordapp.com', 'res.cloudinary.com', 'nelsoncodepen.s3.eu-west-2.amazonaws.com'],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      "encoding": require.resolve("encoding"),
    };
    return config;
  },
};

export default nextConfig;