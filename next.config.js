/** @type {import('next').NextConfig} */
const nextConfig = {
  appDir: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
}

export default nextConfig
