/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3002/api/:path*' // 修改为3002端口
      }
    ]
  },
  images: {
    domains: ['localhost'],
  },
}

module.exports = nextConfig 