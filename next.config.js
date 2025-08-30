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
  // REMOVA esta linha completamente:
  // output: 'standalone',
  compress: true,
  poweredByHeader: false,
}

module.exports = nextConfig
