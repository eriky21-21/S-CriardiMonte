// next.config.js - DEVE ficar assim:
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
  // NÃO tenha output: 'standalone' aqui!
  compress: true,
  poweredByHeader: false,
}

module.exports = nextConfig
