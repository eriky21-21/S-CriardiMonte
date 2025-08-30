/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', '.supabase.co', 'via.placeholder.com'],
    unoptimized: true
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig
