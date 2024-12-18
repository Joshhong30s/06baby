/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = {
  images: {
    domains: ["imgur.com", "i.imgur.com", "vercel.com", "youtube.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "imgur.com/",
      },
      {
        protocol: "https",
        hostname: "i.imgur.com/",
      },
      {
        protocol: "https",
        hostname: "vercel.com",
      },
      {
        protocol: "https",
        hostname: "youtube.com",
      },
    ],
  },
};
