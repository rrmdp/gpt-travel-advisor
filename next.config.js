/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: ['better-sqlite3'],
  },
}

module.exports = nextConfig
