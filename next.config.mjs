/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.haitrieu.com", // Thêm dòng này để sửa lỗi logo VNG
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.google.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ui-avatars.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**", // Cho phép mọi domain (không khuyến khích production)
      },
    ],
  },
};

export default nextConfig;
