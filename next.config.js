/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  // Disable font optimization since we're using system fonts
  optimizeFonts: false,
};

module.exports = nextConfig;