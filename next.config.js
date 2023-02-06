/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["lh3.googleusercontent.com", "placeimg.com", "images.unsplash.com"],
  },
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    ADMIN_EMAILS: process.env.ADMIN_EMAILS,
  },
}

module.exports = nextConfig
