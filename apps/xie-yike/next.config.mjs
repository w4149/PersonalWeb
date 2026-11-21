/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  // content/ 目录下的 CSV 路径是动态构造的，需要显式声明以确保构建时被包含
  outputFileTracingIncludes: {
    "/*": ["./content/**/*"],
  },
};

export default nextConfig;
